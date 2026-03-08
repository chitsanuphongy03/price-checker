import { useState, useEffect, useCallback } from 'react';
import { HistoryItem } from '../types/promotion';
import {
  getHistory,
  saveHistory,
  deleteHistoryItem,
  clearHistory,
  updateHistoryName,
  getSettings,
  saveSettings,
  getCacheSize,
  clearCache,
  AppSettings,
} from '../utils/storage';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } finally {
      setLoading(false);
    }
  };

  const addHistory = useCallback(async (item: HistoryItem) => {
    await saveHistory(item);
    setHistory(prev => [item, ...prev]);
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    await deleteHistoryItem(id);
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearAll = useCallback(async () => {
    await clearHistory();
    setHistory([]);
  }, []);

  const updateName = useCallback(async (id: string, name: string) => {
    await updateHistoryName(id, name);
    setHistory(prev => prev.map(item => 
      item.id === id ? { ...item, name } : item
    ));
  }, []);

  return { history, loading, addHistory, deleteItem, clearAll, updateName, refresh: loadHistory };
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = useCallback(async (newSettings: Partial<AppSettings>) => {
    await saveSettings(newSettings);
    setSettings(prev => prev ? { ...prev, ...newSettings } : null);
  }, []);

  return { settings, loading, updateSettings, refresh: loadSettings };
}

export function useCache() {
  const [cacheSize, setCacheSize] = useState<string>('0 B');
  const [loading, setLoading] = useState(false);

  const calculateSize = useCallback(async () => {
    const size = await getCacheSize();
    setCacheSize(size);
  }, []);

  const clear = useCallback(async () => {
    setLoading(true);
    try {
      await clearCache();
      setCacheSize('0 B');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    calculateSize();
  }, [calculateSize]);

  return { cacheSize, loading, calculateSize, clear };
}
