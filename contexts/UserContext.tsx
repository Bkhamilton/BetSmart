import React, { createContext, useCallback, useEffect, useRef, useState, ReactNode } from 'react';
import { AppState } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import type { Session, User as SupabaseAuthUser } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import { initializeAuthenticatedAccount } from '@/services/supabaseProfile';
import { getUserByCloudId } from '@/db/user-specific/Users';
import { getBalanceByUser } from '@/db/user-specific/Balance';
import { getPreferences, insertPreference, clearUserPreferences } from '@/db/user-specific/Preferences';
import { verifyLegalLocation } from '@/services/locationService';
import {
    User,
    Balance,
    Bookie,
    Preference,
    LocationStatus,
    UserContextValue,
} from '@/constants/types';

const defaultPreferences: Preference = {
    bankroll: 0,
    dailyLimit: 0,
    unitSize: '',
    preferredLeagues: [],
    preferredBetTypes: [],
    riskTolerance: 0,
    oddsFormat: '',
};

export const UserContext = createContext<UserContextValue>({
    user: null,
    userBalance: null,
    setUserBalance: () => {},
    bookie: null,
    setBookie: () => {},
    trigger: false,
    setTrigger: () => {},
    preferences: defaultPreferences,
    updatePreferences: async () => {},
    signedIn: false,
    authLoading: true,
    authError: null,
    setAuthError: () => {},
    activateAccount: async () => {},
    locationStatus: {
        verified: false,
        isLegal: null,
        state: null,
        lastChecked: null,
        error: null,
    },
    checkLocation: async () => ({
        isLegal: null,
        state: null,
        coordinates: undefined,
        timestamp: null,
        error: null,
    }),
});

interface UserContextProviderProps {
    children: ReactNode;
}

const errorMessage = (error: unknown) => {
    if ((error as { code?: string } | null)?.code === 'username_unavailable') return 'That username is unavailable.';
    if (isNetworkError(error)) return 'A network connection is required to set up this account.';
    return 'Unable to load this account. Check your connection and try again.';
};

const isNetworkError = (error: unknown) =>
    error instanceof Error &&
    (error.name === 'AuthRetryableFetchError' || /network|fetch failed|offline|timed out/i.test(error.message));

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [userBalance, setUserBalance] = useState<Balance[] | null>(null);
    const [bookie, setBookie] = useState<Bookie | null>({ id: 0, name: 'Default' });
    const [trigger, setTrigger] = useState(false);
    const [preferences, setPreferences] = useState<Preference>(defaultPreferences);
    const [signedIn, setSignedIn] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);
    const [authSession, setAuthSession] = useState<Session | null>(null);
    const [locationStatus, setLocationStatus] = useState<LocationStatus>({
        verified: false,
        isLegal: null,
        state: null,
        lastChecked: null,
        error: null,
    });

    const db = useSQLiteContext();
    const authUserId = useRef<string | null>(null);
    const activationId = useRef(0);

    const clearAccountState = useCallback(() => {
        setUser(null);
        setUserBalance(null);
        setBookie({ id: 0, name: 'Default' });
        setPreferences(defaultPreferences);
        setSignedIn(false);
        setTrigger(false);
    }, []);

    const activateAccount = useCallback(async (authUser: SupabaseAuthUser) => {
        if (!supabase) throw new Error('Supabase authentication is not configured.');

        const requestId = ++activationId.current;
        setAuthLoading(true);
        setAuthError(null);
        const applyAccount = async (localUser: User) => {
            const balance = await getBalanceByUser(db, localUser.id);
            const preferenceRows = await getPreferences(db, localUser.id) as Record<string, string> | null;
            if (requestId !== activationId.current || (authUserId.current && authUserId.current !== authUser.id)) return;

            setUser(localUser);
            setUserBalance(balance);
            setBookie({ id: 0, name: 'Total' });
            setPreferences(preferenceRows ? {
                bankroll: Number(preferenceRows.bankroll) || 0,
                dailyLimit: Number(preferenceRows.dailyLimit) || 0,
                unitSize: preferenceRows.unitSize || '',
                preferredLeagues: preferenceRows.preferredLeagues ? preferenceRows.preferredLeagues.split(',') : [],
                preferredBetTypes: preferenceRows.preferredBetTypes ? preferenceRows.preferredBetTypes.split(',') : [],
                riskTolerance: Number(preferenceRows.riskTolerance) || 0,
                oddsFormat: preferenceRows.oddsFormat || '',
            } : defaultPreferences);
            setSignedIn(true);
            setAuthLoading(false);
        };

        try {
            const localUser = await initializeAuthenticatedAccount(db, supabase, authUser);
            await applyAccount(localUser);
        } catch (error) {
            if (isNetworkError(error)) {
                const cachedUser = await getUserByCloudId(db, authUser.id);
                if (cachedUser) {
                    await applyAccount(cachedUser);
                    setAuthError("Offline mode: showing this device's saved account data. Cloud changes are unavailable.");
                    return;
                }
            }

            console.error('Unable to initialize authenticated account:', error instanceof Error ? error.message : 'Unknown error.');
            if (requestId === activationId.current) {
                clearAccountState();
                setAuthError(errorMessage(error));
                setAuthLoading(false);
            }
            throw error;
        }
    }, [clearAccountState, db]);

    useEffect(() => {
        if (!supabase) {
            setAuthLoading(false);
            setAuthError('Supabase authentication is not configured.');
            return;
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const nextUserId = session?.user.id ?? null;
            if (!session || authUserId.current !== nextUserId) {
                authUserId.current = nextUserId;
                activationId.current += 1;
                clearAccountState();
                setAuthError(null);
            }
            setAuthSession(session);
        });

        supabase.auth.getSession().then(({ data, error }) => {
            if (error) throw error;
            setAuthSession(data.session);
        }).catch((error: unknown) => {
            console.error('Unable to restore the Supabase session:', error instanceof Error ? error.message : 'Unknown error.');
            setAuthError(errorMessage(error));
            setAuthLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [clearAccountState]);

    useEffect(() => {
        const client = supabase;
        if (!client) return;

        const updateRefreshState = (state: string | null | undefined) => {
            if (state === 'active') client.auth.startAutoRefresh();
            else client.auth.stopAutoRefresh();
        };
        updateRefreshState(AppState.currentState);
        const subscription = AppState.addEventListener('change', updateRefreshState);
        return () => {
            subscription.remove();
            client.auth.stopAutoRefresh();
        };
    }, []);

    useEffect(() => {
        if (!authSession?.user) {
            activationId.current += 1;
            clearAccountState();
            setAuthLoading(false);
            return;
        }

        activateAccount(authSession.user).catch((error: unknown) => {
            setAuthError(errorMessage(error));
            setAuthLoading(false);
        });
    }, [activateAccount, authSession?.user.id, clearAccountState]);

    const checkLocation = async () => {
        const result = await verifyLegalLocation();
        setLocationStatus({
            verified: true,
            isLegal: result.isLegal,
            state: result.state,
            lastChecked: result.timestamp,
            error: result.error,
        });
        return result;
    };

    useEffect(() => {
        checkLocation().catch((error: unknown) => {
            console.error('Unable to verify location:', error);
        });
    }, []);

    const updatePreferences = async (nextPreferences: Preference) => {
        if (!signedIn || !user) throw new Error('Sign in before saving preferences.');

        const {
            bankroll = 0,
            dailyLimit = 0,
            unitSize = '',
            preferredLeagues = [],
            preferredBetTypes = [],
            riskTolerance = 0,
            oddsFormat = '',
        } = nextPreferences;

        await clearUserPreferences(db, user.id);
        await insertPreference(db, user.id, 'bankroll', bankroll);
        await insertPreference(db, user.id, 'dailyLimit', dailyLimit);
        await insertPreference(db, user.id, 'unitSize', unitSize);
        await insertPreference(db, user.id, 'preferredLeagues', preferredLeagues.filter(Boolean).join(','));
        await insertPreference(db, user.id, 'preferredBetTypes', preferredBetTypes.filter(Boolean).join(','));
        await insertPreference(db, user.id, 'riskTolerance', riskTolerance);
        await insertPreference(db, user.id, 'oddsFormat', oddsFormat);
        setPreferences(nextPreferences);
    };

    useEffect(() => {
        if (!signedIn || !user) return;

        getPreferences(db, user.id).then((result) => {
            if (!result) return;
            const dbPreferences = result as Record<string, string>;
            setPreferences({
                bankroll: Number(dbPreferences.bankroll) || 0,
                dailyLimit: Number(dbPreferences.dailyLimit) || 0,
                unitSize: dbPreferences.unitSize || '',
                preferredLeagues: dbPreferences.preferredLeagues ? dbPreferences.preferredLeagues.split(',') : [],
                preferredBetTypes: dbPreferences.preferredBetTypes ? dbPreferences.preferredBetTypes.split(',') : [],
                riskTolerance: Number(dbPreferences.riskTolerance) || 0,
                oddsFormat: dbPreferences.oddsFormat || '',
            });
        }).catch((error: unknown) => {
            console.error('Unable to load account preferences:', error);
        });
    }, [db, signedIn, user]);

    useEffect(() => {
        if (!trigger || !signedIn || !user) return;
        getBalanceByUser(db, user.id).then((balance) => {
            setUserBalance(balance);
            setTrigger(false);
        }).catch((error: unknown) => {
            console.error('Unable to refresh account balances:', error);
            setTrigger(false);
        });
    }, [db, trigger, signedIn, user]);

    const value: UserContextValue = {
        user,
        userBalance,
        setUserBalance,
        bookie,
        setBookie,
        trigger,
        setTrigger,
        preferences,
        updatePreferences,
        signedIn,
        authLoading,
        authError,
        setAuthError,
        activateAccount,
        locationStatus,
        checkLocation,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
