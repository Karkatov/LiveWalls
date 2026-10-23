import type { Paginated, Wallpaper, WallpaperCategoryId, WallpaperFilters } from '@/types';
import { mockWallpapers, mockWallpapersBySlug } from '@/data/mock/wallpapers';
import { mockCategories } from '@/data/mock/categories';
import { fetchData } from './fetcher';
import { PAGE_SIZE } from '@/config/site';
import { filterWallpapers, paginate, sortWallpapers } from '@/lib/catalog/filters';
import { createServerCache } from '@/lib/cache/server-cache';

/**
 * Доступ к каталогу обоев.
 *
 * Мок-режим повторяет поведение реального API: пагинация, фильтры, сортировка.
 *
 * Редко меняющиеся данные (каталог, категории, рекомендации) кэшируются
 * через Next.js Data Cache (`unstable_cache`) + in-memory L1. Пользовательские
 * данные (избранное, лайки) сюда не попадают и кэшу не подлежат.
 */

const LIST_REVALIDATE = 60;
const CATEGORIES_REVALIDATE = 3600;

function filtersKey(filters: WallpaperFilters): string {
  return [
    filters.q ?? '',
    filters.category ?? 'all',
    filters.mediaType ?? 'all',
    filters.price ?? 'all',
    filters.favoritesOnly ? '1' : '0',
    filters.sort ?? 'newest',
    filters.page ?? 1,
    filters.limit ?? PAGE_SIZE,
  ].join('|');
}

async function loadWallpapers(filters: WallpaperFilters): Promise<Paginated<Wallpaper>> {
  const {
    q,
    category,
    mediaType,
    price,
    favoritesOnly,
    sort = 'newest',
    page = 1,
    limit = PAGE_SIZE,
  } = filters;

  return fetchData<Paginated<Wallpaper>>(
    '/api/wallpapers',
    () => {
      const filtered = filterWallpapers(mockWallpapers, {
        q,
        category,
        mediaType,
        price,
        favoritesOnly,
        sort,
      });
      return paginate(sortWallpapers(filtered, sort), Math.max(1, page), limit);
    },
    {
      revalidate: LIST_REVALIDATE,
      tags: ['wallpapers', 'wallpapers:list'],
    },
  );
}

const cachedWallpapers = createServerCache(['wallpapers:list'], loadWallpapers, {
  revalidate: LIST_REVALIDATE,
  tags: ['wallpapers', 'wallpapers:list'],
  memoryKey: (filters: WallpaperFilters) => `wallpapers:list:${filtersKey(filters)}`,
});

/** Список обоев с фильтрами. */
export async function getWallpapers(filters: WallpaperFilters = {}): Promise<Paginated<Wallpaper>> {
  return cachedWallpapers(filters);
}

const cachedWallpaper = createServerCache(
  ['wallpapers:by-slug'],
  async (slug: string): Promise<Wallpaper | null> =>
    fetchData<Wallpaper | null>(
      `/api/wallpapers/${slug}`,
      () => mockWallpapersBySlug[slug] ?? null,
      {
        revalidate: LIST_REVALIDATE,
        tags: ['wallpapers', `wallpaper:${slug}`],
      },
    ),
  {
    revalidate: LIST_REVALIDATE,
    tags: ['wallpapers'],
    memoryKey: (slug: string) => `wallpapers:slug:${slug}`,
  },
);

/** Обои по slug. */
export async function getWallpaper(slug: string): Promise<Wallpaper | null> {
  return cachedWallpaper(slug);
}

const cachedFeatured = createServerCache(
  ['wallpapers:featured'],
  async (limit: number): Promise<Wallpaper[]> =>
    fetchData<Wallpaper[]>(
      '/api/wallpapers/featured',
      () => mockWallpapers.filter((wallpaper) => wallpaper.isFeatured).slice(0, limit),
      {
        revalidate: LIST_REVALIDATE,
        tags: ['wallpapers', 'wallpapers:featured'],
      },
    ),
  {
    revalidate: LIST_REVALIDATE,
    tags: ['wallpapers', 'wallpapers:featured'],
    memoryKey: (limit: number) => `wallpapers:featured:${limit}`,
  },
);

/** Рекомендуемые обои для главной страницы. */
export async function getFeaturedWallpapers(limit = 8): Promise<Wallpaper[]> {
  return cachedFeatured(limit);
}

const cachedSimilar = createServerCache(
  ['wallpapers:similar'],
  async (slug: string, category: WallpaperCategoryId, limit: number): Promise<Wallpaper[]> =>
    fetchData<Wallpaper[]>(
      `/api/wallpapers/${slug}/similar`,
      () =>
        mockWallpapers
          .filter((item) => item.category === category && item.slug !== slug)
          .slice(0, limit),
      {
        revalidate: LIST_REVALIDATE,
        tags: ['wallpapers', `wallpaper:${slug}`],
      },
    ),
  {
    revalidate: LIST_REVALIDATE,
    tags: ['wallpapers'],
    memoryKey: (slug: string, _category: WallpaperCategoryId, limit: number) =>
      `wallpapers:similar:${slug}:${limit}`,
  },
);

/** Похожие обои: та же категория, кроме текущего. */
export async function getSimilarWallpapers(wallpaper: Wallpaper, limit = 4): Promise<Wallpaper[]> {
  return cachedSimilar(wallpaper.slug, wallpaper.category, limit);
}

const cachedCategories = createServerCache(
  ['categories'],
  async (): Promise<typeof mockCategories> =>
    fetchData('/api/categories', () => mockCategories, {
      revalidate: CATEGORIES_REVALIDATE,
      tags: ['categories'],
    }),
  {
    revalidate: CATEGORIES_REVALIDATE,
    tags: ['categories'],
    memoryKey: () => 'categories',
  },
);

/** Категории каталога. */
export async function getCategories(): Promise<typeof mockCategories> {
  return cachedCategories();
}

/** Количество обоев в категории. */
export function countByCategory(category: WallpaperCategoryId): number {
  return mockWallpapers.filter((wallpaper) => wallpaper.category === category).length;
}
