import { Playfair_Display, Inter } from 'next/font/google';

/**
 * Шрифты сайта.
 *
 * Роли повторяют референс Daylight: крупные серифные заголовки с
 * отрицательным трекингом + нейтральный геометрический sans для текста.
 *
 * `Playfair Display` — свободная альтернатива ABC Arizona Flare (сериф),
 * `Inter` — нейтральный аналог ABC Room. Обе под лицензией OFL.
 */

/** Дисплейный сериф — для заголовков. */
export const displaySerif = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display-serif',
});

/** Основной sans — текст, UI, кнопки. */
export const sans = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-sans-ui',
});

/** Классы для `<html>`: подключают CSS-переменные шрифтов. */
export const fontClasses = `${displaySerif.variable} ${sans.variable}`;
