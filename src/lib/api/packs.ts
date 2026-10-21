import type { Pack, PackWithWallpapers } from '@/types';
import { mockPacks, mockPacksBySlug } from '@/data/mock/packs';
import { mockWallpapersBySlug } from '@/data/mock/wallpapers';
import { fetchData } from './fetcher';

/** Все паки. */
export async function getPacks(): Promise<Pack[]> {
  return fetchData<Pack[]>('/api/packs', () => mockPacks, { revalidate: 300 });
}

/** Рекомендуемые паки. */
export async function getFeaturedPacks(limit = 3): Promise<Pack[]> {
  return fetchData<Pack[]>(
    '/api/packs/featured',
    () => mockPacks.filter((pack) => pack.isFeatured).slice(0, limit),
    { revalidate: 300 },
  );
}

/** Пак по slug вместе с составом. */
export async function getPack(slug: string): Promise<PackWithWallpapers | null> {
  return fetchData<PackWithWallpapers | null>(
    `/api/packs/${slug}`,
    () => {
      const pack = mockPacksBySlug[slug];
      if (!pack) return null;
      const wallpapers = pack.wallpaperIds
        .map((id) => mockWallpapersBySlug[id.replace(/^w-/, '')] ?? mockWallpapersBySlug[id])
        .filter((wallpaper): wallpaper is NonNullable<typeof wallpaper> => Boolean(wallpaper));
      return { ...pack, wallpapers };
    },
    { revalidate: 300 },
  );
}
