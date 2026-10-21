'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

/**
 * Список вопросов-ответов (аккордеон).
 *
 * Используется и на главной странице (сокращённый список), и на странице FAQ.
 */
export function FaqAccordion({ items }: { items: FaqEntry[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
