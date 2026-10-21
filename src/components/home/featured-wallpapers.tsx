import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import type { Wallpaper } from '@/types';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/shared/section-heading';
import { Reveal } from '@/components/shared/motion';
import { WallpaperCard } from '@/components/catalog/wallpaper-card';

/**
 * Блок «Рекомендуемые обои» на главной странице.
 */
export async function FeaturedWallpapers({ wallpapers }: { wallpapers: Wallpaper[] }) {
  const t = await getTranslations('home.featured');

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
      <SectionHeading
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        action={
          <Button asChild variant="outline">
            <Link href="/wallpapers">
              {t('cta')}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {wallpapers.map((wallpaper, index) => (
          <Reveal key={wallpaper.id} delay={index * 0.05}>
            <WallpaperCard wallpaper={wallpaper} priority={index < 4} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
