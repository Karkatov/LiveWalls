import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ArrowRight, Download } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Enter, MaskReveal } from '@/components/shared/motion';
import { mockWallpapers } from '@/data/mock/wallpapers';
import { mockCategories } from '@/data/mock/categories';

/**
 * Первый экран главной страницы.
 *
 * Слева — обещание и CTA, справа — кадр приложения в «проекционном свете».
 * Слои появляются по очереди (метка → заголовок → лид → CTA → мета-полоса),
 * справа медленно «дышит» мокап, по кадру проходит луч проектора.
 */
export async function Hero() {
  const t = await getTranslations('home.hero');
  const tNav = await getTranslations('nav');
  const tStats = await getTranslations('home.hero.stats');

  const stats = [
    { value: String(mockWallpapers.length), label: tStats('wallpapers') },
    { value: String(mockCategories.length), label: tStats('categories') },
    { value: '4K', label: tStats('resolution') },
    { value: '24', label: tStats('trial') },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Фон: тонкая сетка + мягкий проекционный свет */}
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] opacity-40" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-70 blur-[120px]"
        style={{ background: 'radial-gradient(closest-side, var(--signal-soft), transparent)' }}
      />

      <div className="mx-auto grid max-w-[1280px] items-center gap-14 px-4 py-16 sm:px-8 lg:grid-cols-[1.02fr_1fr] lg:py-28">
        <div>
          <Enter>
            <span className="eyebrow flex items-center gap-2.5">
              <span className="bg-signal inline-block size-1.5 rounded-full" aria-hidden="true" />
              {t('badge')}
            </span>
          </Enter>

          <h1 className="text-display-xl mt-6">
            <span className="block overflow-hidden pb-1">
              <MaskReveal delay={0.08}>{t('title')}</MaskReveal>
            </span>
            <span className="text-signal-foreground block overflow-hidden pb-1">
              <MaskReveal delay={0.16}>{t('titleAccent')}</MaskReveal>
            </span>
          </h1>

          <Enter delay={0.3}>
            <p className="text-lead text-muted-foreground mt-6 max-w-xl">{t('subtitle')}</p>
          </Enter>

          <Enter delay={0.4}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild variant="signal" size="lg" className="group">
                <Link href="/download">
                  <Download className="size-4" />
                  {t('cta')}
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg">
                <Link href="/wallpapers">{t('ctaSecondary')}</Link>
              </Button>
            </div>
          </Enter>

          <Enter delay={0.46}>
            <p className="timecode mt-4">{t('trialNote')}</p>
          </Enter>

          <Enter delay={0.56}>
            <dl className="rule-strong mt-12 grid max-w-lg grid-cols-2 gap-x-6 gap-y-5 border-t pt-6 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="text-foreground font-mono text-2xl tabular-nums">
                      {stat.value}
                    </span>
                    <span className="text-paper-faint mt-1 block text-xs leading-snug">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Enter>
        </div>

        <Enter delay={0.24} y={28}>
          <figure className="relative">
            <div
              aria-hidden="true"
              className="bg-signal/15 pointer-events-none absolute -inset-8 -z-10 rounded-[48px] blur-3xl"
            />

            <div className="frame grain projector-sweep border-border shadow-frame border">
              <div className="border-border relative z-[2] flex items-center gap-2 border-b bg-[color:var(--ink-850)] px-4 py-3">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
                <span className="timecode ml-2">{tStats('resolution')}</span>
              </div>

              <div className="relative aspect-[1400/880]">
                <Image
                  src="/placeholders/screenshots/app-main.svg"
                  alt={t('appPreviewLabel')}
                  fill
                  sizes="(max-width: 1024px) 100vw, 46vw"
                  priority
                  className="object-cover"
                />
              </div>
            </div>

            <figcaption className="border-border bg-ink-700 shadow-float absolute -bottom-5 -left-4 hidden items-center gap-3 rounded-lg border px-4 py-3 sm:flex">
              <span className="timecode">{tNav('frame')}</span>
              <span className="bg-signal h-8 w-px" aria-hidden="true" />
              <span>
                <span className="text-paper-faint block text-[11px] leading-tight">
                  Bend effect
                </span>
                <span className="text-foreground text-sm font-medium">macOS 26+</span>
              </span>
            </figcaption>
          </figure>
        </Enter>
      </div>
    </section>
  );
}
