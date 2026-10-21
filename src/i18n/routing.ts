import { defineRouting } from 'next-intl/routing';

/**
 * Маршрутизация локалей.
 *
 * Русский — основной язык (по умолчанию), английский — опциональный.
 * Локаль лежит в сегменте пути: /ru/... и /en/...
 * Такой подход работает и на серверных хостингах, и при статическом экспорте
 * (GitHub Pages) — middleware не требуется.
 */
export const routing = defineRouting({
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];

/** Список поддерживаемых локалей. */
export const locales = routing.locales;

/** Локаль по умолчанию. */
export const defaultLocale = routing.defaultLocale;

/**
 * Проверка, что строка — поддерживаемая локаль.
 *
 * Своя реализация вместо `hasLocale` из next-intl: в v3 такой хелпер
 * отсутствует, а тайп-гард нам нужен в нескольких местах.
 */
export function isValidLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}
