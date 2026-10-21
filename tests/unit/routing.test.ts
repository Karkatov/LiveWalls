import { describe, expect, it } from 'vitest';
import { defaultLocale, isValidLocale, locales } from '@/i18n/routing';

describe('маршрутизация локалей', () => {
  it('поддерживает ru и en', () => {
    expect(locales).toEqual(['ru', 'en']);
  });

  it('по умолчанию — русский', () => {
    expect(defaultLocale).toBe('ru');
  });

  it('isValidLocale отсекает неизвестные локали', () => {
    expect(isValidLocale('ru')).toBe(true);
    expect(isValidLocale('en')).toBe(true);
    expect(isValidLocale('de')).toBe(false);
    expect(isValidLocale('')).toBe(false);
  });
});
