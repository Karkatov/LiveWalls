import { findUserByEmail } from '@/data/mock/users';
import { CACHE_CONTROL, apiError, json } from '@/lib/api/response';
import { guardRateLimit } from '@/lib/rate-limit';
import type { AuthResult } from '@/lib/api/auth';

export const runtime = 'nodejs';

/** POST /api/auth/sign-in — демо-вход по email. Строгий лимит: 10 запросов/мин. */
export async function POST(request: Request) {
  const guard = guardRateLimit(request, 'auth:sign-in', { limit: 10 });
  if (guard.response) return guard.response;

  let email = '';

  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === 'string' ? body.email : '';
  } catch {
    return apiError(400, 'invalid_json', 'Некорректный JSON', {
      headers: guard.headers,
      cacheControl: CACHE_CONTROL.noStore,
    });
  }

  const normalized = email.trim().toLowerCase();

  if (!normalized.includes('@')) {
    return json<AuthResult>(
      { user: null, error: 'invalid_email' },
      { status: 400, headers: guard.headers, cacheControl: CACHE_CONTROL.noStore },
    );
  }

  const user = findUserByEmail(normalized);

  if (!user) {
    return json<AuthResult>(
      { user: null, error: 'not_found' },
      { status: 404, headers: guard.headers, cacheControl: CACHE_CONTROL.noStore },
    );
  }

  return json<AuthResult>(
    { user, error: null },
    { headers: guard.headers, cacheControl: CACHE_CONTROL.noStore },
  );
}
