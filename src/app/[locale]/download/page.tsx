import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Apple, CheckCircle2, Cpu, Download, HardDrive, MonitorSmartphone } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
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
  const t = await getTranslations({ locale, namespace: 'download' });

  return buildMetadata({
    title: t('title'),
    description: t('subtitle'),
    path: '/download',
    locale,
  });
}

export default async function DownloadPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('download');

  const builds = [
    {
      id: 'universal',
      name: t('universal'),
      note: t('universalNote'),
      url: siteConfig.APP.downloadUrlUniversal,
      size: '48 МБ',
      icon: MonitorSmartphone,
    },
    {
      id: 'silicon',
      name: t('silicon'),
      note: t('siliconNote'),
      url: siteConfig.APP.downloadUrl,
      size: '26 МБ',
      icon: Cpu,
    },
  ];

  const requirements = [
    { icon: Apple, label: t('requirementsTitle'), value: t('macos') },
    { icon: Cpu, label: t('chip'), value: t('chip') },
    { icon: HardDrive, label: t('size'), value: t('freeSpace') },
  ];

  const steps = [t('step1'), t('step2'), t('step3')];

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-12 sm:px-6 lg:py-16">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-foreground text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {t('title')}
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-relaxed text-pretty">
          {t('subtitle')}
        </p>
        <p className="text-muted-foreground mt-3 text-sm">{t('trust')}</p>
      </header>

      {/* Сборки */}
      <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2">
        {builds.map((build) => (
          <StaggerItem key={build.id} className="h-full">
            <div className="border-border bg-card flex h-full flex-col rounded-2xl border p-6">
              <span className="bg-signal/10 text-signal-foreground ring-signal/20 flex size-11 items-center justify-center rounded-xl ring-1">
                <build.icon className="size-5" aria-hidden="true" />
              </span>

              <h2 className="text-foreground mt-4 text-base font-semibold">{build.name}</h2>
              <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
                {build.note}
              </p>

              <p className="text-muted-foreground mt-4 text-xs">
                {t('version')}: {siteConfig.APP.version} · {t('size')}: {build.size}
              </p>

              <Button asChild variant="signal" size="lg" className="mt-4">
                <a href={build.url} download>
                  <Download className="size-4" aria-hidden="true" />
                  {t('button')}
                </a>
              </Button>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* Требования */}
      <Reveal>
        <section className="mt-12">
          <h2 className="text-foreground text-xl font-semibold tracking-tight">
            {t('requirementsTitle')}
          </h2>

          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {requirements.map((item) => (
              <li
                key={item.label + item.value}
                className="border-border bg-card flex items-center gap-3 rounded-xl border px-4 py-3"
              >
                <span className="bg-secondary/60 text-foreground flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <item.icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="text-muted-foreground block text-xs tracking-[0.12em] uppercase">
                    {item.label}
                  </span>
                  <span className="text-foreground block truncate text-sm">{item.value}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* Шаги установки */}
      <Reveal>
        <section className="mt-12">
          <h2 className="text-foreground text-xl font-semibold tracking-tight">
            {t('stepsTitle')}
          </h2>

          <ol className="mt-5 space-y-3">
            {steps.map((step, index) => (
              <li
                key={step}
                className="border-border bg-card flex items-start gap-3 rounded-xl border px-5 py-4"
              >
                <span className="bg-gradient-signal flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <span className="text-muted-foreground text-sm">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      {/* Что дальше */}
      <Reveal>
        <div className="border-signal/25 bg-signal/6 mt-12 rounded-2xl border p-6 text-center sm:p-8">
          <CheckCircle2 className="text-signal-foreground mx-auto size-8" aria-hidden="true" />
          <h2 className="text-foreground mt-4 text-lg font-semibold">{t('faqTitle')}</h2>
          <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-sm leading-relaxed">
            {t('faqBody')}
          </p>
          <p className="text-muted-foreground/80 mt-4 text-xs">{t('note')}</p>
        </div>
      </Reveal>
    </div>
  );
}
