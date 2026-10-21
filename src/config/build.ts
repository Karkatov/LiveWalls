/**
 * Режим сборки приложения.
 *
 * Статический экспорт включён по умолчанию: Cloudflare Pages и другие
 * статические хостинги не всегда передают переменные окружения в процесс
 * сборки, а каталог `out/` там обязателен. Поэтому режим определяется так:
 *
 *   NEXT_OUTPUT=server      → обычный Next.js-сервер (Vercel, Netlify, VPS)
 *   NEXT_OUTPUT=standalone  → output: 'standalone' (Docker)
 *   всё остальное / пусто   → статический экспорт в `out/`
 *
 * Модуль используется и в `next.config.ts`, и в коде страниц — чтобы
 * обе части всегда считали режим одинаково.
 */

export type BuildMode = 'export' | 'server' | 'standalone';

/** Определяет режим сборки по значению NEXT_OUTPUT. */
export function resolveBuildMode(value: string | undefined = process.env.NEXT_OUTPUT): BuildMode {
  const mode = (value ?? '').trim().toLowerCase();

  if (mode === 'server') return 'server';
  if (mode === 'standalone') return 'standalone';

  return 'export';
}

/** Текущий режим сборки. */
export const buildMode: BuildMode = resolveBuildMode();

/** Статический экспорт — режим по умолчанию. */
export const isStaticExport: boolean = buildMode === 'export';

/** Серверный режим (Next.js-сервер / standalone). */
export const isServerMode: boolean = !isStaticExport;
