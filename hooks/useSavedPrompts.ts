'use client';

import { useState, useEffect } from 'react';

export interface SavedPrompt {
  id: string | number;
  title: string;
  slug: string;
  description?: string;
  model?: string;
  role?: string;
  qualityScore?: number;
}

export function useSavedPrompts() {
  const [savedList, setSavedList] = useState<SavedPrompt[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('saved_prompts');
      if (stored) {
        setSavedList(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error reading saved prompts from localStorage', err);
    }
  }, []);

  const isSaved = (id: string | number) => {
    if (!mounted) return false;
    return savedList.some((item) => String(item.id) === String(id));
  };

  const toggleSave = (prompt: SavedPrompt) => {
    setSavedList((prev) => {
      const exists = prev.some((item) => String(item.id) === String(prompt.id));
      let updated: SavedPrompt[];
      if (exists) {
        updated = prev.filter((item) => String(item.id) !== String(prompt.id));
      } else {
        updated = [prompt, ...prev];
      }
      try {
        localStorage.setItem('saved_prompts', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving prompts to localStorage', err);
      }
      return updated;
    });
  };

  return { savedList, isSaved, toggleSave, mounted };
}
