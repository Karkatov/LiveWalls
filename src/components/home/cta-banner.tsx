import { getTranslations } from 'next-intl/server';
import { ArrowRight, Download } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { MaskReveal, Reveal } from '@/components/shared/motion';

/**
 * Финальный призыв к действию.
 *
 * Не янтарная плашка на весь блок, а тёмная «сцена»: волосяные линии,
 * свет проектора по центру и два действия. Акцент остаётся за одной кнопкой.
 */
export async function CtaBanner() {
  const t = await getTranslations('home.cta');

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-20 sm:px-8 lg:py-28">
      <Reveal>
        <div className="border-border bg-ink-800 relative overflow-hidden rounded-2xl border px-6 py-16 sm:px-14 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 h-[380px] w-[720px] -translate-x-1/2 rounded-full blur-[110px]"
            style={{ background: 'radial-gradient(closest-side, var(--signal-soft), transparent)' }}
          />
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />

          <div className="relative flex flex-col items-center text-center">
            <span className="eyebrow">06 / {t('title').split(' ')[0]}</span>

            <h2 className="text-display-md mt-6 max-w-2xl">
              <span className="block overflow-hidden pb-1">
                <MaskReveal>{t('title')}</MaskReveal>
              </span>
            </h2>

            <p className="text-lead text-muted-foreground mt-5 max-w-xl">{t('description')}</p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild variant="signal" size="lg" className="group">
                <Link href="/download">
                  <Download className="size-4" />
                  {t('button')}
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg">
                <Link href="/pricing">{t('secondary')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
