import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Layers, ShoppingCart } from 'lucide-react';
import type { Pack } from '@/types';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/shared/motion';

/**
 * Карточка пака обоев.
 */
export async function PackCard({ pack, index = 0 }: { pack: Pack; index?: number }) {
  const t = await getTranslations('packs');
  const tCommon = await getTranslations('common');

  return (
    <Reveal delay={index * 0.05} className="h-full">
      <article className="group border-border/70 bg-card/60 hover:border-brand/35 flex h-full flex-col overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_var(--brand-glow)]">
        <Link
          href={`/packs/${pack.slug}`}
          className="focus-visible:outline-ring relative block aspect-[3/2] overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <Image
            src={pack.poster}
            alt={pack.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            placeholder="blur"
            blurDataURL={`/placeholders/packs/pack-01.svg`}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

          {pack.badge && (
            <span className="absolute top-3 left-3">
              <Badge variant="onMedia">{pack.badge}</Badge>
            </span>
          )}

          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
            <Layers className="size-3" aria-hidden="true" />
            {t('count', { count: pack.wallpaperCount })}
          </span>
        </Link>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-foreground text-lg font-semibold tracking-tight">{pack.title}</h3>
          <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
            {pack.description}
          </p>

          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="text-foreground text-xl font-bold tracking-tight">
              {pack.priceText}
            </span>

            <Button asChild variant="outline" size="sm">
              <Link href={`/packs/${pack.slug}`}>
                <ShoppingCart className="size-4" />
                {tCommon('buy')}
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
