'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'promptory_saved_prompts';

export function useSavedPrompts() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedIds(JSON.parse(stored));
      }
    } catch {
      // Fallback if localStorage is disabled
    }
    setIsLoaded(true);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setSavedIds(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleSave = (id: string | number) => {
    const strId = String(id);
    setSavedIds(prev => {
      const next = prev.includes(strId)
        ? prev.filter(item => item !== strId)
        : [...prev, strId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event('promptory_saved_updated'));
      } catch {}
      return next;
    });
  };

  const isSaved = (id: string | number) => {
    return savedIds.includes(String(id));
  };

  return { savedIds, toggleSave, isSaved, isLoaded };
}
