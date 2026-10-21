'use client';

import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
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
  rounded = 'rounded-xl',
}: {
  wallpaper: Wallpaper;
  sizes?: string;
  priority?: boolean;
  className?: string;
  rounded?: string;
}) {
  const reduceMotion = useReducedMotion();
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
        // При prefers-reduced-motion видео не запускается автоматически.
        autoPlay={!reduceMotion}
        preload="metadata"
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
