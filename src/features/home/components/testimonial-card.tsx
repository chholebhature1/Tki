import { Star, BadgeCheck } from "lucide-react";
import type { MockTestimonial } from "../constants/mock-testimonials";

interface TestimonialCardProps {
  testimonial: MockTestimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <blockquote className="flex h-full flex-col rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary/30 hover:shadow-sm">
      {/* Rating */}
      <div className="flex gap-0.5" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < testimonial.rating
                ? "fill-warning text-warning"
                : "fill-border text-border"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Quote */}
      <p className="mt-4 flex-1 text-sm leading-relaxed text-text-secondary">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        {/* Avatar placeholder */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
          {testimonial.name[0]}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-text">
              {testimonial.name}
            </span>
            {testimonial.verified && (
              <BadgeCheck
                className="h-3.5 w-3.5 text-primary"
                aria-label="Verified patient"
              />
            )}
          </div>
          <p className="text-xs text-muted">
            {testimonial.city} · {testimonial.category}
          </p>
        </div>
      </div>
    </blockquote>
  );
}
