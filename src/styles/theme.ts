/**
 * Дизайн-токены LiveWalls.
 *
 * Дублируют значения из `globals.css` (@theme) — нужны там, где CSS-переменные
 * недоступны: Framer Motion, генераторы SVG, генерация OG-изображений.
 *
 * Тёмная тема — основная. Светлая — аккуратная вторичная.
 */
export const palette = {
  /* ── Нейтральная шкала (тёмная) ── */
  background: '#07080A',
  backgroundElevated: '#0C0D10',
  surface: 'rgba(244,242,237,0.035)',
  surfaceStrong: 'rgba(244,242,237,0.06)',
  surfaceGlass: 'rgba(12,13,16,0.72)',

  /* ── Границы и разделители ── */
  border: 'rgba(244,242,237,0.10)',
  borderStrong: 'rgba(244,242,237,0.20)',

  /* ── Бумага (текст) ── */
  foreground: '#F4F2ED',
  foregroundSecondary: 'rgba(244,242,237,0.64)',
  foregroundMuted: 'rgba(244,242,237,0.38)',

  /* ── Акцент: свет проектора ── */
  signal: '#E7B24B',
  signalSoft: 'rgba(231,178,75,0.14)',
  signalGlow: 'rgba(231,178,75,0.32)',
  signalGlowStrong: 'rgba(231,178,75,0.5)',

  /* ── Редкий второй акцент ── */
  live: '#E0523F',

  /* ── Состояния ── */
  success: '#34D399',
  warning: '#FBBF24',
  destructive: '#E0523F',
} as const;

/** Акцентный градиент — для inline-стилей и SVG. */
export const signalGradient = `linear-gradient(135deg, #F2CD80 0%, ${palette.signal} 55%, #CF922C 100%)`;
/** @deprecated Старое имя — замена {@link signalGradient}. */
export const brandGradient = signalGradient;

/** Скругления (px). */
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

/** Тени и свечения. */
export const shadows = {
  card: '0 1px 0 0 rgba(244,242,237,0.05) inset, 0 24px 60px -30px rgba(0,0,0,0.9)',
  cardHover: '0 1px 0 0 rgba(244,242,237,0.07) inset, 0 32px 80px -34px rgba(0,0,0,0.95)',
  glow: `0 0 0 1px ${palette.signalSoft}, 0 18px 50px -22px ${palette.signalGlow}`,
  glowStrong: `0 0 0 1px rgba(231,178,75,0.4), 0 26px 70px -24px ${palette.signalGlowStrong}`,
} as const;

/** Breakpoint’ы (px) — синхронизированы с Tailwind. */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/** Размеры контейнера. */
export const layout = {
  container: '1200px',
  containerWide: '1440px',
  headerHeight: 72,
} as const;

/** Типографика. */
export const typography = {
  display: {
    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
    lineHeight: 1.05,
    letterSpacing: '-0.03em',
    fontWeight: 800,
  },
  title: {
    fontSize: 'clamp(1.875rem, 3.6vw, 3rem)',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    fontWeight: 750,
  },
  sectionTitle: {
    fontSize: 'clamp(1.5rem, 2.6vw, 2.25rem)',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    fontWeight: 700,
  },
  body: {
    fontSize: '1rem',
    lineHeight: 1.65,
  },
} as const;

/** Фиксированный набор градиентных подложек для плейсхолдеров. */
export const placeholderGradients: ReadonlyArray<readonly [string, string, string]> = [
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

/**
 * Детерминированный выбор градиента по строке-ключу.
 * Один и тот же id всегда даёт один и тот же градиент — без Math.random(),
 * чтобы не было расхождений между сервером и клиентом (гидрация).
 */
export function gradientForKey(key: string): readonly [string, string, string] {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % placeholderGradients.length;
  return placeholderGradients[index] as readonly [string, string, string];
}
