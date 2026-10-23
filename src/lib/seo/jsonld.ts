import type { Wallpaper } from '@/types';
import { siteConfig } from '@/config/site';
import { absoluteLocalizedUrl } from './metadata';

/**
 * Structured data (JSON-LD) для обоев.
 *
 * Обои входят в каталог приложения и не продаются поштучно, поэтому
 * разметка описывает медиаматериал, а не товар с ценой.
 */

/** Абсолютный URL медиа: CDN-ссылки не дублируем доменом сайта. */
function absoluteMediaUrl(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${siteConfig.domain}${value.startsWith('/') ? value : `/${value}`}`;
}

/** JSON-LD для карточки обоев. */
export function wallpaperJsonLd(wallpaper: Wallpaper, locale: 'ru' | 'en' = 'ru'): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: wallpaper.title,
    description: wallpaper.description,
    identifier: wallpaper.id,
    genre: wallpaper.category,
    keywords: wallpaper.tags.join(', '),
    image: [absoluteMediaUrl(wallpaper.poster)],
    creator: wallpaper.author
      ? { '@type': 'Person', name: wallpaper.author }
      : { '@type': 'Organization', name: siteConfig.name },
    width: { '@type': 'QuantitativeValue', value: wallpaper.width, unitCode: 'E37' },
    height: { '@type': 'QuantitativeValue', value: wallpaper.height, unitCode: 'E37' },
    url: absoluteLocalizedUrl(`/wallpapers/${wallpaper.slug}`, locale),
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
