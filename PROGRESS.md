# PROGRESS

Чеклист работ над сайтом LiveWalls. Отмечаем выполненные пункты.
Порядок шагов — от фундамента к деплою.

## Шаг 0. Окружение и каркас проекта

- [x] `git init` в `/Users/duxxless/LiveWallsSite`
- [x] `package.json` (Next 15, React 19, TS, Tailwind v4, next-intl, zustand, framer-motion, zod)
- [x] `tsconfig.json` (strict + `noUncheckedIndexedAccess`)
- [x] `next.config.ts` (режимы `export` — по умолчанию / `server` / `standalone`, CSP, SVG для `next/image`)
- [x] `tailwind.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.prettierrc`, `.gitignore`, `.env.example`
- [x] `npm install` (578 пакетов)

## Шаг 1. Дизайн-система и UI-кит

- [x] Токены темы в `src/styles/theme.ts` + CSS-переменные в `src/styles/globals.css`
- [x] Тёмная тема по умолчанию, светлая — вторичная (next-themes)
- [x] UI-примитивы в `src/components/ui`: button, card, badge, input, label, select, tabs, accordion, tooltip, dialog, separator, switch, dropdown-menu, empty-state
- [x] Анимации: `src/components/shared/motion.tsx` (Reveal, StaggerGroup, StaggerItem, `useReducedMotion`)

## Шаг 2. Типы, мок-данные, конфиг

- [x] Доменные типы в `src/types/` (Wallpaper, Pack, Review, User, Purchase, Category)
- [x] Моки в `src/data/mock/` — 34 обоев, 9 категорий, 5 паков, 6 отзывов, 3 юзера, 3 покупки
- [x] `src/config/site.ts` — единая точка переключения мок/реал, цены, навигация, API, S3/CDN, легал
- [x] API-слой `src/lib/api/*` (мок-режим повторяет поведение реального API)

## Шаг 3. Локализация и SEO

- [x] `src/i18n/routing.ts` (локаль в пути, `isValidLocale`), `request.ts`, `navigation.ts`
- [x] Словари `src/messages/ru.json` (полный) и `src/messages/en.json` (зеркало)
- [x] `src/lib/seo/metadata.ts` (OG/Twitter, canonical, alternates) и `jsonld.ts`
- [x] `src/app/sitemap.ts`, `src/app/robots.ts` (force-static)

## Шаг 4. Каркас приложения

- [x] `src/app/[locale]/layout.tsx` — html/body, провайдеры, `setRequestLocale`, `generateStaticParams`
- [x] Header (sticky, мобильное меню, переключатели темы и языка), Footer
- [x] Онбординг-модалка (показ один раз, флаг в localStorage)
- [x] Стор и хуки: корзина, избранное, онбординг

## Шаг 5. Главная страница

- [x] Hero, featured-обои, категории, преимущества, отзывы, FAQ, CTA
- [x] Анимации появления (framer-motion), тёмная тема

## Шаг 6. Каталог обоев

- [x] `src/lib/catalog/filters.ts` — чистая логика фильтров/сортировки/пагинации/query
- [x] `CatalogBrowser` — фильтры, сортировка, пагинация, синхронизация URL, избранное
- [x] `WallpaperCard`, `WallpaperMedia` (image + blur, видео), `FavoriteButton`, `BuyButton`
- [x] Детальная страница обоев: превью, метаданные, характеристики, JSON-LD

## Шаг 7. Паки, цены, о приложении, FAQ

- [x] `/packs` и `/packs/[slug]` (состав пака, JSON-LD)
- [x] `/pricing` (тарифы, сравнение, FAQ по оплате)
- [x] `/about` (фичи, цифры, история)
- [x] `/faq` (аккордеон + JSON-LD FAQPage)

## Шаг 8. Поддержка, скачивание, legal

- [x] `/support` — форма (Zod 4), ошибки в namespace `support.errors`
- [x] `/download` — сборки под macOS, требования, шаги установки
- [x] `/legal/[doc]` — privacy / terms / offer, шаблоны RU+EN в `src/data/legal/*`

## Шаг 9. Кабинет и админка

- [x] `/account` — демо-панель: профиль, покупки, избранное, лицензия
- [x] `/admin` — вход по SHA-256-хешу пароля, таблицы обоев/паков/юзеров/покупок

## Шаг 10. Ошибочные страницы, ассеты, тесты, деплой

- [x] `not-found.tsx`, `error.tsx` (500 + reset), `global-not-found.tsx` (без layout, свой html/body)
- [x] `scripts/generate-placeholders.mjs` — 43 ассета: обои, категории, паки, аватары, скрины, лого, favicon, OG, манифест
- [x] `scripts/postbuild.mjs` — редирект `/` → `/ru` для статического экспорта
- [x] `public/index.html` — редирект `/` → `/ru` независимо от команды сборки
      (Cloudflare выполняет `npx next build` и не запускает `postbuild`)
- [x] `public/_headers` — заголовки безопасности и кеш для статических хостингов
- [x] Vitest: 25 unit-тестов (фильтры, форматирование, локали)
- [x] Playwright: 7 E2E-смоков (главная, каталог, пак, загрузка, /en, редирект, 404)
- [x] `netlify.toml`, `.github/workflows/ci.yml`, husky-хуки (pre-commit, commit-msg)
- [x] Документация: `README.md`, `TODO.md`, `DECISIONS.md`, `CHANGELOG.md`
- [x] Проверки: lint ✓, typecheck ✓, format ✓, unit 25/25 ✓, e2e 7/7 ✓, build (server) ✓, build (export) ✓

## Осталось (в TODO.md)

- [ ] Подключить реальный API каталога и серверную фильтрацию
- [ ] Загрузить реальные изображения в S3/CDN, добавить `remotePatterns`
- [ ] Интеграция оплаты, авторизация, реальная админка с CRUD
- [ ] Sentry, Web Vitals, Lighthouse ≥ 90, проверка доступности
- [ ] Вычитка EN-версии и legal-текстов юристом
