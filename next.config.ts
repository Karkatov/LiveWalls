import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { resolveBuildMode } from './src/config/build';

/**
 * Режим сборки.
 *
 * Статический экспорт включён ПРИНУДИТЕЛЬНО и не зависит от NEXT_OUTPUT:
 * часть хостингов (Cloudflare Pages) не передаёт переменные окружения
 * в процесс сборки, а каталог `out/` там обязателен — из-за этого сборка
 * падала с «Output directory "out" not found».
 *
 * Значения NEXT_OUTPUT:
 *  - 'export'     (по умолчанию, любое другое значение) — статический экспорт
 *                  в `out/`: Cloudflare Pages, GitHub Pages, любой статический хостинг.
 *  - 'server'     — обычный Next.js сервер / ISR: Vercel, Netlify, VPS.
 *  - 'standalone' — output: 'standalone' для Docker/VPS.
 *
 * Для статического экспорта с поддоменом задайте NEXT_BASE_PATH
 * (например '/LiveWallsSite') и NEXT_ASSET_PREFIX.
 */
const buildMode = resolveBuildMode();
const isStandaloneMode = buildMode === 'standalone';
const isStaticExport = buildMode === 'export';
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
  ...(isStandaloneMode ? { output: 'standalone' as const } : {}),
  ...(isStaticExport ? { output: 'export' as const } : {}),

  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,

  // Явно задаём корень проекта: иначе Next ищет ближайший package-lock.json
  // вверх по дереву и может выбрать чужой (предупреждение про workspace root).
  outputFileTracingRoot: process.cwd(),

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

  // Заголовки применяются только в серверном режиме: в статическом экспорте
  // next.config не умеет их отдавать (статичные хостинги читают public/_headers).
  ...(isStaticExport
    ? {}
    : {
        async headers() {
          return [{ source: '/:path*', headers: securityHeaders }];
        },
      }),

  // Webpack-оптимизация: выносим тяжёлые библиотеки в отдельные чанки.
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    // Кастомная app/global-not-found.tsx: брендированная 404-страница
    // для маршрутов, не совпавших ни с одной локалью (в т.ч. 404.html в экспорте).
    globalNotFound: true,
  },
};

export default withNextIntl(nextConfig);
