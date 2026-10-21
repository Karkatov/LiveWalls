import { describe, expect, it } from 'vitest';
import {
  discountPercent,
  formatDateShort,
  formatDiscount,
  formatDuration,
  formatFileSize,
  formatNumber,
  formatPrice,
} from '@/lib/utils/format';

describe('formatPrice', () => {
  it('форматирует рубли по требованиям (ru-RU, RUB)', () => {
    expect(formatPrice(890)).toBe('890\u00a0₽');
    expect(formatPrice(199)).toBe('199\u00a0₽');
  });

  it('не показывает копейки', () => {
    expect(formatPrice(890.5)).not.toContain(',');
  });
});

describe('formatNumber', () => {
  it('разделяет разряды пробелом', () => {
    expect(formatNumber(1240).replace(/[\s\u00a0]/g, ' ')).toBe('1 240');
  });
});

describe('formatDuration', () => {
  it('переводит секунды в мин:сек', () => {
    expect(formatDuration(24)).toBe('0:24');
    expect(formatDuration(125)).toBe('2:05');
  });

  it('возвращает 0:00 для некорректного значения', () => {
    expect(formatDuration(-1)).toBe('0:00');
  });
});

describe('formatFileSize', () => {
  it('переводит байты в мегабайты', () => {
    expect(formatFileSize(10 * 1024 * 1024)).toContain('МБ');
    expect(formatFileSize(0)).toBe('0 МБ');
  });
});

describe('formatDateShort', () => {
  it('возвращает пустую строку для битой даты', () => {
    expect(formatDateShort('не дата')).toBe('');
  });
});

describe('discountPercent', () => {
  it('считает процент скидки (890 → 690)', () => {
    expect(discountPercent(890, 690)).toBe(22);
  });

  it('возвращает 0 для некорректных значений', () => {
    expect(discountPercent(0, 100)).toBe(0);
    expect(discountPercent(100, 120)).toBe(0);
  });
});

describe('formatDiscount', () => {
  it('печатает знак минуса', () => {
    expect(formatDiscount(22)).toBe('−22%');
  });
});
