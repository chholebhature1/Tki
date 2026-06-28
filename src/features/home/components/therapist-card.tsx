import Link from "next/link";
import { Star, Clock } from "lucide-react";
import type { MockTherapist } from "../constants/mock-therapists";

interface TherapistCardProps {
  therapist: MockTherapist;
}

export function TherapistCard({ therapist }: TherapistCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary/30 hover:shadow-sm">
      {/* Top row: avatar + meta */}
      <div className="flex gap-4">
        {/* Portrait placeholder */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-light text-lg font-semibold text-primary">
          {therapist.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-text truncate">
              {therapist.name}
            </h3>
            {therapist.availableToday && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary-light px-2 py-0.5 text-[11px] font-medium text-primary">
                <Clock className="h-3 w-3" aria-hidden="true" />
                Available
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-text-secondary truncate">
            {therapist.qualification}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 flex flex-col gap-2.5 flex-1">
        {/* Rating + Experience */}
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 font-medium text-text">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden="true" />
            {therapist.rating}
          </span>
          <span className="text-text-secondary">
            {therapist.yearsExperience} yrs experience
          </span>
        </div>

        {/* Languages */}
        <p className="text-sm text-text-secondary">
          <span className="font-medium text-text">Languages:</span>{" "}
          {therapist.languages.join(", ")}
        </p>

        {/* Specializations */}
        <div className="flex flex-wrap gap-1.5">
          {therapist.specializations.map((spec) => (
            <span
              key={spec}
              className="rounded-full border border-border px-2.5 py-0.5 text-xs text-text-secondary"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Footer: fee + CTA */}
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <div>
          <p className="text-lg font-semibold text-text">
            ₹{therapist.sessionFee.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-muted">per session</p>
        </div>
        <Link
          href={`/therapists/${therapist.slug}`}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          View Profile
        </Link>
      </div>
    </article>
  );
}
