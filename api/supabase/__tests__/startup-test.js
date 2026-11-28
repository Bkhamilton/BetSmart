import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkForUpdates } from '../startup';
import { syncSeasons, updateGameInfo } from '../sync';
import { getAllUpcomingGames } from '../Games';
import { getAllUpcomingGames as getLocalUpcomingGames } from '@/db/general/Games';
import { getLastUpdatedMarket as getLocalLastUpdatedMarket } from '@/db/api/BetMarkets';
import { getLastUpdatedMarket } from '../BetMarkets';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));
jest.mock('../sync', () => ({
  syncSeasons: jest.fn(),
  updateGameInfo: jest.fn(),
  updateMarkets: jest.fn(),
}));
jest.mock('../Games', () => ({ getAllUpcomingGames: jest.fn() }));
jest.mock('@/db/general/Games', () => ({ getAllUpcomingGames: jest.fn() }));
jest.mock('@/db/api/BetMarkets', () => ({ getLastUpdatedMarket: jest.fn() }));
jest.mock('../BetMarkets', () => ({ getLastUpdatedMarket: jest.fn() }));

beforeEach(() => {
  jest.clearAllMocks();
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  AsyncStorage.getItem.mockResolvedValue(today);
  syncSeasons.mockResolvedValue(false);
  getAllUpcomingGames.mockResolvedValue([]);
  getLocalUpcomingGames.mockResolvedValue([]);
  getLastUpdatedMarket.mockResolvedValue('2026-01-01T00:00:00Z');
  getLocalLastUpdatedMarket.mockResolvedValue('2026-01-01T00:00:00Z');
});

test('syncs seasons before refreshing games when they change on the same day', async () => {
  syncSeasons.mockResolvedValue(true);
  await checkForUpdates({}, {});
  expect(updateGameInfo).toHaveBeenCalledTimes(1);
  expect(syncSeasons.mock.invocationCallOrder[0]).toBeLessThan(updateGameInfo.mock.invocationCallOrder[0]);
  expect(AsyncStorage.setItem).toHaveBeenCalledWith('lastSyncDate', await AsyncStorage.getItem());
});

test('does not refresh games solely for unchanged seasons', async () => {
  await checkForUpdates({}, {});
  expect(syncSeasons).toHaveBeenCalledTimes(1);
  expect(updateGameInfo).not.toHaveBeenCalled();
});

test('does not refresh games or advance the sync date if season sync fails', async () => {
  syncSeasons.mockRejectedValue(new Error('offline'));
  const errorLog = jest.spyOn(console, 'error').mockImplementation(() => {});
  try {
    await checkForUpdates({}, {});
    expect(updateGameInfo).not.toHaveBeenCalled();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(errorLog).toHaveBeenCalled();
  } finally {
    errorLog.mockRestore();
  }
});
