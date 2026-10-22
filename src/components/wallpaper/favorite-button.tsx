'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useFavorites } from '@/lib/hooks/use-favorites';
import { cn } from '@/lib/utils/cn';
import { formatNumber } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { SimpleTooltip } from '@/components/ui/tooltip';

/**
 * Кнопка «В избранное».
 *
 * Состояние хранится в localStorage (zustand/persist).
 * Позже синхронизируется с аккаунтом по email.
 *
 * В компактном режиме (карточки каталога) рядом с сердечком можно показать
 * счётчик лайков — он становится частью кликабельного чипа, поэтому
 * избранное переключается и по нажатию на число.
 */
export function FavoriteButton({
  id,
  title,
  size = 'default',
  compact = false,
  count,
  className,
}: {
  id: string;
  title?: string;
  size?: 'default' | 'sm' | 'icon';
  compact?: boolean;
  /** Количество лайков: показывается рядом с сердечком в компактном режиме. */
  count?: number;
  className?: string;
}) {
  const t = useTranslations('wallpaper');
  const tToast = useTranslations('toast');
  const locale = useLocale();
  const { has, toggle } = useFavorites();
  const isFavorite = has(id);

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    toggle(id);
    toast(isFavorite ? tToast('favoriteRemoved') : tToast('favoriteAdded'));
  };

  const label = isFavorite ? t('removeFromFavorites') : t('addToFavorites');
  const accessibleLabel = title ? `${label}: ${title}` : label;

  if (compact) {
    const hasCount = typeof count === 'number' && count > 0;

    // Компактный чип для карточек: сердечко + счётчик лайков в одной кнопке.
    // Собственный <button>, а не ui/Button: так размер иконки не перебивается
    // базовым правилом `[&_svg]:size-4` и чип получается заметно компактнее.
    return (
      <button
        type="button"
        aria-pressed={isFavorite}
        aria-label={accessibleLabel}
        onClick={handleClick}
        className={cn(
          'inline-flex shrink-0 items-center rounded-full font-medium tabular-nums transition-[color,transform] duration-300',
          'focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95',
          hasCount ? 'h-7 gap-0.5 px-1 text-[11px]' : 'size-7 justify-center',
          isFavorite ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-400',
          className,
        )}
      >
        <Heart className={cn('size-3', isFavorite && 'fill-current')} aria-hidden="true" />
        {hasCount && <span>{formatNumber(count, locale)}</span>}
      </button>
    );
  }

  return (
    <SimpleTooltip label={accessibleLabel}>
      <Button
        variant="outline"
        size={size === 'icon' ? 'icon' : 'default'}
        aria-pressed={isFavorite}
        aria-label={accessibleLabel}
        onClick={handleClick}
        className={cn(
          'gap-2',
          isFavorite && 'border-rose-400/40 text-rose-400 hover:text-rose-300',
          className,
        )}
      >
        <Heart className={cn('size-4', isFavorite && 'fill-current')} />
        {size !== 'icon' && (
          <span>{isFavorite ? t('removeFromFavorites') : t('addToFavorites')}</span>
        )}
      </Button>
    </SimpleTooltip>
  );
}
