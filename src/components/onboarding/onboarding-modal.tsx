'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, Download, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useOnboarding } from '@/lib/hooks/use-onboarding';
import { cn } from '@/lib/utils/cn';

const STEPS = 2;

/**
 * Онбординг-модалка при первом заходе на сайт.
 *
 * Шаги: приветствие → приглашение скачать приложение.
 * Тема следует системным настройкам, поэтому отдельный шаг не нужен.
 * Показывается один раз (флаг в localStorage), есть кнопка «Пропустить».
 */
export function OnboardingModal() {
  const t = useTranslations('onboarding');
  const { open, setOpen, dismiss, ready } = useOnboarding();
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) setStep(0);
  }, [open]);

  if (!ready) return null;

  const isLast = step === STEPS - 1;

  const handleFinish = () => {
    dismiss();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : dismiss())}>
      <DialogContent
        hideClose
        className="max-w-xl overflow-hidden p-0"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div className="relative overflow-hidden">
          <div className="bg-aurora pointer-events-none absolute inset-0 opacity-70" />

          <div className="relative px-6 pt-8 pb-6 sm:px-8">
            {/* Индикатор шагов */}
            <div className="mb-6 flex items-center gap-1.5" aria-hidden="true">
              {Array.from({ length: STEPS }).map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors duration-300',
                    index <= step ? 'bg-gradient-brand' : 'bg-secondary',
                  )}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 28 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: -28 }}
                transition={{ duration: reduce ? 0.01 : 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 0 && (
                  <div className="space-y-4">
                    <span className="bg-gradient-brand-strong flex size-14 items-center justify-center rounded-2xl text-white shadow-[0_14px_40px_-14px_var(--brand-glow)]">
                      <Sparkles className="size-6" aria-hidden="true" />
                    </span>
                    <h2 className="text-foreground text-2xl font-bold tracking-tight">
                      {t('step1Title')}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {t('step1Body')}
                    </p>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <span className="bg-gradient-brand-strong flex size-14 items-center justify-center rounded-2xl text-white shadow-[0_14px_40px_-14px_var(--brand-glow)]">
                      <Download className="size-6" aria-hidden="true" />
                    </span>
                    <h2 className="text-foreground text-2xl font-bold tracking-tight">
                      {t('step3Title')}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {t('step3Body')}
                    </p>
                    <ul className="space-y-2 pt-1">
                      {[t('feature1'), t('feature2'), t('feature3')].map((feature) => (
                        <li
                          key={feature}
                          className="text-foreground/90 flex items-start gap-2 text-sm"
                        >
                          <Check
                            className="text-brand-foreground mt-0.5 size-4 shrink-0"
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Действия */}
          <div className="border-border/60 bg-background/40 relative flex items-center justify-between gap-3 border-t px-6 py-4 sm:px-8">
            <Button variant="ghost" size="sm" onClick={handleFinish}>
              {t('skip')}
            </Button>

            <div className="flex items-center gap-2">
              {step > 0 && (
                <Button variant="outline" size="sm" onClick={() => setStep((value) => value - 1)}>
                  {t('back')}
                </Button>
              )}
              {isLast ? (
                <Button variant="gradient" size="sm" onClick={handleFinish}>
                  {t('finish')}
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button variant="gradient" size="sm" onClick={() => setStep((value) => value + 1)}>
                  {t('next')}
                  <ArrowRight className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
