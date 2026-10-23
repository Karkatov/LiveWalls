'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { usePathname } from '@/i18n/navigation';
import type { ReactNode } from 'react';

/**
 * Переход между страницами.
 *
 * Ключ — путь: при смене маршрута содержимое плавно переезжает.
 * При prefers-reduced-motion переход отключается.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
