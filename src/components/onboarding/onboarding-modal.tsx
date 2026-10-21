'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, Download, Monitor, Moon, Sparkles, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useOnboarding } from '@/lib/hooks/use-onboarding';
import { cn } from '@/lib/utils/cn';

const STEPS = 3;

/**
 * Онбординг-модалка при первом заходе на сайт.
 *
 * Шаги: приветствие → выбор темы → приглашение скачать приложение.
 * Показывается один раз (флаг в localStorage), есть кнопка «Пропустить».
 */
export function OnboardingModal() {
  const t = useTranslations('onboarding');
  const { open, setOpen, dismiss, ready } = useOnboarding();
  const { theme, setTheme } = useTheme();
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
                    index <= step ? 'bg-gradient-signal' : 'bg-secondary',
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
                    <span className="bg-gradient-signal flex size-14 items-center justify-center rounded-xl text-white shadow-[0_14px_40px_-14px_var(--signal-glow)]">
                      <Sparkles className="size-6" aria-hidden="true" />
                    </span>
                    <h2 className="font-display text-section">{t('step1Title')}</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {t('step1Body')}
                    </p>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <h2 className="font-display text-section">{t('step2Title')}</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {t('step2Body')}
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <ThemeOption
                        active={theme === 'dark'}
                        onClick={() => setTheme('dark')}
                        icon={<Moon className="size-4" />}
                        label={t('themeDark')}
                      />
                      <ThemeOption
                        active={theme === 'light'}
                        onClick={() => setTheme('light')}
                        icon={<Sun className="size-4" />}
                        label={t('themeLight')}
                      />
                      <ThemeOption
                        active={theme === 'system'}
                        onClick={() => setTheme('system')}
                        icon={<Monitor className="size-4" />}
                        label={t('themeSystem')}
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <span className="bg-gradient-signal flex size-14 items-center justify-center rounded-xl text-white shadow-[0_14px_40px_-14px_var(--signal-glow)]">
                      <Download className="size-6" aria-hidden="true" />
                    </span>
                    <h2 className="font-display text-section">{t('step3Title')}</h2>
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
                            className="text-signal-foreground mt-0.5 size-4 shrink-0"
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
          <div className="border-border bg-background/40 relative flex items-center justify-between gap-3 border-t px-6 py-4 sm:px-8">
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
                <Button variant="signal" size="sm" onClick={handleFinish}>
                  {t('finish')}
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button variant="signal" size="sm" onClick={() => setStep((value) => value + 1)}>
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

function ThemeOption({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-xs transition-all',
        'focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2',
        active
          ? 'border-signal/60 bg-signal/12 text-foreground shadow-[0_0_0_1px_rgba(124,92,255,0.25)]'
          : 'border-border bg-secondary/40 text-muted-foreground hover:border-signal/30 hover:text-foreground',
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}
