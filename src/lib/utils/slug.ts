/**
 * Работа со slug'ами: транслитерация кириллицы, нормализация, безопасные id.
 */

const TRANSLIT: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'c',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
};

/** Транслитерация кириллицы в латиницу. */
export function translit(input: string): string {
  return input
    .toLowerCase()
    .split('')
    .map((char) => TRANSLIT[char] ?? char)
    .join('');
}

/** Приводит строку к slug: латиница, дефисы, без пробелов. */
export function slugify(input: string): string {
  return translit(input)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Читаемый id из UUID — совместим с моделями приложения (строковый id). */
export function idToSlug(id: string): string {
  return id
    .replace(/[^a-zA-Z0-9-_]/g, '')
    .slice(0, 40)
    .toLowerCase();
}

/** Инициалы для аватара-заглушки. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0]?.[0] ?? '';
  const second = parts.length > 1 ? (parts[1]?.[0] ?? '') : '';
  return (first + second).toUpperCase();
}
