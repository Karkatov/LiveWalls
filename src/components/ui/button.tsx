import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

/**
 * Кнопка.
 *
 * Варианты: primary/gradient (главная CTA), default, secondary, outline, ghost, destructive, link.
 * Тактильность обеспечивает active:scale + transition — без JS-анимаций,
 * чтобы не тянуть Framer Motion в каждую кнопку. Ховер основной кнопки —
 * «свечение-ореол» (как в референсе Daylight), а не смена цвета.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[box-shadow,opacity,background-color,color,border-color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  {
    variants: {
      variant: {
        gradient:
          'bg-[linear-gradient(135deg,#6366F1,#8B5CF6)] text-white shadow-[0_10px_40px_-10px_rgba(99,102,241,0.6)] hover:shadow-[0_12px_50px_-10px_rgba(99,102,241,0.7)] hover:brightness-110',
        primary:
          'bg-[linear-gradient(135deg,#6366F1,#8B5CF6)] text-white shadow-[0_10px_40px_-10px_rgba(99,102,241,0.6)] hover:shadow-[0_12px_50px_-10px_rgba(99,102,241,0.7)]',
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_0_0_var(--brand-glow)] hover:shadow-[0_0_20px_0_var(--brand-glow)]',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/60 hover:shadow-[0_0_18px_-2px_var(--brand-glow)]',
        outline:
          'border border-border bg-transparent text-foreground hover:bg-secondary/60 hover:border-brand/50',
        ghost: 'text-foreground hover:bg-secondary/70',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        link: 'text-foreground underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-4 text-[13px]',
        default: 'h-11 px-6',
        lg: 'h-13 px-8 text-base',
        icon: 'size-10',
        'icon-sm': 'size-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Рендерить как ссылку/другой элемент (Radix Slot). */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...(asChild ? {} : { type: type ?? 'button' })}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };
