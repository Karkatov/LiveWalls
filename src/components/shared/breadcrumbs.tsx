import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils/cn';

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Хлебные крошки.
 * Последний элемент — текущая страница (не ссылка).
 */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Хлебные крошки" className={cn('text-muted-foreground text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground focus-visible:outline-ring rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(isLast && 'text-foreground')}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="size-3.5 opacity-50" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
