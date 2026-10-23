import { getCategories } from '@/lib/api/wallpapers';
import { CACHE_CONTROL, apiError, json } from '@/lib/api/response';
import { guardRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

/** GET /api/categories — категории каталога. Кэш: 1 час. */
export async function GET(request: Request) {
  const guard = guardRateLimit(request, 'categories');
  if (guard.response) return guard.response;

  try {
    const data = await getCategories();

    return json(data, {
      headers: guard.headers,
      cacheControl: CACHE_CONTROL.categories,
    });
  } catch {
    return apiError(502, 'upstream_error', 'Не удалось загрузить категории', {
      headers: guard.headers,
      cacheControl: CACHE_CONTROL.noStore,
    });
  }
}
