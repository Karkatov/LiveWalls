import localFont from 'next/font/local';

/**
 * Локальные шрифты LiveWalls.
 *
 * Почему не `next/font/google`: Google Fonts тянутся во время сборки, и падение
 * внешней сети = падение деплоя на Cloudflare Pages. Здесь файлы лежат в
 * репозитории (`src/fonts/*.woff2`), поэтому сборка полностью автономна.
 *
 * Каждая гарнитура разделена на два подмножества — `latin` и `cyrillic`.
 * `next/font/local` не умеет `unicode-range`, поэтому подмножества подключены
 * отдельными семействами и складываются в стек: браузер берёт латиницу из
 * первого семейства, а кириллицу (которой в latin-файле нет) — из второго.
 */

/* ── Playfair Display — дисплейный шрифт (заголовки) ── */

const displayLatin = localFont({
  src: [{ path: '../fonts/PlayfairDisplay-latin.woff2', weight: '400 900', style: 'normal' }],
  variable: '--font-display-latin',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  adjustFontFallback: 'Times New Roman',
});

const displayCyrillic = localFont({
  src: [{ path: '../fonts/PlayfairDisplay-cyrillic.woff2', weight: '400 900', style: 'normal' }],
  variable: '--font-display-cyr',
  display: 'swap',
  preload: false,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  adjustFontFallback: 'Times New Roman',
});

/* ── Manrope — текстовый и интерфейсный шрифт ── */

const sansLatin = localFont({
  src: [{ path: '../fonts/Manrope-latin.woff2', weight: '200 800', style: 'normal' }],
  variable: '--font-sans-latin',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

const sansCyrillic = localFont({
  src: [{ path: '../fonts/Manrope-cyrillic.woff2', weight: '200 800', style: 'normal' }],
  variable: '--font-sans-cyr',
  display: 'swap',
  preload: false,
  fallback: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

/* ── JetBrains Mono — метаданные, таймкод, технические метки ── */

const monoLatin = localFont({
  src: [{ path: '../fonts/JetBrainsMono-latin.woff2', weight: '100 800', style: 'normal' }],
  variable: '--font-mono-latin',
  display: 'swap',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
  adjustFontFallback: 'Arial',
});

const monoCyrillic = localFont({
  src: [{ path: '../fonts/JetBrainsMono-cyrillic.woff2', weight: '100 800', style: 'normal' }],
  variable: '--font-mono-cyr',
  display: 'swap',
  preload: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
  adjustFontFallback: 'Arial',
});

/**
 * CSS-переменные, которые нужно навесить на корневой элемент.
 * Подключаются в `src/app/[locale]/layout.tsx`.
 */
export const fontVariables = [
  displayLatin.variable,
  displayCyrillic.variable,
  sansLatin.variable,
  sansCyrillic.variable,
  monoLatin.variable,
  monoCyrillic.variable,
].join(' ');

/** Имена семейств для JS-слоя (canvas, SVG, генераторы). */
export const fontStacks = {
  display: 'var(--font-display-latin), var(--font-display-cyr), Georgia, serif',
  sans: 'var(--font-sans-latin), var(--font-sans-cyr), ui-sans-serif, system-ui, sans-serif',
  mono: 'var(--font-mono-latin), var(--font-mono-cyr), ui-monospace, SFMono-Regular, monospace',
} as const;
