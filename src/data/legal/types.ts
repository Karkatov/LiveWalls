/**
 * Тексты юридических документов.
 *
 * ВАЖНО: это шаблоны-заглушки. Перед публикацией их должен проверить юрист
 * и подставить реальные реквизиты оператора (см. src/config/site.ts → LEGAL).
 */

export type Locale = 'ru' | 'en';

export interface LegalSection {
  id: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
}

export interface LegalDocument {
  title: string;
  updatedAt: string;
  intro?: string;
  sections: LegalSection[];
}
