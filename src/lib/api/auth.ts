import type { User } from '@/types';
import { findUserByEmail, mockUsers } from '@/data/mock/users';
import { fetchData } from './fetcher';

/**
 * Аутентификация — заглушка.
 *
 * Сейчас вход «моковый»: достаточно указать email, пароля нет.
 * TODO: подключить реальную авторизацию (magic-link на почту или OAuth),
 * хранить сессию в httpOnly-cookie, подписать её через AUTH_SECRET.
 */

export interface AuthResult {
  user: User | null;
  error: 'not_found' | 'invalid_email' | null;
}

/** Вход по email без пароля (заглушка). */
export async function signIn(email: string): Promise<AuthResult> {
  return fetchData<AuthResult>(
    '/api/auth/sign-in',
    () => {
      const normalized = email.trim().toLowerCase();
      if (!normalized.includes('@')) return { user: null, error: 'invalid_email' };
      const user = findUserByEmail(normalized);
      if (!user) return { user: null, error: 'not_found' };
      return { user, error: null };
    },
    { method: 'POST', body: { email } },
  );
}

/** Текущий пользователь (мок: всегда демо-пользователь). */
export async function getCurrentUser(): Promise<User | null> {
  return fetchData<User | null>('/api/auth/me', () => mockUsers[0] ?? null, {
    revalidate: 60,
  });
}

/** Выход — заглушка. */
export async function signOut(): Promise<void> {
  return fetchData<void>('/api/auth/sign-out', () => undefined, { method: 'POST' });
}
