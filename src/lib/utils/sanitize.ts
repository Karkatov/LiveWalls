import { siteConfig } from '@/config/site';

/**
 * Санитизация пользовательского ввода.
 *
 * Основа — «безопасный текст»: вырезаем управляющие символы, нормализуем
 * пробелы и обрезаем длину. Для форм поддержки этого достаточно:
 * текст всё равно уходит на бэкенд, где его нужно экранировать при выводе.
 */

/** Убирает управляющие символы и нормализует пробелы. */
export function sanitizeText(input: string, maxLength = 2000): string {
  return input
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLength);
}

/** Очищает имя/тему — только буквы, цифры, пробелы, дефис и точка. */
export function sanitizeName(input: string, maxLength = 80): string {
  return input
    .replace(/[^\p{L}\p{N}\s.-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/** Нормализует email для хранения и сравнения. */
export function normalizeEmail(input: string): string {
  return input.trim().toLowerCase().slice(0, 254);
}

/** Экранирует текст для безопасной вставки в HTML. */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** URL сайта — для абсолютных ссылок в письмах и метаданных. */
export function siteUrl(path = '/'): string {
  return `https://${siteConfig.domain}${path.startsWith('/') ? path : `/${path}`}`;
}
