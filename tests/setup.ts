import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import type * as NextIntl from 'next-intl';

afterEach(() => {
  cleanup();
});

// jsdom не реализует matchMedia — нужен для next-themes и prefers-reduced-motion.
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

// next-intl в тестах использует серверные компоненты вне провайдера.
vi.mock('next-intl', async () => {
  const actual = await vi.importActual<typeof NextIntl>('next-intl');
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});
