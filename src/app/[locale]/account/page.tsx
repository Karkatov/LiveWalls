import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { AccountPanel } from '@/components/account/account-panel';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'account' });

  return buildMetadata({
    title: t('title'),
    description: t('subtitle'),
    path: '/account',
    locale,
    noIndex: true,
  });
}

export default async function AccountPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('account');

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:py-16">
      <header className="max-w-2xl">
        <h1 className="text-foreground text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {t('title')}
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-relaxed text-pretty">
          {t('subtitle')}
        </p>
      </header>

      <div className="mt-10">
        <AccountPanel />
      </div>
    </div>
  );
}
