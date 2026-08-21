'use client';
import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('promptory_favorites');
      if (stored) setFavorites(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to load favorites', e);
    }
    setIsLoaded(true);
  }, []);

  const toggleFavorite = (promptId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(promptId)
        ? prev.filter((id) => id !== promptId)
        : [...prev, promptId];
      try {
        localStorage.setItem('promptory_favorites', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save favorite', e);
      }
      return next;
    });
  };

  const isFavorite = (promptId: string) => favorites.includes(promptId);

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}
