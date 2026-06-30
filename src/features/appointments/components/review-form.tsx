"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { submitReviewAction } from "../actions/review.actions";

interface ReviewFormProps {
  appointmentId: string;
  therapistName: string;
}

export function ReviewForm({ appointmentId, therapistName }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    setSubmitting(true);
    setError("");

    const result = await submitReviewAction(appointmentId, rating, comment);

    if (!result.success) {
      setError(result.error || "Failed to submit review.");
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    router.refresh();
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-primary/30 bg-primary-light p-6 text-center">
        <div className="text-3xl">🎉</div>
        <p className="mt-2 text-sm font-semibold text-text">Thank you for your feedback!</p>
        <p className="mt-1 text-xs text-text-secondary">Your review helps other patients find the right therapist.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-6">
      <h3 className="text-base font-semibold text-text">Rate Your Session</h3>
      <p className="mt-1 text-sm text-text-secondary">How was your session with {therapistName}?</p>

      {/* Star Rating */}
      <div className="mt-4 flex gap-1" role="radiogroup" aria-label="Session rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            aria-pressed={rating === star}
          >
            <Star
              className={`h-7 w-7 transition-colors ${
                star <= (hoveredRating || rating)
                  ? "fill-warning text-warning"
                  : "fill-none text-border"
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 self-center text-sm text-text-secondary">
            {rating === 5 ? "Excellent" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
          </span>
        )}
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)..."
        rows={3}
        className="mt-4 w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />

      {error && <p className="mt-2 text-xs text-danger">{error}</p>}

      <button
        type="submit"
        disabled={submitting || rating === 0}
        className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
