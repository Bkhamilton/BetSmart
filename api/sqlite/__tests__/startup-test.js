import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeDatabase } from '../startup';
import { createTables } from '../createTables';
import { syncInitialData, checkForUpdates } from '@/api/supabase/startup';
import { supabase } from '@/services/supabase';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));
jest.mock('../createTables', () => ({ createTables: jest.fn() }));
jest.mock('@/api/supabase/startup', () => ({
  syncInitialData: jest.fn(),
  checkForUpdates: jest.fn(),
}));
jest.mock('@/services/supabase', () => ({ supabase: undefined }));

beforeEach(() => {
  jest.clearAllMocks();
});

it('initializes local schema on every launch without a backend or data reset', async () => {
  const db = { execAsync: jest.fn() };
  await initializeDatabase(db);
  await initializeDatabase(db);
  expect(createTables).toHaveBeenCalledTimes(2);
  expect(createTables).toHaveBeenCalledWith(db);
  expect(db.execAsync).not.toHaveBeenCalled();
  expect(syncInitialData).not.toHaveBeenCalled();
  expect(checkForUpdates).not.toHaveBeenCalled();
  expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  expect(supabase).toBeUndefined();
});

it('surfaces local schema failures rather than opening a broken database', async () => {
  createTables.mockRejectedValueOnce(new Error('disk full'));
  await expect(initializeDatabase({})).rejects.toThrow('disk full');
});
