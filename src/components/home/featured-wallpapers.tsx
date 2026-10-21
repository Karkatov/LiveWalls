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
    <section className="mx-auto max-w-[1280px] px-4 py-20 sm:px-8 lg:py-28">
      <SectionHeading
        index={2}
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

      <div className="mt-14 grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {wallpapers.map((wallpaper, index) => (
          <Reveal key={wallpaper.id} delay={index * 0.05}>
            <WallpaperCard wallpaper={wallpaper} index={index} priority={index < 3} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
