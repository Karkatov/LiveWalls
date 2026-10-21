import { getTranslations } from 'next-intl/server';
import {
  Car,
  Gamepad2,
  LayoutGrid,
  Leaf,
  Moon,
  Rocket,
  Shapes,
  Shield,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Category } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';
import { Reveal } from '@/components/shared/motion';
import { cn } from '@/lib/utils/cn';

/** Соответствие «имя иконки из мока» → компонент Lucide. */
const ICONS: Record<string, LucideIcon> = {
  Leaf,
  Rocket,
  Car,
  Shapes,
  Moon,
  Gamepad2,
  Sparkles,
  Shield,
  LayoutGrid,
};

/**
 * Сетка категорий каталога.
 */
export async function CategoriesGrid({ categories }: { categories: Category[] }) {
  const t = await getTranslations('home.categories');

  return (
    <section className="relative mx-auto max-w-[1280px] px-4 py-20 sm:px-8 lg:py-28">
      <SectionHeading
        index={3}
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        action={
          <Link
            href="/wallpapers"
            className="text-signal-foreground text-sm font-medium underline-offset-4 hover:underline"
          >
            {t('cta')}
          </Link>
        }
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => {
          const Icon = ICONS[category.icon] ?? LayoutGrid;

          return (
            <Reveal key={category.id} delay={index * 0.04}>
              <Link
                href={{ pathname: '/wallpapers', query: { category: category.id } }}
                className={cn(
                  'group border-border bg-card flex items-center gap-4 rounded-xl border p-5',
                  'transition-colors duration-300 hover:border-[color:var(--hairline-strong)]',
                  'focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-4',
                )}
              >
                <span
                  className={cn(
                    'flex size-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br',
                    category.accent,
                    'text-white',
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>

                <span className="min-w-0">
                  <span className="text-foreground block truncate text-base font-semibold">
                    {category.title}
                  </span>
                  <span className="text-muted-foreground mt-0.5 block truncate text-sm">
                    {t('count', { count: category.count })}
                  </span>
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
