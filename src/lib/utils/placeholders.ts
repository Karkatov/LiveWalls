import { gradientForKey, palette } from '@/styles/theme';

/**
 * Генераторы SVG-плейсхолдеров.
 *
 * Никаких внешних сервисов (placehold.co и подобные) — только локальная генерация.
 * Результат можно использовать как `src` для next/image (data-URI поддерживается)
 * или как `blurDataURL`.
 */

/** SVG → data URI, безопасный для CSS background и next/image. */
export function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`;
}

function gradientDefs(id: string, from: string, via: string, to: string): string {
  return `
    <defs>
      <linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${from}"/>
        <stop offset="55%" stop-color="${via}"/>
        <stop offset="100%" stop-color="${to}"/>
      </linearGradient>
      <radialGradient id="r${id}" cx="0.75" cy="0.15" r="0.9">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.28"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
    </defs>`;
}

export interface PlaceholderOptions {
  width?: number;
  height?: number;
  label?: string;
  /** Показывать иконку play (для видео-обоев). */
  play?: boolean;
}

/** Плейсхолдер обоев: градиент + мягкое свечение + опциональная иконка play. */
export function wallpaperPlaceholderSvg(key: string, options: PlaceholderOptions = {}): string {
  const { width = 1600, height = 900, label, play = true } = options;
  const [from, via, to] = gradientForKey(key);
  const id = Math.abs(hashString(key)).toString(36);
  const playIcon = play
    ? `<g transform="translate(${width / 2 - 34} ${height / 2 - 34})" opacity="0.92">
         <circle cx="34" cy="34" r="34" fill="rgba(10,10,12,0.42)" stroke="rgba(255,255,255,0.42)" stroke-width="1.5"/>
         <path d="M26 20 L50 34 L26 48 Z" fill="#ffffff"/>
       </g>`
    : '';
  const caption = label
    ? `<text x="40" y="${height - 40}" font-family="-apple-system, system-ui, sans-serif" font-size="26" fill="rgba(255,255,255,0.82)">${escapeXml(label)}</text>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    ${gradientDefs(id, from, via, to)}
    <rect width="${width}" height="${height}" fill="url(#g${id})"/>
    <rect width="${width}" height="${height}" fill="url(#r${id})"/>
    <g opacity="0.18" stroke="#ffffff" stroke-width="1" fill="none">
      <path d="M0 ${height * 0.72} Q ${width * 0.3} ${height * 0.55} ${width * 0.6} ${height * 0.75} T ${width} ${height * 0.68}"/>
      <path d="M0 ${height * 0.82} Q ${width * 0.35} ${height * 0.66} ${width * 0.7} ${height * 0.86} T ${width} ${height * 0.78}"/>
    </g>
    ${playIcon}
    ${caption}
  </svg>`;
}

/** Маленький blur-плейсхолдер (16×9) — только градиент, минимальный вес. */
export function wallpaperBlurDataURL(key: string): string {
  const [from, , to] = gradientForKey(key);
  const id = Math.abs(hashString(key)).toString(36);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="9" viewBox="0 0 16 9">
    <defs><linearGradient id="b${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>
    </linearGradient></defs>
    <rect width="16" height="9" fill="url(#b${id})"/>
  </svg>`;
  return svgToDataUri(svg);
}

/** Плейсхолдер скриншота приложения: макет окна macOS с подписью. */
export function screenshotPlaceholderSvg(label: string, options: PlaceholderOptions = {}): string {
  const { width = 1200, height = 750 } = options;
  const [from, via, to] = gradientForKey(label);
  const id = Math.abs(hashString(label)).toString(36);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    ${gradientDefs(id, from, via, to)}
    <rect width="${width}" height="${height}" fill="#0A0A0C"/>
    <g transform="translate(60 60)">
      <rect width="${width - 120}" height="${height - 120}" rx="24" fill="url(#g${id})"/>
      <rect x="0" y="0" width="${width - 120}" height="56" rx="24" fill="rgba(10,10,12,0.35)"/>
      <rect x="0" y="40" width="${width - 120}" height="16" fill="rgba(10,10,12,0.35)"/>
      <circle cx="28" cy="28" r="7" fill="#ff5f57"/>
      <circle cx="52" cy="28" r="7" fill="#7c5cff"/>
      <circle cx="76" cy="28" r="7" fill="#28c840"/>
      <text x="${(width - 120) / 2}" y="${(height - 120) / 2 + 12}" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="40" font-weight="600" fill="rgba(255,255,255,0.92)">${escapeXml(label)}</text>
    </g>
  </svg>`;
}

/** Аватар-заглушка: градиентный круг с инициалами. */
export function avatarPlaceholderSvg(name: string, key: string, size = 96): string {
  const [from, , to] = gradientForKey(key || name);
  const id = Math.abs(hashString(name)).toString(36);
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs><linearGradient id="a${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>
    </linearGradient></defs>
    <rect width="${size}" height="${size}" rx="${size / 2}" fill="url(#a${id})"/>
    <text x="50%" y="52%" dy="0.35em" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="${size * 0.4}" font-weight="700" fill="#ffffff">${escapeXml(letters)}</text>
  </svg>`;
}

/** Плашка-превью приложения для hero-блока. */
export function appWindowPlaceholderSvg(width = 1400, height = 880): string {
  const id = 'appwin';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="aw${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${palette.brandFrom}"/>
        <stop offset="50%" stop-color="${palette.brandVia}"/>
        <stop offset="100%" stop-color="${palette.brandTo}"/>
      </linearGradient>
      <radialGradient id="awr${id}" cx="0.5" cy="0" r="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${width}" height="${height}" rx="28" fill="#0A0A0C"/>
    <rect x="18" y="18" width="${width - 36}" height="${height - 36}" rx="22" fill="url(#aw${id})"/>
    <rect x="18" y="18" width="${width - 36}" height="${height - 36}" rx="22" fill="url(#awr${id})"/>
    <g opacity="0.9">
      <rect x="46" y="46" width="240" height="${height - 92}" rx="16" fill="rgba(10,10,12,0.45)"/>
      <rect x="310" y="46" width="${width - 356}" height="${height - 92}" rx="16" fill="rgba(10,10,12,0.28)"/>
    </g>
  </svg>`;
}

/** ─── Вспомогательные функции ─── */

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
