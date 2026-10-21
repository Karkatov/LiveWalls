import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Star } from 'lucide-react';
import type { Review } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';
import { StaggerGroup, StaggerItem } from '@/components/shared/motion';

/**
 * Отзывы пользователей.
 */
export async function Reviews({ reviews }: { reviews: Review[] }) {
  const t = await getTranslations('home.reviews');

  return (
    <section className="relative mx-auto max-w-[1280px] px-4 py-20 sm:px-8 lg:py-28">
      <SectionHeading
        index={5}
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        align="center"
      />

      <StaggerGroup className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <StaggerItem key={review.id} className="h-full">
            <figure className="border-border bg-card flex h-full flex-col rounded-xl border p-6">
              <div
                className="flex items-center gap-1"
                aria-label={t('rating', { rating: review.rating })}
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={
                      index < review.rating
                        ? 'text-signal size-4 fill-current'
                        : 'text-paper-ghost size-4'
                    }
                    aria-hidden="true"
                  />
                ))}
              </div>

              <blockquote className="text-muted-foreground mt-4 flex-1 text-sm leading-relaxed">
                {review.text}
              </blockquote>

              <figcaption className="border-border mt-6 flex items-center gap-3 border-t pt-4">
                <Image
                  src={review.avatar}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 rounded-full object-cover"
                />
                <span className="min-w-0">
                  <span className="text-foreground block truncate text-sm font-medium">
                    {review.name}
                  </span>
                  <span className="text-muted-foreground block truncate text-xs">
                    {review.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
