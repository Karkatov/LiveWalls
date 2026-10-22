'use client';

import * as React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * Аккордеон на Framer Motion.
 *
 * Открытие/закрытие — пружинистая анимация высоты, текст внутри появляется
 * с небольшой задержкой, иконка «плюс» плавно поворачивается на 45°.
 *
 * При `prefers-reduced-motion` высота/прозрачность меняются мгновенно.
 */

type AccordionContextValue = {
  value: string | null;
  setValue: (v: string) => void;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error('Accordion components must be used within <Accordion>');
  return ctx;
}

export function Accordion({
  type = 'single',
  collapsible = true,
  defaultValue,
  className,
  children,
}: {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [value, setValue] = React.useState<string | null>(defaultValue ?? null);

  const handleSet = React.useCallback(
    (v: string) => {
      if (type === 'multiple') {
        setValue((prev) => (prev === v ? null : v));
        return;
      }
      setValue((prev) => (collapsible && prev === v ? null : v));
    },
    [type, collapsible],
  );

  return (
    <AccordionContext.Provider value={{ value, setValue: handleSet }}>
      <div className={cn('divide-border/40 divide-y', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-value={value} className={cn('group', className)}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ value: string }>, { value })
          : child,
      )}
    </div>
  );
}

export function AccordionTrigger({
  value: itemValue,
  className,
  children,
}: {
  value?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { value, setValue } = useAccordion();
  const reduce = useReducedMotion();
  const v = itemValue ?? '';
  const open = value === v;

  return (
    <button
      type="button"
      onClick={() => setValue(v)}
      aria-expanded={open}
      className={cn(
        'text-foreground flex w-full items-start justify-between gap-4 py-5 text-left text-base font-medium transition-colors duration-300',
        'hover:text-brand-foreground focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      )}
    >
      <span className="leading-snug">{children}</span>
      <motion.span
        animate={{ rotate: open ? 45 : 0 }}
        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 20 }}
        className="mt-0.5 shrink-0"
        aria-hidden="true"
      >
        <Plus className="text-muted-foreground group-hover:text-brand-foreground size-5 transition-colors duration-300" />
      </motion.span>
    </button>
  );
}

export function AccordionContent({
  value: itemValue,
  className,
  children,
}: {
  value?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { value } = useAccordion();
  const reduce = useReducedMotion();
  const v = itemValue ?? '';
  const open = value === v;

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={
            reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 28, mass: 0.8 }
          }
          className="overflow-hidden"
        >
          <motion.div
            initial={reduce ? { opacity: 0 } : { y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: reduce ? 0 : 0.05, duration: 0.25 }}
            className={cn(
              'text-muted-foreground pt-1 pr-8 pb-6 text-sm leading-relaxed',
              className,
            )}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
