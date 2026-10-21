import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

/**
 * Кнопка.
 *
 * Варианты:
 *  - `signal` — янтарный акцент (главный призыв);
 *  - `solid`  — бумажный (второй по важности);
 *  - `outline`— контур;
 *  - `ghost`  — без фона;
 *  - `link`   — текстовая ссылка.
 *
 * Тактильность: блик при наведении, сжатие при нажатии, кольцо фокуса.
 * Всё на CSS — без Framer Motion в каждой кнопке.
 */
const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center gap-2 whitespace-nowrap overflow-hidden',
    'font-medium transition-[color,background-color,border-color,transform,box-shadow] duration-200',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    'active:scale-[0.985]',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  ],
  {
    variants: {
      variant: {
        signal:
          'bg-signal text-ink-900 font-semibold rounded-md hover:bg-signal/90 shadow-[0_10px_30px_-16px_var(--signal)]',
        solid:
          'bg-paper text-ink-900 rounded-md hover:bg-paper/90 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.9)]',
        outline:
          'border border-border text-foreground rounded-md hover:border-[color:var(--hairline-strong)] hover:bg-secondary/60',
        ghost: 'text-foreground rounded-md hover:bg-secondary/70',
        danger: 'bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90',
        link: 'text-foreground underline-offset-4 hover:text-signal-foreground hover:underline',
      },
      size: {
        sm: 'h-9 px-3.5 text-[13px]',
        default: 'h-11 px-5',
        lg: 'h-12 px-7 text-base',
        icon: 'size-10',
        'icon-sm': 'size-8',
      },
    },
    defaultVariants: {
      variant: 'solid',
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
