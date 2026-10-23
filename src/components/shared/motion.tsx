'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur';

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Появление при прокрутке.
 *
 * `animateOnMount` включается только там, где нужен осознанный intro
 * (например, hero главной). В остальных случаях контент, который уже
 * находится в кадре при монтировании, показывается сразу — без «догоняющей»
 * анимации после того, как пользователь его увидел.
 */
function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  once = true,
  animateOnMount = false,
) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  const [instant, setInstant] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    let observer: IntersectionObserver | null = null;
    let frame = 0;
    let done = false;

    const setShown = (next: boolean) => {
      setVisible((current) => (current === next ? current : next));
    };

    const cleanup = () => {
      observer?.disconnect();
      observer = null;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const show = (skipAnimation = false) => {
      if (done) return;
      if (once) done = true;
      if (skipAnimation) setInstant(true);
      setShown(true);
      if (once) cleanup();
    };

    const check = () => {
      if (!node.isConnected || done) return;

      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight || document.documentElement.clientHeight;

      if (rect.bottom <= 0) {
        show();
        return;
      }

      if (rect.top < viewport * 0.92 && rect.bottom > 0) {
        show();
        return;
      }

      if (!once) setShown(false);
    };

    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        check();
      });
    }

    // Синхронно (до первой отрисовки) решаем, нужно ли анимировать элемент.
    // Так уже видимый контент не успевает мелькнуть финальным состоянием.
    const rect = node.getBoundingClientRect();
    const viewport = window.innerHeight || document.documentElement.clientHeight;
    const above = rect.bottom <= 0;
    const inView = rect.top < viewport * 0.92 && rect.bottom > 0;

    if (above || inView) {
      show(!animateOnMount);
      if (once) return cleanup;
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show();
          } else if (!once) {
            setInstant(false);
            setShown(false);
          }
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(node);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return cleanup;
  }, [once, animateOnMount]);

  return { ref, visible, instant };
}

const StaggerInstantContext = createContext(false);

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
  animateOnMount = false,
}: {
  children: ReactNode;
  delay?: number;
  /** Устаревший алиас дистанции: оставлен для совместимости. */
  y?: number;
  direction?: RevealDirection;
  className?: string;
  once?: boolean;
  /** Анимировать контент, который уже виден при монтировании (intro главной). */
  animateOnMount?: boolean;
}) {
  const reduce = useReducedMotion();
  const offset = revealOffset(direction, y);
  const { ref, visible, instant } = useScrollReveal<HTMLDivElement>(once, animateOnMount);
  const hidden = reduce ? { opacity: 0 } : { opacity: 0, ...offset };
  const shown = reduce ? { opacity: 1 } : { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' };
  const still = reduce || instant;

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={hidden}
      animate={visible ? shown : hidden}
      transition={{
        duration: reduce ? 0.01 : instant ? 0 : direction === 'blur' ? 0.8 : 0.68,
        delay: still ? 0 : delay,
        ease: REVEAL_EASE,
        filter: { duration: reduce ? 0.01 : instant ? 0 : 0.55 },
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
  animateOnMount = false,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  /** Анимировать контент, который уже виден при монтировании (intro главной). */
  animateOnMount?: boolean;
}) {
  const reduce = useReducedMotion();
  const { ref, visible, instant } = useScrollReveal<HTMLDivElement>(true, animateOnMount);
  const still = reduce || instant;

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: still ? 0 : stagger, delayChildren: still ? 0 : delay },
        },
      }}
    >
      <StaggerInstantContext.Provider value={instant}>{children}</StaggerInstantContext.Provider>
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
  const instant = useContext(StaggerInstantContext);
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
          transition: { duration: reduce ? 0.01 : instant ? 0 : 0.58, ease: REVEAL_EASE },
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
  animateOnMount = false,
}: {
  children: ReactNode;
  className?: string;
  wrapperClassName?: string;
  delay?: number;
  once?: boolean;
  /** Анимировать контент, который уже виден при монтировании. */
  animateOnMount?: boolean;
}) {
  const reduce = useReducedMotion();
  const { ref, visible, instant } = useScrollReveal<HTMLSpanElement>(once, animateOnMount);

  return (
    <span ref={ref} className={cn('inline-block overflow-hidden align-bottom', wrapperClassName)}>
      <motion.span
        className={cn('inline-block', className)}
        initial={reduce ? { opacity: 0 } : { y: '110%' }}
        animate={
          visible
            ? reduce
              ? { opacity: 1 }
              : { y: '0%' }
            : reduce
              ? { opacity: 0 }
              : { y: '110%' }
        }
        transition={{
          duration: reduce ? 0.01 : instant ? 0 : 0.75,
          delay: reduce || instant ? 0 : delay,
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
  animateOnMount = true,
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
  /** Анимировать контент, который уже виден при монтировании (intro главной). */
  animateOnMount?: boolean;
}) {
  const reduce = useReducedMotion();
  const { ref, visible, instant } = useScrollReveal<HTMLSpanElement>(true, animateOnMount);

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
      ref={ref}
      className={cn(className)}
      style={{ perspective: 900 }}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: instant ? 0 : stagger,
            delayChildren: instant ? 0 : delay,
          },
        },
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
                    transition: { duration: instant ? 0 : 0.6, ease: [0.23, 1, 0.32, 1] },
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
