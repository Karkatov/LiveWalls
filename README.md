# LiveWalls — сайт

Промо-сайт приложения **LiveWalls** (живые обои для macOS): каталог обоев, паки, тарифы,
страница загрузки, поддержка, личный кабинет и демо-админка.

## Стек

| Слой        | Технологии                                                              |
| ----------- | ----------------------------------------------------------------------- |
| Framework   | Next.js 15 (App Router), React 19, TypeScript (strict)                  |
| Стили       | Tailwind CSS v4, CSS-переменные в `src/styles/globals.css`              |
| UI          | shadcn/ui (Radix UI) — компоненты собраны вручную в `src/components/ui` |
| Анимации    | Framer Motion (`src/components/shared/motion.tsx`)                      |
| Иконки      | Lucide React                                                            |
| Локализация | next-intl 3 (сегмент пути `/[locale]`)                                  |
| Состояние   | Zustand (+ `persist` для избранного и корзины)                          |
| Тема        | next-themes                                                             |
| Формы       | React Hook Form-ready, валидация Zod 4                                  |
| Тесты       | Vitest (юнит) + Playwright (E2E)                                        |
| Линтинг     | ESLint 9 (flat config), Prettier, Husky + lint-staged                   |

## Быстрый старт

```bash
npm install
cp .env.example .env.local   # опционально: ключи API и Sentry
npm run dev                  # http://localhost:3000 → редирект на /ru
```

## Команды

| Команда                           | Что делает                                       |
| --------------------------------- | ------------------------------------------------ |
| `npm run dev`                     | Dev-сервер с HMR                                 |
| `npm run build`                   | Продакшен-сборка (+ `postbuild`)                 |
| `npm run start`                   | Запуск собранного приложения                     |
| `npm run typecheck`               | `tsc --noEmit`                                   |
| `npm run lint` / `lint:fix`       | ESLint                                           |
| `npm run format` / `format:check` | Prettier                                         |
| `npm test`                        | Юнит-тесты (Vitest)                              |
| `npm run test:e2e`                | E2E-тесты (Playwright, собирает приложение сама) |
| `npm run assets`                  | Перегенерация плейсхолдеров и иконок в `public/` |

## Режимы сборки

Управляются переменной окружения `NEXT_OUTPUT`:

| `NEXT_OUTPUT`            | Результат                              | Куда деплоить                                             |
| ------------------------ | -------------------------------------- | --------------------------------------------------------- |
| `default` (по умолчанию) | Обычный Next.js-сервер, ISR            | Vercel, Netlify, VPS                                      |
| `standalone`             | `output: 'standalone'`                 | Docker / VPS (запуск `node .next/standalone/server.js`)   |
| `export`                 | Полностью статический экспорт в `out/` | GitHub Pages, Cloudflare Pages, любой статический хостинг |

```bash
NEXT_OUTPUT=standalone npm run build
NEXT_OUTPUT=export NEXT_BASE_PATH=/LiveWallsSite NEXT_ASSET_PREFIX=/LiveWallsSite npm run build
```

В режиме `export`:

- `images.unoptimized` включён автоматически (нет image-сервера);
- серверные редиректы недоступны — корень `/` закрывает `scripts/postbuild.mjs`
  (мета-редирект + JS на `/ru`);
- `next.config.ts` → `headers()` не применяются — для статических хостингов
  используйте `public/_headers` (Netlify / Cloudflare Pages);
- `next-intl` и `searchParams` работают: на странице каталога `searchParams`
  читается только в серверном режиме, в экспорте — уже в браузере.

## Структура

```
src/
  app/
    [locale]/          — все страницы (локаль в сегменте пути)
    global-not-found.tsx — 404 для маршрутов вне локалей (рендерится без layout)
    robots.ts, sitemap.ts
  components/
    ui/                — shadcn/ui-примитивы
    layout/, home/, catalog/, wallpaper/, packs/, faq/, support/, account/, admin/, legal/, shared/, onboarding/
  config/site.ts       — единый конфиг: цены, навигация, API, S3/CDN, легал
  data/mock/           — демо-данные (34 обоев, 9 категорий, 5 паков, отзывы)
  data/legal/          — тексты legal-документов (RU/EN)
  i18n/                — routing, request, navigation
  lib/
    api/               — клиент API (мок-режим, реальный режим — за флагом)
    catalog/filters.ts — чистая логика фильтров/сортировки/пагинации
    seo/               — metadata и JSON-LD
    store/, hooks/, utils/
  messages/            — ru.json, en.json
  styles/              — theme.ts, globals.css
  types/               — доменные типы
scripts/               — генерация плейсхолдеров и postbuild
tests/                 — unit/ и e2e/
```

## Локализация

- Локали: `ru` (по умолчанию) и `en`, префикс в URL всегда: `/ru/...`, `/en/...`.
- Middleware нет намеренно — локаль лежит в сегменте пути, поэтому всё работает
  и на сервере, и в статическом экспорте.
- Все пользовательские строки — в `src/messages/*.json`; UI не должен содержать «сырых» строк.
- Ссылки внутри приложения — только через `Link` из `@/i18n/navigation`,
  иначе потеряется префикс локали.

## Демо-режим

Сейчас сайт работает на моках (`src/data/mock`). Переключение на реальный API —
в `src/lib/api/*` (флаги `siteConfig.API.mode`). Ключевые заглушки:
корзина, оплата, личный кабинет, админка (вход по паролю `ADMIN_PASSWORD`,
в статическом экспорте — через SHA-256-хеш на клиенте).

## Цены

Заданы в `src/config/site.ts` → `pricing` (в рублях):
пробный период 24 ч, пожизненный доступ 890 ₽, год 490 ₽, пак из 10 обоев 199 ₽,
одни обои 99 ₽, пробническая скидка 690 ₽ (−22%).

## Деплой

- **Vercel / Netlify**: Framework Preset = Next.js, `NEXT_OUTPUT=default`.
- **Docker / VPS**: `NEXT_OUTPUT=standalone npm run build`, затем
  `node .next/standalone/server.js` (не забудьте скопировать `.next/static` и `public`).
- **GitHub Pages**: `NEXT_OUTPUT=export NEXT_BASE_PATH=/<repo> NEXT_ASSET_PREFIX=/<repo> npm run build`,
  публиковать содержимое `out/`.

## Лицензия и контент

Контент приложения MacWall в сайт не переносится: демо-изображения — собственные
SVG-плейсхолдеры, сгенерированные скриптом `npm run assets`.
