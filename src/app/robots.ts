import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

/**
 * robots.txt
 *
 * Закрываем от индексации личный кабинет и админку.
 */
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const base = `https://${siteConfig.domain}`;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/account', '/admin'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
