'use client';

import { useFavoritesStore } from '@/lib/store/favorites';

/**
 * Хук избранного.
 *
 * Возвращает список id избранных обоев и функции переключения.
 * Обёртка над zustand-стором, чтобы компоненты не зависели от реализации стора.
 */
export function useFavorites() {
  const favorites = useFavoritesStore((state) => state.favorites);
  const toggle = useFavoritesStore((state) => state.toggle);
  const clear = useFavoritesStore((state) => state.clear);

  const has = (id: string) => favorites.includes(id);

  return { favorites, has, toggle, clear, count: favorites.length };
}
