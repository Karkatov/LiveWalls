import type { Config } from 'tailwindcss';

/**
 * Tailwind CSS v4 — конфигурация CSS-first.
 * Реальные токены темы живут в `src/app/[locale]/globals.css` (директива @theme)
 * и продублированы в `src/styles/theme.ts` для JS-слоя (Framer Motion, canvas, SVG).
 *
 * Этот файл оставлен как совместимая обёртка: он подключается через
 * директиву `@config "../../tailwind.config.ts"` в globals.css и отвечает за
 * режим тёмной темы (class) и подключение плагинов.
 */
const config: Config = {
  darkMode: 'class',
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}', './src/lib/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
