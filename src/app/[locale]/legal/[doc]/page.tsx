import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { privacyPolicy } from '@/data/legal/privacy';
import { termsOfUse } from '@/data/legal/terms';
import { publicOffer } from '@/data/legal/offer';
import type { LegalDocument } from '@/data/legal/types';
import { LegalDocumentView } from '@/components/legal/legal-document';

/** Три юридических документа сайта. */
const DOCUMENTS = {
  privacy: privacyPolicy,
  terms: termsOfUse,
  offer: publicOffer,
} as const;

type DocumentSlug = keyof typeof DOCUMENTS;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    (Object.keys(DOCUMENTS) as DocumentSlug[]).map((doc) => ({ locale, doc })),
  );
}

function resolveDocument(doc: string, locale: Locale): LegalDocument | null {
  if (!(doc in DOCUMENTS)) return null;
  const bundle = DOCUMENTS[doc as DocumentSlug];
  return bundle[locale] ?? bundle.ru;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; doc: string }>;
}): Promise<Metadata> {
  const { locale, doc } = await params;
  const document = resolveDocument(doc, locale);

  if (!document) {
    return buildMetadata({ title: '404', description: '', path: '/legal/privacy', locale });
  }

  return buildMetadata({
    title: document.title,
    description: document.intro ?? document.title,
    path: `/legal/${doc}`,
    locale,
  });
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: Locale; doc: string }>;
}) {
  const { locale, doc } = await params;
  setRequestLocale(locale);

  const document = resolveDocument(doc, locale);
  if (!document) notFound();

  const t = await getTranslations('legal');

  return (
    <div id="top" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-8 lg:py-24">
      <LegalDocumentView document={document} />

      <p className="text-muted-foreground/70 mt-12 text-xs">
        {t('operatorTitle')}: {t('operatorValue')}
      </p>
    </div>
  );
}
