import type { Paginated, Wallpaper, WallpaperCategoryId, WallpaperFilters } from '@/types';
import { mockWallpapers, mockWallpapersBySlug } from '@/data/mock/wallpapers';
import { mockCategories } from '@/data/mock/categories';
import { fetchData } from './fetcher';
import { PAGE_SIZE } from '@/config/site';
import { filterWallpapers, paginate, sortWallpapers } from '@/lib/catalog/filters';

/**
 * Доступ к каталогу обоев.
 *
 * Мок-режим повторяет поведение реального API: пагинация, фильтры, сортировка.
 */

/** Список обоев с фильтрами. */
export async function getWallpapers(filters: WallpaperFilters = {}): Promise<Paginated<Wallpaper>> {
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
      revalidate: 300,
    },
  );
}

/** Обои по slug. */
export async function getWallpaper(slug: string): Promise<Wallpaper | null> {
  return fetchData<Wallpaper | null>(
    `/api/wallpapers/${slug}`,
    () => mockWallpapersBySlug[slug] ?? null,
    { revalidate: 300 },
  );
}

/** Рекомендуемые обои для главной страницы. */
export async function getFeaturedWallpapers(limit = 8): Promise<Wallpaper[]> {
  return fetchData<Wallpaper[]>(
    '/api/wallpapers/featured',
    () => mockWallpapers.filter((wallpaper) => wallpaper.isFeatured).slice(0, limit),
    { revalidate: 300 },
  );
}

/** Похожие обои: та же категория, кроме текущего. */
export async function getSimilarWallpapers(wallpaper: Wallpaper, limit = 4): Promise<Wallpaper[]> {
  return fetchData<Wallpaper[]>(
    `/api/wallpapers/${wallpaper.slug}/similar`,
    () =>
      mockWallpapers
        .filter((item) => item.category === wallpaper.category && item.id !== wallpaper.id)
        .slice(0, limit),
    { revalidate: 300 },
  );
}

/** Категории каталога. */
export async function getCategories(): Promise<typeof mockCategories> {
  return fetchData('/api/categories', () => mockCategories, { revalidate: 3600 });
}

/** Количество обоев в категории. */
export function countByCategory(category: WallpaperCategoryId): number {
  return mockWallpapers.filter((wallpaper) => wallpaper.category === category).length;
}
