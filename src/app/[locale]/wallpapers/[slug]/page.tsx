import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Download, Eye, Heart, MapPin, Play, User } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { buildMetadata } from '@/lib/seo/metadata';
import { wallpaperJsonLd } from '@/lib/seo/jsonld';
import { getSimilarWallpapers, getWallpaper } from '@/lib/api/wallpapers';
import { mockWallpapers } from '@/data/mock/wallpapers';
import { formatDate, formatDuration, formatFileSize, formatNumber } from '@/lib/utils/format';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { SectionHeading } from '@/components/shared/section-heading';
import { Reveal } from '@/components/shared/motion';
import { WallpaperMedia } from '@/components/catalog/wallpaper-media';
import { WallpaperCard } from '@/components/catalog/wallpaper-card';
import { FavoriteButton } from '@/components/wallpaper/favorite-button';
import { BuyButton } from '@/components/wallpaper/buy-button';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    mockWallpapers.map((wallpaper) => ({ locale, slug: wallpaper.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const wallpaper = await getWallpaper(slug);

  if (!wallpaper) {
    return buildMetadata({ title: '404', description: '', path: '/wallpapers', locale });
  }

  return buildMetadata({
    title: wallpaper.title,
    description: wallpaper.description.slice(0, 180),
    path: `/wallpapers/${wallpaper.slug}`,
    locale,
    image: wallpaper.poster,
    type: 'article',
    publishedTime: wallpaper.createdAt,
    keywords: wallpaper.tags,
  });
}

export default async function WallpaperPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const wallpaper = await getWallpaper(slug);
  if (!wallpaper) notFound();

  const similar = await getSimilarWallpapers(wallpaper, 4);
  const t = await getTranslations('wallpaper');
  const tNav = await getTranslations('nav');
  const tCommon = await getTranslations('common');

  const specs = [
    { label: t('resolution'), value: `${wallpaper.width} × ${wallpaper.height}` },
    { label: t('duration'), value: wallpaper.duration ? formatDuration(wallpaper.duration) : '—' },
    { label: t('size'), value: formatFileSize(wallpaper.fileSize) },
    { label: t('author'), value: wallpaper.author ?? '—' },
    { label: t('location'), value: wallpaper.location ?? '—' },
    { label: t('published'), value: formatDate(wallpaper.createdAt, locale) },
    { label: t('likes'), value: formatNumber(wallpaper.likeCount) },
    { label: t('views'), value: formatNumber(wallpaper.views) },
  ];

  return (
    <article className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:py-14">
      <Breadcrumbs
        className="mb-6"
        items={[{ label: tNav('wallpapers'), href: '/wallpapers' }, { label: wallpaper.title }]}
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        {/* Превью */}
        <Reveal>
          <div className="frame grain border-border shadow-frame relative overflow-hidden border">
            <div className="relative aspect-video">
              <WallpaperMedia
                wallpaper={wallpaper}
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
                rounded="rounded-none"
              />

              {wallpaper.mediaType === 'video' && (
                <span className="timecode pointer-events-none absolute top-4 left-4 flex items-center gap-1.5 rounded bg-black/55 px-2 py-1 text-white">
                  <Play className="size-3 fill-current" aria-hidden="true" />
                  {t('videoBadge')}
                </span>
              )}
            </div>
          </div>
        </Reveal>

        {/* Информация и покупка */}
        <Reveal delay={0.08}>
          <div className="flex h-full flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="signal">{t('premiumBadge')}</Badge>
              <Badge variant="outline">{wallpaper.category}</Badge>
              {wallpaper.isCuratedPick && <Badge variant="success">Curated</Badge>}
            </div>

            <h1 className="text-display-md mt-4">{wallpaper.title}</h1>

            <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              {wallpaper.author && (
                <span className="inline-flex items-center gap-1.5">
                  <User className="size-4" aria-hidden="true" />
                  {wallpaper.author}
                </span>
              )}
              {wallpaper.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" aria-hidden="true" />
                  {wallpaper.location}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Eye className="size-4" aria-hidden="true" />
                {formatNumber(wallpaper.views)}
              </span>
            </div>

            <p className="text-muted-foreground mt-5 leading-relaxed">{wallpaper.description}</p>

            {/* Покупка */}
            <div className="border-border bg-card mt-7 rounded-xl border p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">
                    {wallpaper.isPaid ? t('premiumBadge') : tCommon('free')}
                  </p>
                  <p className="text-foreground mt-1 font-mono text-3xl tabular-nums">
                    {wallpaper.priceText ?? tCommon('free')}
                  </p>
                </div>

                <FavoriteButton id={wallpaper.id} title={wallpaper.title} />
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                {wallpaper.isPaid ? (
                  <BuyButton
                    kind="wallpaper"
                    itemId={wallpaper.id}
                    title={wallpaper.title}
                    price={wallpaper.price ?? 0}
                    priceLabel={t('buyWithPrice', { price: wallpaper.priceText ?? '' })}
                    size="lg"
                    className="flex-1"
                  />
                ) : (
                  <Button asChild variant="signal" size="lg" className="flex-1">
                    <Link href="/download">
                      <Download className="size-4" />
                      {t('download')}
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Теги */}
            {wallpaper.tags.length > 0 && (
              <div className="mt-6">
                <p className="text-muted-foreground text-xs tracking-[0.14em] uppercase">
                  {t('tags')}
                </p>
                <ul className="mt-2.5 flex flex-wrap gap-2">
                  {wallpaper.tags.map((tag) => (
                    <li key={tag}>
                      <span className="border-border bg-secondary/50 text-muted-foreground inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs">
                        <Heart className="size-3" aria-hidden="true" />
                        {tag}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {/* Характеристики */}
      <Reveal>
        <section className="mt-14">
          <h2 className="text-foreground text-xl font-semibold tracking-tight">{t('specs')}</h2>

          <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {specs.map((spec) => (
              <div key={spec.label} className="border-border bg-card rounded-xl border px-4 py-3">
                <dt className="text-muted-foreground text-xs tracking-[0.12em] uppercase">
                  {spec.label}
                </dt>
                <dd className="text-foreground mt-1 text-sm font-medium">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Reveal>

      {/* Похожие */}
      {similar.length > 0 && (
        <section className="mt-16">
          <SectionHeading align="left" title={t('similarTitle')} />

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((item) => (
              <WallpaperCard key={item.id} wallpaper={item} />
            ))}
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: wallpaperJsonLd(wallpaper, locale) }}
      />
    </article>
  );
}
