import { getFeaturedWallpapers } from '@/lib/api/wallpapers';
import { CACHE_CONTROL, apiError, json } from '@/lib/api/response';
import { guardRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

/** GET /api/wallpapers/featured?limit=8 — рекомендации для главной. */
export async function GET(request: Request) {
  const guard = guardRateLimit(request, 'wallpapers:featured');
  if (guard.response) return guard.response;

  try {
    const url = new URL(request.url);
    const rawLimit = Number(url.searchParams.get('limit') ?? 8);
    const limit = Number.isFinite(rawLimit) ? Math.min(50, Math.max(1, Math.floor(rawLimit))) : 8;

    const data = await getFeaturedWallpapers(limit);

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
