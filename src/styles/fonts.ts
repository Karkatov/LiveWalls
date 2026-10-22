import { Inter } from 'next/font/google';

/**
 * Шрифты сайта.
 *
 * Современный геометрический гротеск — Inter. Чистый, чёткий,
 * хорошо держит крупные заголовки.
 */

/** Основной sans — текст, UI, кнопки, заголовки. */
export const sans = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-sans-ui',
});

/** Классы для `<html>`: подключают CSS-переменные шрифтов. */
export const fontClasses = `${sans.variable}`;
