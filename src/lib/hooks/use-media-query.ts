'use client';

import { useEffect, useState } from 'react';

/**
 * Подписка на media query. SSR-безопасна: на сервере возвращает `defaultValue`.
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(list.matches);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Мобильный/планшетный экран (< 1024px). */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 1023px)');
}

/** Очень маленький экран (< 640px). */
export function useIsSmallScreen(): boolean {
  return useMediaQuery('(max-width: 639px)');
}

/** Пользователь просил уменьшить анимацию. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
