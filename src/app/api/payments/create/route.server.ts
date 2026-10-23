import type { PaymentRequest } from '@/lib/api/payments';
import { CACHE_CONTROL, apiError, json } from '@/lib/api/response';
import { createPaymentOnServer } from '@/lib/payments/server';
import { QueueOverflowError } from '@/lib/queue/serial-queue';
import { guardRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

function isPaymentRequest(value: unknown): value is PaymentRequest {
  if (!value || typeof value !== 'object') return false;
  const body = value as Partial<PaymentRequest>;
  return (
    body.kind === 'subscription' &&
    typeof body.itemId === 'string' &&
    body.itemId.length > 0 &&
    typeof body.title === 'string' &&
    typeof body.amount === 'number' &&
    Number.isFinite(body.amount)
  );
}

/** POST /api/payments/create — создание платежа через последовательную очередь. */
export async function POST(request: Request) {
  const guard = guardRateLimit(request, 'payments:create', { limit: 10 });
  if (guard.response) return guard.response;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return apiError(400, 'invalid_json', 'Некорректный JSON', {
      headers: guard.headers,
      cacheControl: CACHE_CONTROL.noStore,
    });
  }

  if (!isPaymentRequest(body)) {
    return apiError(400, 'invalid_payment', 'Некорректные данные платежа', {
      headers: guard.headers,
      cacheControl: CACHE_CONTROL.noStore,
    });
  }

  try {
    const result = await createPaymentOnServer(body);

    return json(result, {
      headers: guard.headers,
      cacheControl: CACHE_CONTROL.noStore,
    });
  } catch (error) {
    if (error instanceof QueueOverflowError) {
      const headers = new Headers(guard.headers);
      headers.set('Retry-After', '5');

      return apiError(503, 'queue_overflow', 'Сервис оплаты перегружен, попробуйте позже', {
        headers,
        cacheControl: CACHE_CONTROL.noStore,
      });
    }

    return apiError(502, 'payment_error', 'Не удалось создать платёж', {
      headers: guard.headers,
      cacheControl: CACHE_CONTROL.noStore,
    });
  }
}
