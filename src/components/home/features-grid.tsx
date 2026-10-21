import { getTranslations } from 'next-intl/server';
import {
  AudioLines,
  BatteryCharging,
  FolderOpen,
  LayoutPanelTop,
  ListMusic,
  MonitorSmartphone,
  type LucideIcon,
} from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/shared/motion';

/** Иконки для блока преимуществ. */
const ICONS: LucideIcon[] = [
  LayoutPanelTop,
  MonitorSmartphone,
  AudioLines,
  BatteryCharging,
  ListMusic,
  FolderOpen,
];

/**
 * Блок «Почему это нативное приложение».
 */
export async function FeaturesGrid() {
  const t = await getTranslations('home.benefits');
  const keys = ['menuBar', 'lockScreen', 'bend', 'performance', 'playlists', 'import'] as const;

  return (
    <section className="relative mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
      <SectionHeading eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />

      <StaggerGroup className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {keys.map((key, index) => {
          const Icon = ICONS[index] ?? LayoutPanelTop;

          return (
            <StaggerItem key={key} className="h-full">
              <article className="group border-border/60 bg-card/40 hover:border-amber/35 hover:bg-card/70 h-full rounded-2xl border p-6 backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 hover:shadow-[0_24px_60px_-28px_var(--brand-glow)]">
                <span className="bg-brand/10 text-brand-foreground ring-brand/20 group-hover:bg-brand/20 flex size-11 items-center justify-center rounded-xl ring-1 transition-colors">
                  <Icon className="size-5" aria-hidden="true" />
                </span>

                <h3 className="text-foreground mt-4 text-base font-semibold">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {t(`items.${key}.description`)}
                </p>
              </article>
            </StaggerItem>
          );
        })}
      </StaggerGroup>

      <Reveal>
        <div className="border-border/60 bg-card/30 text-muted-foreground mt-8 rounded-2xl border px-5 py-4 text-center text-sm backdrop-blur-xl">
          {t('description')}
        </div>
      </Reveal>
    </section>
  );
}
