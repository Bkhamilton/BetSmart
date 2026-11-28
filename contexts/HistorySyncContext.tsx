import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { addDatabaseChangeListener, useSQLiteContext } from 'expo-sqlite';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '@/contexts/UserContext';
import { supabase } from '@/services/supabase';
import { pushHistory } from '@/db/sync/push';
import { pullHistory } from '@/db/sync/pull';

type SyncStatus = 'unavailable' | 'pending' | 'syncing' | 'synced' | 'failed';
type SyncValue = {
    status: SyncStatus;
    retry: () => void;
    revision: number;
    hasHistoryWarning: boolean;
    warningStorageUnavailable: boolean;
};
type OutboxSummary = { latest: number; outstanding: number; failed: number };
type NoticeState = { owner: string; hasWarning: boolean; storageUnavailable: boolean };

// Native has no connectivity listener without an additional dependency. While
// foregrounded, retry failures with capped backoff and occasionally check for
// remote changes even after a successful sync.
const RETRY_DELAYS_MS = [10_000, 30_000, 60_000, 120_000, 300_000];
const SYNC_PROBE_INTERVAL_MS = 300_000;

export const HistorySyncContext = createContext<SyncValue>({
    status: 'unavailable',
    retry: () => {},
    revision: 0,
    hasHistoryWarning: false,
    warningStorageUnavailable: false,
});

export function HistorySyncProvider({ children }: { children: React.ReactNode }) {
    const db = useSQLiteContext();
    const { user, signedIn, authLoading, setTrigger } = useContext(UserContext);
    const userId = signedIn && !authLoading ? user?.id : undefined;
    const cloudUserId = signedIn && !authLoading ? user?.cloudUserId : undefined;
    const owner = userId != null && cloudUserId ? `${userId}:${cloudUserId}` : null;
    const [result, setResult] = useState<{ owner: string; status: SyncStatus } | null>(null);
    const [refresh, setRefresh] = useState<{ owner: string; revision: number } | null>(null);
    const [notice, setNotice] = useState<NoticeState | null>(null);
    const requestRef = useRef<() => void>(() => {});
    // Keep old and new account operations serialized even when the effect is replaced.
    const serial = useRef<Promise<void>>(Promise.resolve());
    const retry = useCallback(() => requestRef.current(), []);

    useEffect(() => {
        if (!owner || userId == null || !cloudUserId || !supabase) {
            requestRef.current = () => {};
            setResult(null);
            setRefresh(null);
            setNotice(null);
            return;
        }

        const authClient = supabase;
        // Only a generic flag is persisted, never service warning text or rows.
        // Both identities are included so a recreated local database cannot
        // associate a different cloud account with an old notice.
        const noticeKey = `@betsmart:history-sync-notice:${userId}:${cloudUserId}`;
        const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
        const key = process.env.EXPO_PUBLIC_SUPABASE_API_KEY;
        if (!url || !key) {
            setResult({ owner, status: 'unavailable' });
            return;
        }

        let disposed = false;
        let authMatches = true;
        let active = AppState.currentState !== 'background' && AppState.currentState !== 'inactive';
        let requested = false;
        let scheduled = false;
        let latestSequence = 0;
        let lastStatus: SyncStatus = 'pending';
        let retryIndex = 0;
        let retryTimer: ReturnType<typeof setTimeout> | undefined;
        let probeTimer: ReturnType<typeof setTimeout> | undefined;
        let probeDelay = 500;
        const online = () => Platform.OS !== 'web' || typeof navigator === 'undefined' || navigator.onLine !== false;
        const valid = () => !disposed && authMatches;
        const updateNotice = (hasWarning: boolean, storageUnavailable: boolean) => {
            if (!valid()) return;
            setNotice((previous) => ({
                owner,
                hasWarning: (previous?.owner === owner && previous.hasWarning) || hasWarning,
                storageUnavailable: (previous?.owner === owner && previous.storageUnavailable) || storageUnavailable,
            }));
        };
        const saveWarnings = async (warnings: unknown) => {
            if (!valid() || !Array.isArray(warnings) || warnings.length === 0) return;
            updateNotice(true, false);
            try {
                await AsyncStorage.setItem(noticeKey, '1');
            } catch {
                updateNotice(false, true);
            }
        };
        AsyncStorage.getItem(noticeKey).then((value) => {
            if (value === '1') updateNotice(true, false);
        }).catch(() => updateNotice(false, true));
        const report = (status: SyncStatus) => {
            if (valid()) {
                lastStatus = status;
                setResult({ owner, status });
            }
        };
        const clearRetry = () => {
            if (retryTimer) clearTimeout(retryTimer);
            retryTimer = undefined;
        };
        const scheduleRetry = () => {
            clearRetry();
            if (!valid() || !active || !online()) return;
            let delay = SYNC_PROBE_INTERVAL_MS;
            if (lastStatus === 'synced') {
                retryIndex = 0;
            } else {
                delay = RETRY_DELAYS_MS[Math.min(retryIndex, RETRY_DELAYS_MS.length - 1)];
                retryIndex = Math.min(retryIndex + 1, RETRY_DELAYS_MS.length - 1);
            }
            retryTimer = setTimeout(() => {
                retryTimer = undefined;
                request();
            }, delay);
        };
        const summary = async () => {
            const row = await db.getFirstAsync<OutboxSummary>(`
                SELECT COALESCE(MAX(sequence), 0) AS latest,
                    COALESCE(SUM(CASE WHEN status != 'acked' THEN 1 ELSE 0 END), 0) AS outstanding,
                    COALESCE(SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END), 0) AS failed
                FROM sync_outbox WHERE ownerUserId = ?
            `, [userId]);
            if (!row) throw new Error('Unable to inspect history sync queue.');
            return row;
        };

        const run = async () => {
            if (!valid()) return;
            if (!active || !online()) {
                report('pending');
                return;
            }
            report('syncing');
            try {
                // Update hooks run inside transactions, before the write commits.
                // Never start a sync while that same connection has an open transaction.
                if (await db.isInTransactionAsync()) {
                    report('pending');
                    return;
                }
                const initial = await summary();
                latestSequence = Math.max(latestSequence, initial.latest);
                const { data, error } = await authClient.auth.getSession();
                if (error) throw error;
                if (!valid()) return;
                if (!data.session || data.session.user.id !== cloudUserId) {
                    report('pending');
                    return;
                }

                // Pin every request to this account's token, never the mutable shared
                // client's next session. Stop issuing requests after an auth change.
                const session = data.session;
                const token = session.access_token;
                const tokenClient = createClient(url, key, {
                    accessToken: async () => {
                        if (!valid() || !active || !online()) throw new Error('History sync session changed.');
                        return token;
                    },
                });
                // accessToken clients intentionally have no auth namespace. The
                // services verify both session and user; expose only those checks,
                // pinned to the same token rather than the mutable shared session.
                const client = new Proxy(tokenClient, {
                    get(target, property, receiver) {
                        if (property === 'auth') {
                            return {
                                getSession: async () => {
                                    if (!valid() || !active || !online()) throw new Error('History sync session changed.');
                                    return { data: { session }, error: null };
                                },
                                getUser: async () => {
                                    if (!valid() || !active || !online()) throw new Error('History sync session changed.');
                                    const response = await authClient.auth.getUser(token);
                                    if (!valid() || !active || !online()) throw new Error('History sync session changed.');
                                    return response;
                                },
                            };
                        }
                        return Reflect.get(target, property, receiver);
                    },
                });
                const pushResult = await pushHistory(db, client, userId, cloudUserId);
                await saveWarnings(pushResult?.warnings);
                if (!valid() || !active || !online()) {
                    report('pending');
                    return;
                }
                // Some service implementations return blocked operations instead of
                // throwing. Do not pull over unresolved local changes.
                const pushed = await summary();
                if (!valid()) return;
                if (pushed.failed || pushed.outstanding) {
                    if (pushed.latest > latestSequence) {
                        latestSequence = pushed.latest;
                        requested = true;
                    }
                    report(pushed.failed ? 'failed' : 'pending');
                    return;
                }
                try {
                    const pulled = await pullHistory(db, client, userId, cloudUserId);
                    await saveWarnings(pulled?.warnings);
                } finally {
                    // A later page may fail after earlier pages have committed.
                    if (valid()) {
                        setTrigger(true);
                        setRefresh((previous) => ({
                            owner,
                            revision: previous?.owner === owner ? previous.revision + 1 : 1,
                        }));
                    }
                }
                if (!valid()) return;
                const final = await summary();
                if (!valid()) return;
                // A write that arrived during the cycle needs another pass.
                if (final.latest > latestSequence) {
                    latestSequence = final.latest;
                    requested = true;
                }
                if (!active || !online()) report('pending');
                else if (final.failed) report('failed');
                else if (final.outstanding) report('pending');
                else report('synced');
            } catch {
                report(!active || !online() ? 'pending' : 'failed');
            }
        };

        const request = () => {
            if (!valid()) return;
            clearRetry();
            requested = true;
            report('pending');
            if (scheduled) return;
            scheduled = true;
            serial.current = serial.current.catch(() => {}).then(async () => {
                while (requested && valid()) {
                    requested = false;
                    await run();
                }
                scheduled = false;
                scheduleRetry();
            });
        };
        requestRef.current = () => {
            retryIndex = 0;
            request();
        };

        const { data: { subscription: authSubscription } } = authClient.auth.onAuthStateChange((_event, session) => {
            if (session?.user.id !== cloudUserId) {
                setResult(null);
                setNotice(null);
                authMatches = false;
                requested = false;
                clearRetry();
                if (probeTimer) clearTimeout(probeTimer);
            }
        });
        const appSubscription = AppState.addEventListener('change', (state) => {
            const wasActive = active;
            active = state === 'active';
            if (!active) {
                clearRetry();
                if (probeTimer) clearTimeout(probeTimer);
                report('pending');
            } else if (!wasActive) {
                retryIndex = 0;
                request();
            }
        });
        const probe = () => {
            if (!valid() || !active) return;
            if (probeTimer) clearTimeout(probeTimer);
            // SQLite hooks can fire before commit and also for sync acknowledgements.
            probeTimer = setTimeout(() => {
                db.isInTransactionAsync().then((inTransaction) => {
                    if (!valid() || !active) return null;
                    if (inTransaction) {
                        probeDelay = Math.min(probeDelay * 2, 30_000);
                        probe();
                        return null;
                    }
                    probeDelay = 500;
                    return summary();
                }).then((row) => {
                    if (!row) return;
                    if (!valid()) return;
                    if (row.latest > latestSequence) {
                        latestSequence = row.latest;
                        request();
                    }
                }).catch(() => {
                    report('failed');
                    if (!scheduled) scheduleRetry();
                });
            }, probeDelay);
        };
        const dbSubscription = addDatabaseChangeListener((event) => {
            if (event.databaseFilePath !== db.databasePath || event.tableName !== 'sync_outbox') return;
            probe();
        });
        const onOnline = () => {
            retryIndex = 0;
            request();
        };
        const onOffline = () => {
            clearRetry();
            report('pending');
        };
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            window.addEventListener('online', onOnline);
            window.addEventListener('offline', onOffline);
        }
        request();
        return () => {
            disposed = true;
            requested = false;
            requestRef.current = () => {};
            if (probeTimer) clearTimeout(probeTimer);
            clearRetry();
            authSubscription.unsubscribe();
            appSubscription.remove();
            dbSubscription.remove();
            if (Platform.OS === 'web' && typeof window !== 'undefined') {
                window.removeEventListener('online', onOnline);
                window.removeEventListener('offline', onOffline);
            }
        };
    }, [db, supabase, owner, userId, cloudUserId, setTrigger]);

    const status = !owner || !supabase ? 'unavailable' : result?.owner === owner ? result.status : 'pending';
    const revision = refresh?.owner === owner ? refresh.revision : 0;
    const hasHistoryWarning = !!owner && notice?.owner === owner && notice.hasWarning;
    const warningStorageUnavailable = !!owner && notice?.owner === owner && notice.storageUnavailable;
    return (
        <HistorySyncContext.Provider value={{ status, retry, revision, hasHistoryWarning, warningStorageUnavailable }}>
            {children}
        </HistorySyncContext.Provider>
    );
}
