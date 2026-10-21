import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { getPacks } from '@/lib/api/packs';
import { PackCard } from '@/components/packs/pack-card';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'packs' });

  return buildMetadata({
    title: t('title'),
    description: t('subtitle'),
    path: '/packs',
    locale,
    keywords: ['наборы обоев', 'wallpaper packs', 'паки обоев macOS'],
  });
}

export default async function PacksPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const packs = await getPacks();
  const t = await getTranslations('packs');

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:py-16">
      <header className="max-w-2xl">
        <h1 className="text-display-md">{t('title')}</h1>
        <p className="text-muted-foreground mt-3 text-base leading-relaxed text-pretty">
          {t('subtitle')}
        </p>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {packs.map((pack, index) => (
          <PackCard key={pack.id} pack={pack} index={index} />
        ))}
      </div>
    </div>
  );
}
