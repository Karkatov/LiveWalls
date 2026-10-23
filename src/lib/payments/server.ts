import type { PaymentRequest, PaymentResult } from '@/lib/api/payments';
import { createSerialQueue } from '@/lib/queue/serial-queue';

/**
 * Серверная обработка создания платежа.
 *
 * Сейчас возвращает тот же мок, что и клиентский слой (`payment_soon`),
 * поэтому существующая логика оплаты не меняется. Когда появится реальный
 * провайдер, вызов внешнего API нужно делать внутри `execute` — очередь
 * уже сериализует запросы и не даст спамить ЮKassa/LAVA при пике.
 */

const paymentQueue = createSerialQueue({ maxPending: 100 });

async function execute(request: PaymentRequest): Promise<PaymentResult> {
  void request;

  return {
    ok: false,
    paymentUrl: null,
    orderId: null,
    message: 'payment_soon',
  };
}

/** Поставить создание платежа в очередь и дождаться результата. */
export function createPaymentOnServer(request: PaymentRequest): Promise<PaymentResult> {
  return paymentQueue.enqueue(() => execute(request));
}
