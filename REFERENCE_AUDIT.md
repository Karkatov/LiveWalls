# REFERENCE_AUDIT — Daylight Computer → LiveWalls

Аудит статического дампа `daylightcomputer.com` (Next.js 15 + Tailwind, тот же стек, что у нас).
Цель — перенять **визуальный язык и приёмы**, реализовав их нашими средствами (Tailwind v4 + Framer Motion),
не копируя файлы и не ломая функционал LiveWalls.

---

## 1. Типографика

Референс строит всю иерархию на **двух гарнитурах** и резком контрасте «крупный serif ↔ мелкий sans».

| Роль                             | Гарнитура в референсе                                  | Метрики (из CSS)                              |
| -------------------------------- | ------------------------------------------------------ | --------------------------------------------- |
| Заголовки `title-*`              | ABC Arizona Flare (серифный, weight 300, italic-опция) | `line-height: .97`, `letter-spacing: -0.07em` |
| Текст, UI, кнопки `paragraph-*`  | ABC Room (геометрический sans)                         | `line-height: 1.1`, `letter-spacing: -0.05em` |
| Расширенный sans `Room Extended` | ABC Room Extended                                      | для широких строк/лейблов                     |
| Моно                             | системный `ui-monospace`                               | мелкие подписи, даты                          |

Ключевые приёмы:

- **Огромные заголовки**: `.title-lg` = `clamp(4.5rem → 9rem)`, `.title-md` = `clamp(2.5rem → 4.5rem)`, `.title-sm` = `clamp(2.5rem → 3rem)`.
- **Отрицательный трекинг** у всего: `-0.07em` заголовки, `-0.05em` body. Это главный признак «дорогой» типографики.
- **VW-масштаб**: размеры/отступы заданы в `vw` (`--spacing-vw-4: 4.267vw`), а на desktop ограничены `clamp()` по формуле `text-scale`.
- **`text-em-[N/M]`**: относительные размеры внутри компонентов (например `13/16` = 0.8125em) — текст масштабируется от размера родителя.
- **Аптайм-мелочи**: `text-pretty`, `text-balance`, `drop-shadow` на тексте поверх медиа, `font-feature-settings` выключены, `text-rendering: geometricPrecision`.

> У нас: Playfair Display (serif) + Manrope (sans) + JetBrains Mono — роли совпадают, но у нас **нет отрицательного трекинга** и размеры скромнее. Переносим трекинг и шкалу.

---

## 2. Цветовая палитра

Скудная, «природная», почти вся тёмная. Всё держится на одном акценте.

```
--color-cream        #faf5f2   /* основной светлый фон */
--color-cream-dark   #e8ded8   /* вторичный светлый */
--color-night        #18190f   /* тёмно-зелёно-чёрный фон (не чистый чёрный!) */
--color-gray         #17190f   /* текст на светлом */
--color-gray-lighter #262626
--color-amber        #ff9d00   /* ЕДИНСТВЕННЫЙ акцент */
--color-black        #000
--color-white        #fff
```

Приёмы:

- Фон секций — **`--color-night` (#18190f)**, тёплый оливково-чёрный, а не `#000`. Это сильно «удорожает» вид.
- Секции на светлом — cream; есть переходы через `mix-blend-multiply` (media ложится «в краску» фона).
- Акцент **янтарный `#ff9d00`** — у нас уже есть amber/signal; совпадает по духу.
- Полупрозрачности по alpha-hex: `bg-night/20`, `bg-moonlight/80`, `border-black/10`.
- `::selection { background: var(--color-amber) }` — выделение текста акцентом.
- `color-scheme: dark` по умолчанию.

---

## 3. Композиция и сетка

- **Full-bleed**: секции на всю ширину (`100vw`), контент внутри `.container` с `vw`-отступами.
- **Асимметрия**: hero — `flex justify-between`, заголовок слева внизу (`max-w-[10em]`), кнопка/статус справа; заголовок секции `lg:flex-row` — первая часть слева, вторая справа (`text-right`).
- **Много воздуха**: вертикальные отступы `py-vw-20`…`py-vw-56` (=20…56% ширины вьюпорта), `mb-[25vh]`.
- **Sticky-композиция**: заголовок секции `lg:sticky lg:top-[25lvh]`, контент проезжает рядом.
- **Scroll-driven «сцены»**: секции высотой `100vh`–`500vh` со `sticky`-внутренностями (`data-index-title`), скролл превращается в таймлайн.
- **Perspective-обёртки** `[perspective:900px]` / `[perspective:2000px]` вокруг заголовков — для 3D-переворота букв.
- Тонкая **сетка-фон** и вертикальные разделители (`questions_fit-vertical-guides`).
- Скроллбар **скрыт** (`scrollbar{width:0}`).

---

## 4. Анимации

### 4.1 Библиотеки

- **GSAP + ScrollTrigger** — scroll-driven, split-text по буквам (у нас их нет; запрещено добавлять зависимости).
- **Lenis** — smooth scroll (нет у нас).
- **WebGL/Canvas шейдеры** (`gl_FragColor`, `LoadPageCanvas`) — интерактивный фон hero и переход между страницами.
- CSS-анимации для Radix-подобных элементов.

> **Важно**: WebGL-канвас и GSAP/Lenis **не переносим напрямую** (запрет на новые зависимости + риск производительности). Заменяем на Framer Motion `useScroll`/`useTransform` и CSS.

### 4.2 Загрузка Hero

- Заголовок **разбит на буквы**: `<span class="char">` внутри `title-a`/`title-b`, обёртки с `perspective`. Буквы поочерёдно «влетают»/поворачиваются в 3D.
- Подзаголовок, статус «✓ In stock» и кнопка появляются после заголовка.
- Медиа hero — видео/картинка поверх, `mix-blend-multiply`, появляется после прелоада.

### 4.3 Скролл-эффекты

- **Sticky-сцены** с `data-index-title="Why?" | "Night"` — по мере прокрутки меняются надзаголовки/палитра.
- **Scroll-linked** движение через GSAP ScrollTrigger (у нас → `useScroll` + `useTransform`).
- Секции `motion-safe:invisible` пока скрипт не готов — затем проявляются (у нас → `whileInView`).
- **Reverse**: уважение к `prefers-reduced-motion` через `motion-safe:` / `motion-reduce:` — у нас уже есть глобальный медиа-запрос.

### 4.4 Ховеры и микро

- **`link_link`**: animated underline — `::after` шириной 100%, `transform: scaleX(0)` → `scaleX(1)`, `transform-origin: bottom right → bottom left`, `height: .055em`, `transition: transform .2s ease-out`. Это центральный микро-приём навигации.
- **Кнопка**: `box-shadow: 0 0 0 0 var(--hover-shadow-color)` → `hover: 0 0 24px 0` (свечение-ореол), `transition: box-shadow .3s ease-out`. Т.е. **ховер = свечение**, не масштаб.
- Иконка-play: `group-hover:scale-110`, `duration-500`.
- Кнопки формы: `rounded-[1em]`, `paragraph-uppercase` (uppercase без доп. трекинга).
- **Easing**: `--ease-out-quint: cubic-bezier(0.23,1,0.32,1)` — фирменная кривая всего сайта.

### 4.5 Ключевые кадры (CSS, найдены)

```
fade-in / fade-out / pulse / pulse-slow
scale-fade-in:  { 0%: opacity 0, scale .9 → 100%: 1 }
slide-fade-in:  { 0%: opacity 0, translateY(10px) → 0 }
slide-down/up (accordion, по Radix-переменной высоты)
```

### 4.6 Мако-мелочи

- `.marquee` с mask-градиентом по краям (`mask: linear-gradient(90deg,#0000,#000 30%,#000 70%,#0000)`) — бегущая строка.
- «Активная буква меню»: `animation-iteration-count: 2` на подсветке категорий.

---

## 5. Hero и навигация

**Hero**

- Full-bleed медиа-фон, сверху — контент в `flex justify-between`, выровнен по низу.
- H1 `title-md`, `leading-none`, `max-w-[10em]`, drop-shadow.
- Подзаголовок `paragraph-md` `max-w-[17em]`, `mt-[1.25em]` (относительные отступы в `em`).
- CTA: большая янтарная кнопка `min-w-[22em]`, `h-em-[72/16]`, status-строка «✓ In stock · Ships in 3-5 business days» с `opacity-60`.
- Видео-карточка с янтарной рамкой `p-[2px]`, `rounded-2xl`, свечение на hover.

**Header**

- Fixed, `pointer-events: none` на обёртке (кликабельны только элементы), `isolation: isolate`.
- Логотип и menu-icon — **квадратные «кнопки-плашки»** `var(--header-height)=44px`, `border-radius:10px`, hairline-бордер, полупрозрачный фон + `backdrop-blur(16px)`; на тёмных секциях меняются на `bg-night/80` / `border-white/10` (класс `header_dark`) с transition цвета `.3s/.35s`.
- Меню — `Radix NavigationMenu` с **анимацией высоты** viewport (`submenu-in: height 0 → var(--radix-nav-viewport-height)`, `ease-out-quint`) и addon-панелью.
- Переключение цвета текста хедера при смене тёмной/светлой секции — плавная интерполяция.

---

## 6. Что переносим легко / что требует кастома

### Легко (Tailwind + Framer Motion)

| Приём                                                       | Куда                                                    |
| ----------------------------------------------------------- | ------------------------------------------------------- |
| Отрицательный трекинг, шкала `title/paragraph`              | `globals.css` (`@theme`), `SectionHeading`, `globals`   |
| Палитра: тёплый night-фон, cream, амбер-акцент              | токены в `globals.css` + `theme.ts`                     |
| `link_link` animated underline                              | `header`, `footer`, `breadcrumbs`                       |
| Кнопка-свечение при hover (`box-shadow`-ореол)              | `ui/button.tsx`                                         |
| `ease-out-quint` как основная кривая                        | `styles/animations.ts`                                  |
| Хедер-плашки 44px + сморозный фон + смена на тёмных секциях | `layout/header.tsx`                                     |
| `mask`-градиент у бегущей строки                            | новый `Marquee` (независимый, без библиотек)            |
| `scale-fade-in` / `slide-fade-in` keyframes                 | `globals.css` (Radix/утилиты)                           |
| `::selection` акцентом, тонкая сетка-фон                    | `globals.css`                                           |
| `whileInView` + stagger, `viewport once amount .2`          | все секции через `motion.tsx`                           |
| Параллакс декоративных пятен                                | `useScroll`/`useTransform` в `motion.tsx`               |
| `prefers-reduced-motion`                                    | уже есть в `globals.css`, дублируем в motion-примитивах |

### Требует кастомного подхода / упрощения

| Приём                                 | Решение                                                                                            |
| ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| WebGL/Canvas фон и page-transition    | Заменяем на CSS-градиенты + Framer Motion `AnimatePresence` (без шейдеров)                         |
| GSAP ScrollTrigger sticky-сцены 500vh | Упрощаем: `useScroll` + sticky-блоки на 1 экран, без 5-экранных таймлайнов                         |
| Lenis smooth scroll                   | Не берём (нативный скролл; риск a11y и производительности)                                         |
| Split-text по буквам (побитовый 3D)   | Буквенный stagger в `MaskReveal`/`StaggerItem` только для hero H1, с ограничением (≤ ~40 символов) |
| `text-em-[N/M]` относительные размеры | Берём только там, где реально нужно; в основном — `clamp`-шкала                                    |

---

## 7. Что НЕ ломаем

- Роутинг `/ru/*` и `/en/*`, локализация next-intl, middleware-независимый подход.
- `src/data/mock` — структура и данные неизменны.
- `next.config.ts` (`output: 'export'`) — **не трогаем**.
- Фильтры/сортировка/пагинация каталога, модалка быстрого просмотра, избранное, онбординг.
- Тексты и контент — наши (LiveWalls), меняем только оболочку.

---

## 8. План внедрения (после «ОК»)

1. **Токены и типографика** (`globals.css`, `tailwind.config.ts`, `theme.ts`): сетка размеров `title-*`/`paragraph-*`, отрицательный трекинг, `--ease-out-quint`, амбер-акцент, тёплый night-фон, `::selection`, ключевые кадры `scale-fade-in`/`slide-fade-in`.
2. **Motion-слой** (`styles/animations.ts`, `shared/motion.tsx`): `revealViewport`, `maskReveal`, `letterStagger`, `parallaxLayer`, `hoverGlow`, `underline`; всё под `useReducedMotion`.
3. **UI-кит** (`ui/button.tsx`, `ui/card.tsx`, `ui/badge.tsx`, `ui/input.tsx`): ховер-свечение кнопок, `rounded-[1em]`-семейство, hairline-карточки, focus-ring.
4. **Layout** (`header.tsx`, `footer.tsx`): квадратные плашки навигации, animated underline, смена цвета на тёмных секциях (через `IntersectionObserver`), мобильное меню в стиле референса.
5. **Секции главной** (`hero`, `featured`, `categories`, `features`, `reviews`, `cta`): буквенный reveal H1, `whileInView` + stagger, параллакс пятен, sticky-заголовки, бегущая строка отзывов.
6. **Внутренние страницы** (каталог, паки, цены, faq, about): единая сетка/типографика, `whileInView`-появление, ховеры карточек.
7. **Проверки**: `npx next build` → `out/`, `npm run lint`, typecheck, e2e, адаптив 360/768/1024/1440, отсутствие горизонтального скролла.
8. **Commit + push**.

---

## 9. Скриншоты

Браузер/скриншот-инструменты в этой среде недоступны; аудит сделан по HTML-разметке, CSS-бандлам
(`_next/static/css/*.css`) и JS-чанкам. Все ключевые метрики и классы выписаны выше.
