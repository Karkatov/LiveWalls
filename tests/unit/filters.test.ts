import { describe, expect, it } from 'vitest';
import {
  filterWallpapers,
  filtersToQuery,
  paginate,
  parseFilters,
  sortWallpapers,
} from '@/lib/catalog/filters';
import type { Wallpaper } from '@/types';

/** Минимальный мок обоев для проверки чистой логики каталога. */
function makeWallpaper(overrides: Partial<Wallpaper> & { id: string }): Wallpaper {
  return {
    slug: overrides.id,
    title: `Обои ${overrides.id}`,
    description: 'Описание',
    author: 'Автор',
    location: null,
    mediaType: 'video',
    category: 'nature',
    price: 100,
    isPaid: true,
    isFavorite: false,
    likeCount: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
    tags: [],
    previewUrl: '',
    fullUrl: '',
    resolution: '3840x2160',
    fileSize: 10,
    ...overrides,
  } as Wallpaper;
}

const items: Wallpaper[] = [
  makeWallpaper({
    id: 'a',
    title: 'Северное сияние',
    category: 'nature',
    price: 100,
    likeCount: 5,
  }),
  makeWallpaper({ id: 'b', title: 'Неон-город', category: 'abstract', price: 50, likeCount: 20 }),
  makeWallpaper({
    id: 'c',
    title: 'Туманный лес',
    category: 'nature',
    price: 0,
    isPaid: false,
    likeCount: 10,
  }),
];

describe('filterWallpapers', () => {
  it('фильтрует по поисковой строке без учёта регистра', () => {
    const result = filterWallpapers(items, {
      q: 'СЕВЕРНОЕ',
      category: 'all',
      mediaType: 'all',
      price: 'all',
      favoritesOnly: false,
      sort: 'newest',
      page: 1,
    });
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('a');
  });

  it('фильтрует по категории и типу', () => {
    const result = filterWallpapers(items, {
      q: '',
      category: 'nature',
      mediaType: 'all',
      price: 'all',
      favoritesOnly: false,
      sort: 'newest',
      page: 1,
    });
    expect(result.map((item) => item.id)).toEqual(['a', 'c']);
  });

  it('разделяет платные и бесплатные обои', () => {
    const free = filterWallpapers(items, {
      q: '',
      category: 'all',
      mediaType: 'all',
      price: 'free',
      favoritesOnly: false,
      sort: 'newest',
      page: 1,
    });
    expect(free.map((item) => item.id)).toEqual(['c']);
  });
});

describe('sortWallpapers', () => {
  it('сортирует по популярности по убыванию', () => {
    const result = sortWallpapers(items, 'popular');
    expect(result.map((item) => item.id)).toEqual(['b', 'c', 'a']);
  });

  it('сортирует по цене по возрастанию', () => {
    const result = sortWallpapers(items, 'price-asc');
    expect(result.map((item) => item.id)).toEqual(['c', 'b', 'a']);
  });

  it('не мутирует исходный массив', () => {
    const before = items.map((item) => item.id);
    sortWallpapers(items, 'name');
    expect(items.map((item) => item.id)).toEqual(before);
  });
});

describe('paginate', () => {
  it('возвращает срез страницы и флаг hasMore', () => {
    const page = paginate(items, 1, 2);
    expect(page.items).toHaveLength(2);
    expect(page.total).toBe(3);
    expect(page.hasMore).toBe(true);
    expect(page.page).toBe(1);
  });

  it('не падает на некорректном номере страницы', () => {
    const page = paginate(items, -5, 2);
    expect(page.page).toBe(1);
    expect(page.items).toHaveLength(2);
  });
});

describe('parseFilters / filtersToQuery', () => {
  it('разбирает query-параметры', () => {
    const filters = parseFilters({ q: 'лес', category: 'nature', sort: 'popular', page: '3' });
    expect(filters.q).toBe('лес');
    expect(filters.category).toBe('nature');
    expect(filters.sort).toBe('popular');
    expect(filters.page).toBe(3);
  });

  it('откатывается к дефолтам при мусорных значениях', () => {
    const filters = parseFilters({ sort: 'unknown', page: 'abc' });
    expect(filters.sort).toBe('newest');
    expect(filters.page).toBe(1);
    expect(filters.category).toBe('all');
  });

  it('убирает пустые параметры из query', () => {
    const query = filtersToQuery({
      q: '',
      category: 'all',
      mediaType: 'all',
      price: 'all',
      favoritesOnly: false,
      sort: 'newest',
      page: 1,
    });
    expect(query).toEqual({});
  });

  it('сохраняет значимые параметры', () => {
    const query = filtersToQuery({
      q: 'лес',
      category: 'nature',
      mediaType: 'video',
      price: 'paid',
      favoritesOnly: true,
      sort: 'popular',
      page: 2,
    });
    expect(query).toEqual({
      q: 'лес',
      category: 'nature',
      mediaType: 'video',
      price: 'paid',
      favorites: '1',
      sort: 'popular',
      page: '2',
    });
  });
});
