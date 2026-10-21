'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Download, Heart, Play } from 'lucide-react';
import type { Wallpaper } from '@/types';
import { Link } from '@/i18n/navigation';
import { useFavorites } from '@/lib/hooks/use-favorites';
import { cn } from '@/lib/utils/cn';
import { formatDuration, formatFileSize } from '@/lib/utils/format';
import { WallpaperMedia } from './wallpaper-media';
import { FavoriteButton } from '@/components/wallpaper/favorite-button';

/**
 * Карточка обоев для каталога и подборок.
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
  const { has } = useFavorites();
  const isFavorite = has(wallpaper.id);

  return (
    <article
      className={cn(
        'group border-border/70 bg-card/60 relative overflow-hidden rounded-2xl border backdrop-blur-xl',
        'hover:border-brand/35 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_var(--brand-glow)]',
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

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

          {wallpaper.mediaType === 'video' && (
            <span className="pointer-events-none absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
              <Play className="size-3 fill-current" aria-hidden="true" />
              {wallpaper.duration ? formatDuration(wallpaper.duration) : t('videoBadge')}
            </span>
          )}

          {wallpaper.isPaid ? (
            <span className="bg-gradient-brand pointer-events-none absolute top-3 right-3 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white shadow-[0_6px_18px_-8px_var(--brand-glow)]">
              {wallpaper.priceText}
            </span>
          ) : (
            <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
              {t('freeBadge')}
            </span>
          )}

          {isFavorite && (
            <span className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-rose-500/85 px-2.5 py-1 text-[11px] font-medium text-white">
              <Heart className="size-3 fill-current" aria-hidden="true" />
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="truncate text-[15px] font-semibold text-white drop-shadow-sm">
              {wallpaper.title}
            </h3>
            <p className="mt-0.5 truncate text-xs text-white/70">
              {wallpaper.width} × {wallpaper.height} · {formatFileSize(wallpaper.fileSize)}
            </p>
          </div>
        </div>
      </Link>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
              {wallpaper.isPaid ? wallpaper.priceText : t('freeBadge')}
            </span>
            <p className="text-muted-foreground mt-1 truncate text-xs">
              {wallpaper.author ?? t('premiumBadge')}
            </p>
          </div>
          <FavoriteButton id={wallpaper.id} compact className="mt-1" />
        </div>
        <Button asChild variant="gradient" className="w-full justify-center">
          <Link href={`/wallpapers/${wallpaper.slug}`}>
            <Download className="size-4" />
            {t('download')}
          </Link>
        </Button>
      </div>
    </article>
  );
}
