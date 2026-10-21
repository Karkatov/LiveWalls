# Changelog

Все значимые изменения проекта фиксируются здесь.
Формат — по [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/),
версии — по [SemVer](https://semver.org/lang/ru/).

## [0.1.0] — 2026-10-21

### Добавлено

- Каркас проекта: Next.js 15 (App Router), TypeScript strict, Tailwind CSS v4,
  ESLint 9 (flat config) + Prettier + Husky/lint-staged.
- Дизайн-система: токены в `src/styles/theme.ts` и `globals.css`, UI-кит
  `src/components/ui` (кнопки, карточки, поля, вкладки, аккордеон, тултипы, бейджи).
- Локализация: next-intl, локаль в сегменте пути (`/ru`, `/en`), словари
  `src/messages/ru.json` и `src/messages/en.json`, переключатель языка.
- Страницы: главная, каталог обоев с фильтрами/сортировкой/пагинацией,
  страница обоев, паки и страница пака, цены, о приложении, FAQ, поддержка,
  загрузка, личный кабинет, админка, legal-документы (privacy / terms / offer).
- SEO: `buildMetadata`, JSON-LD (обои, пак, FAQ), `sitemap.xml`, `robots.txt`,
  Open Graph-изображение.
- Обработка ошибок: `error.tsx`, `not-found.tsx`, `global-not-found.tsx`
  (брендированная 404 для маршрутов вне локалей).
- Публичные ассеты: генератор SVG-плейсхолдеров, логотипы, favicon,
  apple-touch-icon, OG-изображение, манифест.
- Режимы сборки: статический экспорт по умолчанию (`out/`), серверный —
  `NEXT_OUTPUT=server`, Docker — `NEXT_OUTPUT=standalone`; скрипты
  `scripts/generate-placeholders.mjs` и `scripts/postbuild.mjs`.
- Тесты: Vitest (фильтры каталога, форматирование, локали) и Playwright (E2E-смок).
- Документация: README.md, TODO.md, DECISIONS.md, CHANGELOG.md.

### Исправлено

- Сборка на Cloudflare Pages падала с `Error: Output directory "out" not found`:
  статический экспорт теперь включён в `next.config.ts` принудительно и не
  зависит от `NEXT_OUTPUT` (Cloudflare не передаёт переменные окружения в сборку).
- Корень `/` в статическом экспорте редиректит на `/ru` при любом способе
  сборки: добавлен `public/index.html` (Cloudflare по умолчанию выполняет
  `npx next build` и не запускает `postbuild`).
- Предупреждение Next.js о постороннем `package-lock.json` в корне проекта —
  задано `outputFileTracingRoot`.

### Известные ограничения

- Данные — моки (`src/data/mock`), реальный API не подключён.
- Оплата, аккаунт и админка — демонстрационные заглушки.
- Legal-тексты — шаблоны, требуют проверки юристом.
