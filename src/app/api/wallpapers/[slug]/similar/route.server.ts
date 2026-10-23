import { getSimilarWallpapers, getWallpaper } from '@/lib/api/wallpapers';
import { CACHE_CONTROL, apiError, json } from '@/lib/api/response';
import { guardRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

/** GET /api/wallpapers/:slug/similar?limit=4 — похожие обои. */
export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const guard = guardRateLimit(request, 'wallpapers:similar');
  if (guard.response) return guard.response;

  try {
    const { slug } = await context.params;
    const wallpaper = await getWallpaper(slug);

    if (!wallpaper) {
      return apiError(404, 'not_found', 'Обои не найдены', {
        headers: guard.headers,
        cacheControl: CACHE_CONTROL.noStore,
      });
    }

    const url = new URL(request.url);
    const rawLimit = Number(url.searchParams.get('limit') ?? 4);
    const limit = Number.isFinite(rawLimit) ? Math.min(24, Math.max(1, Math.floor(rawLimit))) : 4;

    const data = await getSimilarWallpapers(wallpaper, limit);

    return json(data, {
      headers: guard.headers,
      cacheControl: CACHE_CONTROL.publicList,
    });
  } catch {
    return apiError(502, 'upstream_error', 'Не удалось загрузить рекомендации', {
      headers: guard.headers,
      cacheControl: CACHE_CONTROL.noStore,
    });
  }
}
