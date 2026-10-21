import type { Wallpaper } from './wallpaper';

/** Тип пака обоев — набор с общей ценой. */
export interface Pack {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** Цена в рублях. */
  price: number;
  /** Готовая строка цены («199 ₽») — как `priceText` в приложении. */
  priceText: string;
  /** id обоев, входящих в пак. */
  wallpaperIds: string[];
  /** Сколько обоев в паке (дублирует длину списка для удобства в UI). */
  wallpaperCount: number;
  /** Обложка пака. */
  poster: string;
  /** Бейдж на карточке: «Хит», «Новинка» и т.п. */
  badge: string | null;
  isFeatured: boolean;
  createdAt: string;
  accent: string;
}

export interface PackWithWallpapers extends Pack {
  wallpapers: Wallpaper[];
}
