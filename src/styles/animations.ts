import type { Transition, Variants } from 'framer-motion';

/**
 * Общие варианты анимаций Framer Motion.
 *
 * Все анимации построены на двух кривых:
 *  - smooth — плавное появление, скролл-эффекты;
 *  - snappy — тактильные микровзаимодействия (кнопки, карточки).
 *
 * Уважение prefers-reduced-motion: компоненты берут `useReducedMotion()`
 * и переключаются на `reducedVariants` (см. src/lib/hooks/use-reduced-motion.ts).
 */

/** Плавная кривая — для появления и скролла. */
export const easeSmooth: Transition['ease'] = [0.22, 1, 0.36, 1];

/** Пружинистая кривая — для нажатий и смены состояний. */
export const easeSnappy: Transition['ease'] = [0.34, 1.56, 0.64, 1];

/** Строгая кривая — для мелких сдвигов. */
export const easeStrict: Transition['ease'] = [0.4, 0, 0.2, 1];

export const transitions = {
  fast: { duration: 0.2, ease: easeSnappy } satisfies Transition,
  base: { duration: 0.4, ease: easeSmooth } satisfies Transition,
  slow: { duration: 0.7, ease: easeSmooth } satisfies Transition,
  spring: { type: 'spring', stiffness: 380, damping: 32, mass: 0.8 } satisfies Transition,
  springSoft: { type: 'spring', stiffness: 180, damping: 26, mass: 1 } satisfies Transition,
} as const;

/** Появление снизу вверх. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: transitions.base },
};

/** Появление с лёгким масштабированием. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.base },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: transitions.spring },
};

/** Появление слева. */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: transitions.base },
};

/** Появление справа. */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: transitions.base },
};

/** Контейнер, дети которого появляются по очереди (stagger). */
export const staggerContainer = (stagger = 0.07, delayChildren = 0.05): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

/** Ребёнок staggered-контейнера. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: transitions.base },
};

/** Параллакс для hero-блока. */
export const parallax = (distance = 60): Variants => ({
  hidden: { opacity: 0, y: distance, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...transitions.slow },
  },
});

/** Переход между страницами. */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: transitions.base },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: easeStrict } },
};

/** Наведение на карточку: подъём + свечение. */
export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: { y: -6, scale: 1.015, transition: transitions.spring },
  tap: { scale: 0.985, transition: transitions.fast },
} satisfies Record<string, unknown>;

/** Варианты для режима «уменьшенная анимация». */
export const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
  exit: { opacity: 0, transition: { duration: 0.01 } },
};

export const reducedStaggerItem: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
};
