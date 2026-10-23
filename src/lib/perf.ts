/**
 * Утилиты для производительности.
 * Минимум тяжелой логики в главном потоке.
 */

export function isPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function requestIdleCallbackPolyfill(cb: () => void, timeout = 1000) {
  if (typeof window === 'undefined') return;
  if ('requestIdleCallback' in window) {
    (
      window as Window & {
        requestIdleCallback: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number;
      }
    ).requestIdleCallback(() => cb(), { timeout });
    return;
  }
  setTimeout(cb, 1);
}
