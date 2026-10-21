import * as React from 'react';
import { cn } from '@/lib/utils/cn';

/** Поле ввода. */
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = 'text', ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      'border-input/70 bg-background/60 text-foreground flex h-11 w-full rounded-xl border px-4 py-2 text-sm',
      'placeholder:text-muted-foreground/70 transition-colors duration-200',
      'focus-visible:border-signal/60 focus-visible:bg-background focus-visible:ring-signal/30 focus-visible:ring-2 focus-visible:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'aria-invalid:border-destructive/70 aria-invalid:ring-destructive/20',
      className,
    )}
    {...props}
  />
));
Input.displayName = 'Input';

/** Многострочное поле. */
export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'border-input/70 bg-background/60 text-foreground flex min-h-32 w-full resize-y rounded-xl border px-4 py-3 text-sm',
      'placeholder:text-muted-foreground/70 transition-colors duration-200',
      'focus-visible:border-signal/60 focus-visible:bg-background focus-visible:ring-signal/30 focus-visible:ring-2 focus-visible:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'aria-invalid:border-destructive/70 aria-invalid:ring-destructive/20',
      className,
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';
