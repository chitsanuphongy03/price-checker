// In-memory storage fallback for when AsyncStorage is not available
const memoryStorage: Record<string, string> = {};

// Check if we're in a native environment
const isNative = typeof navigator !== 'undefined' && navigator.product !== 'ReactNative';

// Try to import AsyncStorage, fallback to memory if not available
let AsyncStorage: any;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch {
  AsyncStorage = null;
}

const STORAGE_KEYS = {
  HISTORY: '@price_checker_history',
  SETTINGS: '@price_checker_settings',
};

// Storage wrapper that works with or without AsyncStorage
const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (AsyncStorage) {
        return await AsyncStorage.getItem(key);
      }
    } catch {
      // Fallback to memory
    }
    return memoryStorage[key] || null;
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (AsyncStorage) {
        await AsyncStorage.setItem(key, value);
        return;
      }
    } catch {
      // Fallback to memory
    }
    memoryStorage[key] = value;
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (AsyncStorage) {
        await AsyncStorage.removeItem(key);
        return;
      }
    } catch {
      // Fallback to memory
    }
    delete memoryStorage[key];
  },

  async getAllKeys(): Promise<string[]> {
    try {
      if (AsyncStorage) {
        return await AsyncStorage.getAllKeys();
      }
    } catch {
      // Fallback to memory
    }
    return Object.keys(memoryStorage);
  },
};

import { HistoryItem } from '../types/promotion';

// History Operations
export const saveHistory = async (item: HistoryItem): Promise<void> => {
  try {
    const existing = await getHistory();
    const updated = [item, ...existing];
    await storage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving history:', error);
  }
};

export const getHistory = async (): Promise<HistoryItem[]> => {
  try {
    const data = await storage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};

export const deleteHistoryItem = async (id: string): Promise<void> => {
  try {
    const existing = await getHistory();
    const updated = existing.filter(item => item.id !== id);
    await storage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting history:', error);
  }
};

export const clearHistory = async (): Promise<void> => {
  try {
    await storage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
};

export const updateHistoryName = async (id: string, name: string): Promise<void> => {
  try {
    const existing = await getHistory();
    const updated = existing.map(item => 
      item.id === id ? { ...item, name } : item
    );
    await storage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating history:', error);
  }
};

// Settings Operations
export interface AppSettings {
  language: 'th' | 'en';
  mode: 'simple' | 'advance';
  defaultUnit: string;
  currency: '$' | '฿' | '€' | '¥';
}

const DEFAULT_SETTINGS: AppSettings = {
  language: 'th',
  mode: 'simple',
  defaultUnit: 'pcs',
  currency: '฿',
};

export const getSettings = async (): Promise<AppSettings> => {
  try {
    const data = await storage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (settings: Partial<AppSettings>): Promise<void> => {
  try {
    const existing = await getSettings();
    const updated = { ...existing, ...settings };
    await storage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

// Cache Management
export const getCacheSize = async (): Promise<string> => {
  try {
    const keys = await storage.getAllKeys();
    let size = 0;
    
    for (const key of keys) {
      const value = await storage.getItem(key);
      if (value) {
        size += value.length * 2;
      }
    }
    
    if (size > 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else if (size > 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    }
    return `${size} B`;
  } catch (error) {
    console.error('Error calculating cache size:', error);
    return '0 B';
  }
};

export const clearCache = async (): Promise<void> => {
  try {
    const keys = await storage.getAllKeys();
    for (const key of keys) {
      await storage.removeItem(key);
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

export { STORAGE_KEYS };
