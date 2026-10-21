'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { useTheme } from 'next-themes';

/**
 * Контейнер тостов.
 * Тёмная тема наследуется от next-themes, поэтому тосты выглядят одинаково
 * в обеих темах.
 */
export function Toaster(props: ToasterProps) {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: 'glass-strong !rounded-xl !border-border/80 !shadow-2xl',
          title: '!text-foreground',
          description: '!text-muted-foreground',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
