import type { PaymentResult } from '@/lib/api/payments';
import { CACHE_CONTROL, json } from '@/lib/api/response';
import { guardRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

/** GET /api/payments/status/:orderId — проверка статуса. Всегда динамический. */
export async function GET(request: Request, context: { params: Promise<{ orderId: string }> }) {
  const guard = guardRateLimit(request, 'payments:status');
  if (guard.response) return guard.response;

  const { orderId } = await context.params;

  return json<PaymentResult>(
    { ok: false, paymentUrl: null, orderId, message: 'payment_soon' },
    { headers: guard.headers, cacheControl: CACHE_CONTROL.noStore },
  );
}
