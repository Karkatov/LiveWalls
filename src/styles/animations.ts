import type { Transition, Variants } from 'framer-motion';

/**
 * Motion-язык LiveWalls (Kinetic Cinema).
 *
 * Единственный источник кривых, длительностей и вариантов для всего сайта.
 * Значения совпадают с CSS-токенами в `src/app/globals.css`
 * (`--ease-expo`, `--ease-soft`, `--ease-strict`), поэтому CSS-анимации
 * и Framer Motion ведут себя одинаково.
 */

/** Появление: резкий старт, длинное затухание. */
export const easeExpo: Transition['ease'] = [0.16, 1, 0.3, 1];

/** Смена состояния: мягкий разгон и торможение. */
export const easeSoft: Transition['ease'] = [0.32, 0.72, 0, 1];

/** Строгая кривая для мелких сдвигов. */
export const easeStrict: Transition['ease'] = [0.4, 0, 0.2, 1];

export const transitions = {
  /** 160 мс — hover, фокус, мелкие состояния */
  fast: { duration: 0.16, ease: easeExpo },
  /** 280 мс — появление панелей, смена вкладок */
  base: { duration: 0.28, ease: easeSoft },
  /** 720 мс — появление при скролле */
  reveal: { duration: 0.72, ease: easeExpo },
  /** 900 мс — кадр обоев на hover */
  frame: { duration: 0.9, ease: easeExpo },
  /** Пружина для тактильных элементов */
  spring: { type: 'spring', stiffness: 140, damping: 22, mass: 0.9 },
  springSoft: { type: 'spring', stiffness: 90, damping: 20, mass: 1 },
} as const;

/** Появление снизу вверх. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: transitions.reveal },
};

/** Появление с лёгким масштабированием. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.base },
};

/**
 * Появление из-под маски: элемент «выезжает» из-под обрезки,
 * как кадр, поднимающийся в монтажной склейке.
 */
export const maskReveal: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: transitions.reveal },
};

/** Кадр: лёгкое увеличение изображения при наведении. */
export const frameHover: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.045, transition: transitions.frame },
};

/** Варианты для режима «уменьшить движение». */
export const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

/** Каскад появления дочерних элементов. */
export const staggerContainer = (stagger = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

/** Появление ребёнка каскада. */
export const staggerChild = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: transitions.reveal },
} satisfies Variants;
