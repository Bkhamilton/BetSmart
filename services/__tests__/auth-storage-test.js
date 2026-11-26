const mockSecureStoreData = new Map();
const mockAsyncStorageData = new Map();

jest.mock('expo-secure-store', () => ({
    AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 'after-first-unlock',
    getItemAsync: jest.fn(async key => mockSecureStoreData.get(key) ?? null),
    setItemAsync: jest.fn(async (key, value) => mockSecureStoreData.set(key, value)),
    deleteItemAsync: jest.fn(async key => mockSecureStoreData.delete(key)),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: {
        getItem: jest.fn(async key => mockAsyncStorageData.get(key) ?? null),
        setItem: jest.fn(async (key, value) => mockAsyncStorageData.set(key, value)),
        removeItem: jest.fn(async key => mockAsyncStorageData.delete(key)),
    },
}));

jest.mock('react-native', () => ({ Platform: { OS: 'ios' } }));

beforeEach(() => {
    mockSecureStoreData.clear();
    mockAsyncStorageData.clear();
    jest.resetModules();
});

it('stores long session values in bounded SecureStore chunks', async () => {
    const { authStorage } = require('../authStorage');
    const session = JSON.stringify({ access_token: 'a'.repeat(5000), display_name: 'A User 😀' });

    await authStorage.setItem('auth-session', session);

    expect(await authStorage.getItem('auth-session')).toBe(session);
    for (const [key, value] of mockSecureStoreData) {
        if (key.includes('.current')) continue;
        expect(unescape(encodeURIComponent(value)).length).toBeLessThanOrEqual(1600);
    }
});

it('moves a legacy AsyncStorage session into SecureStore on first read', async () => {
    mockAsyncStorageData.set('auth-session', '{"refresh_token":"legacy"}');
    const { authStorage } = require('../authStorage');

    await expect(authStorage.getItem('auth-session')).resolves.toBe('{"refresh_token":"legacy"}');
    expect(mockAsyncStorageData.has('auth-session')).toBe(false);
    expect(mockSecureStoreData.has('auth-session.current')).toBe(true);
});

it('does not access browser storage during web server rendering', async () => {
    const { authStorage } = require('../authStorage');
    const { Platform } = require('react-native');
    Platform.OS = 'web';
    const originalWindow = global.window;
    delete global.window;
    try {
        await expect(authStorage.getItem('auth-session')).resolves.toBeNull();
        await expect(authStorage.setItem('auth-session', 'session')).resolves.toBeUndefined();
        await expect(authStorage.removeItem('auth-session')).resolves.toBeUndefined();
    } finally {
        global.window = originalWindow;
    }
});
