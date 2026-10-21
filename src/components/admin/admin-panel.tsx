'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { KeyRound, Lock, ShieldCheck } from 'lucide-react';
import type { Pack, User, Wallpaper } from '@/types';
import { formatDateShort, formatPrice } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/** SHA-256 от строки в hex. */
async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Панель администратора.
 *
 * Пароль проверяется на клиенте по хешу: так страница остаётся статической
 * и работает даже при полностью статическом экспорте (GitHub Pages).
 * Реальная авторизация появится вместе с бэкендом.
 */
export function AdminPanel({
  passwordHash,
  wallpapers,
  packs,
  users,
}: {
  passwordHash: string;
  wallpapers: Wallpaper[];
  packs: Pack[];
  users: User[];
}) {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');

  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(false);

    const hash = await sha256(password);
    if (hash !== passwordHash) {
      setError(true);
      return;
    }

    setUnlocked(true);
    setPassword('');
    toast.success(t('success'), { description: t('mockNotice') });
  };

  if (!unlocked) {
    return (
      <div className="border-border/70 bg-card/50 mx-auto max-w-md rounded-3xl border p-6 backdrop-blur-xl sm:p-8">
        <div className="flex items-center gap-3">
          <span className="bg-brand/10 text-brand-foreground ring-brand/20 flex size-11 items-center justify-center rounded-xl ring-1">
            <Lock className="size-5" aria-hidden="true" />
          </span>
          <h2 className="text-foreground text-lg font-semibold tracking-tight">{t('enter')}</h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">{t('password')}</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t('passwordPlaceholder')}
              aria-invalid={error}
              required
            />
          </div>

          {error && (
            <p className="border-destructive/30 bg-destructive/10 text-destructive rounded-xl border px-4 py-3 text-xs">
              {t('unauthorizedBody')}
            </p>
          )}

          <Button type="submit" variant="gradient" className="w-full">
            <KeyRound className="size-4" aria-hidden="true" />
            {t('enter')}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-400/8 px-4 py-3">
        <ShieldCheck className="size-5 text-emerald-300" aria-hidden="true" />
        <p className="text-muted-foreground text-sm">{t('mockNotice')}</p>
      </div>

      <Tabs defaultValue="wallpapers">
        <TabsList>
          <TabsTrigger value="wallpapers">{t('tabs.wallpapers')}</TabsTrigger>
          <TabsTrigger value="packs">{t('tabs.packs')}</TabsTrigger>
          <TabsTrigger value="users">{t('tabs.users')}</TabsTrigger>
        </TabsList>

        <TabsContent value="wallpapers">
          <Table
            headers={[
              t('columns.title'),
              t('columns.category'),
              t('columns.type'),
              t('columns.price'),
            ]}
            rows={wallpapers.map((wallpaper) => [
              wallpaper.title,
              wallpaper.category,
              wallpaper.mediaType,
              wallpaper.priceText ?? tCommon('free'),
            ])}
          />
        </TabsContent>

        <TabsContent value="packs">
          <Table
            headers={[t('columns.title'), t('columns.count'), t('columns.price')]}
            rows={packs.map((pack) => [
              pack.title,
              String(pack.wallpaperCount),
              formatPrice(pack.price),
            ])}
          />
        </TabsContent>

        <TabsContent value="users">
          <Table
            headers={[t('columns.email'), t('columns.status'), t('columns.created')]}
            rows={users.map((user) => [
              user.email,
              user.subscriptionStatus,
              formatDateShort(user.createdAt),
            ])}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="border-border/70 overflow-x-auto rounded-2xl border">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="bg-card/60 text-left">
            {headers.map((header) => (
              <th key={header} scope="col" className="text-muted-foreground px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-border/60 border-t">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={
                    cellIndex === 0
                      ? 'text-foreground px-4 py-3 font-medium'
                      : 'text-muted-foreground px-4 py-3'
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
