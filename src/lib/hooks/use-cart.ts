'use client';

import { useCartStore, type CartItem } from '@/lib/store/cart';

/**
 * Хук корзины — тонкая обёртка над zustand-стором.
 */
export function useCart() {
  const items = useCartStore((state) => state.items);
  const add = useCartStore((state) => state.add);
  const remove = useCartStore((state) => state.remove);
  const clear = useCartStore((state) => state.clear);
  const total = useCartStore((state) => state.total());
  const count = useCartStore((state) => state.count());

  return { items, add, remove, clear, total, count };
}

export type { CartItem };
