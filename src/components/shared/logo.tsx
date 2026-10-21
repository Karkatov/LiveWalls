import { useId } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Логотип LiveWalls.
 *
 * Два варианта: полный (монограмма + текст) и компактный (только монограмма).
 * Монограмма «LW» с градиентом и иконкой play.
 */
export function Logo({
  variant = 'full',
  className,
  showText = true,
}: {
  variant?: 'full' | 'compact';
  className?: string;
  showText?: boolean;
}) {
  const isCompact = variant === 'compact' || !showText;
  // Логотип рендерится дважды (шапка + футер) — id градиента должен быть уникальным.
  const gradientId = `lw-grad-${useId().replace(/:/g, '')}`;

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="bg-gradient-signal relative inline-flex size-9 items-center justify-center overflow-hidden rounded-xl shadow-[0_8px_24px_-10px_var(--signal-glow)]">
        <svg viewBox="0 0 32 32" className="size-6" aria-hidden="true">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.72" />
            </linearGradient>
          </defs>
          <path
            d="M7 8v12.5A3.5 3.5 0 0 0 10.5 24H13"
            stroke={`url(#${gradientId})`}
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M20 8v16"
            stroke={`url(#${gradientId})`}
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M20 8l7 8-7 8z" fill={`url(#${gradientId})`} />
        </svg>
        <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/25 ring-inset" />
      </span>
      {!isCompact && (
        <span className="font-display text-foreground text-lg tracking-tight">LiveWalls</span>
      )}
    </span>
  );
}
