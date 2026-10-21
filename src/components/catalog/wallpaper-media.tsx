'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';
import type { Wallpaper } from '@/types';
import { cn } from '@/lib/utils/cn';
import { wallpaperBlurDataURL } from '@/lib/utils/placeholders';

/**
 * Превью обоев.
 *
 * Если у обоев есть mp4-превью (когда подключим S3/CDN) — показываем
 * ленивый <video> с poster. Пока файлов нет — рисуем статичный SVG-плейсхолдер
 * через next/image с blur-плейсхолдером.
 */
export function WallpaperMedia({
  wallpaper,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  className,
  rounded = 'rounded-2xl',
}: {
  wallpaper: Wallpaper;
  sizes?: string;
  priority?: boolean;
  className?: string;
  rounded?: string;
}) {
  const isVideo = wallpaper.mediaType === 'video' && Boolean(wallpaper.preview);

  if (isVideo) {
    return (
      <video
        className={cn('h-full w-full object-cover', rounded, className)}
        src={wallpaper.preview ?? undefined}
        poster={wallpaper.poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={wallpaper.title}
      />
    );
  }

  return (
    <Image
      src={wallpaper.poster}
      alt={wallpaper.title}
      fill
      sizes={sizes}
      priority={priority}
      className={cn('object-cover', rounded, className)}
      placeholder="blur"
      blurDataURL={wallpaperBlurDataURL(wallpaper.id)}
    />
  );
}

/** Значок видео на карточке. */
export function VideoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'pointer-events-none absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md',
        className,
      )}
    >
      <Play className="size-3 fill-current" aria-hidden="true" />
    </span>
  );
}
