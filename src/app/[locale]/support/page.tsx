import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Clock, Mail, MessageCircle } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { siteConfig } from '@/config/site';
import { Reveal } from '@/components/shared/motion';
import { SupportForm } from '@/components/support/support-form';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'support' });

  return buildMetadata({
    title: t('title'),
    description: t('subtitle'),
    path: '/support',
    locale,
  });
}

export default async function SupportPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('support');

  const contacts = [
    {
      icon: Mail,
      label: t('emailLabel'),
      value: siteConfig.CONTACTS.email,
      href: `mailto:${siteConfig.CONTACTS.email}`,
    },
    {
      icon: MessageCircle,
      label: t('telegramLabel'),
      value: siteConfig.CONTACTS.telegram,
      href: `https://t.me/${siteConfig.CONTACTS.telegram.replace('@', '')}`,
    },
    {
      icon: Clock,
      label: t('responseTime'),
      value: t('responseTimeValue'),
      href: null,
    },
  ];

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:py-16">
      <header className="max-w-2xl">
        <h1 className="text-display-md">{t('title')}</h1>
        <p className="text-muted-foreground mt-3 text-base leading-relaxed text-pretty">
          {t('subtitle')}
        </p>
      </header>

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Reveal>
          <div className="border-border bg-card rounded-2xl border p-6 sm:p-8">
            <h2 className="text-foreground text-lg font-semibold tracking-tight">
              {t('formTitle')}
            </h2>

            <div className="mt-6">
              <SupportForm />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="border-border bg-card rounded-2xl border p-6 sm:p-8">
            <h2 className="text-foreground text-lg font-semibold tracking-tight">
              {t('contactsTitle')}
            </h2>

            <ul className="mt-6 space-y-4">
              {contacts.map((contact) => (
                <li
                  key={contact.label}
                  className="border-border bg-background/40 flex items-start gap-3 rounded-xl border px-4 py-3"
                >
                  <span className="bg-signal/10 text-signal-foreground flex size-9 shrink-0 items-center justify-center rounded-lg">
                    <contact.icon className="size-4" aria-hidden="true" />
                  </span>

                  <span className="min-w-0">
                    <span className="text-muted-foreground block text-xs tracking-[0.12em] uppercase">
                      {contact.label}
                    </span>
                    {contact.href ? (
                      <a
                        href={contact.href}
                        className="text-foreground mt-0.5 block truncate text-sm underline-offset-4 hover:underline"
                      >
                        {contact.value}
                      </a>
                    ) : (
                      <span className="text-foreground mt-0.5 block text-sm leading-relaxed">
                        {contact.value}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <p className="border-border bg-background/40 text-muted-foreground mt-6 rounded-xl border px-4 py-3 text-sm leading-relaxed">
              {t('faqLink')}
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
