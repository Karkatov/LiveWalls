import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

/**
 * Режим сборки управляется переменной окружения NEXT_OUTPUT:
 *  - 'default'    (по умолчанию) — обычный Next.js сервер / ISR. Подходит для Vercel, Netlify, VPS.
 *  - 'standalone' — output: 'standalone' для Docker/VPS.
 *  - 'export'     — полностью статический экспорт (GitHub Pages). Обязательно ставить
 *                   NEXT_BASE_PATH (например '/LiveWallsSite') и NEXT_ASSET_PREFIX.
 */
const outputMode = (process.env.NEXT_OUTPUT ?? 'default') as 'default' | 'standalone' | 'export';
const isStaticExport = outputMode === 'export';
const basePath = process.env.NEXT_BASE_PATH ?? '';
const assetPrefix = process.env.NEXT_ASSET_PREFIX ?? '';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/**
 * Базовые заголовки безопасности.
 * TODO: после подключения реального API и аналитики расширить connect-src/script-src.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js инжектит inline-скрипты; 'unsafe-eval' нужен только в dev (HMR).
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "media-src 'self' blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https: wss:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  // --- Базовые пути (нужны для GitHub Pages) ---
  basePath: basePath || undefined,
  assetPrefix: assetPrefix || undefined,

  // --- Режим вывода ---
  ...(outputMode === 'standalone' ? { output: 'standalone' as const } : {}),
  ...(isStaticExport ? { output: 'export' as const } : {}),

  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,

  // В статическом экспорте next/image требует unoptimized (нет image-сервера).
  images: {
    unoptimized: isStaticExport,
    formats: ['image/avif', 'image/webp'],
    // Локальные SVG-плейсхолдеры: next/image их не оптимизирует, поэтому
    // разрешаем SVG и жёстко ограничиваем его обработку.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // TODO: добавить remotePatterns для CDN (Timeweb S3 / CDN), когда появится реальный контент.
    remotePatterns: [
      { protocol: 'https', hostname: '**.livewalls.app' },
      { protocol: 'https', hostname: '**.timeweb.cloud' },
    ],
  },

  // Короткие редиректы: / → /ru (в статическом экспорте не поддерживаются,
  // там корень закрывает scripts/postbuild.mjs мета-редиректом).
  ...(isStaticExport
    ? {}
    : {
        async redirects() {
          return [
            { source: '/', destination: '/ru', permanent: false },
            { source: '/wallpapers', destination: '/ru/wallpapers', permanent: false },
            { source: '/packs', destination: '/ru/packs', permanent: false },
            { source: '/pricing', destination: '/ru/pricing', permanent: false },
          ];
        },
      }),

  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },

  // Webpack-оптимизация: выносим тяжёлые библиотеки в отдельные чанки.
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    // Кастомная app/global-not-found.tsx: брендированная 404-страница
    // для маршрутов, не совпавших ни с одной локалью (в т.ч. 404.html в экспорте).
    globalNotFound: true,
  },
};

export default withNextIntl(nextConfig);
