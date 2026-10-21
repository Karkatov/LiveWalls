'use client';

import { useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useFavorites } from '@/lib/hooks/use-favorites';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { SimpleTooltip } from '@/components/ui/tooltip';

/**
 * Кнопка «В избранное».
 *
 * Состояние хранится в localStorage (zustand/persist).
 * Позже синхронизируется с аккаунтом по email.
 */
export function FavoriteButton({
  id,
  title,
  size = 'default',
  compact = false,
  className,
}: {
  id: string;
  title?: string;
  size?: 'default' | 'sm' | 'icon';
  compact?: boolean;
  className?: string;
}) {
  const t = useTranslations('wallpaper');
  const tToast = useTranslations('toast');
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
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        aria-pressed={isFavorite}
        aria-label={accessibleLabel}
        onClick={handleClick}
        className={cn(
          'text-muted-foreground h-8 w-8 hover:text-rose-400',
          isFavorite && 'text-rose-500',
          className,
        )}
      >
        <Heart className={cn('size-4', isFavorite && 'fill-current')} />
      </Button>
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
