import { CACHE_CONTROL } from '@/lib/api/response';
import { guardRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

/** POST /api/auth/sign-out — заглушка выхода. */
export async function POST(request: Request) {
  const guard = guardRateLimit(request, 'auth:sign-out');
  if (guard.response) return guard.response;

  guard.headers.set('Cache-Control', CACHE_CONTROL.noStore);

  return new Response(null, { status: 204, headers: guard.headers });
}
