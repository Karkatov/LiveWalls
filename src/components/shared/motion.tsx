'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { easeExpo, easeSoft, staggerContainer, transitions } from '@/styles/animations';

/**
 * Motion-примитивы LiveWalls.
 *
 * Единая точка входа для появлений: все компоненты используют эти
 * примитивы, а не собственные числа в transition — иначе язык анимаций
 * расползается по файлам (так было до редизайна).
 */

/** Есть ли у пользователя запрос на уменьшенное движение. */
export function useMotionPref(): boolean {
  return useReducedMotion() ?? false;
}

/**
 * Появление при скролле.
 *
 * Если пользователь просил уменьшить анимацию — элемент просто проявляется
 * без смещения.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  once = true,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
  as?: 'div' | 'section' | 'li' | 'article' | 'header';
}) {
  const reduce = useMotionPref();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn(className)}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px 0px -60px 0px' }}
      transition={{
        duration: reduce ? 0.2 : 0.72,
        delay: reduce ? 0 : delay,
        ease: easeExpo,
      }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Появление из-под маски — «шторка», как в монтажной склейке.
 * Родитель должен иметь `overflow-hidden`.
 */
export function MaskReveal({
  children,
  delay = 0,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  const reduce = useMotionPref();

  return (
    <motion.div
      className={cn(className)}
      initial={reduce ? { opacity: 0 } : { y: '110%' }}
      whileInView={reduce ? { opacity: 1 } : { y: '0%' }}
      viewport={{ once, margin: '-60px 0px -40px 0px' }}
      transition={{
        duration: reduce ? 0.2 : 0.78,
        delay: reduce ? 0 : delay,
        ease: easeExpo,
      }}
    >
      {children}
    </motion.div>
  );
}

/** Контейнер с поочерёдным появлением детей. */
export function StaggerGroup({
  children,
  className,
  stagger = 0.07,
  delay = 0,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: 'div' | 'ul' | 'section';
}) {
  const reduce = useMotionPref();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={staggerContainer(reduce ? 0 : stagger, reduce ? 0 : delay)}
    >
      {children}
    </MotionTag>
  );
}

/** Ребёнок staggered-контейнера. */
export function StaggerItem({
  children,
  className,
  y = 20,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: 'div' | 'li' | 'article';
}) {
  const reduce = useMotionPref();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn(className)}
      variants={
        reduce
          ? {
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.2 } },
            }
          : {
              hidden: { opacity: 0, y },
              visible: { opacity: 1, y: 0, transition: transitions.reveal },
            }
      }
    >
      {children}
    </MotionTag>
  );
}

/**
 * Мягкий параллакс: элемент смещается медленнее прокрутки.
 * Отключается при `prefers-reduced-motion`.
 */
export function Parallax({
  children,
  className,
  distance = 40,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const reduce = useMotionPref();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={cn(className)}
      initial={{ y: distance }}
      whileInView={{ y: -distance }}
      viewport={{ once: false, margin: '-20% 0px -20% 0px' }}
      transition={{ duration: 1.2, ease: easeSoft }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Появление по таймеру (первый экран) — в отличие от Reveal, ждёт не скролл,
 * а задержку: так появляются слои hero.
 */
export function Enter({
  children,
  delay = 0,
  className,
  y = 20,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const reduce = useMotionPref();

  return (
    <motion.div
      className={cn(className)}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0.2 : 0.78,
        delay: reduce ? 0 : delay,
        ease: easeExpo,
      }}
    >
      {children}
    </motion.div>
  );
}
