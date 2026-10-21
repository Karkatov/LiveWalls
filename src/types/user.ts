/**
 * Пользователь.
 *
 * Поле `subscriptionStatus` повторяет `SubscriptionStatus` из приложения
 * (`trial` / `subscribed` / `expired`).
 */
export type SubscriptionStatus = 'trial' | 'subscribed' | 'expired';
export type PlanType = 'lifetime' | 'yearly' | 'none';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  createdAt: string;
  subscriptionStatus: SubscriptionStatus;
  plan: PlanType;
  /** Срок действия подписки (ISO), null для lifetime. */
  expiresAt: string | null;
}
