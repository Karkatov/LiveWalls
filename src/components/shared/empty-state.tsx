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
        'border-border bg-card flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-6 py-16 text-center',
        className,
      )}
    >
      {Icon ? (
        <span className="border-signal-line bg-signal-soft text-signal-foreground flex size-14 items-center justify-center rounded-lg border border-dashed">
          <Icon className="size-6" aria-hidden="true" />
        </span>
      ) : null}
      <div className="space-y-1.5">
        <p className="font-display text-foreground text-xl">{title}</p>
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
