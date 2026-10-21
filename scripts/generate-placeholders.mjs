#!/usr/bin/env node
/**
 * Генератор статических ассетов сайта.
 *
 * Создаёт:
 *   public/placeholders/wallpapers/wallpaper-01..12.svg
 *   public/placeholders/categories/category-01..09.svg
 *   public/placeholders/packs/pack-01..05.svg
 *   public/placeholders/avatars/avatar-01..06.svg
 *   public/placeholders/screenshots/app-*.svg
 *   public/logo.svg, public/logo-compact.svg, public/favicon.svg
 *   public/favicon.ico, public/apple-touch-icon.png, public/og/og-default.png
 *   public/manifest.webmanifest
 *
 * Запуск: npm run assets  (или node scripts/generate-placeholders.mjs)
 *
 * Палитра дублирует src/styles/theme.ts — скрипт намеренно автономный,
 * чтобы его можно было запускать до установки зависимостей.
 *
 * Кадры «живые»: внутри SVG объявлены CSS-анимации (дрейф градиента и
 * зерно), которые отключаются по `prefers-reduced-motion`. Анимации
 * работают внутри <img>, поэтому не требуют JS на странице.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');

const PALETTE = {
  background: '#07080A',
  foreground: '#F4F2ED',
  signal: '#E7B24B',
  signalLight: '#F2CD80',
  signalDark: '#CF922C',
  live: '#E0523F',
};

/**
 * Кинематографичная палитра кадров.
 *
 * Насыщенный цвет живёт только внутри изображений: интерфейс нейтрален,
 * поэтому обои — единственный источник цвета на странице.
 */
const GRADIENTS = [
  ['#0F2E4C', '#1C6E8C', '#E7B24B'],
  ['#2B1B3D', '#6B3F6E', '#E0523F'],
  ['#0B2B26', '#1E6B5A', '#9FD3B0'],
  ['#3A2410', '#8C5A22', '#F0C674'],
  ['#101826', '#25405E', '#7FA8C9'],
  ['#2A0F14', '#7A2430', '#E0523F'],
  ['#16161C', '#3A3A46', '#8C8C9E'],
  ['#1A2A1E', '#3E6B4A', '#B9D9A3'],
  ['#241C0E', '#6B4E1E', '#D9B26A'],
  ['#0D1B2A', '#3A506B', '#C9D6E3'],
  ['#22122E', '#5B2A66', '#D48AB8'],
  ['#0C1A14', '#26513C', '#8FCFA8'],
];

/* ─── утилиты ─────────────────────────────────────────────────────────── */

function write(relativePath, content) {
  const target = join(publicDir, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
  return target;
}

/** Общие стили «живого» кадра: дрейф, зерно и отключение по reduced-motion. */
function motionStyles(id, duration = 26) {
  return `<style>
    @keyframes drift-${id} {
      0%, 100% { transform: translate3d(0, 0, 0) scale(1.06); }
      50% { transform: translate3d(-2%, 2.5%, 0) scale(1.14); }
    }
    @keyframes grain-${id} {
      0%, 100% { transform: translate(0, 0); opacity: 0.14; }
      25% { transform: translate(-1.5%, 1%); opacity: 0.2; }
      50% { transform: translate(1%, -1.5%); opacity: 0.12; }
      75% { transform: translate(1.5%, 1.5%); opacity: 0.18; }
    }
    .drift { animation: drift-${id} ${duration}s ease-in-out infinite; transform-origin: center; }
    .grain { animation: grain-${id} 7s steps(4, end) infinite; }
    @media (prefers-reduced-motion: reduce) {
      .drift, .grain { animation: none; }
    }
  </style>`;
}

/** Зерно поверхности: feTurbulence внутри самого кадра. */
function grainFilter(id) {
  return `<filter id="n${id}" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>`;
}

function gradientDefs(id, from, via, to, animated = false) {
  // Анимированные градиентные стопы дают медленную смену света внутри кадра.
  const animate = (attribute, values, dur) =>
    animated
      ? `<animate attributeName="${attribute}" values="${values}" dur="${dur}s" repeatCount="indefinite"/>`
      : '';

  return `
    <defs>
      <linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${from}">${animate('stop-color', `${from};${via};${from}`, 22)}</stop>
        <stop offset="55%" stop-color="${via}">${animate('stop-color', `${via};${to};${via}`, 26)}</stop>
        <stop offset="100%" stop-color="${to}">${animate('stop-color', `${to};${from};${to}`, 30)}</stop>
      </linearGradient>
      <radialGradient id="r${id}" cx="0.72" cy="0.14" r="0.95">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="v${id}" cx="0.5" cy="0.55" r="0.75">
        <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.42"/>
      </radialGradient>
      ${grainFilter(id)}
    </defs>`;
}

/* ─── SVG-плейсхолдеры ────────────────────────────────────────────────── */

function wallpaperSvg(index) {
  const [from, via, to] = GRADIENTS[index % GRADIENTS.length];
  const id = index;
  const width = 1600;
  const height = 900;

  // Перекрывающиеся «слои гор» вместо плоской заливки — глубине кадра.
  const layers = [
    { y: 0.62, opacity: 0.28, amp: 0.09 },
    { y: 0.74, opacity: 0.22, amp: 0.07 },
    { y: 0.86, opacity: 0.34, amp: 0.05 },
  ]
    .map(
      (layer, i) => `<path d="M0 ${height * layer.y}
          Q ${width * 0.25} ${height * (layer.y - layer.amp)} ${width * 0.5} ${height * (layer.y + layer.amp * 0.4)}
          T ${width} ${height * (layer.y - layer.amp * 0.3)}
          V ${height} H 0 Z"
          fill="#000000" opacity="${(layer.opacity + i * 0.04).toFixed(2)}"/>`,
    )
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">
    ${motionStyles(id, 24 + index * 2)}
    ${gradientDefs(id, from, via, to, true)}
    <rect width="${width}" height="${height}" fill="url(#g${id})"/>
    <g class="drift">
      <rect width="${width}" height="${height}" fill="url(#r${id})"/>
      ${layers}
    </g>
    <rect width="${width}" height="${height}" fill="url(#v${id})"/>
    <rect class="grain" width="${width}" height="${height}" filter="url(#n${id})" opacity="0.16"/>
    <circle cx="${width * 0.72}" cy="${height * 0.22}" r="${height * 0.06}" fill="#ffffff" opacity="0.14"/>
  </svg>`;
}

function categorySvg(index) {
  const [from, via, to] = GRADIENTS[(index + 3) % GRADIENTS.length];
  const id = `c${index}`;
  const width = 1200;
  const height = 900;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">
    ${motionStyles(id, 28 + index)}
    ${gradientDefs(id, from, via, to)}
    <rect width="${width}" height="${height}" fill="url(#g${id})"/>
    <g class="drift">
      <rect width="${width}" height="${height}" fill="url(#r${id})"/>
      <g opacity="0.2" fill="none" stroke="#ffffff" stroke-width="2">
        <circle cx="${width / 2}" cy="${height / 2}" r="150"/>
        <circle cx="${width / 2}" cy="${height / 2}" r="220"/>
        <circle cx="${width / 2}" cy="${height / 2}" r="290"/>
      </g>
    </g>
    <rect width="${width}" height="${height}" fill="url(#v${id})"/>
    <rect class="grain" width="${width}" height="${height}" filter="url(#n${id})" opacity="0.14"/>
  </svg>`;
}

function packSvg(index) {
  const [from, via, to] = GRADIENTS[(index + 5) % GRADIENTS.length];
  const id = `p${index}`;
  const width = 1200;
  const height = 800;

  // Кадры пака — сетка 3×2 с собственными мини-градиентами.
  const tiles = Array.from({ length: 6 })
    .map((_, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 60 + col * 370;
      const y = 60 + row * 350;
      const [f, v, t] = GRADIENTS[(index + i) % GRADIENTS.length];
      return `<g>
        <rect x="${x}" y="${y}" width="340" height="310" rx="14" fill="#000000" opacity="0.35"/>
        <rect x="${x + 3}" y="${y + 3}" width="334" height="304" rx="12" fill="${f}" opacity="0.55"/>
        <rect x="${x + 3}" y="${y + 3}" width="334" height="304" rx="12" fill="url(#g${id})" opacity="0.35"/>
        <rect x="${x + 3}" y="${y + 3}" width="334" height="150" rx="12" fill="${v}" opacity="0.35"/>
        <rect x="${x + 3}" y="${y + 153}" width="334" height="154" fill="${t}" opacity="0.22"/>
      </g>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">
    ${motionStyles(id, 30 + index)}
    ${gradientDefs(id, from, via, to, true)}
    <rect width="${width}" height="${height}" fill="#0C0D10"/>
    ${tiles}
    <rect width="${width}" height="${height}" fill="url(#v${id})" opacity="0.6"/>
    <rect class="grain" width="${width}" height="${height}" filter="url(#n${id})" opacity="0.14"/>
  </svg>`;
}

function avatarSvg(index) {
  const [from, , to] = GRADIENTS[(index + 7) % GRADIENTS.length];
  const id = `a${index}`;
  const size = 96;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="a${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${size / 2}" fill="url(#a${id})"/>
    <circle cx="${size / 2}" cy="${size * 0.38}" r="${size * 0.16}" fill="rgba(244,242,237,0.9)"/>
    <path d="M${size * 0.2} ${size * 0.88} a${size * 0.3} ${size * 0.3} 0 0 1 ${size * 0.6} 0 Z" fill="rgba(244,242,237,0.9)"/>
  </svg>`;
}

function screenshotSvg(label, variant, variantIndex) {
  const [from, via, to] = GRADIENTS[(variantIndex + 2) % GRADIENTS.length];
  const id = `s${variant}`;
  const width = 1200;
  const height = 750;
  const ink = '#07080A';

  // Каждый скриншот — честная схема интерфейса приложения в едином стиле.
  const panels = {
    // Каталог: сайдбар категорий + сетка кадров.
    main: `<rect x="48" y="48" width="240" height="${height - 96}" rx="14" fill="${ink}" opacity="0.55"/>
           <rect x="70" y="76" width="120" height="10" rx="5" fill="#F4F2ED" opacity="0.5"/>
           ${Array.from({ length: 7 })
             .map(
               (_, i) =>
                 `<rect x="70" y="${112 + i * 34}" width="${140 - (i % 3) * 22}" height="8" rx="4" fill="#F4F2ED" opacity="${i === 0 ? 0.75 : 0.22}"/>`,
             )
             .join('')}
           <rect x="312" y="48" width="${width - 360}" height="56" rx="12" fill="${ink}" opacity="0.4"/>
           <rect x="336" y="68" width="180" height="12" rx="6" fill="#F4F2ED" opacity="0.35"/>
           ${Array.from({ length: 6 })
             .map((_, i) => {
               const col = i % 3;
               const row = Math.floor(i / 3);
               const x = 312 + col * 288;
               const y = 124 + row * 246;
               return `<g>
                 <rect x="${x}" y="${y}" width="264" height="222" rx="12" fill="#FFFFFF" opacity="0.07"/>
                 <rect x="${x + 10}" y="${y + 10}" width="244" height="138" rx="8" fill="#FFFFFF" opacity="${(0.1 + (i % 3) * 0.07).toFixed(2)}"/>
                 <rect x="${x + 10}" y="${y + 160}" width="120" height="9" rx="4" fill="#F4F2ED" opacity="0.35"/>
                 <rect x="${x + 10}" y="${y + 178}" width="70" height="8" rx="4" fill="#F4F2ED" opacity="0.18"/>
               </g>`;
             })
             .join('')}`,

    // Плеер: большой кадр, таймлайн, управление.
    player: `<rect x="48" y="48" width="${width - 96}" height="${height - 240}" rx="16" fill="#000000" opacity="0.4"/>
           <rect x="48" y="48" width="${width - 96}" height="${height - 240}" rx="16" fill="url(#g${id})" opacity="0.5"/>
           <circle cx="${width / 2}" cy="${(height - 144) / 2}" r="40" fill="#F4F2ED" opacity="0.85"/>
           <path d="M${width / 2 - 12} ${(height - 144) / 2 - 18} L${width / 2 + 20} ${(height - 144) / 2} L${width / 2 - 12} ${(height - 144) / 2 + 18} Z" fill="${ink}"/>
           <rect x="48" y="${height - 168}" width="${width - 96}" height="6" rx="3" fill="#F4F2ED" opacity="0.2"/>
           <rect x="48" y="${height - 168}" width="${(width - 96) * 0.42}" height="6" rx="3" fill="${PALETTE.signal}"/>
           <circle cx="${48 + (width - 96) * 0.42}" cy="${height - 165}" r="9" fill="${PALETTE.signal}"/>
           <rect x="48" y="${height - 130}" width="90" height="10" rx="5" fill="#F4F2ED" opacity="0.35"/>
           <rect x="${width - 138}" y="${height - 130}" width="90" height="10" rx="5" fill="#F4F2ED" opacity="0.35"/>`,

    // Каталог-сетка без сайдбара: плотная выкладка кадров.
    catalog: `${Array.from({ length: 9 })
      .map((_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 48 + col * 376;
        const y = 48 + row * 226;
        return `<g>
           <rect x="${x}" y="${y}" width="352" height="202" rx="12" fill="#000000" opacity="0.35"/>
           <rect x="${x + 3}" y="${y + 3}" width="346" height="196" rx="10" fill="#FFFFFF" opacity="${(0.09 + (i % 4) * 0.05).toFixed(2)}"/>
           <rect x="${x + 3}" y="${y + 121}" width="346" height="78" rx="10" fill="${ink}" opacity="0.5"/>
           <rect x="${x + 20}" y="${y + 148}" width="130" height="10" rx="5" fill="#F4F2ED" opacity="0.5"/>
           <rect x="${x + 20}" y="${y + 168}" width="80" height="8" rx="4" fill="#F4F2ED" opacity="0.22"/>
         </g>`;
      })
      .join('')}`,

    // Bend: крышка складывается по центральной оси.
    bend: `<rect x="120" y="150" width="${width / 2 - 130}" height="${height - 300}" rx="16" fill="url(#g${id})" opacity="0.65"/>
           <rect x="${width / 2 + 10}" y="150" width="${width / 2 - 130}" height="${height - 300}" rx="16" fill="url(#g${id})" opacity="0.4" transform="scale(-1 1) translate(${-width} 0)"/>
           <path d="M${width / 2} 150 L${width / 2} ${height - 150}" stroke="${PALETTE.signal}" stroke-width="2" stroke-dasharray="12 10"/>
           <circle cx="${width / 2}" cy="${height / 2}" r="42" fill="${ink}" opacity="0.75"/>
           <path d="M${width / 2 - 14} ${height / 2 - 16} L${width / 2 + 16} ${height / 2} L${width / 2 - 14} ${height / 2 + 16} Z" fill="#F4F2ED"/>`,
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    ${motionStyles(id, 32)}
    ${gradientDefs(id, from, via, to)}
    <rect width="${width}" height="${height}" fill="${ink}"/>
    <rect width="${width}" height="${height}" fill="url(#g${id})" opacity="0.28"/>
    <rect class="drift" width="${width}" height="${height}" fill="url(#r${id})" opacity="0.6"/>
    ${panels[variant] ?? panels.main}
    <rect class="grain" width="${width}" height="${height}" filter="url(#n${id})" opacity="0.1"/>
    <text x="${width / 2}" y="${height - 26}" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="18" letter-spacing="3" fill="#F4F2ED" opacity="0.55">${label.toString().toUpperCase()}</text>
  </svg>`;
}

function logoSvg(compact) {
  const width = compact ? 40 : 168;
  const height = 40;
  const mark = `<defs>
      <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${PALETTE.signalLight}"/>
        <stop offset="55%" stop-color="${PALETTE.signal}"/>
        <stop offset="100%" stop-color="${PALETTE.signalDark}"/>
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#lg)"/>
    <path d="M17 12 L29 20 L17 28 Z" fill="${PALETTE.background}" opacity="0.9"/>`;

  const wordmark = compact
    ? ''
    : `<text x="50" y="26" font-family="ui-serif, Georgia, 'Playfair Display', serif" font-size="20" font-weight="500" fill="${PALETTE.foreground}">LiveWalls</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    ${mark}
    ${wordmark}
  </svg>`;
}

function faviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="fav" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${PALETTE.signalLight}"/>
        <stop offset="55%" stop-color="${PALETTE.signal}"/>
        <stop offset="100%" stop-color="${PALETTE.signalDark}"/>
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="15" fill="${PALETTE.background}"/>
    <rect x="6" y="6" width="52" height="52" rx="12" fill="url(#fav)"/>
    <path d="M26 20 L46 32 L26 44 Z" fill="${PALETTE.background}" opacity="0.92"/>
  </svg>`;
}

/* ─── Минимальный PNG-энкодер ─────────────────────────────────────────── */

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData));
  return Buffer.concat([length, typeAndData, crc]);
}

function encodePng(width, height, pixel) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  let offset = 0;

  for (let y = 0; y < height; y += 1) {
    raw[offset] = 0;
    offset += 1;
    for (let x = 0; x < width; x += 1) {
      const [r, g, b, a] = pixel(x, y);
      raw[offset] = r;
      raw[offset + 1] = g;
      raw[offset + 2] = b;
      raw[offset + 3] = a;
      offset += 4;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

function mix(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

/** Мягкое свечение «проектора» на тёмном фоне. */
function signalPixel(x, y, width, height) {
  const light = hexToRgb(PALETTE.signalLight);
  const base = hexToRgb(PALETTE.signal);
  const dark = hexToRgb(PALETTE.signalDark);
  const ink = hexToRgb(PALETTE.background);

  const t = Math.min(1, Math.max(0, (x / width + y / height) / 2));
  const rgb = t < 0.5 ? mix(light, base, t * 2) : mix(base, dark, (t - 0.5) * 2);

  // Радиальное затухание к краям — «луч».
  const dx = (x - width / 2) / (width / 2);
  const dy = (y - height / 2) / (height / 2);
  const fade = Math.min(1, Math.max(0, 1 - Math.hypot(dx, dy) * 0.85));
  return mix(ink, rgb, fade);
}

function iconPixel(x, y, size) {
  const radius = size * 0.23;
  const inset = size * 0.03;
  const left = inset;
  const top = inset;
  const right = size - inset;
  const bottom = size - inset;

  const cx = Math.min(Math.max(x, left + radius), right - radius);
  const cy = Math.min(Math.max(y, top + radius), bottom - radius);
  const distance = Math.hypot(x - cx, y - cy);
  if (distance > radius) return [0, 0, 0, 0];

  const rgb = signalPixel(x, y, size, size);

  const tx = (x - size * 0.38) / (size * 0.3);
  const ty = (y - size * 0.3) / (size * 0.4);
  if (tx >= 0 && tx <= 1 && ty >= 0 && ty <= 1 && tx * 0.9 + Math.abs(ty - 0.5) * 1.6 <= 0.9) {
    return [7, 8, 10, 235];
  }

  return [...rgb, 255];
}

function encodeIco(pngBuffer, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  const entry = Buffer.alloc(16);
  entry[0] = size === 256 ? 0 : size;
  entry[1] = size === 256 ? 0 : size;
  entry[2] = 0;
  entry[3] = 0;
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngBuffer.length, 8);
  entry.writeUInt32LE(22, 12);

  return Buffer.concat([header, entry, pngBuffer]);
}

/* ─── Генерация ───────────────────────────────────────────────────────── */

const written = [];

for (let i = 1; i <= 12; i += 1) {
  written.push(
    write(
      `placeholders/wallpapers/wallpaper-${String(i).padStart(2, '0')}.svg`,
      wallpaperSvg(i - 1),
    ),
  );
}

for (let i = 1; i <= 9; i += 1) {
  written.push(
    write(`placeholders/categories/category-${String(i).padStart(2, '0')}.svg`, categorySvg(i - 1)),
  );
}

for (let i = 1; i <= 5; i += 1) {
  written.push(write(`placeholders/packs/pack-${String(i).padStart(2, '0')}.svg`, packSvg(i - 1)));
}

for (let i = 1; i <= 6; i += 1) {
  written.push(
    write(`placeholders/avatars/avatar-${String(i).padStart(2, '0')}.svg`, avatarSvg(i - 1)),
  );
}

const screens = [
  ['app-main.svg', 'Каталог', 'main'],
  ['app-player.svg', 'Плеер', 'player'],
  ['app-catalog.svg', 'Сетка', 'catalog'],
  ['app-bend.svg', 'Bend', 'bend'],
];

screens.forEach(([file, label, variant], index) => {
  written.push(write(`placeholders/screenshots/${file}`, screenshotSvg(label, variant, index)));
});

written.push(write('logo.svg', logoSvg(false)));
written.push(write('logo-compact.svg', logoSvg(true)));
written.push(write('favicon.svg', faviconSvg()));

const appleIcon = encodePng(180, 180, (x, y) => iconPixel(x, y, 180));
writeFileSync(join(publicDir, 'apple-touch-icon.png'), appleIcon);
written.push(join(publicDir, 'apple-touch-icon.png'));

const faviconPng = encodePng(32, 32, (x, y) => iconPixel(x, y, 32));
writeFileSync(join(publicDir, 'favicon.ico'), encodeIco(faviconPng, 32));
written.push(join(publicDir, 'favicon.ico'));

const ogWidth = 1200;
const ogHeight = 630;
const ogImage = encodePng(ogWidth, ogHeight, (x, y) => {
  const rgb = signalPixel(x, y, ogWidth, ogHeight);

  const edge = Math.min(
    x / ogWidth,
    (ogWidth - x) / ogWidth,
    y / ogHeight,
    (ogHeight - y) / ogHeight,
  );
  const shade = Math.min(0.7, Math.max(0, (0.16 - edge) * 4.2));

  const dx = (x - ogWidth / 2) / 118;
  const dy = (y - ogHeight / 2) / 118;
  if (dx >= -1 && dx <= 1 && dy >= -1 && dy <= 1 && Math.hypot(dx, dy) <= 1) {
    return [7, 8, 10, 210];
  }

  return [
    Math.round(rgb[0] * (1 - shade)),
    Math.round(rgb[1] * (1 - shade)),
    Math.round(rgb[2] * (1 - shade)),
    255,
  ];
});
mkdirSync(join(publicDir, 'og'), { recursive: true });
writeFileSync(join(publicDir, 'og', 'og-default.png'), ogImage);
written.push(join(publicDir, 'og', 'og-default.png'));

const manifest = {
  name: 'LiveWalls — живые обои для macOS',
  short_name: 'LiveWalls',
  description: 'Живые обои для macOS: рабочий стол, экран блокировки и заставка.',
  start_url: '/ru',
  scope: '/',
  display: 'standalone',
  background_color: PALETTE.background,
  theme_color: PALETTE.background,
  lang: 'ru',
  icons: [
    { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  ],
};
written.push(write('manifest.webmanifest', `${JSON.stringify(manifest, null, 2)}\n`));

console.log(`Создано файлов: ${written.length}`);
