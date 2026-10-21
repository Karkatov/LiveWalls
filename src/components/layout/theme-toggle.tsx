'use client';

import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Переключатель темы: тёмная (по умолчанию) / светлая / системная.
 *
 * Рендерится только после монтирования — иначе сервер и клиент разойдутся
 * (тема читается из localStorage).
 */
export function ThemeToggle() {
  const t = useTranslations('nav');
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label={t('theme')} disabled>
        <Sun className="size-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('theme')} className="text-foreground/80">
          {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10.5rem]">
        <DropdownMenuItem onSelect={() => setTheme('dark')}>
          <Moon className="size-4" />
          {t('themeDark')}
          {theme === 'dark' && <span className="ml-auto text-xs opacity-60">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTheme('light')}>
          <Sun className="size-4" />
          {t('themeLight')}
          {theme === 'light' && <span className="ml-auto text-xs opacity-60">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTheme('system')}>
          <Monitor className="size-4" />
          {t('themeSystem')}
          {theme === 'system' && <span className="ml-auto text-xs opacity-60">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
