import type { Pack, Wallpaper } from '@/types';
import { siteConfig } from '@/config/site';
import { absoluteLocalizedUrl } from './metadata';

/**
 * Structured data (JSON-LD) для обоев и паков.
 *
 * Формат соответствует schema.org: Product + ImageObject + Offer.
 * Цены — в рублях, по стандарту schema.org валюта указывается кодом RUB.
 */

/** JSON-LD для карточки обоев. */
export function wallpaperJsonLd(wallpaper: Wallpaper, locale: 'ru' | 'en' = 'ru'): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: wallpaper.title,
    description: wallpaper.description,
    sku: wallpaper.id,
    category: wallpaper.category,
    keywords: wallpaper.tags.join(', '),
    image: [`https://${siteConfig.domain}${wallpaper.poster}`],
    brand: { '@type': 'Brand', name: siteConfig.name },
    width: { '@type': 'QuantitativeValue', value: wallpaper.width, unitCode: 'E37' },
    height: { '@type': 'QuantitativeValue', value: wallpaper.height, unitCode: 'E37' },
    ...(wallpaper.author ? { creator: { '@type': 'Person', name: wallpaper.author } } : {}),
    offers: {
      '@type': 'Offer',
      price: wallpaper.price ?? 0,
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
      url: absoluteLocalizedUrl(`/wallpapers/${wallpaper.slug}`, locale),
      priceValidUntil: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    },
  };

  return JSON.stringify(data);
}

/** JSON-LD для пака. */
export function packJsonLd(pack: Pack, locale: 'ru' | 'en' = 'ru'): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pack.title,
    description: pack.description,
    sku: pack.id,
    image: [`https://${siteConfig.domain}${pack.poster}`],
    brand: { '@type': 'Brand', name: siteConfig.name },
    offers: {
      '@type': 'Offer',
      price: pack.price,
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
      url: absoluteLocalizedUrl(`/packs/${pack.slug}`, locale),
    },
  };

  return JSON.stringify(data);
}

/** JSON-LD для страницы FAQ (расширенные сниппеты Google). */
export function faqJsonLd(items: Array<{ question: string; answer: string }>): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return JSON.stringify(data);
}

/** JSON-LD для организации. */
export function organizationJsonLd(): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: `https://${siteConfig.domain}`,
    logo: `https://${siteConfig.domain}/logo.svg`,
    email: siteConfig.CONTACTS.email,
    sameAs: [siteConfig.SOCIAL.telegram, siteConfig.SOCIAL.vk, siteConfig.SOCIAL.github],
  };

  return JSON.stringify(data);
}
