'use client';

import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import type { Wallpaper } from '@/types';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import { formatDuration } from '@/lib/utils/format';
import { WallpaperMedia } from './wallpaper-media';
import { FavoriteButton } from '@/components/wallpaper/favorite-button';

/**
 * Карточка обоев для каталога и подборок.
 *
 * Компактная: на превью — тип и длительность, а в нижней панели остаются
 * название (до двух строк), сердечко со счётчиком лайков и кнопка действия.
 *
 * Наведение: лёгкий подъём, масштаб превью и появление свечения.
 */
export function WallpaperCard({
  wallpaper,
  priority = false,
  className,
}: {
  wallpaper: Wallpaper;
  priority?: boolean;
  className?: string;
}) {
  const t = useTranslations('wallpaper');
  const reduce = useReducedMotion();

  return (
    <motion.article
      whileHover={reduce ? undefined : { y: -3, scale: 1.015 }}
      whileTap={reduce ? undefined : { scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.8 }}
      className={cn(
        'group border-border/70 bg-card/60 relative overflow-hidden rounded-2xl border backdrop-blur-xl',
        'hover:border-brand/35 transition-[border-color,box-shadow] duration-300 hover:shadow-[0_24px_60px_-24px_var(--brand-glow)]',
        'focus-within:border-brand/40',
        className,
      )}
    >
      <Link
        href={`/wallpapers/${wallpaper.slug}`}
        className="focus-visible:outline-ring block focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <div className="relative aspect-video overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.06]">
            <WallpaperMedia wallpaper={wallpaper} priority={priority} rounded="rounded-none" />
          </div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-90" />

          {wallpaper.mediaType === 'video' && (
            <span className="pointer-events-none absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
              <Play className="size-3 fill-current" aria-hidden="true" />
              {wallpaper.duration ? formatDuration(wallpaper.duration) : t('videoBadge')}
            </span>
          )}
        </div>
      </Link>

      <div className="flex items-center gap-1.5 px-2.5 py-2">
        <Link
          href={`/wallpapers/${wallpaper.slug}`}
          title={wallpaper.title}
          className="text-foreground hover:text-brand-foreground focus-visible:outline-ring line-clamp-2 min-w-0 flex-1 text-[13px] font-semibold tracking-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {wallpaper.title}
        </Link>

        <FavoriteButton id={wallpaper.id} compact count={wallpaper.likeCount} />

        <Button asChild variant="gradient" size="sm" className="h-7 shrink-0 px-2 text-[12px]">
          <Link href={`/wallpapers/${wallpaper.slug}`}>{t('download')}</Link>
        </Button>
      </div>
    </motion.article>
  );
}
