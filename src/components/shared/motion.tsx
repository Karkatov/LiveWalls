'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import { cn } from '@/lib/utils/cn';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur';

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

function revealOffset(direction: RevealDirection, distance: number) {
  switch (direction) {
    case 'down':
      return { y: -distance };
    case 'left':
      return { x: -distance };
    case 'right':
      return { x: distance };
    case 'scale':
      return { scale: 0.94 };
    case 'blur':
      return { y: distance * 0.5, filter: 'blur(12px)' };
    case 'up':
    default:
      return { y: distance };
  }
}

/**
 * Появление при скролле.
 *
 * Направление можно менять (`direction`), чтобы соседние блоки выезжали
 * с разных сторон и страница ощущалась живой. Если пользователь просил
 * уменьшить анимацию — элемент просто проявляется без смещения.
 */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  direction = 'up',
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  /** Устаревший алиас дистанции: оставлен для совместимости. */
  y?: number;
  direction?: RevealDirection;
  className?: string;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  const offset = revealOffset(direction, y);

  return (
    <motion.div
      className={cn(className)}
      initial={reduce ? { opacity: 0 } : { opacity: 0, ...offset }}
      whileInView={
        reduce ? { opacity: 1 } : { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }
      }
      viewport={{ once, margin: '-70px 0px -50px 0px' }}
      transition={{
        duration: reduce ? 0.01 : direction === 'blur' ? 0.8 : 0.68,
        delay: reduce ? 0 : delay,
        ease: REVEAL_EASE,
        filter: { duration: reduce ? 0.01 : 0.55 },
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
  direction = 'up',
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  direction?: RevealDirection;
}) {
  const reduce = useReducedMotion();
  const offset = revealOffset(direction, y);

  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, ...offset },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          ...(direction === 'blur' ? { filter: 'blur(0px)' } : {}),
          transition: { duration: reduce ? 0.01 : 0.58, ease: REVEAL_EASE },
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
  wordClassName,
  accentFromIndex,
  as: Tag = 'span',
  delay = 0,
  stagger = 0.045,
}: {
  text: string;
  className?: string;
  /**
   * Классы для слов. Нужны для градиентного текста: `background-clip: text`
   * не заливает потомков с прозрачным цветом, поэтому градиент применяется
   * к самому элементу со словами.
   */
  wordClassName?: string;
  /**
   * Индекс слова, с которого применяется `wordClassName` (акцент в конце
   * заголовка). Число вместо функции — компонент можно вызывать из
   * серверных компонентов (RSC не пропускает функции через границу).
   */
  accentFromIndex?: number;
  as?: 'h1' | 'h2' | 'h3' | 'span';
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();

  const lines = text.split('\n');
  let wordIndex = 0;

  const MotionTag = motion[Tag] as typeof motion.span;

  const resolveWordClass = (index: number) =>
    accentFromIndex !== undefined && index >= accentFromIndex ? wordClassName : undefined;

  if (reduce) {
    return (
      <Tag className={cn(className)}>
        {lines.map((line, li) => (
          <span key={li} className="block">
            {line.split(' ').map((word) => {
              const i = wordIndex++;
              return (
                <span key={`${word}-${i}`} className={cn('inline-block', resolveWordClass(i))}>
                  {word}
                  {'\u00A0'}
                </span>
              );
            })}
          </span>
        ))}
      </Tag>
    );
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
                className={cn('inline-block will-change-transform', resolveWordClass(i))}
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
