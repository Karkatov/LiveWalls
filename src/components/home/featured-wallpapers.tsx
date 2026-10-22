import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import type { Wallpaper } from '@/types';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/shared/section-heading';
import { StaggerGroup, StaggerItem } from '@/components/shared/motion';
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

      <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {wallpapers.map((wallpaper, index) => (
          <StaggerItem key={wallpaper.id} className="h-full">
            <WallpaperCard wallpaper={wallpaper} priority={index < 4} />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
