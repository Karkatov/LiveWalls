import type { Purchase } from '@/types';

/** Моковые покупки для личного кабинета. */
export const mockPurchases: Purchase[] = [
  {
    id: 'pay-1',
    userId: 'u-1',
    email: 'demo@livewalls.app',
    itemType: 'subscription',
    itemId: 'premium-lifetime',
    itemTitle: 'Premium — навсегда',
    amount: 890,
    currency: 'RUB',
    status: 'paid',
    invoiceId: 'DEMO-0001',
    createdAt: '2026-07-20T11:24:00.000Z',
    downloadUrl: null,
  },
  {
    id: 'pay-2',
    userId: 'u-1',
    email: 'demo@livewalls.app',
    itemType: 'pack',
    itemId: 'p-atlas',
    itemTitle: 'Атлас природы',
    amount: 199,
    currency: 'RUB',
    status: 'paid',
    invoiceId: 'DEMO-0002',
    createdAt: '2026-08-03T14:02:00.000Z',
    downloadUrl: null,
  },
  {
    id: 'pay-3',
    userId: 'u-1',
    email: 'demo@livewalls.app',
    itemType: 'wallpaper',
    itemId: 'w-severnoe-siyanie',
    itemTitle: 'Северное сияние',
    amount: 99,
    currency: 'RUB',
    status: 'paid',
    invoiceId: 'DEMO-0003',
    createdAt: '2026-08-21T09:41:00.000Z',
    downloadUrl: null,
  },
];

/** Покупки конкретного пользователя. */
export function purchasesForUser(userId: string): Purchase[] {
  return mockPurchases.filter((purchase) => purchase.userId === userId);
}
