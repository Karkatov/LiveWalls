/**
 * Хелперы для JSON-ответов Route Handlers.
 *
 * Заголовки кэширования вынесены в константы, чтобы CDN, reverse proxy
 * и Route Handlers использовали одинаковые значения.
 */

export const CACHE_CONTROL = {
  /** Списки и рекомендации: 60 секунд на CDN + 5 минут stale-while-revalidate. */
  publicList: 'public, s-maxage=60, stale-while-revalidate=300',
  /** Категории меняются редко — можно кэшировать дольше. */
  categories: 'public, s-maxage=3600, stale-while-revalidate=86400',
  /** Пользовательские данные и платежи не кэшируются. */
  noStore: 'private, no-store, max-age=0',
  /** Хэшированные файлы Next.js. */
  staticImmutable: 'public, max-age=31536000, immutable',
  /** Плейсхолдеры и прочие статичные ассеты без хэша в имени. */
  staticAssets: 'public, max-age=604800, stale-while-revalidate=86400',
} as const;

export interface JsonResponseInit {
  status?: number;
  cacheControl?: string;
  headers?: HeadersInit;
}

/** JSON-ответ с корректным Content-Type и, при необходимости, Cache-Control. */
export function json<T>(data: T, init: JsonResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json; charset=utf-8');

  if (init.cacheControl) headers.set('Cache-Control', init.cacheControl);

  return new Response(JSON.stringify(data), {
    status: init.status ?? 200,
    headers,
  });
}

/** Унифицированный JSON-ответ с ошибкой. */
export function apiError(
  status: number,
  code: string,
  message: string,
  init: Omit<JsonResponseInit, 'status'> = {},
): Response {
  return json({ error: code, message }, { ...init, status });
}
