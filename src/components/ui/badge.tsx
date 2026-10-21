import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

/** Бейдж — небольшая метка. */
const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-border/70 bg-secondary/60 text-foreground',
        brand: 'border-brand/30 bg-brand/12 text-brand-foreground',
        outline: 'border-border/80 bg-transparent text-muted-foreground',
        success: 'border-emerald-400/30 bg-emerald-400/12 text-emerald-300',
        warning: 'border-amber/30 bg-amber/12 text-amber',
        danger: 'border-destructive/30 bg-destructive/12 text-destructive',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
