'use client';

import { useCallback, useEffect, useState } from 'react';
import { ONBOARDING_STORAGE_KEY } from '@/config/site';

/**
 * Онбординг-модалка: показывается при первом заходе на сайт.
 *
 * Флаг хранится в localStorage. Позже синхронизируется с аккаунтом,
 * чтобы не показывать её повторно на другом устройстве.
 */
export function useOnboarding() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const seen = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (!seen) setOpen(true);
    } catch {
      // localStorage недоступен (приватный режим) — просто не показываем.
    }
    setReady(true);
  }, []);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, '1');
    } catch {
      // игнорируем — просто закроем в текущей сессии.
    }
  }, []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    } catch {
      // игнорируем
    }
    setOpen(true);
  }, []);

  return { open, setOpen, dismiss, reset, ready };
}
