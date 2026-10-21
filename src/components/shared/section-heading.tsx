import { cn } from '@/lib/utils/cn';
import { Reveal } from './motion';

/**
 * Заголовок секции: надзаголовок, заголовок, описание.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <Reveal
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow ? (
        <span className="border-brand/25 bg-brand/10 text-brand-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-[0.14em] uppercase">
          {eyebrow}
        </span>
      ) : null}

      <h2 className="text-foreground max-w-3xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>

      {description ? (
        <p className="text-muted-foreground max-w-2xl text-base leading-relaxed text-pretty sm:text-lg">
          {description}
        </p>
      ) : null}

      {action ? <div className="mt-2">{action}</div> : null}
    </Reveal>
  );
}
