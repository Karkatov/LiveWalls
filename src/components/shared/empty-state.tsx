import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * Пустое состояние — заглушка, когда фильтры ничего не нашли.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'border-border/80 bg-card/40 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed px-6 py-16 text-center',
        className,
      )}
    >
      {Icon ? (
        <span className="bg-gradient-brand/12 text-brand-foreground flex size-14 items-center justify-center rounded-2xl">
          <Icon className="size-6" aria-hidden="true" />
        </span>
      ) : null}
      <div className="space-y-1.5">
        <p className="text-foreground text-lg font-semibold">{title}</p>
        {description ? (
          <p className="text-muted-foreground mx-auto max-w-md text-sm leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
