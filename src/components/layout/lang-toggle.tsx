'use client';

import { useTransition } from 'react';
import { Languages } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Переключатель языка RU ↔ EN.
 * Путь сохраняется: /ru/wallpapers → /en/wallpapers.
 */
export function LangToggle() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const changeLocale = (next: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: next as (typeof routing.locales)[number] });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-foreground/80 gap-1.5 px-2.5"
          aria-label={t('language')}
          disabled={isPending}
        >
          <Languages className="size-4" />
          <span className="text-xs font-semibold uppercase">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((item) => (
          <DropdownMenuItem key={item} onSelect={() => changeLocale(item)}>
            {item === 'ru' ? 'Русский' : 'English'}
            {locale === item && <span className="ml-auto text-xs opacity-60">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
