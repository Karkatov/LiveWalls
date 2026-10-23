import { unstable_cache } from 'next/cache';
import { withMemoryCache } from './memory-cache';

/**
 * Двухуровневый серверный кэш.
 *
 * Верхний уровень — Next.js Data Cache (`unstable_cache`): переживает запросы
 * и работает в серверном режиме (`NEXT_OUTPUT=server|standalone`), а также
 * корректно прогревается во время сборки статического экспорта.
 *
 * Нижний уровень — in-memory TTL-кэш: страхует от окружений без Next Data
 * Cache и снижает накладные расходы на сериализацию ключей при высоком RPS.
 *
 * Кэшируются только общие (не пользовательские) данные: каталог, категории,
 * рекомендации. Избранное, лайки и статусы покупок должны оставаться
 * динамическими — для них этот хелпер не используется.
 */

export interface ServerCacheOptions<Args extends unknown[]> {
  /** Время жизни в секундах (оно же — `revalidate` для Next Data Cache). */
  revalidate: number;
  /** Теги для точечной инвалидации через `revalidateTag()`. */
  tags?: string[];
  /** Ключ in-memory слоя. Если не задан, используется только Next Data Cache. */
  memoryKey?: (...args: Args) => string;
}

export function createServerCache<Args extends unknown[], Result>(
  keyParts: string[],
  loader: (...args: Args) => Promise<Result>,
  options: ServerCacheOptions<Args>,
): (...args: Args) => Promise<Result> {
  const nextCached = unstable_cache(loader, keyParts, {
    revalidate: options.revalidate,
    tags: options.tags,
  });

  return (...args: Args): Promise<Result> => {
    if (!options.memoryKey) return nextCached(...args);

    return withMemoryCache(
      options.memoryKey(...args),
      () => nextCached(...args),
      options.revalidate,
    );
  };
}
