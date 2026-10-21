import type { Paginated, Wallpaper, WallpaperFilters, WallpaperSort } from '@/types';

/**
 * Чистая логика каталога: фильтрация, сортировка, пагинация.
 *
 * Вынесена отдельно от API-слоя, чтобы одни и те же правила применялись
 * и на сервере (SSR), и в браузере (мгновенная реакция на фильтры).
 */

export const WALLPAPER_SORTS: WallpaperSort[] = [
  'newest',
  'popular',
  'price-asc',
  'price-desc',
  'name',
];

/** Фильтрация по поиску, категории, типу, цене и избранному. */
export function filterWallpapers(items: Wallpaper[], filters: WallpaperFilters): Wallpaper[] {
  let result = items;

  if (filters.q) {
    const query = filters.q.trim().toLowerCase();
    result = result.filter((wallpaper) => {
      const haystack = [
        wallpaper.title,
        wallpaper.author ?? '',
        wallpaper.location ?? '',
        wallpaper.description,
        ...wallpaper.tags,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  if (filters.category && filters.category !== 'all') {
    result = result.filter((wallpaper) => wallpaper.category === filters.category);
  }

  if (filters.mediaType && filters.mediaType !== 'all') {
    result = result.filter((wallpaper) => wallpaper.mediaType === filters.mediaType);
  }

  if (filters.price === 'paid') {
    result = result.filter((wallpaper) => wallpaper.isPaid);
  } else if (filters.price === 'free') {
    result = result.filter((wallpaper) => !wallpaper.isPaid);
  }

  if (filters.favoritesOnly) {
    result = result.filter((wallpaper) => wallpaper.isFavorite);
  }

  return result;
}

/** Сортировка — в том же порядке, что ожидает API. */
export function sortWallpapers(items: Wallpaper[], sort: WallpaperSort): Wallpaper[] {
  const copy = [...items];
  switch (sort) {
    case 'popular':
      return copy.sort((a, b) => b.likeCount - a.likeCount);
    case 'price-asc':
      return copy.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    case 'price-desc':
      return copy.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    case 'name':
      return copy.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
    case 'newest':
    default:
      return copy.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }
}

/** Пагинация списка. */
export function paginate<T>(items: T[], page: number, limit: number): Paginated<T> {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * limit;
  const slice = items.slice(start, start + limit);
  return {
    items: slice,
    total: items.length,
    page: safePage,
    limit,
    hasMore: start + limit < items.length,
  };
}

/** Разбор query-параметров страницы каталога в набор фильтров. */
export function parseFilters(
  params: Record<string, string | string[] | undefined>,
): WallpaperFilters {
  const value = (key: string): string | undefined => {
    const raw = params[key];
    return Array.isArray(raw) ? raw[0] : raw;
  };

  const sort = value('sort');
  const category = value('category');
  const mediaType = value('mediaType');
  const price = value('price');
  const page = Number(value('page') ?? '1');

  return {
    q: value('q') ?? undefined,
    category: (category ?? 'all') as WallpaperFilters['category'],
    mediaType: (mediaType ?? 'all') as WallpaperFilters['mediaType'],
    price: (price ?? 'all') as WallpaperFilters['price'],
    favoritesOnly: value('favorites') === '1',
    sort: WALLPAPER_SORTS.includes(sort as WallpaperSort) ? (sort as WallpaperSort) : 'newest',
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/** Фильтры → query-параметры (без пустых значений). */
export function filtersToQuery(filters: WallpaperFilters): Record<string, string> {
  const query: Record<string, string> = {};

  if (filters.q) query.q = filters.q;
  if (filters.category && filters.category !== 'all') query.category = filters.category;
  if (filters.mediaType && filters.mediaType !== 'all') query.mediaType = filters.mediaType;
  if (filters.price && filters.price !== 'all') query.price = filters.price;
  if (filters.favoritesOnly) query.favorites = '1';
  if (filters.sort && filters.sort !== 'newest') query.sort = filters.sort;
  if (filters.page && filters.page > 1) query.page = String(filters.page);

  return query;
}
