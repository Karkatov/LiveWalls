'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Появление при скролле.
 *
 * Если пользователь просил уменьшить анимацию — элемент просто проявляется
 * без смещения (никакого параллакса и масштаба).
 */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px 0px -60px 0px' }}
      transition={{
        duration: reduce ? 0.01 : 0.65,
        delay: reduce ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Контейнер с поочерёдным появлением детей.
 */
export function StaggerGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Ребёнок staggered-контейнера.
 */
export function StaggerItem({
  children,
  className,
  y = 22,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: reduce ? 0.01 : 0.55, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Лёгкий «дрейф» — для декоративных элементов фона.
 */
export function Float({
  children,
  className,
  amplitude = 12,
  duration = 8,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      animate={{ y: [-amplitude, amplitude, -amplitude] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  );
}
