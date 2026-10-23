import { mockUsers } from '@/data/mock/users';
import { CACHE_CONTROL, json } from '@/lib/api/response';
import { guardRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

/** GET /api/auth/me — текущий пользователь. Данные пользователя не кэшируем. */
export async function GET(request: Request) {
  const guard = guardRateLimit(request, 'auth:me');
  if (guard.response) return guard.response;

  return json(mockUsers[0] ?? null, {
    headers: guard.headers,
    cacheControl: CACHE_CONTROL.noStore,
  });
}
