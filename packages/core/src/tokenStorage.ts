import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

type TokenKey = 'accessToken' | 'refreshToken' | 'tokenExpiry';

const STORAGE_KEYS: Record<TokenKey, string> = {
  accessToken: 'clipo.accessToken',
  refreshToken: 'clipo.refreshToken',
  tokenExpiry: 'clipo.tokenExpiry',
};

let secureStorageAvailable: boolean | null = null;

const ensureSecureStoreAvailability = async () => {
  if (secureStorageAvailable != null) {
    return secureStorageAvailable;
  }

  if (typeof SecureStore.isAvailableAsync !== 'function') {
    secureStorageAvailable = false;
    return secureStorageAvailable;
  }

  secureStorageAvailable = await SecureStore.isAvailableAsync();
  return secureStorageAvailable;
};

const setItem = async (key: TokenKey, value: string | null) => {
  const storeKey = STORAGE_KEYS[key];
  const canUseSecureStore = await ensureSecureStoreAvailability();

  if (value == null) {
    if (canUseSecureStore) {
      await SecureStore.deleteItemAsync(storeKey);
    }
    await AsyncStorage.removeItem(storeKey);
    return;
  }

  if (canUseSecureStore) {
    await SecureStore.setItemAsync(storeKey, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  }

  await AsyncStorage.setItem(storeKey, value);
};

const getItem = async (key: TokenKey) => {
  const storeKey = STORAGE_KEYS[key];
  const canUseSecureStore = await ensureSecureStoreAvailability();

  if (canUseSecureStore) {
    const secureValue = await SecureStore.getItemAsync(storeKey);
    if (secureValue != null) {
      return secureValue;
    }
  }

  return AsyncStorage.getItem(storeKey);
};

export type StoredTokens = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
};

export const saveTokens = async ({ accessToken, refreshToken, expiresAt }: StoredTokens) => {
  await Promise.all([
    setItem('accessToken', accessToken ?? null),
    setItem('refreshToken', refreshToken ?? null),
    setItem('tokenExpiry', expiresAt ?? null),
  ]);
};

export const loadTokens = async (): Promise<StoredTokens> => {
  const [accessToken, refreshToken, expiresAt] = await Promise.all([
    getItem('accessToken'),
    getItem('refreshToken'),
    getItem('tokenExpiry'),
  ]);

  return {
    accessToken: accessToken ?? undefined,
    refreshToken: refreshToken ?? undefined,
    expiresAt: expiresAt ?? undefined,
  };
};

export const clearTokens = async () => {
  await Promise.all([
    setItem('accessToken', null),
    setItem('refreshToken', null),
    setItem('tokenExpiry', null),
  ]);
};
