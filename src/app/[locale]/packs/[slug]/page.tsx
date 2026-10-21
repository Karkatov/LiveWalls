import type { Metadata } from 'next';
import Image from 'next/image';
import { wallpaperBlurDataURL } from '@/lib/utils/placeholders';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Layers } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { packJsonLd } from '@/lib/seo/jsonld';
import { getPack } from '@/lib/api/packs';
import { mockPacks } from '@/data/mock/packs';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { Reveal } from '@/components/shared/motion';
import { WallpaperCard } from '@/components/catalog/wallpaper-card';
import { BuyButton } from '@/components/wallpaper/buy-button';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    mockPacks.map((pack) => ({ locale, slug: pack.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const pack = await getPack(slug);

  if (!pack) {
    return buildMetadata({ title: '404', description: '', path: '/packs', locale });
  }

  return buildMetadata({
    title: pack.title,
    description: pack.description.slice(0, 180),
    path: `/packs/${pack.slug}`,
    locale,
    image: pack.poster,
    type: 'article',
    publishedTime: pack.createdAt,
  });
}

export default async function PackPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const pack = await getPack(slug);
  if (!pack) notFound();

  const t = await getTranslations('packs');
  const tNav = await getTranslations('nav');

  return (
    <article className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:py-14">
      <Breadcrumbs
        className="mb-6"
        items={[{ label: tNav('packs'), href: '/packs' }, { label: pack.title }]}
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Reveal>
          <div className="frame grain border-border shadow-frame relative overflow-hidden border">
            <div className="relative aspect-[3/2]">
              <Image
                src={pack.poster}
                alt={pack.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL={wallpaperBlurDataURL(pack.id)}
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="flex h-full flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="signal">
                <Layers className="size-3" aria-hidden="true" />
                {t('count', { count: pack.wallpaperCount })}
              </Badge>
              {pack.badge && <Badge variant="outline">{pack.badge}</Badge>}
            </div>

            <h1 className="text-display-md mt-4">{pack.title}</h1>

            <p className="text-muted-foreground mt-4 leading-relaxed">{pack.description}</p>

            <div className="border-border bg-card mt-7 rounded-xl border p-5">
              <p className="text-foreground font-mono text-3xl tabular-nums">{pack.priceText}</p>
              <p className="text-paper-faint mt-1 text-xs">{t('subtitle')}</p>

              <BuyButton
                kind="pack"
                itemId={pack.id}
                title={pack.title}
                price={pack.price}
                priceLabel={t('buyPack')}
                size="lg"
                className="mt-5 w-full"
              />
            </div>
          </div>
        </Reveal>
      </div>

      {pack.wallpapers.length > 0 && (
        <section className="mt-16">
          <h2 className="text-foreground text-xl font-semibold tracking-tight">{t('includes')}</h2>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pack.wallpapers.map((wallpaper) => (
              <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
            ))}
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: packJsonLd(pack, locale) }}
      />
    </article>
  );
}
