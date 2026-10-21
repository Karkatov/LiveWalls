'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

/**
 * Страница ошибки (500).
 *
 * Next.js требует, чтобы error.tsx был клиентским компонентом:
 * в нём доступен reset() для повторной попытки рендера.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors');

  useEffect(() => {
    // TODO: подключить отправку ошибок в Sentry — см. TODO.md.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-[900px] flex-col items-center px-4 py-20 text-center sm:px-6 lg:py-28">
      <span className="bg-destructive/12 text-destructive ring-destructive/25 flex size-16 items-center justify-center rounded-2xl ring-1">
        <AlertTriangle className="size-7" aria-hidden="true" />
      </span>

      <h1 className="text-foreground mt-6 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {t('errorTitle')}
      </h1>

      <p className="text-muted-foreground mt-3 max-w-lg text-base leading-relaxed text-pretty">
        {t('errorBody')}
      </p>

      {error.digest && (
        <p className="text-muted-foreground mt-3 font-mono text-xs">
          {t('code')}: {error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        <Button variant="gradient" onClick={reset}>
          <RotateCcw className="size-4" />
          {t('errorCta')}
        </Button>

        <Button asChild variant="outline">
          <Link href="/">
            <Home className="size-4" />
            {t('home')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
