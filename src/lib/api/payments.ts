import { siteConfig, type PaymentProvider } from '@/config/site';
import { fetchData } from './fetcher';

/**
 * Оплата — заглушка.
 *
 * Кнопки «Купить» показывают тост «Оплата будет доступна позже».
 * Подключение реальной платёжной системы сводится к заполнению
 * `siteConfig.PAYMENT_PROVIDER` и реализации `createPayment`.
 *
 * Провайдеры:
 *  - 'lava'       — LAVA (https://lavaonline.ru), оплата по карте, СБП, ЮMoney;
 *  - 'robokassa' — Robokassa, оплата по карте, СБП, Qiwi и др.
 */

export interface PaymentRequest {
  /** Тип покупки. */
  kind: 'subscription';
  /** id тарифа. */
  itemId: string;
  /** Название для чека. */
  title: string;
  /** Сумма в рублях. */
  amount: number;
  /** Email покупателя — по нему доступ привязывается к аккаунту. */
  email?: string;
  /** Куда вернуть пользователя после оплаты. */
  returnUrl?: string;
}

export interface PaymentResult {
  ok: boolean;
  /** URL страницы оплаты — пользователя перекинет на провайдера. */
  paymentUrl: string | null;
  /** id заказа на стороне платёжной системы. */
  orderId: string | null;
  /** Человекочитаемое сообщение для тоста. */
  message: string;
}

/** Создание заказа на оплату. */
export async function createPayment(request: PaymentRequest): Promise<PaymentResult> {
  return fetchData<PaymentResult>(
    '/api/payments/create',
    () => ({
      ok: false,
      paymentUrl: null,
      orderId: null,
      message: 'payment_soon',
    }),
    { method: 'POST', body: request },
  );
}

/** Проверка статуса заказа (после возврата с сайта провайдера). */
export async function checkPaymentStatus(orderId: string): Promise<PaymentResult> {
  return fetchData<PaymentResult>(
    `/api/payments/status/${orderId}`,
    () => ({ ok: false, paymentUrl: null, orderId, message: 'payment_soon' }),
    { revalidate: 0 },
  );
}

/** Провайдер, настроенный в конфиге. */
export function activeProvider(): PaymentProvider {
  return siteConfig.PAYMENT_PROVIDER;
}

/** Оплата включена? */
export function isPaymentEnabled(): boolean {
  return siteConfig.PAYMENT_PROVIDER !== 'none';
}
