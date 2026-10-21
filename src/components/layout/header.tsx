'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { navLinks } from '@/config/site';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/logo';
import { ThemeToggle } from './theme-toggle';
import { LangToggle } from './lang-toggle';
import { cn } from '@/lib/utils/cn';

/**
 * Шапка сайта.
 *
 * Прозрачная «стеклянная» панель, которая уплотняется при скролле.
 * Мобильное меню — выдвижная панель (Sheet) с анимацией.
 */
export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]',
        scrolled
          ? 'border-border/60 bg-background/70 supports-[backdrop-filter]:bg-background/55 border-b backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          aria-label="LiveWalls"
          className="border-border/70 bg-background/40 hover:border-amber/40 focus-visible:outline-ring flex size-11 items-center justify-center rounded-[10px] border backdrop-blur-md transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <Logo variant="compact" />
        </Link>

        {/* Десктопная навигация */}
        <nav aria-label={t('mainNav')} className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'link-underline relative px-3.5 py-2 text-sm transition-colors duration-300',
                'focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2',
                isActive(link.href)
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <LangToggle />
          <ThemeToggle />

          <Button asChild variant="gradient" size="sm" className="ml-1 hidden sm:inline-flex">
            <Link href="/download">
              <Download className="size-4" />
              {t('install')}
            </Link>
          </Button>

          {/* Мобильное меню */}
          <Button
            variant="ghost"
            size="icon"
            className="border-border/70 bg-background/40 hover:border-amber/40 rounded-[10px] border backdrop-blur-md transition-colors duration-300 lg:hidden"
            aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? 'close' : 'open'}
                initial={reduce ? { opacity: 0 } : { opacity: 0, rotate: -90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, rotate: 90, scale: 0.8 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-center"
              >
                {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </motion.span>
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Мобильная панель навигации */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: reduce ? 0.01 : 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="border-border/60 bg-background/90 overflow-hidden border-t backdrop-blur-xl lg:hidden"
          >
            <nav aria-label={t('mainNav')} className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6">
              <ul className="flex flex-col gap-1">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduce ? 0 : 0.04 * index, duration: 0.28 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'block rounded-xl px-4 py-3 text-base transition-colors',
                        isActive(link.href)
                          ? 'bg-secondary/70 text-foreground'
                          : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
                      )}
                    >
                      {t(link.labelKey)}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="border-border/60 mt-4 flex flex-col gap-2 border-t pt-4">
                <Button asChild variant="gradient" className="w-full">
                  <Link href="/download">
                    <Download className="size-4" />
                    {t('install')}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/account">{t('account')}</Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
