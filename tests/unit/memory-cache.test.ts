import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearMemoryCache, invalidateMemoryCache, withMemoryCache } from '@/lib/cache/memory-cache';

describe('memory cache', () => {
  beforeEach(() => {
    clearMemoryCache();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    clearMemoryCache();
  });

  it('кеширует результат на TTL и не вызывает loader повторно', async () => {
    const loader = vi.fn(async () => 'value');

    await expect(withMemoryCache('key', loader, 60)).resolves.toBe('value');
    await expect(withMemoryCache('key', loader, 60)).resolves.toBe('value');

    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('перезагружает данные после истечения TTL', async () => {
    const loader = vi.fn(async () => Date.now());

    await withMemoryCache('key', loader, 1);
    vi.advanceTimersByTime(1_001);
    await withMemoryCache('key', loader, 1);

    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('инвалидирует ключи по префиксу', async () => {
    const loader = vi.fn(async () => 'value');

    await withMemoryCache('wallpapers:1', loader, 60);
    await withMemoryCache('categories:1', loader, 60);

    invalidateMemoryCache('wallpapers:');

    await withMemoryCache('wallpapers:1', loader, 60);
    await withMemoryCache('categories:1', loader, 60);

    expect(loader).toHaveBeenCalledTimes(3);
  });
});
