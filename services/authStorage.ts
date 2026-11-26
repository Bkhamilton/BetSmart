import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const CHUNK_MAX_BYTES = 1600;
const secureStoreOptions = {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
};
const isBrowser = () => typeof window !== 'undefined';

const splitIntoChunks = (value: string): string[] => {
    const chunks: string[] = [];
    let chunk = '';
    let byteLength = 0;

    for (const character of value) {
        const characterBytes = unescape(encodeURIComponent(character)).length;
        if (byteLength + characterBytes > CHUNK_MAX_BYTES && chunk) {
            chunks.push(chunk);
            chunk = '';
            byteLength = 0;
        }
        chunk += character;
        byteLength += characterBytes;
    }

    if (chunk || chunks.length === 0) chunks.push(chunk);
    return chunks;
};

const secureGetItem = async (key: string): Promise<string | null> => {
    const pointerKey = `${key}.current`;
    const pointerValue = await SecureStore.getItemAsync(pointerKey);

    if (pointerValue) {
        let pointer: { id: string; count: number };
        try {
            pointer = JSON.parse(pointerValue);
        } catch {
            throw new Error('Stored authentication session metadata is invalid.');
        }
        if (!pointer.id || !Number.isInteger(pointer.count) || pointer.count < 1) {
            throw new Error('Stored authentication session metadata is incomplete.');
        }

        const chunks = await Promise.all(
            Array.from({ length: pointer.count }, (_, index) =>
                SecureStore.getItemAsync(`${key}.${pointer.id}.${index}`)
            )
        );
        if (chunks.some((chunk) => chunk === null)) {
            throw new Error('The saved authentication session is incomplete.');
        }
        return chunks.join('');
    }

    const legacySecureValue = await SecureStore.getItemAsync(key);
    if (legacySecureValue) {
        await secureSetItem(key, legacySecureValue);
        await SecureStore.deleteItemAsync(key, secureStoreOptions);
        return legacySecureValue;
    }

    const legacyAsyncValue = await AsyncStorage.getItem(key);
    if (legacyAsyncValue) {
        await secureSetItem(key, legacyAsyncValue);
        await AsyncStorage.removeItem(key);
        return legacyAsyncValue;
    }

    return null;
};

const secureSetItem = async (key: string, value: string): Promise<void> => {
    const pointerKey = `${key}.current`;
    const previousValue = await SecureStore.getItemAsync(pointerKey);
    const previous = previousValue ? JSON.parse(previousValue) as { id: string; count: number } : null;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const chunks = splitIntoChunks(value);

    await Promise.all(chunks.map((chunk, index) =>
        SecureStore.setItemAsync(`${key}.${id}.${index}`, chunk, secureStoreOptions)
    ));
    await SecureStore.setItemAsync(pointerKey, JSON.stringify({ id, count: chunks.length }), secureStoreOptions);

    if (previous?.id && Number.isInteger(previous.count)) {
        await Promise.all(Array.from({ length: previous.count }, (_, index) =>
            SecureStore.deleteItemAsync(`${key}.${previous.id}.${index}`, secureStoreOptions)
        ));
    }
};

export const authStorage = {
    getItem: (key: string) => Platform.OS === 'web'
        ? isBrowser() ? AsyncStorage.getItem(key) : Promise.resolve(null)
        : secureGetItem(key),
    setItem: (key: string, value: string) =>
        Platform.OS === 'web'
            ? isBrowser() ? AsyncStorage.setItem(key, value) : Promise.resolve()
            : secureSetItem(key, value),
    removeItem: async (key: string) => {
        if (Platform.OS === 'web') {
            if (isBrowser()) await AsyncStorage.removeItem(key);
            return;
        }

        const pointerKey = `${key}.current`;
        const pointerValue = await SecureStore.getItemAsync(pointerKey);
        if (pointerValue) {
            const pointer = JSON.parse(pointerValue) as { id: string; count: number };
            if (pointer.id && Number.isInteger(pointer.count)) {
                await Promise.all(Array.from({ length: pointer.count }, (_, index) =>
                    SecureStore.deleteItemAsync(`${key}.${pointer.id}.${index}`, secureStoreOptions)
                ));
            }
        }
        await SecureStore.deleteItemAsync(pointerKey, secureStoreOptions);
        await SecureStore.deleteItemAsync(key, secureStoreOptions);
        await AsyncStorage.removeItem(key);
    },
};
