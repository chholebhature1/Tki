import { Star, BadgeCheck } from "lucide-react";
import type { Review } from "../../types";

interface ProfileReviewsProps {
  reviews: Review[];
  rating: number;
  totalReviews: number;
}

export function ProfileReviews({ reviews, rating, totalReviews }: ProfileReviewsProps) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">
          Reviews
          <span className="ml-2 text-sm font-normal text-muted">({totalReviews})</span>
        </h2>
        <div className="flex items-center gap-1 text-sm font-medium text-text">
          <Star className="h-4 w-4 fill-warning text-warning" aria-hidden="true" />
          {rating}
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
                  {review.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-text">{review.name}</span>
                    {review.verified && (
                      <BadgeCheck className="h-3.5 w-3.5 text-primary" aria-label="Verified" />
                    )}
                  </div>
                  <p className="text-xs text-muted">{review.category} · {review.date}</p>
                </div>
              </div>
              <div className="flex gap-0.5" role="img" aria-label={`${review.rating} stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < review.rating ? "fill-warning text-warning" : "fill-border text-border"}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
