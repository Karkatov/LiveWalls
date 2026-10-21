/** Отзыв пользователя для главной страницы. */
export interface Review {
  id: string;
  /** Имя автора. */
  name: string;
  /** Роль/подпись: «Разработчик», «Студент» и т.п. */
  role: string;
  /** Оценка: 4 или 5. */
  rating: 4 | 5;
  text: string;
  avatar: string;
  createdAt: string;
}
