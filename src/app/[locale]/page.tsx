import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { buildMetadata } from '@/lib/seo/metadata';
import { getFeaturedWallpapers, getCategories } from '@/lib/api/wallpapers';
import { mockReviews } from '@/data/mock/reviews';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/shared/section-heading';
import { Reveal } from '@/components/shared/motion';
import { Hero } from '@/components/home/hero';
import { FeaturedWallpapers } from '@/components/home/featured-wallpapers';
import { CategoriesGrid } from '@/components/home/categories-grid';
import { FeaturesGrid } from '@/components/home/features-grid';
import { Reviews } from '@/components/home/reviews';
import { CtaBanner } from '@/components/home/cta-banner';
import { FaqAccordion } from '@/components/faq/faq-accordion';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home.hero' });
  const tMeta = await getTranslations({ locale, namespace: 'meta' });

  return buildMetadata({
    title: tMeta('siteTitle'),
    description: t('subtitle'),
    path: '/',
    locale,
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home.faq');
  const tFaq = await getTranslations('faq.items');

  const [featured, categories] = await Promise.all([getFeaturedWallpapers(8), getCategories()]);

  const faqItems = (['trial', 'system', 'battery', 'license', 'payment'] as const).map((key) => ({
    id: key,
    question: tFaq(`${key}.q`),
    answer: tFaq(`${key}.a`),
  }));

  return (
    <>
      <Hero />

      <FeaturedWallpapers wallpapers={featured} />

      <CategoriesGrid categories={categories} />

      <FeaturesGrid />

      <Reviews reviews={mockReviews} />

      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-8 lg:py-28">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />

        <Reveal>
          <div className="border-border bg-card mt-10 rounded-xl border px-2 py-2">
            <FaqAccordion items={faqItems} />
          </div>
        </Reveal>

        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/faq">
              {t('cta')}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
