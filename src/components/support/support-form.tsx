'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/** Схема формы поддержки. */
const supportSchema = z.object({
  name: z.string().trim().min(2, 'name'),
  email: z.email('email'),
  topic: z.string().trim().min(3, 'topic'),
  message: z.string().trim().min(10, 'message'),
});

type SupportValues = z.infer<typeof supportSchema>;
type FieldName = keyof SupportValues;

/**
 * Форма обращения в поддержку.
 *
 * В демо-режиме запрос никуда не уходит — показывается сообщение об успехе.
 * Для подключения реальной отправки достаточно реализовать вызов API
 * в обработчике `handleSubmit`.
 */
export function SupportForm() {
  const t = useTranslations('support');
  const tErrors = useTranslations('support.errors');
  const tToast = useTranslations('toast');
  const reduce = useReducedMotion();

  const [values, setValues] = useState<SupportValues>({
    name: '',
    email: '',
    topic: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const setField = (field: FieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSent(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = supportSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Partial<Record<FieldName, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as FieldName | undefined;
        if (field && !fieldErrors[field]) fieldErrors[field] = tErrors(issue.message);
      }
      setErrors(fieldErrors);
      return;
    }

    setSending(true);
    setSent(false);
    try {
      // TODO: подключить отправку на бэкенд (см. TODO.md → «Поддержка»).
      await new Promise((resolve) => setTimeout(resolve, 400));
      setSent(true);
      setValues({ name: '', email: '', topic: '', message: '' });
    } catch {
      toast.error(t('error'));
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label={t('name')}
          error={errors.name}
          placeholder={t('namePlaceholder')}
          value={values.name}
          onChange={(value) => setField('name', value)}
        />

        <Field
          id="email"
          type="email"
          label={t('email')}
          error={errors.email}
          placeholder={t('emailPlaceholder')}
          value={values.email}
          onChange={(value) => setField('email', value)}
        />
      </div>

      <Field
        id="topic"
        label={t('topic')}
        error={errors.topic}
        placeholder={t('topicPlaceholder')}
        value={values.topic}
        onChange={(value) => setField('topic', value)}
      />

      <Field
        id="message"
        label={t('message')}
        error={errors.message}
        placeholder={t('messagePlaceholder')}
        value={values.message}
        onChange={(value) => setField('message', value)}
        multiline
      />

      <AnimatePresence initial={false}>
        {sent && (
          <motion.div
            key="support-success"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduce ? 0.12 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            aria-live="polite"
            className="border-brand/25 bg-brand/8 flex items-start gap-3 rounded-2xl border p-4"
          >
            <CheckCircle2
              className="text-brand-foreground mt-0.5 size-5 shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="text-foreground text-sm font-semibold">{t('success')}</p>
              <p className="text-muted-foreground mt-0.5 text-sm">{t('successBody')}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={reduce ? undefined : { scale: 1.02 }}
        whileTap={reduce ? undefined : { scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        className="w-full sm:w-auto"
      >
        <Button type="submit" variant="gradient" size="lg" disabled={sending} className="w-full">
          {sending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              {t('sending')}
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden="true" />
              {t('send')}
            </>
          )}
        </Button>
      </motion.div>

      <p className="text-muted-foreground text-xs">{tToast('sentBody')}</p>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  placeholder,
  value,
  onChange,
  type = 'text',
  multiline = false,
}: {
  id: string;
  label: string;
  error?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  multiline?: boolean;
}) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      {multiline ? (
        <Textarea
          id={id}
          name={id}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
      ) : (
        <Input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
      )}

      {error && (
        <p id={errorId} className="text-destructive text-xs">
          {error}
        </p>
      )}
    </div>
  );
}
