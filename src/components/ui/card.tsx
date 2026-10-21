import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

/**
 * Поверхность — базовый контейнер интерфейса.
 *
 * Варианты:
 *  - `panel` — матовая панель с волосяной линией (бывшие «стеклянные» карточки);
 *  - `frame` — кадр 16:9 с обрезкой и тенью;
 *  - `row`   — плоская строка с разделителем;
 *  - `quiet` — без границы, только фон.
 *
 * Раньше по проекту лежало ~37 ручных копий карточки с четырьмя вариантами
 * прозрачности и четырьмя радиусами — теперь всё это в одном месте.
 */
const cardVariants = cva('relative', {
  variants: {
    variant: {
      panel:
        'border-border bg-card rounded-xl border transition-colors duration-300 hover:border-border',
      frame: 'bg-ink-700 rounded-lg border border-border overflow-hidden',
      row: 'bg-card rounded-lg border border-border',
      quiet: 'bg-card rounded-lg',
    },
  },
  defaultVariants: { variant: 'panel' },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />
  ),
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('font-display text-section', className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-muted-foreground text-sm leading-relaxed', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-3 p-6 pt-0', className)} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';

export { cardVariants };
