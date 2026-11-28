import React, { useContext } from 'react';
import renderer, { act } from 'react-test-renderer';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistorySyncContext, HistorySyncProvider } from '@/contexts/HistorySyncContext';
import { UserContext } from '@/contexts/UserContext';
import { supabase } from '@/services/supabase';
import { useSQLiteContext, addDatabaseChangeListener } from 'expo-sqlite';
import { pushHistory } from '@/db/sync/push';
import { pullHistory } from '@/db/sync/pull';
import HistorySyncStatus from '../HistorySyncStatus';

jest.mock('@/contexts/UserContext', () => ({
  UserContext: require('react').createContext({}),
}));
jest.mock('@/services/supabase', () => ({
  supabase: { auth: {
    getSession: jest.fn(),
    getUser: jest.fn(),
    onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
  } },
}));
jest.mock('@supabase/supabase-js', () => ({ createClient: jest.fn(() => ({})) }));
jest.mock('expo-sqlite', () => ({
  useSQLiteContext: jest.fn(),
  addDatabaseChangeListener: jest.fn(() => ({ remove: jest.fn() })),
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { getItem: jest.fn(), setItem: jest.fn() },
}));
jest.mock('@/db/sync/push', () => ({ pushHistory: jest.fn() }));
jest.mock('@/db/sync/pull', () => ({ pullHistory: jest.fn() }), { virtual: true });

let current;
function Observer() {
  current = useContext(HistorySyncContext);
  return null;
}

const flush = async () => {
  for (let i = 0; i < 20; i += 1) await Promise.resolve();
};

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  jest.spyOn(AppState, 'addEventListener').mockImplementation(() => ({ remove: jest.fn() }));
  AsyncStorage.getItem.mockResolvedValue(null);
  AsyncStorage.setItem.mockResolvedValue(undefined);
  process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://example.invalid';
  process.env.EXPO_PUBLIC_SUPABASE_API_KEY = 'public-test-key';
  useSQLiteContext.mockReturnValue({
    databasePath: 'test.db',
    isInTransactionAsync: jest.fn().mockResolvedValue(false),
    getFirstAsync: jest.fn().mockResolvedValue({ latest: 1, outstanding: 0, failed: 0 }),
  });
  supabase.auth.getSession.mockResolvedValue({
    data: { session: { user: { id: 'cloud-a' }, access_token: 'test-token' } }, error: null,
  });
  supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'cloud-a' } }, error: null });
  pushHistory.mockResolvedValue(undefined);
  pullHistory.mockResolvedValue(undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

it('refreshes after pull without resyncing its own outbox status updates', async () => {
  const setTrigger = jest.fn();
  let tree;
  await act(async () => {
    tree = renderer.create(
      <UserContext.Provider value={{ signedIn: true, authLoading: false, user: { id: 1, cloudUserId: 'cloud-a' }, setTrigger }}>
        <HistorySyncProvider><Observer /></HistorySyncProvider>
      </UserContext.Provider>
    );
    await flush();
  });
  expect(current.status).toBe('synced');
  expect(current.revision).toBe(1);
  expect(setTrigger).toHaveBeenCalledWith(true);
  expect(pushHistory).toHaveBeenCalledTimes(1);
  expect(pullHistory).toHaveBeenCalledTimes(1);
  const pinnedClient = pushHistory.mock.calls[0][1];
  expect((await pinnedClient.auth.getSession()).data.session.user.id).toBe('cloud-a');
  await pinnedClient.auth.getUser();
  expect(supabase.auth.getUser).toHaveBeenCalledWith('test-token');

  await act(async () => {
    addDatabaseChangeListener.mock.calls[0][0]({ databaseFilePath: 'test.db', tableName: 'sync_outbox' });
    jest.advanceTimersByTime(500);
    await flush();
  });
  expect(pushHistory).toHaveBeenCalledTimes(1);
  expect(pullHistory).toHaveBeenCalledTimes(1);
  await act(async () => tree.unmount());
});

it('does not pull or publish the old account after logout during push', async () => {
  let resolvePush;
  pushHistory.mockReturnValue(new Promise((resolve) => { resolvePush = resolve; }));
  const setTrigger = jest.fn();
  let tree;
  await act(async () => {
    tree = renderer.create(
      <UserContext.Provider value={{ signedIn: true, authLoading: false, user: { id: 1, cloudUserId: 'cloud-a' }, setTrigger }}>
        <HistorySyncProvider><Observer /></HistorySyncProvider>
      </UserContext.Provider>
    );
    await flush();
  });
  expect(pushHistory).toHaveBeenCalledTimes(1);
  const pinnedClient = pushHistory.mock.calls[0][1];
  await act(async () => {
    supabase.auth.onAuthStateChange.mock.calls[0][0]('SIGNED_OUT', null);
    resolvePush({ warnings: [{ operationId: 'private-id', field: 'snapshot' }] });
    await flush();
  });
  expect(pullHistory).not.toHaveBeenCalled();
  expect(setTrigger).not.toHaveBeenCalled();
  expect(current.status).not.toBe('synced');
  expect(current.hasHistoryWarning).toBe(false);
  expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  await expect(pinnedClient.auth.getSession()).rejects.toThrow('session changed');
  await act(async () => tree.unmount());
});

it('syncs a newly committed outbox sequence once', async () => {
  const db = useSQLiteContext();
  let latest = 1;
  db.getFirstAsync.mockImplementation(async () => ({ latest, outstanding: 0, failed: 0 }));
  let tree;
  await act(async () => {
    tree = renderer.create(
      <UserContext.Provider value={{ signedIn: true, authLoading: false, user: { id: 1, cloudUserId: 'cloud-a' }, setTrigger: jest.fn() }}>
        <HistorySyncProvider><Observer /></HistorySyncProvider>
      </UserContext.Provider>
    );
    await flush();
  });
  latest = 2;
  await act(async () => {
    const listener = addDatabaseChangeListener.mock.calls[0][0];
    listener({ databaseFilePath: 'test.db', tableName: 'sync_outbox' });
    listener({ databaseFilePath: 'test.db', tableName: 'sync_outbox' });
    jest.advanceTimersByTime(500);
    await flush();
  });
  expect(pushHistory).toHaveBeenCalledTimes(2);
  expect(pullHistory).toHaveBeenCalledTimes(2);
  expect(current.revision).toBe(2);
  await act(async () => tree.unmount());
});

it('does not pull or claim sync success with failed outbox rows', async () => {
  const db = useSQLiteContext();
  db.getFirstAsync.mockResolvedValue({ latest: 1, outstanding: 1, failed: 1 });
  let tree;
  await act(async () => {
    tree = renderer.create(
      <UserContext.Provider value={{ signedIn: true, authLoading: false, user: { id: 1, cloudUserId: 'cloud-a' }, setTrigger: jest.fn() }}>
        <HistorySyncProvider><Observer /></HistorySyncProvider>
      </UserContext.Provider>
    );
    await flush();
  });
  expect(current.status).toBe('failed');
  expect(pullHistory).not.toHaveBeenCalled();
  await act(async () => tree.unmount());
});

it('refreshes readers when a pull fails after possibly applying an earlier page', async () => {
  pullHistory.mockRejectedValue(new Error('later page failed'));
  const setTrigger = jest.fn();
  let tree;
  await act(async () => {
    tree = renderer.create(
      <UserContext.Provider value={{ signedIn: true, authLoading: false, user: { id: 1, cloudUserId: 'cloud-a' }, setTrigger }}>
        <HistorySyncProvider><Observer /></HistorySyncProvider>
      </UserContext.Provider>
    );
    await flush();
  });
  expect(current.status).toBe('failed');
  expect(current.revision).toBe(1);
  expect(setTrigger).toHaveBeenCalledWith(true);
  await act(async () => tree.unmount());
});

it('backs off after failures and automatically recovers while foregrounded', async () => {
  pullHistory.mockRejectedValueOnce(new Error('private payload')).mockRejectedValueOnce(new Error('offline'));
  let tree;
  await act(async () => {
    tree = renderer.create(
      <UserContext.Provider value={{ signedIn: true, authLoading: false, user: { id: 1, cloudUserId: 'cloud-a' }, setTrigger: jest.fn() }}>
        <HistorySyncProvider><Observer /></HistorySyncProvider>
      </UserContext.Provider>
    );
    await flush();
  });
  expect(current.status).toBe('failed');
  expect(JSON.stringify(current)).not.toContain('private payload');
  await act(async () => { jest.advanceTimersByTime(9_999); await flush(); });
  expect(pullHistory).toHaveBeenCalledTimes(1);
  await act(async () => { jest.advanceTimersByTime(1); await flush(); });
  expect(pullHistory).toHaveBeenCalledTimes(2);
  await act(async () => { jest.advanceTimersByTime(29_999); await flush(); });
  expect(pullHistory).toHaveBeenCalledTimes(2);
  await act(async () => { jest.advanceTimersByTime(1); await flush(); });
  expect(pullHistory).toHaveBeenCalledTimes(3);
  expect(current.status).toBe('synced');
  await act(async () => tree.unmount());
});

it('caps retry frequency for persistent errors without a tight loop', async () => {
  pullHistory.mockRejectedValue(new Error('offline'));
  let tree;
  await act(async () => {
    tree = renderer.create(
      <UserContext.Provider value={{ signedIn: true, authLoading: false, user: { id: 1, cloudUserId: 'cloud-a' }, setTrigger: jest.fn() }}>
        <HistorySyncProvider><Observer /></HistorySyncProvider>
      </UserContext.Provider>
    );
    await flush();
  });
  for (const delay of [10_000, 30_000, 60_000, 120_000, 300_000]) {
    await act(async () => { jest.advanceTimersByTime(delay); await flush(); });
  }
  expect(pullHistory).toHaveBeenCalledTimes(6);
  await act(async () => { jest.advanceTimersByTime(299_999); await flush(); });
  expect(pullHistory).toHaveBeenCalledTimes(6);
  await act(async () => { jest.advanceTimersByTime(1); await flush(); });
  expect(pullHistory).toHaveBeenCalledTimes(7);
  await act(async () => tree.unmount());
});

it('does not start overlapping retries while a sync is still in flight', async () => {
  let resolvePull;
  pullHistory.mockReturnValue(new Promise((resolve) => { resolvePull = resolve; }));
  let tree;
  await act(async () => {
    tree = renderer.create(
      <UserContext.Provider value={{ signedIn: true, authLoading: false, user: { id: 1, cloudUserId: 'cloud-a' }, setTrigger: jest.fn() }}>
        <HistorySyncProvider><Observer /></HistorySyncProvider>
      </UserContext.Provider>
    );
    await flush();
  });
  await act(async () => { jest.advanceTimersByTime(600_000); await flush(); });
  expect(pullHistory).toHaveBeenCalledTimes(1);
  await act(async () => { tree.unmount(); resolvePull(); await flush(); });
  expect(pullHistory).toHaveBeenCalledTimes(1);
});

it('checks again after a successful sync and recovers when connectivity returns', async () => {
  pullHistory.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('offline'));
  let tree;
  await act(async () => {
    tree = renderer.create(
      <UserContext.Provider value={{ signedIn: true, authLoading: false, user: { id: 1, cloudUserId: 'cloud-a' }, setTrigger: jest.fn() }}>
        <HistorySyncProvider><Observer /></HistorySyncProvider>
      </UserContext.Provider>
    );
    await flush();
  });
  await act(async () => { jest.advanceTimersByTime(299_999); await flush(); });
  expect(pullHistory).toHaveBeenCalledTimes(1);
  await act(async () => { jest.advanceTimersByTime(1); await flush(); });
  expect(current.status).toBe('failed');
  await act(async () => { jest.advanceTimersByTime(10_000); await flush(); });
  expect(pullHistory).toHaveBeenCalledTimes(3);
  expect(current.status).toBe('synced');
  await act(async () => tree.unmount());
});

it('cancels retries in the background and after sign-out', async () => {
  let onAppState;
  AppState.addEventListener.mockImplementation((_event, listener) => {
    onAppState = listener;
    return { remove: jest.fn() };
  });
  pullHistory.mockRejectedValue(new Error('offline'));
  let tree;
  await act(async () => {
    tree = renderer.create(
      <UserContext.Provider value={{ signedIn: true, authLoading: false, user: { id: 1, cloudUserId: 'cloud-a' }, setTrigger: jest.fn() }}>
        <HistorySyncProvider><Observer /></HistorySyncProvider>
      </UserContext.Provider>
    );
    await flush();
  });
  await act(async () => { onAppState('background'); jest.advanceTimersByTime(600_000); await flush(); });
  expect(pullHistory).toHaveBeenCalledTimes(1);
  await act(async () => { onAppState('active'); await flush(); });
  expect(pullHistory).toHaveBeenCalledTimes(2);
  await act(async () => {
    supabase.auth.onAuthStateChange.mock.calls[0][0]('SIGNED_OUT', null);
    jest.advanceTimersByTime(600_000);
    await flush();
  });
  expect(pullHistory).toHaveBeenCalledTimes(2);
  await act(async () => tree.unmount());
});

it('manual retry cancels the existing timer and unmount cleans up the next one', async () => {
  pullHistory.mockRejectedValue(new Error('offline'));
  let tree;
  await act(async () => {
    tree = renderer.create(
      <UserContext.Provider value={{ signedIn: true, authLoading: false, user: { id: 1, cloudUserId: 'cloud-a' }, setTrigger: jest.fn() }}>
        <HistorySyncProvider><Observer /></HistorySyncProvider>
      </UserContext.Provider>
    );
    await flush();
  });
  await act(async () => { jest.advanceTimersByTime(5_000); current.retry(); await flush(); });
  expect(pullHistory).toHaveBeenCalledTimes(2);
  await act(async () => { jest.advanceTimersByTime(5_000); await flush(); });
  expect(pullHistory).toHaveBeenCalledTimes(2);
  await act(async () => tree.unmount());
  await act(async () => { jest.advanceTimersByTime(600_000); await flush(); });
  expect(pullHistory).toHaveBeenCalledTimes(2);
});

it('does not retry the previous account after switching accounts', async () => {
  pullHistory.mockRejectedValueOnce(new Error('offline'));
  const setTrigger = jest.fn();
  const account = (id, cloudUserId) => (
    <UserContext.Provider value={{ signedIn: true, authLoading: false, user: { id, cloudUserId }, setTrigger }}>
      <HistorySyncProvider><Observer /></HistorySyncProvider>
    </UserContext.Provider>
  );
  let tree;
  await act(async () => { tree = renderer.create(account(1, 'cloud-a')); await flush(); });
  expect(current.status).toBe('failed');
  supabase.auth.getSession.mockResolvedValue({
    data: { session: { user: { id: 'cloud-b' }, access_token: 'other-token' } }, error: null,
  });
  await act(async () => { tree.update(account(2, 'cloud-b')); await flush(); });
  expect(current.status).toBe('synced');
  await act(async () => { jest.advanceTimersByTime(10_000); await flush(); });
  expect(pullHistory.mock.calls.map((call) => call[3])).toEqual(['cloud-a', 'cloud-b']);
  await act(async () => tree.unmount());
});

it('retains a generic warning across empty pulls and relaunch, isolated by account', async () => {
  const saved = new Map();
  AsyncStorage.getItem.mockImplementation(async (key) => saved.get(key) ?? null);
  AsyncStorage.setItem.mockImplementation(async (key, value) => { saved.set(key, value); });
  pullHistory.mockResolvedValueOnce({ warnings: ['private row details'] });
  const setTrigger = jest.fn();
  const account = (id, cloudUserId) => (
    <UserContext.Provider value={{ signedIn: true, authLoading: false, user: { id, cloudUserId }, setTrigger }}>
      <HistorySyncProvider><Observer /></HistorySyncProvider>
    </UserContext.Provider>
  );
  let tree;
  await act(async () => { tree = renderer.create(account(1, 'cloud-a')); await flush(); });
  expect(current.status).toBe('synced');
  expect(current.hasHistoryWarning).toBe(true);
  expect([...saved.values()]).toEqual(['1']);
  expect(JSON.stringify(current)).not.toContain('private row details');
  expect(JSON.stringify([...saved])).not.toContain('private row details');

  pullHistory.mockResolvedValue({ warnings: [] });
  await act(async () => { current.retry(); await flush(); });
  expect(current.hasHistoryWarning).toBe(true);
  await act(async () => tree.unmount());
  await act(async () => { tree = renderer.create(account(1, 'cloud-a')); await flush(); });
  expect(current.hasHistoryWarning).toBe(true);

  supabase.auth.getSession.mockResolvedValue({
    data: { session: { user: { id: 'cloud-b' }, access_token: 'other-token' } }, error: null,
  });
  await act(async () => { tree.update(account(1, 'cloud-b')); await flush(); });
  expect(current.hasHistoryWarning).toBe(false);
  await act(async () => tree.unmount());
});

it('persists and displays upload warnings even when pending work prevents a pull', async () => {
  const saved = new Map();
  AsyncStorage.getItem.mockImplementation(async (key) => saved.get(key) ?? null);
  AsyncStorage.setItem.mockImplementation(async (key, value) => { saved.set(key, value); });
  pushHistory.mockResolvedValueOnce({ warnings: [{ operationId: 'private-id', field: 'snapshot' }] });
  const db = useSQLiteContext();
  db.getFirstAsync.mockResolvedValue({ latest: 1, outstanding: 1, failed: 1 });
  const setTrigger = jest.fn();
  const account = (id, cloudUserId) => (
    <UserContext.Provider value={{ signedIn: true, authLoading: false, user: { id, cloudUserId }, setTrigger }}>
      <HistorySyncProvider><Observer /><HistorySyncStatus /></HistorySyncProvider>
    </UserContext.Provider>
  );
  let tree;
  await act(async () => { tree = renderer.create(account(1, 'cloud-a')); await flush(); });
  expect(pullHistory).not.toHaveBeenCalled();
  expect(current.status).toBe('failed');
  expect(current.hasHistoryWarning).toBe(true);
  expect(JSON.stringify(tree.toJSON())).toContain('Some betting history may be missing historical details');
  expect(JSON.stringify(tree.toJSON())).not.toContain('private-id');
  expect([...saved.values()]).toEqual(['1']);
  expect(JSON.stringify([...saved])).not.toContain('private-id');

  db.getFirstAsync.mockResolvedValue({ latest: 1, outstanding: 0, failed: 0 });
  pushHistory.mockResolvedValue({ warnings: [] });
  pullHistory.mockResolvedValue({ warnings: [] });
  await act(async () => tree.unmount());
  await act(async () => { tree = renderer.create(account(1, 'cloud-a')); await flush(); });
  expect(current.hasHistoryWarning).toBe(true);
  expect(current.status).toBe('synced');
  supabase.auth.getSession.mockResolvedValue({
    data: { session: { user: { id: 'cloud-b' }, access_token: 'other-token' } }, error: null,
  });
  await act(async () => { tree.update(account(1, 'cloud-b')); await flush(); });
  expect(current.hasHistoryWarning).toBe(false);
  await act(async () => tree.unmount());
});

it('keeps upload warnings visible if notice storage fails', async () => {
  pushHistory.mockResolvedValue({ warnings: [{ field: 'snapshot' }] });
  AsyncStorage.setItem.mockRejectedValue(new Error('storage error'));
  let tree;
  await act(async () => {
    tree = renderer.create(
      <UserContext.Provider value={{ signedIn: true, authLoading: false, user: { id: 1, cloudUserId: 'cloud-a' }, setTrigger: jest.fn() }}>
        <HistorySyncProvider><Observer /></HistorySyncProvider>
      </UserContext.Provider>
    );
    await flush();
  });
  expect(current.hasHistoryWarning).toBe(true);
  expect(current.warningStorageUnavailable).toBe(true);
  await act(async () => tree.unmount());
});

it('does not expose warnings returned after the account signs out', async () => {
  let resolvePull;
  pullHistory.mockReturnValue(new Promise((resolve) => { resolvePull = resolve; }));
  let tree;
  await act(async () => {
    tree = renderer.create(
      <UserContext.Provider value={{ signedIn: true, authLoading: false, user: { id: 1, cloudUserId: 'cloud-a' }, setTrigger: jest.fn() }}>
        <HistorySyncProvider><Observer /></HistorySyncProvider>
      </UserContext.Provider>
    );
    await flush();
  });
  await act(async () => {
    supabase.auth.onAuthStateChange.mock.calls[0][0]('SIGNED_OUT', null);
    resolvePull({ warnings: ['private row details'] });
    await flush();
  });
  expect(current.hasHistoryWarning).toBe(false);
  expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  await act(async () => tree.unmount());
});

it('keeps the warning visible and reports notice storage failure', async () => {
  pullHistory.mockResolvedValue({ warnings: ['missing snapshot'] });
  AsyncStorage.setItem.mockRejectedValue(new Error('storage error'));
  let tree;
  await act(async () => {
    tree = renderer.create(
      <UserContext.Provider value={{ signedIn: true, authLoading: false, user: { id: 1, cloudUserId: 'cloud-a' }, setTrigger: jest.fn() }}>
        <HistorySyncProvider><Observer /></HistorySyncProvider>
      </UserContext.Provider>
    );
    await flush();
  });
  expect(current.hasHistoryWarning).toBe(true);
  expect(current.warningStorageUnavailable).toBe(true);
  expect(current.status).toBe('synced');
  await act(async () => tree.unmount());
});

it('reports when a prior restore notice cannot be loaded', async () => {
  AsyncStorage.getItem.mockRejectedValue(new Error('storage error'));
  let tree;
  await act(async () => {
    tree = renderer.create(
      <UserContext.Provider value={{ signedIn: true, authLoading: false, user: { id: 1, cloudUserId: 'cloud-a' }, setTrigger: jest.fn() }}>
        <HistorySyncProvider><Observer /></HistorySyncProvider>
      </UserContext.Provider>
    );
    await flush();
  });
  expect(current.warningStorageUnavailable).toBe(true);
  expect(current.hasHistoryWarning).toBe(false);
  await act(async () => tree.unmount());
});
