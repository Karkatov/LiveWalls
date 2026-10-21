import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Навигация с учётом локали.
 *
 * `Link` и `usePathname` автоматически подставляют префикс локали
 * (/ru/... или /en/...), поэтому в компонентах не нужно знать про локаль.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
