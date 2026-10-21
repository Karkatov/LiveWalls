import { cn } from '@/lib/utils/cn';
import { MaskReveal, Reveal } from './motion';

/**
 * Заголовок секции.
 *
 * Редакционная разметка: номер секции и моно-eyebrow в левой колонке,
 * крупный заголовок дисплейным шрифтом в правой. Так заголовки читаются
 * как колонтитулы, а не как центрированные «шаблонные» блоки.
 */
export function SectionHeading({
  eyebrow,
  index,
  title,
  description,
  align = 'left',
  className,
  action,
}: {
  eyebrow?: string;
  /** Номер секции — выводится как `01`, `02`, … */
  index?: number;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  action?: React.ReactNode;
}) {
  const centered = align === 'center';

  return (
    <Reveal
      className={cn(
        'flex flex-col gap-5',
        centered ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      <div className={cn('flex items-center gap-3', centered && 'justify-center')}>
        {typeof index === 'number' ? (
          <span className="timecode">{String(index).padStart(2, '0')}</span>
        ) : null}
        <span className="bg-signal-line h-px w-8" aria-hidden="true" />
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      </div>

      <h2 className="text-display-md max-w-3xl">
        <span className="block overflow-hidden pb-1">
          <MaskReveal>{title}</MaskReveal>
        </span>
      </h2>

      {description ? (
        <p className="text-lead text-muted-foreground max-w-2xl">{description}</p>
      ) : null}

      {action ? <div className="mt-1">{action}</div> : null}
    </Reveal>
  );
}
