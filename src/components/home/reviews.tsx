import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Star } from 'lucide-react';
import type { Review } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';
import { Marquee } from '@/components/shared/motion';

/**
 * Отзывы пользователей.
 *
 * Бегущая строка из крупных карточек: оценка, текст отзыва, имя,
 * род деятельности и город автора.
 */
export async function Reviews({ reviews }: { reviews: Review[] }) {
  const t = await getTranslations('home.reviews');

  return (
    <section className="relative mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
      <SectionHeading eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />

      <Marquee className="mt-10" duration={64}>
        <div className="flex items-stretch gap-4 pr-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              ratingLabel={t('rating', { rating: review.rating })}
            />
          ))}
        </div>
      </Marquee>
    </section>
  );
}

function ReviewCard({ review, ratingLabel }: { review: Review; ratingLabel: string }) {
  return (
    <figure className="border-border/60 bg-card/40 flex w-[320px] shrink-0 flex-col rounded-2xl border p-6 backdrop-blur-xl sm:w-[380px]">
      <div className="flex items-center gap-1" aria-label={ratingLabel}>
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={
              index < review.rating
                ? 'text-brand size-4 fill-current'
                : 'text-muted-foreground/40 size-4'
            }
            aria-hidden="true"
          />
        ))}
      </div>

      <blockquote className="text-muted-foreground mt-4 flex-1 text-sm leading-relaxed">
        {review.text}
      </blockquote>

      <figcaption className="border-border/60 mt-6 flex items-center gap-3 border-t pt-4">
        <Image
          src={review.avatar}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-full object-cover"
        />
        <span className="min-w-0">
          <span className="text-foreground block truncate text-sm font-medium">{review.name}</span>
          <span className="text-muted-foreground block truncate text-xs">
            {review.role} · {review.city}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
