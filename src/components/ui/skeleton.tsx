import { cn } from '@/lib/utils/cn';

/** Скелетон загрузки. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('skeleton rounded-xl', className)} {...props} />;
}

/** Скелетон карточки обоев. */
export function WallpaperCardSkeleton() {
  return (
    <div className="border-border/60 bg-card overflow-hidden rounded-2xl border">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

/** Скелетон строки таблицы. */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="border-border/50 flex items-center gap-4 border-b px-4 py-3">
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} className="h-4 flex-1" />
      ))}
    </div>
  );
}
