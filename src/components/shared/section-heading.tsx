import { cn } from '@/lib/utils/cn';
import { MaskReveal, Reveal } from './motion';

/**
 * Заголовок секции: надзаголовок, заголовок, описание.
 *
 * Заголовок «выезжает» снизу из-под маски, как крупные заголовки в референсе.
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

      <h2 className="text-foreground text-display-md max-w-3xl">
        <MaskReveal>{title}</MaskReveal>
      </h2>

      {description ? (
        <p className="text-muted-foreground text-lead max-w-2xl">{description}</p>
      ) : null}

      {action ? <div className="mt-2">{action}</div> : null}
    </Reveal>
  );
}
