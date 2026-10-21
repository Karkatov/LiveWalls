import { getTranslations } from 'next-intl/server';
import type { LegalDocument } from '@/data/legal/types';
import { cn } from '@/lib/utils/cn';

/**
 * Отрисовка юридического документа: оглавление, разделы, дисклеймер.
 */
export async function LegalDocumentView({ document }: { document: LegalDocument }) {
  const t = await getTranslations('legal');

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
      {/* Оглавление */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <nav
          aria-label={t('tocTitle')}
          className="border-border/60 bg-card/40 rounded-2xl border p-5 backdrop-blur-xl"
        >
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">
            {t('tocTitle')}
          </p>

          <ol className="mt-3 space-y-1.5">
            {document.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-muted-foreground hover:text-foreground block rounded text-sm underline-offset-4 transition-colors hover:underline"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>

      {/* Текст */}
      <article className="min-w-0">
        <header>
          <h1 className="text-foreground text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {document.title}
          </h1>
          <p className="text-muted-foreground mt-3 text-sm">
            {t('lastUpdated', { date: document.updatedAt })}
          </p>
          <p className="text-muted-foreground/80 mt-1 text-xs">{t('disclaimer')}</p>
        </header>

        {document.intro && (
          <p className="border-border/60 bg-card/40 text-muted-foreground mt-8 rounded-2xl border p-5 text-sm leading-relaxed backdrop-blur-xl">
            {document.intro}
          </p>
        )}

        <div className="mt-10 space-y-10">
          {document.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <h2 className="text-foreground text-lg font-semibold tracking-tight">
                {section.title}
              </h2>

              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-muted-foreground mt-3 text-sm leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}

              {section.list && (
                <ul className="mt-3 space-y-2">
                  {section.list.map((item) => (
                    <li
                      key={item.slice(0, 32)}
                      className="text-muted-foreground flex gap-3 text-sm leading-relaxed"
                    >
                      <span
                        aria-hidden="true"
                        className="bg-brand mt-2 size-1 shrink-0 rounded-full"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <a
          href="#top"
          className={cn(
            'border-border/70 bg-secondary/50 mt-12 inline-flex items-center gap-2 rounded-full border px-4 py-2',
            'text-muted-foreground hover:text-foreground text-sm transition-colors',
          )}
        >
          ↑ {t('backToTop')}
        </a>
      </article>
    </div>
  );
}
