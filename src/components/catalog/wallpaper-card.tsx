'use client';

import type { MouseEvent } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart, Play } from 'lucide-react';
import type { Wallpaper } from '@/types';
import { Link } from '@/i18n/navigation';
import { useFavorites } from '@/lib/hooks/use-favorites';
import { cn } from '@/lib/utils/cn';
import { formatDuration, formatFileSize } from '@/lib/utils/format';
import { transitions } from '@/styles/animations';
import { WallpaperMedia } from './wallpaper-media';
import { FavoriteButton } from '@/components/wallpaper/favorite-button';

/**
 * Карточка обоев — кадр.
 *
 * Вместо «стеклянной» плашки с круглыми углами: жёсткий кадр 16:9,
 * моно-номер кадра, мета-строка с разрешением и один hover-жест
 * (медленный кен-бёрнс и появление мета-строки).
 *
 * Метка `quickView` внутри кадра открывает быстрый просмотр, не уводя
 * пользователя со страницы каталога.
 */
export function WallpaperCard({
  wallpaper,
  index = 0,
  priority = false,
  onQuickView,
  className,
}: {
  wallpaper: Wallpaper;
  /** Порядковый номер — выводится как моно-индекс кадра. */
  index?: number;
  priority?: boolean;
  onQuickView?: (wallpaper: Wallpaper) => void;
  className?: string;
}) {
  const t = useTranslations('wallpaper');
  const tCatalog = useTranslations('catalog');
  const reduce = useReducedMotion();
  const { has } = useFavorites();
  const isFavorite = has(wallpaper.id);

  const openQuickView = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onQuickView?.(wallpaper);
  };

  return (
    <article className={cn('group relative flex flex-col', className)}>
      <div className="border-border bg-ink-700 frame grain shadow-frame relative overflow-hidden border">
        <Link
          href={`/wallpapers/${wallpaper.slug}`}
          className="focus-visible:outline-ring block focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <div className="relative aspect-video overflow-hidden">
            <motion.div
              className="absolute inset-0"
              initial={false}
              whileHover={reduce ? undefined : { scale: 1.045 }}
              transition={transitions.frame}
            >
              <WallpaperMedia wallpaper={wallpaper} priority={priority} rounded="rounded-none" />
            </motion.div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

            {/* Метка номера кадра */}
            <span className="timecode pointer-events-none absolute top-3 left-3 rounded bg-black/50 px-1.5 py-0.5 backdrop-blur-sm">
              {String(index + 1).padStart(3, '0')}
            </span>

            {wallpaper.mediaType === 'video' && (
              <span className="pointer-events-none absolute top-3 right-3 flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5 font-mono text-[11px] text-white backdrop-blur-sm">
                <Play className="size-3 fill-current" aria-hidden="true" />
                {wallpaper.duration ? formatDuration(wallpaper.duration) : t('videoBadge')}
              </span>
            )}

            {isFavorite && (
              <span className="pointer-events-none absolute right-3 bottom-3 flex items-center rounded bg-rose-500/85 px-1.5 py-0.5 text-white">
                <Heart className="size-3 fill-current" aria-hidden="true" />
              </span>
            )}

            <div className="absolute inset-x-0 bottom-0 p-3.5">
              <h3 className="truncate text-[15px] font-medium text-white drop-shadow-sm">
                {wallpaper.title}
              </h3>
              <p className="text-paper-faint mt-0.5 truncate font-mono text-[11px] tabular-nums">
                {wallpaper.width} × {wallpaper.height}
              </p>
            </div>
          </div>
        </Link>

        {onQuickView && (
          <button
            type="button"
            onClick={openQuickView}
            aria-label={tCatalog('quickViewLabel', { title: wallpaper.title })}
            className="text-paper-faint hover:text-ink-900 hover:bg-signal focus-visible:outline-ring absolute top-3 right-3 translate-y-[-6px] rounded bg-black/50 px-2 py-1 font-mono text-[10px] tracking-[0.14em] uppercase opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:outline-2"
          >
            {tCatalog('quickView')}
          </button>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className="text-paper-faint truncate font-mono text-[11px] tabular-nums">
          {formatFileSize(wallpaper.fileSize)}
          {wallpaper.isPaid ? ` · ${wallpaper.priceText}` : ` · ${t('freeBadge')}`}
        </span>
        <FavoriteButton id={wallpaper.id} title={wallpaper.title} compact />
      </div>
    </article>
  );
}
