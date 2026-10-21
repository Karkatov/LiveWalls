import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Объединение классов: clsx (условные классы) + tailwind-merge
 * (приоритет последнего Tailwind-класса).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
