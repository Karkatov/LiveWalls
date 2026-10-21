import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

/**
 * Загрузка сообщений для текущей локали.
 *
 * next-intl вызывает эту функцию на сервере; при `localePrefix: 'always'`
 * локаль берётся из сегмента пути.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested && routing.locales.includes(requested as (typeof routing.locales)[number])
      ? (requested as (typeof routing.locales)[number])
      : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Europe/Moscow',
    now: new Date(),
  };
});
