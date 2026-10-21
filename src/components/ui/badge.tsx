import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

/**
 * Метка.
 *
 * `mono` — технические данные (разрешение, длительность, номер кадра),
 * `signal` — акцент, `live` — «живое» видео, `neutral` — обычная.
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium leading-none transition-colors',
  {
    variants: {
      variant: {
        neutral: 'border-border bg-secondary/70 text-foreground',
        signal: 'border-signal-line bg-signal-soft text-signal-foreground',
        live: 'border-live/40 bg-live-soft text-live',
        outline: 'border-border bg-transparent text-muted-foreground',
        premium: 'border-border bg-paper/90 text-ink-900',
        success: 'border-[rgba(52,211,153,0.35)] bg-[rgba(52,211,153,0.12)] text-[#34d399]',
        warning: 'border-signal-line bg-signal-soft text-signal-foreground',
        danger: 'border-[rgba(224,82,63,0.35)] bg-live-soft text-[#e0523f]',
      },
      mono: {
        true: 'font-mono tracking-[0.14em] uppercase',
        false: '',
      },
    },
    defaultVariants: { variant: 'neutral', mono: false },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, mono, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, mono }), className)} {...props} />;
}

export { badgeVariants };
