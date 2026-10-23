import type { Transition, Variants } from 'framer-motion';
import { fadeUp, staggerContainer, transitions } from '@/styles/animations';

export {
  easeOutQuint,
  easeSmooth,
  easeSnappy,
  easeStrict,
  transitions,
  revealViewport,
  revealViewportMargin,
  maskReveal,
  letterReveal,
  fadeUp,
  fadeIn,
  scaleIn,
  slideInLeft,
  slideInRight,
  staggerContainer,
  staggerItem,
  parallax,
  pageTransition,
  cardHover,
  reducedVariants,
  reducedStaggerItem,
} from '@/styles/animations';

/** Кривая easeOutExpo для переходов между страницами. */
export const easeOutExpo: Transition['ease'] = [0.16, 1, 0.3, 1];

/** Появление снизу вверх (совместимый алиас). */
export const fadeInUp: Variants = fadeUp;

/** Контейнер для последовательного появления карточек. */
export const cardsStagger: Variants = staggerContainer(0.05, 0.04);

/** Микровзаимодействие карточки: подъём при наведении и нажатие. */
export const hoverScale = {
  rest: { y: 0, scale: 1, transition: transitions.springSoft },
  hover: { y: -3, scale: 1.015, transition: transitions.spring },
  tap: { y: 0, scale: 0.985, transition: transitions.fast },
} as const;

export type { Transition, Variants };
