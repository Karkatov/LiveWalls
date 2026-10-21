'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { ShoppingCart, Sparkles } from 'lucide-react';
import { createPayment } from '@/lib/api/payments';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/hooks/use-cart';

/**
 * Кнопка покупки.
 *
 * Сейчас — заглушка: показывает тост «Оплата будет доступна позже».
 * Чтобы подключить LAVA/Robokassa, достаточно реализовать `createPayment`
 * в `src/lib/api/payments.ts` и добавить редирект на `paymentUrl`.
 *
 * TODO(бэкенд): выдача лицензионного ключа после оплаты, проверка ключа
 * в приложении LiveWalls, промокоды и реферальная программа.
 */
export function BuyButton({
  kind,
  itemId,
  title,
  price,
  priceLabel,
  className,
  variant = 'signal',
  size = 'default',
  email,
}: {
  kind: 'subscription' | 'pack' | 'wallpaper';
  itemId: string;
  title: string;
  price: number;
  priceLabel?: string;
  className?: string;
  variant?: 'signal' | 'solid' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  email?: string;
}) {
  const t = useTranslations('wallpaper');
  const tToast = useTranslations('toast');
  const [pending, setPending] = useState(false);
  const { add } = useCart();

  const handleClick = async () => {
    setPending(true);
    try {
      add({ id: itemId, kind, title, price, slug: itemId });

      const result = await createPayment({ kind, itemId, title, amount: price, email });

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }

      toast(tToast('paymentSoon'), { description: tToast('paymentSoonBody') });
    } catch {
      toast(tToast('sentError'));
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={pending}
      className={cn('gap-2', className)}
    >
      {kind === 'subscription' ? (
        <Sparkles className="size-4" />
      ) : (
        <ShoppingCart className="size-4" />
      )}
      {priceLabel ?? t('buy')}
    </Button>
  );
}
