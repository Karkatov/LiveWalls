import type { Metadata } from 'next';
import Image from 'next/image';
import { wallpaperBlurDataURL } from '@/lib/utils/placeholders';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Apple, Cpu, Download, Layers3, MonitorSmartphone, Sparkles } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { buildMetadata } from '@/lib/seo/metadata';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/shared/section-heading';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/shared/motion';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return buildMetadata({
    title: t('title'),
    description: t('subtitle'),
    path: '/about',
    locale,
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('about');

  const screenshots = [
    { src: '/placeholders/screenshots/app-main.svg', label: 'Основное окно' },
    { src: '/placeholders/screenshots/app-player.svg', label: 'Плеер' },
    { src: '/placeholders/screenshots/app-catalog.svg', label: 'Каталог' },
    { src: '/placeholders/screenshots/app-bend.svg', label: 'Эффект Bend' },
  ];

  const requirements = [
    { icon: Apple, label: t('macos'), value: `macOS ${siteConfig.APP.minMacOS} (Sequoia) и новее` },
    { icon: Cpu, label: t('chip'), value: t('architecture') },
    { icon: Layers3, label: t('extensions'), value: t('extensionsValue') },
    { icon: MonitorSmartphone, label: t('version'), value: siteConfig.APP.version },
  ];

  const highlights = [
    { icon: Sparkles, text: t('featuresBody') },
    { icon: MonitorSmartphone, text: t('whatBody') },
    { icon: Layers3, text: t('demoBody') },
  ];

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:py-16">
      <SectionHeading eyebrow={t('title')} title={t('subtitle')} description={t('whatBody')} />

      {/* Скриншоты */}
      <section className="mt-16">
        <h2 className="font-display text-section">{t('screenshotsTitle')}</h2>
        <p className="text-muted-foreground mt-2 text-sm">{t('screenshotsBody')}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {screenshots.map((shot, index) => (
            <Reveal key={shot.src} delay={index * 0.05}>
              <figure className="border-border bg-card overflow-hidden rounded-xl border">
                <Image
                  src={shot.src}
                  alt={shot.label}
                  width={1200}
                  height={750}
                  className="w-full"
                  placeholder="blur"
                  blurDataURL={wallpaperBlurDataURL('app-about')}
                />
                <figcaption className="text-muted-foreground px-4 py-3 text-sm">
                  {shot.label}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Ключевые особенности */}
      <section className="mt-16">
        <h2 className="font-display text-section">{t('featuresTitle')}</h2>

        <StaggerGroup className="mt-8 grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <StaggerItem key={item.text} className="h-full">
              <div className="border-border bg-card flex h-full flex-col rounded-xl border p-6">
                <span className="bg-signal/10 text-signal-foreground ring-signal/20 flex size-11 items-center justify-center rounded-xl ring-1">
                  <item.icon className="size-5" aria-hidden="true" />
                </span>
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">{item.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Требования */}
      <section className="mt-16">
        <h2 className="font-display text-section">{t('requirementsTitle')}</h2>
        <p className="text-muted-foreground mt-2 text-sm">{t('requirementsBody')}</p>

        <dl className="mt-8 grid gap-3 sm:grid-cols-2">
          {requirements.map((item) => (
            <div
              key={item.label}
              className="border-border bg-card flex items-start gap-3 rounded-xl border px-5 py-4"
            >
              <span className="bg-secondary/60 text-foreground flex size-9 shrink-0 items-center justify-center rounded-lg">
                <item.icon className="size-4" aria-hidden="true" />
              </span>
              <span>
                <dt className="text-muted-foreground text-xs tracking-[0.12em] uppercase">
                  {item.label}
                </dt>
                <dd className="text-foreground mt-0.5 text-sm">{item.value}</dd>
              </span>
            </div>
          ))}
        </dl>
      </section>

      {/* CTA */}
      <Reveal>
        <div className="panel projector-sweep relative mt-16 flex flex-col items-center gap-4 overflow-hidden px-6 py-14 text-center">
          <h2 className="font-display text-section text-foreground text-balance">
            {t('download')}
          </h2>

          <Button asChild variant="signal" size="lg" className="relative">
            <Link href="/download">
              <Download className="size-4" />
              {t('download')}
            </Link>
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
