import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Check, Flame, Sparkles } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { buildMetadata } from '@/lib/seo/metadata';
import { pricing } from '@/config/site';
import { formatPrice } from '@/lib/utils/format';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/shared/section-heading';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/shared/motion';
import { BuyButton } from '@/components/wallpaper/buy-button';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });

  return buildMetadata({
    title: t('title'),
    description: t('subtitle'),
    path: '/pricing',
    locale,
    keywords: ['LiveWalls цена', 'премиум LiveWalls', 'live walls price'],
  });
}

export default async function PricingPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('pricing');
  const tCommon = await getTranslations('common');
  const tNav = await getTranslations('nav');

  const featureKeys = [
    'catalog',
    'lockscreen',
    'favorites',
    'updates',
    'support',
    'import',
  ] as const;

  const plans = [
    {
      id: 'trial',
      name: t('trial'),
      badge: t('trialBadge'),
      price: t('trialPrice'),
      period: '',
      description: t('trialDescription'),
      cta: tCommon('install'),
      featured: false,
      action: { type: 'link' as const, href: '/download' as const },
    },
    {
      id: 'lifetime',
      name: t('lifetime'),
      badge: t('mostPopular'),
      price: formatPrice(pricing.lifetime),
      period: t('oneTime'),
      description: t('lifetimeDescription'),
      cta: tCommon('buy'),
      featured: true,
      action: { type: 'buy' as const, kind: 'subscription' as const, itemId: 'lifetime' },
    },
    {
      id: 'yearly',
      name: t('yearly'),
      badge: null,
      price: formatPrice(pricing.yearly),
      period: t('perYear'),
      description: t('yearlyDescription'),
      cta: tCommon('buy'),
      featured: false,
      action: { type: 'buy' as const, kind: 'subscription' as const, itemId: 'yearly' },
    },
  ];

  const extras = [
    {
      id: 'pack',
      name: t('pack'),
      price: formatPrice(pricing.pack),
      description: t('packDescription'),
      cta: t('packTitle'),
      body: t('packBody'),
    },
    {
      id: 'single',
      name: t('single'),
      price: formatPrice(pricing.single),
      description: t('singleDescription'),
      cta: t('singleTitle'),
      body: t('singleBody'),
    },
  ];

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:py-16">
      <SectionHeading eyebrow={tNav('pricing')} title={t('title')} description={t('subtitle')} />

      {/* Тарифы */}
      <StaggerGroup className="mt-12 grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <StaggerItem key={plan.id} className="h-full">
            <div
              className={
                plan.featured
                  ? 'border-signal/40 from-signal/12 to-card/60 relative flex h-full flex-col rounded-2xl border bg-gradient-to-b p-7 shadow-[0_30px_90px_-40px_var(--signal-glow-strong)]'
                  : 'border-border bg-card relative flex h-full flex-col rounded-2xl border p-7'
              }
            >
              {plan.badge && (
                <span className="absolute -top-3 left-7">
                  <Badge variant="signal">
                    {plan.featured && <Flame className="size-3" aria-hidden="true" />}
                    {plan.badge}
                  </Badge>
                </span>
              )}

              <h2 className="text-foreground text-lg font-semibold tracking-tight">{plan.name}</h2>

              <p className="mt-4 flex items-baseline gap-2">
                <span className="text-foreground font-mono text-4xl tabular-nums">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                )}
              </p>

              <p className="text-muted-foreground mt-3 flex-1 text-sm leading-relaxed">
                {plan.description}
              </p>

              <div className="mt-6">
                {plan.action.type === 'buy' ? (
                  <BuyButton
                    kind={plan.action.kind}
                    itemId={plan.action.itemId}
                    title={plan.name}
                    price={plan.id === 'lifetime' ? pricing.lifetime : pricing.yearly}
                    priceLabel={plan.cta}
                    variant={plan.featured ? 'signal' : 'outline'}
                    size="lg"
                    className="w-full"
                  />
                ) : (
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <Link href="/download">{plan.cta}</Link>
                  </Button>
                )}
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* Скидка на триал */}
      <Reveal>
        <div className="mt-6 flex flex-col items-start gap-3 rounded-xl border border-amber-400/25 bg-amber-400/8 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 size-5 shrink-0 text-amber-300" aria-hidden="true" />
            <div>
              <p className="text-foreground text-sm font-semibold">{t('trialDiscountTitle')}</p>
              <p className="text-muted-foreground mt-1 text-sm">{t('trialDiscountBody')}</p>
            </div>
          </div>

          <BuyButton
            kind="subscription"
            itemId="lifetime-trial"
            title={t('lifetime')}
            price={pricing.trialDiscount}
            priceLabel={formatPrice(pricing.trialDiscount)}
            variant="outline"
          />
        </div>
      </Reveal>

      {/* Дополнительные покупки */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {extras.map((extra, index) => (
          <Reveal key={extra.id} delay={index * 0.06}>
            <div className="border-border bg-card flex h-full flex-col rounded-xl border p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-foreground text-base font-semibold">{extra.name}</h2>
                <span className="text-foreground font-mono text-xl tabular-nums">
                  {extra.price}
                </span>
              </div>

              <p className="text-muted-foreground mt-2 text-sm">{extra.description}</p>
              <p className="text-muted-foreground mt-3 flex-1 text-sm leading-relaxed">
                {extra.body}
              </p>

              <Button asChild variant="outline" className="mt-5">
                <Link href="/wallpapers">{extra.cta}</Link>
              </Button>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Что входит в Premium */}
      <section className="mt-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-section">{t('featuresTitle')}</h2>

            <ul className="mt-6 space-y-3">
              {featureKeys.map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <span className="bg-signal/15 text-signal-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="text-muted-foreground text-sm">{t(`features.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-section">{t('faqTitle')}</h2>

            <dl className="mt-6 space-y-4">
              <div>
                <dt className="text-foreground text-sm font-semibold">{t('refundTitle')}</dt>
                <dd className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {t('refundBody')}
                </dd>
              </div>
              <div>
                <dt className="text-foreground text-sm font-semibold">{t('packTitle')}</dt>
                <dd className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {t('packBody')}
                </dd>
              </div>
              <div>
                <dt className="text-foreground text-sm font-semibold">{t('singleTitle')}</dt>
                <dd className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {t('singleBody')}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Сравнение */}
      <section className="mt-16">
        <h2 className="font-display text-section">{t('compareTitle')}</h2>

        <div className="border-border mt-6 overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="bg-card text-left">
                <th scope="col" className="text-muted-foreground px-4 py-3 font-medium">
                  {tCommon('all')}
                </th>
                <th scope="col" className="text-foreground px-4 py-3 font-medium">
                  {t('trial')}
                </th>
                <th scope="col" className="text-foreground px-4 py-3 font-medium">
                  {t('lifetime')}
                </th>
                <th scope="col" className="text-foreground px-4 py-3 font-medium">
                  {t('yearly')}
                </th>
              </tr>
            </thead>
            <tbody>
              {featureKeys.map((key) => (
                <tr key={key} className="border-border border-t">
                  <th scope="row" className="text-muted-foreground px-4 py-3 text-left font-normal">
                    {t(`features.${key}`)}
                  </th>
                  <td className="px-4 py-3">
                    <Check className="text-signal-foreground size-4" aria-hidden="true" />
                  </td>
                  <td className="px-4 py-3">
                    <Check className="text-signal-foreground size-4" aria-hidden="true" />
                  </td>
                  <td className="px-4 py-3">
                    <Check className="text-signal-foreground size-4" aria-hidden="true" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
