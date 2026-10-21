'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { PackageSearch, Search, SlidersHorizontal, X } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import type { Category, Wallpaper, WallpaperFilters } from '@/types';
import { PAGE_SIZE } from '@/config/site';
import {
  filterWallpapers,
  filtersToQuery,
  paginate,
  parseFilters,
  sortWallpapers,
} from '@/lib/catalog/filters';
import { useFavorites } from '@/lib/hooks/use-favorites';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/shared/empty-state';
import { WallpaperCard } from './wallpaper-card';

/**
 * Каталог обоев: фильтры, сортировка и пагинация.
 *
 * Данные приходят с сервера целиком, а фильтрация выполняется в браузере —
 * так список реагирует мгновенно и без перезагрузки. При этом адрес
 * страницы синхронизируется с состоянием, поэтому ссылку можно сохранить.
 */
export function CatalogBrowser({
  wallpapers,
  categories,
  initialFilters,
}: {
  wallpapers: Wallpaper[];
  categories: Category[];
  initialFilters: WallpaperFilters;
}) {
  const t = useTranslations('catalog');
  const router = useRouter();
  const { favorites } = useFavorites();

  const [filters, setFilters] = useState<WallpaperFilters>(initialFilters);
  const [search, setSearch] = useState(initialFilters.q ?? '');
  const mounted = useRef(false);

  // В статическом экспорте сервер не знает query-параметры, поэтому
  // фильтры из адреса читаем на клиенте после монтирования.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if ([...params.keys()].length === 0) return;

    const parsed = parseFilters(Object.fromEntries(params.entries()));
    setFilters(parsed);
    setSearch(parsed.q ?? '');
  }, []);

  // Debounce для поля поиска.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((current) =>
        current.q === search ? current : { ...current, q: search || undefined, page: 1 },
      );
    }, 250);
    return () => clearTimeout(timeout);
  }, [search]);

  // Синхронизация адреса страницы с фильтрами.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    const query = filtersToQuery(filters);
    router.replace({ pathname: '/wallpapers', query }, { scroll: false });
  }, [filters, router]);

  const filtered = useMemo(() => {
    const withFavorites: WallpaperFilters = {
      ...filters,
      favoritesOnly: undefined,
    };
    const result = filterWallpapers(wallpapers, withFavorites);
    const sorted = sortWallpapers(result, filters.sort ?? 'newest');

    if (!filters.favoritesOnly) return sorted;
    return sorted.filter((wallpaper) => favorites.includes(wallpaper.id));
  }, [wallpapers, filters, favorites]);

  const page = paginate(filtered, filters.page ?? 1, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(page.total / PAGE_SIZE));

  const update = useCallback((patch: Partial<WallpaperFilters>) => {
    setFilters((current) => ({ ...current, ...patch, page: patch.page ?? 1 }));
  }, []);

  const reset = useCallback(() => {
    setSearch('');
    setFilters((current) => ({ ...current, q: undefined, page: 1 }));
  }, []);

  const hasActiveFilters =
    Boolean(filters.q) ||
    (filters.category ?? 'all') !== 'all' ||
    (filters.mediaType ?? 'all') !== 'all' ||
    (filters.price ?? 'all') !== 'all' ||
    Boolean(filters.favoritesOnly);

  return (
    <div className="space-y-8">
      {/* Панель фильтров */}
      <div className="border-border/60 bg-card/40 rounded-2xl border p-4 backdrop-blur-xl sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto_auto]">
          <div className="relative">
            <Search
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchLabel')}
              className="pl-10"
            />
          </div>

          <Select
            value={filters.category ?? 'all'}
            onValueChange={(value) => update({ category: value as WallpaperFilters['category'] })}
          >
            <SelectTrigger className="lg:w-[190px]" aria-label={t('filterCategory')}>
              <SelectValue placeholder={t('filterCategory')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allCategories')}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.mediaType ?? 'all'}
            onValueChange={(value) => update({ mediaType: value as WallpaperFilters['mediaType'] })}
          >
            <SelectTrigger className="lg:w-[150px]" aria-label={t('filterType')}>
              <SelectValue placeholder={t('filterType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allTypes')}</SelectItem>
              <SelectItem value="video">{t('typeVideo')}</SelectItem>
              <SelectItem value="image">{t('typeImage')}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.price ?? 'all'}
            onValueChange={(value) => update({ price: value as WallpaperFilters['price'] })}
          >
            <SelectTrigger className="lg:w-[140px]" aria-label={t('filterPrice')}>
              <SelectValue placeholder={t('filterPrice')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('priceAll')}</SelectItem>
              <SelectItem value="free">{t('priceFree')}</SelectItem>
              <SelectItem value="paid">{t('pricePaid')}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sort ?? 'newest'}
            onValueChange={(value) => update({ sort: value as WallpaperFilters['sort'] })}
          >
            <SelectTrigger className="lg:w-[180px]" aria-label={t('sort')}>
              <SelectValue placeholder={t('sort')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t('sortNewest')}</SelectItem>
              <SelectItem value="popular">{t('sortPopular')}</SelectItem>
              <SelectItem value="price-asc">{t('sortPriceAsc')}</SelectItem>
              <SelectItem value="price-desc">{t('sortPriceDesc')}</SelectItem>
              <SelectItem value="name">{t('sortName')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border-border/60 mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <label className="text-muted-foreground flex cursor-pointer items-center gap-2.5 text-sm">
            <Switch
              checked={Boolean(filters.favoritesOnly)}
              onCheckedChange={(checked) => update({ favoritesOnly: checked })}
            />
            {t('filterFavorites')}
          </label>

          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm">
              {t('resultsCount', { count: page.total })}
            </span>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5">
                <X className="size-4" />
                {t('clearFilters')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Сетка */}
      {page.items.length > 0 ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {page.items.map((wallpaper, index) => (
              <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} priority={index < 4} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2" aria-label={t('page')}>
              <Button
                variant="outline"
                size="sm"
                disabled={page.page <= 1}
                onClick={() => update({ page: page.page - 1 })}
              >
                ←
              </Button>

              <span className="text-muted-foreground px-3 text-sm">
                {t('page')} {page.page} {t('of')} {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page.page >= totalPages}
                onClick={() => update({ page: page.page + 1 })}
              >
                →
              </Button>
            </nav>
          )}
        </>
      ) : (
        <EmptyState
          icon={PackageSearch}
          title={t('noResults')}
          description={t('noResultsHint')}
          action={
            <Button variant="outline" onClick={reset}>
              <SlidersHorizontal className="size-4" />
              {t('clearFilters')}
            </Button>
          }
        />
      )}

      <p className="sr-only" aria-live="polite">
        {t('resultsCount', { count: page.total })}
      </p>
    </div>
  );
}
