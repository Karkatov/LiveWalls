import { getTranslations } from 'next-intl/server';
import { Download } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/shared/motion';

/**
 * Финальный призыв к действию.
 */
export async function CtaBanner() {
  const t = await getTranslations('home.cta');

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
      <Reveal>
        <div className="border-brand/25 bg-gradient-brand-strong relative overflow-hidden rounded-3xl border px-6 py-14 text-center shadow-[0_40px_120px_-40px_var(--brand-glow-strong)] sm:px-12">
          <div className="bg-aurora pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay" />

          <div className="relative">
            <h2 className="text-display-md text-white">{t('title')}</h2>
            <p className="text-lead mx-auto mt-4 max-w-xl text-white/85">{t('description')}</p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-[#0A0A0C] hover:bg-white/90">
                <Link href="/download">
                  <Download className="size-4" />
                  {t('button')}
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:border-white/50 hover:bg-white/10 hover:text-white"
              >
                <Link href="/pricing">{t('secondary')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
