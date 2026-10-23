'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { usePathname, useRouter } from '@/i18n/navigation';
import { easeOutExpo } from '@/lib/animations';

/**
 * Плавная смена контента при навигации.
 *
 * В браузерах с View Transitions API используется нативный переход,
 * в остальных — Framer Motion fallback. Первый рендер (жёсткая загрузка)
 * не анимируется, чтобы не показывать пустой экран до гидратации.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [nativeSupported, setNativeSupported] = useState(false);
  const pendingNavigation = useRef<(() => void) | null>(null);

  useEffect(() => {
    setMounted(true);
    setNativeSupported(
      typeof document !== 'undefined' && typeof document.startViewTransition === 'function',
    );
  }, []);

  useEffect(() => {
    pendingNavigation.current?.();
    pendingNavigation.current = null;
  }, [pathname]);

  const nativeActive = mounted && nativeSupported && !reduce;

  useEffect(() => {
    if (!nativeActive) return;

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return;
      }

      const locale = window.location.pathname.split('/')[1];
      let nextPath = url.pathname;
      if (locale && nextPath.startsWith(`/${locale}`)) {
        nextPath = nextPath.slice(locale.length + 1) || '/';
      }

      const nextHref = `${nextPath}${url.search}${url.hash}`;

      event.preventDefault();
      document.startViewTransition(() => {
        router.push(nextHref);
        return new Promise<void>((resolve) => {
          const timeout = window.setTimeout(resolve, 1200);
          pendingNavigation.current = () => {
            window.clearTimeout(timeout);
            resolve();
          };
        });
      });
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [nativeActive, router]);

  const animateEntry = mounted && !nativeActive;
  const hidden = reduce ? { opacity: 0 } : { opacity: 0, y: 14 };

  return (
    <motion.div
      key={pathname}
      initial={animateEntry ? hidden : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0.2 : 0.36,
        ease: easeOutExpo,
      }}
      style={{ willChange: animateEntry ? 'opacity, transform' : undefined }}
    >
      {children}
    </motion.div>
  );
}
