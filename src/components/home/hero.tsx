import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ArrowRight, Download, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/shared/motion';
import { mockWallpapers } from '@/data/mock/wallpapers';
import { mockCategories } from '@/data/mock/categories';

/**
 * Первый экран главной страницы.
 *
 * Слева — обещание и CTA, справа — мокап приложения.
 */
export async function Hero() {
  const t = await getTranslations('home.hero');
  const tStats = await getTranslations('home.hero.stats');

  const stats = [
    { value: String(mockWallpapers.length), label: tStats('wallpapers') },
    { value: String(mockCategories.length), label: tStats('categories') },
    { value: '4K', label: tStats('resolution') },
    { value: '24', label: tStats('trial') },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Фоновые слои */}
      <div className="bg-aurora pointer-events-none absolute inset-0 -z-10 opacity-70" />
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] opacity-[0.18]" />

      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div>
          <Reveal>
            <span className="border-brand/25 bg-brand/10 text-brand-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium backdrop-blur-md">
              <Sparkles className="size-3.5" aria-hidden="true" />
              {t('badge')}
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="text-foreground mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {t('title')}{' '}
              <span className="text-gradient bg-gradient-brand bg-clip-text text-transparent">
                {t('titleAccent')}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed text-pretty sm:text-lg">
              {t('subtitle')}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild variant="gradient" size="lg" className="group">
                <Link href="/download">
                  <Download className="size-4" />
                  {t('cta')}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg">
                <Link href="/wallpapers">{t('ctaSecondary')}</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="text-muted-foreground mt-4 text-sm">{t('trialNote')}</p>
          </Reveal>

          <StaggerGroup className="mt-12 grid max-w-lg grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="border-border/60 bg-card/40 rounded-2xl border px-4 py-3 backdrop-blur-xl">
                  <p className="text-foreground text-2xl font-bold tracking-tight">{stat.value}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs leading-snug">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        <Reveal delay={0.1} y={34}>
          <div className="relative">
            <div className="bg-brand/15 pointer-events-none absolute -inset-6 -z-10 rounded-[40px] blur-3xl" />

            <div className="border-border/70 bg-card/50 relative overflow-hidden rounded-3xl border shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl">
              <div className="border-border/60 bg-background/40 flex items-center gap-2 border-b px-4 py-3">
                <span className="size-3 rounded-full bg-[#ff5f57]" />
                <span className="size-3 rounded-full bg-[#febc2e]" />
                <span className="size-3 rounded-full bg-[#28c840]" />
                <span className="text-muted-foreground ml-3 text-xs">LiveWalls</span>
              </div>

              <Image
                src="/placeholders/screenshots/app-main.svg"
                alt={t('appPreviewLabel')}
                width={1400}
                height={880}
                priority
                className="w-full"
              />
            </div>

            <div className="border-border/70 bg-card/80 pointer-events-none absolute -bottom-6 -left-4 hidden rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-xl sm:block">
              <p className="text-muted-foreground text-xs">Bend effect</p>
              <p className="text-foreground text-sm font-semibold">macOS 26+</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
