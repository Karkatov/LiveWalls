import { getWallpapers } from '@/lib/api/wallpapers';
import { CACHE_CONTROL, apiError, json } from '@/lib/api/response';
import { parseFilters } from '@/lib/catalog/filters';
import { guardRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

/** GET /api/wallpapers — каталог с фильтрами и пагинацией. Кэш: 60 секунд. */
export async function GET(request: Request) {
  const guard = guardRateLimit(request, 'wallpapers:list');
  if (guard.response) return guard.response;

  try {
    const url = new URL(request.url);
    const params: Record<string, string> = {};

    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const filters = parseFilters(params);
    const data = await getWallpapers(filters);

    return json(data, {
      headers: guard.headers,
      cacheControl: CACHE_CONTROL.publicList,
    });
  } catch {
    return apiError(502, 'upstream_error', 'Не удалось загрузить каталог', {
      headers: guard.headers,
      cacheControl: CACHE_CONTROL.noStore,
    });
  }
}
