import { palette } from '@/styles/theme';

/**
 * Форматирование чисел, цен, дат и размеров.
 *
 * Все цены — в рублях. Формат фиксирован по требованиям: Intl.NumberFormat('ru-RU')
 * со стилем 'currency' и валютой RUB → «890 ₽».
 */

export const PRICE_LOCALE = 'ru-RU';
export const DATE_LOCALE = 'ru-RU';

/**
 * Тег Intl для локали сайта.
 *
 * Раньше даты и цены всегда форматировались как `ru-RU`, поэтому на
 * английских страницах показывалось «21 октября 2026 г.» и «890 ₽».
 */
export function localeTag(locale: string): string {
  return locale === 'en' ? 'en-US' : 'ru-RU';
}

/** «890 ₽» */
export function formatPrice(amount: number, locale: string = PRICE_LOCALE): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** «1 240» */
export function formatNumber(value: number, locale: string = PRICE_LOCALE): string {
  return new Intl.NumberFormat(locale).format(value);
}

/** «21 октября 2026 г.» */
export function formatDate(value: string | Date, locale: string = DATE_LOCALE): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/** «21.10.2026» — компактный вариант для таблиц. */
export function formatDateShort(value: string | Date, locale: string = DATE_LOCALE): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/** Секунды → «0:24» */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}:${rest.toString().padStart(2, '0')}`;
}

/** Байты → «24 МБ» (ru-RU) */
export function formatFileSize(bytes: number, locale: string = PRICE_LOCALE): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 МБ';
  const units = ['Б', 'КБ', 'МБ', 'ГБ'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  const unit = units[exponent] ?? 'МБ';
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: value < 10 ? 1 : 0 }).format(value)} ${unit}`;
}

/** «3840 × 2160» */
export function formatResolution(width: number, height: number): string {
  return `${width} × ${height}`;
}

/** Проценты скидки: цена 690 ₽ при базовой 890 ₽ → 22 */
export function discountPercent(base: number, sale: number): number {
  if (base <= 0 || sale >= base) return 0;
  return Math.round(((base - sale) / base) * 100);
}

/** «24 часа» / «1 год» — для тарифов. */
export function pluralRu(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/** Проценты вычитания из цены: «−22%» */
export function formatDiscount(percent: number): string {
  return `−${percent}%`;
}

/** Ссылка на обои с CDN/S3 (пустая, пока нет реального хостинга). */
export function mediaBase(): string {
  return palette.background;
}
