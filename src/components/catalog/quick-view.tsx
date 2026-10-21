'use client';

import { useTranslations } from 'next-intl';
import { ArrowUpRight, Heart, Play } from 'lucide-react';
import type { Wallpaper } from '@/types';
import { Link } from '@/i18n/navigation';
import { useFavorites } from '@/lib/hooks/use-favorites';
import { cn } from '@/lib/utils/cn';
import { formatDate, formatDuration, formatFileSize } from '@/lib/utils/format';
import { useLocale } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { BuyButton } from '@/components/wallpaper/buy-button';
import { WallpaperMedia } from './wallpaper-media';

/**
 * Быстрый просмотр обоев.
 *
 * Модальное окно поверх каталога: кадр, характеристики и два действия
 * (купить/скачать и перейти на страницу). Раньше ключ `catalog.quickView`
 * существовал, но функции не было — единственным путём к обоям оставался
 * переход на отдельную страницу.
 */
export function QuickView({
  wallpaper,
  open,
  onOpenChange,
}: {
  wallpaper: Wallpaper | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations('wallpaper');
  const tCatalog = useTranslations('catalog');
  const locale = useLocale();
  const { has, toggle } = useFavorites();

  if (!wallpaper) return null;

  const isFavorite = has(wallpaper.id);

  const specs = [
    { label: t('resolution'), value: `${wallpaper.width} × ${wallpaper.height}` },
    {
      label: t('duration'),
      value: wallpaper.duration ? formatDuration(wallpaper.duration) : '—',
    },
    { label: t('size'), value: formatFileSize(wallpaper.fileSize) },
    { label: t('published'), value: formatDate(wallpaper.createdAt, locale) },
    { label: t('author'), value: wallpaper.author ?? '—' },
    { label: t('location'), value: wallpaper.location ?? '—' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0" hideClose={false}>
        <div className="grid gap-0 sm:grid-cols-[1.15fr_1fr]">
          <div className="bg-ink-700 relative aspect-video sm:aspect-auto sm:min-h-[320px]">
            <WallpaperMedia
              wallpaper={wallpaper}
              priority
              sizes="(max-width: 640px) 100vw, 55vw"
              rounded="rounded-none"
            />
            {wallpaper.mediaType === 'video' && (
              <span className="pointer-events-none absolute top-3 left-3 flex items-center gap-1 rounded bg-black/55 px-2 py-1 font-mono text-[11px] text-white">
                <Play className="size-3 fill-current" aria-hidden="true" />
                {wallpaper.duration ? formatDuration(wallpaper.duration) : t('videoBadge')}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-5 p-6">
            <div className="pr-8">
              <p className="eyebrow">{tCatalog('quickView')}</p>
              <DialogTitle className="font-display text-section mt-2">
                {wallpaper.title}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {wallpaper.description}
              </DialogDescription>
            </div>

            <dl className="border-border grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-4">
              {specs.map((spec) => (
                <div key={spec.label}>
                  <dt className="text-paper-faint text-[11px]">{spec.label}</dt>
                  <dd className="text-foreground mt-0.5 font-mono text-xs tabular-nums">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>

            {wallpaper.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {wallpaper.tags.slice(0, 5).map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="mt-auto flex flex-col gap-2">
              <div className="flex gap-2">
                {wallpaper.isPaid ? (
                  <BuyButton
                    kind="wallpaper"
                    itemId={wallpaper.id}
                    title={wallpaper.title}
                    price={wallpaper.price ?? 0}
                    priceLabel={t('buyWithPrice', { price: wallpaper.priceText ?? '' })}
                    variant="signal"
                    className="flex-1"
                  />
                ) : (
                  <Button asChild variant="signal" className="flex-1">
                    <Link href={`/wallpapers/${wallpaper.slug}`}>
                      {t('download')}
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="icon"
                  aria-pressed={isFavorite}
                  aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
                  onClick={() => toggle(wallpaper.id)}
                  className={cn('shrink-0', isFavorite && 'text-rose-400')}
                >
                  <Heart className={cn('size-4', isFavorite && 'fill-current')} />
                </Button>
              </div>

              <Button asChild variant="ghost" size="sm" className="w-full">
                <Link href={`/wallpapers/${wallpaper.slug}`}>
                  {t('overview')}
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
