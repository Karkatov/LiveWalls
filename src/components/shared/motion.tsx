'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';
import { useRef } from 'react';
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

/**
 * Заголовок, «выезжающий» снизу из-под маски.
 *
 * Текст оборачивается в overflow-hidden-обёртку, а сам текст анимируется
 * от `translateY(110%)` к нулю при попадании в кадр. Одна из типовых
 * анимаций крупных заголовков в референсе.
 */
export function MaskReveal({
  children,
  className,
  wrapperClassName,
  delay = 0,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  wrapperClassName?: string;
  delay?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <span className={cn('inline-block overflow-hidden align-bottom', wrapperClassName)}>
      <motion.span
        className={cn('inline-block', className)}
        initial={reduce ? { opacity: 0 } : { y: '110%' }}
        whileInView={reduce ? { opacity: 1 } : { y: '0%' }}
        viewport={{ once, amount: 0.4 }}
        transition={{
          duration: reduce ? 0.01 : 0.75,
          delay: reduce ? 0 : delay,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Заголовок с поочерёдным появлением слов и лёгким 3D-переворотом.
 *
 * Разбивает строку на слова (по пробелам) и анимирует каждое с нарастающей
 * задержкой. Уважает `prefers-reduced-motion` (тогда — простой fade).
 * По возможности сохраняет переносы строк (`\n` в тексте).
 */
export function LetterReveal({
  text,
  className,
  as: Tag = 'span',
  delay = 0,
  stagger = 0.045,
}: {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span';
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const lines = text.split('\n');
  let wordIndex = 0;

  const MotionTag = motion[Tag] as typeof motion.span;

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <MotionTag
      className={cn(className)}
      style={{ perspective: 900 }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      aria-label={text}
    >
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(' ').map((word) => {
            const i = wordIndex++;
            return (
              <motion.span
                key={`${word}-${i}`}
                className="inline-block will-change-transform"
                style={{ transformStyle: 'preserve-3d' }}
                variants={{
                  hidden: { opacity: 0, y: '0.4em', rotateX: -55 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
                  },
                }}
              >
                {word}
                {'\u00A0'}
              </motion.span>
            );
          })}
        </span>
      ))}
    </MotionTag>
  );
}

/**
 * Параллакс-слой: элемент смещается при прокрутке родителя на `distance` пикселей.
 */
export function ParallaxLayer({
  children,
  className,
  distance = 60,
  axis = 'y',
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  axis?: 'x' | 'y';
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const value = useTransform(scrollYProgress, [0, 0.5, 1], [distance, 0, -distance]);

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={axis === 'y' ? { y: value } : { x: value }}>
      {children}
    </motion.div>
  );
}

/**
 * Бегущая строка: контент дублируется и бесконечно прокручивается,
 * края растворяются маской. При `prefers-reduced-motion` статика.
 */
export function Marquee({
  children,
  className,
  duration = 40,
  pauseOnHover = true,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  pauseOnHover?: boolean;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={cn('marquee-mask overflow-hidden', className)}>{children}</div>;
  }

  return (
    <div className={cn('marquee-mask group overflow-hidden', className)}>
      <div
        className="animate-marquee flex w-max items-center"
        style={{
          animationDuration: `${duration}s`,
          animationPlayState: 'running',
        }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
      {pauseOnHover ? (
        <style>{`.group:hover > div { animation-play-state: paused; }`}</style>
      ) : null}
    </div>
  );
}
