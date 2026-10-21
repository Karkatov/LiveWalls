/** Покупка. Повторяет структуру таблицы `purchases` в server/schema.sql. */
export type PurchaseItemType = 'wallpaper' | 'pack' | 'subscription';
export type PurchaseStatus = 'paid' | 'pending' | 'refunded';

export interface Purchase {
  id: string;
  userId: string;
  email: string;
  itemType: PurchaseItemType;
  itemId: string;
  itemTitle: string;
  /** Сумма в рублях. */
  amount: number;
  currency: 'RUB';
  status: PurchaseStatus;
  /** Номер чека / транзакции платёжной системы. */
  invoiceId: string;
  createdAt: string;
  /** Ссылка на скачивание (заглушка, пока нет S3). */
  downloadUrl: string | null;
}
