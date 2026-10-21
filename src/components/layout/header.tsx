'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
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
 * Не «стекло», а плёнка: волосяная линия снизу и фон, который проявляется
 * только после прокрутки. Активный пункт помечен янтарной линией и
 * моно-индексом — как кадр в монтажном листе.
 *
 * Мобильное меню — выдвижная панель справа с фокус-ловушкой (Radix Dialog),
 * а не самодельный раскрывающийся блок.
 */
export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Пока открыто меню — фоновый скролл заблокирован.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300',
          scrolled ? 'border-border glass border-b' : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-8">
          <Link
            href="/"
            className="focus-visible:outline-ring rounded-md focus-visible:outline-2 focus-visible:outline-offset-4"
            aria-label={t('home')}
          >
            <Logo />
          </Link>

          {/* Десктопная навигация */}
          <nav aria-label={t('mainNav')} className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link, index) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition-colors',
                    'focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2',
                    active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <span className="timecode opacity-60 group-hover:opacity-100">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {t(link.labelKey)}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="bg-signal absolute inset-x-2.5 -bottom-0.5 h-px"
                      transition={{ type: 'spring', stiffness: 140, damping: 22 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <LangToggle />
            <ThemeToggle />

            <Button asChild variant="signal" size="sm" className="ml-1.5 hidden sm:inline-flex">
              <Link href="/download">
                <Download className="size-4" />
                {t('install')}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {/* Прогресс прокрутки — тонкая янтарная линия по нижнему краю */}
        {!reduce && (
          <motion.div
            aria-hidden="true"
            style={{ scaleX: progress }}
            className="bg-signal absolute inset-x-0 bottom-0 h-px origin-left"
          />
        )}
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

/**
 * Мобильная панель навигации.
 *
 * Отдельный компонент, потому что раньше блок рендерился внутри шапки и
 * триггерил лишние пересборки всего дерева при каждом открытии.
 */
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  // Закрытие по Escape и удержание фокуса внутри панели.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable.item(0);
      const last = focusable.item(focusable.length - 1);
      if (!first || !last) return;
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panelRef.current?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.01 : 0.24, ease: [0.32, 0.72, 0, 1] }}
            onClick={onClose}
            className="bg-ink-900/80 fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
          />

          <motion.aside
            key="mobile-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('mainNav')}
            initial={reduce ? { opacity: 0 } : { x: '100%' }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: reduce ? 0.01 : 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="border-border bg-ink-850 fixed inset-y-0 right-0 z-50 flex w-4/5 max-w-sm flex-col border-l lg:hidden"
          >
            <div className="border-border flex h-[72px] items-center justify-between border-b px-4">
              <Logo variant="compact" />
              <Button
                ref={closeRef}
                variant="ghost"
                size="icon"
                aria-label={t('closeMenu')}
                onClick={onClose}
              >
                <X className="size-5" />
              </Button>
            </div>

            <nav aria-label={t('mainNav')} className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="flex flex-col">
                {navLinks.map((link, index) => {
                  const active = isActive(link.href);
                  return (
                    <motion.li
                      key={link.href}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: reduce ? 0 : 0.05 * index + 0.06,
                        duration: 0.34,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="border-border border-b last:border-b-0"
                    >
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          'flex items-baseline gap-3 py-4 text-lg transition-colors',
                          active
                            ? 'text-foreground'
                            : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        <span className="timecode">{String(index + 1).padStart(2, '0')}</span>
                        {t(link.labelKey)}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <div className="border-border flex flex-col gap-2 border-t p-4">
              <Button asChild variant="signal" className="w-full">
                <Link href="/download" onClick={onClose}>
                  <Download className="size-4" />
                  {t('install')}
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/account" onClick={onClose}>
                  {t('account')}
                </Link>
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
