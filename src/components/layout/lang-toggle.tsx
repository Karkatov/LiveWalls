'use client';

import { Languages } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

/**
 * Переключатель языка RU ↔ EN.
 * Путь сохраняется: /ru/wallpapers → /en/wallpapers.
 */
export function LangToggle() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const next = locale === 'ru' ? 'en' : 'ru';
    router.replace(pathname, { locale: next });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-foreground/80 w-[68px] justify-center gap-1.5 px-0"
      aria-label={t('language')}
      onClick={toggleLocale}
    >
      <Languages className="size-4" />
      <span className="text-xs font-semibold uppercase">{locale}</span>
    </Button>
  );
}
