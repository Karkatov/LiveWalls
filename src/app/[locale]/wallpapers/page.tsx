import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { getCategories, getWallpapers } from '@/lib/api/wallpapers';
import { parseFilters } from '@/lib/catalog/filters';
import { isStaticExport } from '@/config/build';
import { CatalogBrowser } from '@/components/catalog/catalog-browser';

/**
 * В статическом экспорте (Cloudflare Pages, GitHub Pages) query-параметры
 * недоступны на сервере — фильтры применяются на клиенте. Поэтому searchParams
 * читаются только в серверном режиме, иначе страница не смогла бы быть статической.
 */

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'catalog' });

  return buildMetadata({
    title: t('title'),
    description: t('subtitle'),
    path: '/wallpapers',
    locale,
    keywords: ['live wallpapers macOS', 'video wallpapers', '4K wallpapers', 'обои macOS'],
  });
}

export default async function WallpapersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const query = isStaticExport ? {} : await searchParams;
  const initialFilters = parseFilters(query);

  // Список отдаём целиком: фильтрация и пагинация выполняются в браузере,
  // поэтому интерфейс реагирует мгновенно и без перезагрузки страницы.
  const [all, categories] = await Promise.all([
    getWallpapers({ limit: 1000, sort: 'newest' }),
    getCategories(),
  ]);

  const t = await getTranslations('catalog');

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-8 lg:py-24">
      <header className="max-w-2xl">
        <h1 className="text-display-md">{t('title')}</h1>
        <p className="text-muted-foreground mt-3 text-base leading-relaxed text-pretty">
          {t('subtitle')}
        </p>
      </header>

      <div className="mt-10">
        <CatalogBrowser
          wallpapers={all.items}
          categories={categories}
          initialFilters={initialFilters}
        />
      </div>
    </div>
  );
}
