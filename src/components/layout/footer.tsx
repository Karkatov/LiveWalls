import { Github, Mail, MessageCircle, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/config/site';
import { Logo } from '@/components/shared/logo';

/**
 * Подвал сайта: навигация, соцсети, реквизиты (плейсхолдеры).
 */
export function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const year = new Date().getFullYear();

  const product = [
    { href: '/wallpapers', label: nav('wallpapers') },
    { href: '/packs', label: nav('packs') },
    { href: '/pricing', label: nav('pricing') },
    { href: '/download', label: t('download') },
  ];

  const company = [
    { href: '/about', label: nav('about') },
    { href: '/faq', label: nav('faq') },
    { href: '/support', label: nav('support') },
    { href: '/account', label: nav('account') },
  ];

  const legal = [
    { href: '/legal/privacy', label: t('privacy') },
    { href: '/legal/terms', label: t('terms') },
    { href: '/legal/offer', label: t('offer') },
  ];

  return (
    <footer className="border-border/60 bg-background/60 relative mt-24 border-t">
      <div className="bg-aurora pointer-events-none absolute inset-x-0 -top-40 h-40 opacity-40 blur-3xl" />

      <div className="relative mx-auto max-w-[1200px] px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block rounded-lg">
              <Logo />
            </Link>
            <p className="text-muted-foreground mt-4 max-w-sm text-sm leading-relaxed">
              {t('description')}
            </p>

            <div className="mt-6 flex items-center gap-2">
              <SocialLink
                href={siteConfig.SOCIAL.telegram}
                label="Telegram"
                icon={<Send className="size-4" />}
              />
              <SocialLink
                href={siteConfig.SOCIAL.vk}
                label="VK"
                icon={<MessageCircle className="size-4" />}
              />
              <SocialLink
                href={siteConfig.SOCIAL.github}
                label="GitHub"
                icon={<Github className="size-4" />}
              />
              <SocialLink
                href={`mailto:${siteConfig.CONTACTS.email}`}
                label={siteConfig.CONTACTS.email}
                icon={<Mail className="size-4" />}
              />
            </div>
          </div>

          <FooterColumn title={t('product')} links={product} />
          <FooterColumn title={t('company')} links={company} />
          <FooterColumn title={t('legalColumn')} links={legal} />
        </div>

        <div className="border-border/60 text-muted-foreground mt-12 flex flex-col gap-4 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. {t('rights')}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              {t('inn')}: {siteConfig.LEGAL.inn}
            </span>
            <span>
              {t('ogrnip')}: {siteConfig.LEGAL.ogrnip}
            </span>
            <span>{siteConfig.APP.version}</span>
          </div>
        </div>

        <p className="text-muted-foreground/70 mt-4 text-xs leading-relaxed">{t('disclaimer')}</p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h2 className="text-foreground text-sm font-semibold">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-muted-foreground hover:text-foreground focus-visible:outline-ring rounded text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      className="border-border/70 bg-secondary/40 text-muted-foreground hover:border-brand/40 hover:text-foreground focus-visible:outline-ring flex size-9 items-center justify-center rounded-full border transition-all focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {icon}
    </a>
  );
}
