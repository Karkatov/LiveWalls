import { getWallpaper } from '@/lib/api/wallpapers';
import { CACHE_CONTROL, apiError, json } from '@/lib/api/response';
import { guardRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

/** GET /api/wallpapers/:slug — карточка обоев. Кэш: 60 секунд. */
export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const guard = guardRateLimit(request, 'wallpapers:detail');
  if (guard.response) return guard.response;

  try {
    const { slug } = await context.params;
    const data = await getWallpaper(slug);

    if (!data) {
      return apiError(404, 'not_found', 'Обои не найдены', {
        headers: guard.headers,
        cacheControl: CACHE_CONTROL.noStore,
      });
    }

    return json(data, {
      headers: guard.headers,
      cacheControl: CACHE_CONTROL.publicList,
    });
  } catch {
    return apiError(502, 'upstream_error', 'Не удалось загрузить обои', {
      headers: guard.headers,
      cacheControl: CACHE_CONTROL.noStore,
    });
  }
}
