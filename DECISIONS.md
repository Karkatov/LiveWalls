# Технические решения

## Локаль в сегменте пути, без middleware

`src/app/[locale]/…`, `localePrefix: 'always'`, `setRequestLocale(locale)` в layout.

**Почему:** один и тот же код должен собираться и как серверное приложение
(Vercel/VPS), и как статический экспорт (GitHub Pages). Middleware в статическом
экспорте не работает, а локаль в пути работает везде. Цена — дублирование
префикса в URL и `generateStaticParams` для каждого динамического сегмента.

**Следствие:** все ссылки внутри приложения — через `Link` из `@/i18n/navigation`.
Обычный `next/link` не подставит локаль.

## `isValidLocale` вместо `hasLocale`

В next-intl 3.26 нет хелпера `hasLocale`, который есть в более новых версиях.
В `src/i18n/routing.ts` написан собственный type-guard — он же используется
в `generateStaticParams` и в проверке параметров.

## Три режима сборки через `NEXT_OUTPUT`

`export` (по умолчанию) / `server` / `standalone` (см. `next.config.ts`).

**Статический экспорт включён принудительно** и не зависит от `NEXT_OUTPUT`:
Cloudflare Pages не передаёт переменные окружения в процесс сборки, а каталог
`out/` там обязателен — из-за этого сборка падала с
`Error: Output directory "out" not found`. Теперь режим определяется так:

- `NEXT_OUTPUT` отсутствует или не равен `server`/`standalone` → `output: 'export'`;
- `NEXT_OUTPUT=server` → обычный Next.js-сервер (Vercel, Netlify, VPS);
- `NEXT_OUTPUT=standalone` → `output: 'standalone'` (Docker).

`scripts/postbuild.mjs` определяет режим по фактическому результату сборки,
а не по env, — иначе он печатал бы неверные подсказки по деплою.

Один код — три способа задеплоить: Cloudflare Pages / GitHub Pages (статика),
Vercel/Netlify (сервер), Docker/VPS (standalone).

В `export` недоступны: server actions, серверные редиректы, `headers()`,
оптимизация картинок. Отсюда:

- корень `/` закрывает `scripts/postbuild.mjs` (мета-редирект на `/ru`);
- заголовки безопасности для статики — `public/_headers`;
- админка не использует server actions: пароль сверяется по SHA-256 на клиенте;
- на странице каталога `searchParams` читается только в серверном режиме,
  в экспорте фильтры применяются в браузере.

## SVG-плейсхолдеры и `next/image`

Локальные SVG-иллюстрации (обои, категории, превью приложения) генерируются
скриптом `scripts/generate-placeholders.mjs` — без бинарных ассетов в репозитории.
`next/image` их не оптимизирует, поэтому в `next.config.ts` включён
`dangerouslyAllowSVG` с жёстким CSP (`script-src 'none'; sandbox;`) и
`contentDispositionType: 'attachment'`.

## Логика каталога вынесена в чистый модуль

`src/lib/catalog/filters.ts` содержит `filterWallpapers`, `sortWallpapers`,
`paginate`, `parseFilters`, `filtersToQuery` — без React и без сетевых запросов.
Один и тот же код используется и на сервере (SSR), и в браузере (`CatalogBrowser`),
поэтому фильтры и URL ведут себя одинаково в обоих режимах.

## Админка без server actions

Чтобы `/admin` работал и в статическом экспорте, сервер считает SHA-256-хеш
`ADMIN_PASSWORD` и передаёт его в клиентский компонент; ввод пароля сверяется
через `crypto.subtle`. Это демонстрация, а не защита — реальный доступ к админке
требует серверной авторизации (см. TODO.md).

## Правовые документы — шаблоны

Тексты в `src/data/legal/*` (RU/EN) — шаблоны с плейсхолдерными реквизитами
и дисклеймером. Перед публикацией их должен проверить юрист (см. TODO.md).

## Цены и форматирование

Все цены — целые рубли, `Intl.NumberFormat('ru-RU', { currency: 'RUB' })`
→ «890 ₽». Значения хранятся в `src/config/site.ts` (`pricing`), чтобы цены
и скидки не дублировались по страницам.
