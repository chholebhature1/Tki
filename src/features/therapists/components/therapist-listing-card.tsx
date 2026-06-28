import Link from "next/link";
import { Star, Clock, BadgeCheck, Video, MapPin } from "lucide-react";
import type { Therapist } from "../types";

interface TherapistListingCardProps {
  therapist: Therapist;
}

export function TherapistListingCard({ therapist }: TherapistListingCardProps) {
  const modeLabel =
    therapist.consultationMode === "both"
      ? "Online & In-Person"
      : therapist.consultationMode === "online"
        ? "Online"
        : "In-Person";

  const ModeIcon = therapist.consultationMode === "offline" ? MapPin : Video;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-white p-5 transition-all hover:border-primary/30 hover:shadow-sm sm:p-6">
      {/* Header: Avatar + Name + Badge */}
      <div className="flex gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-light text-lg font-semibold text-primary">
          {therapist.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-base font-semibold text-text">
              {therapist.name}
            </h3>
            {therapist.verified && (
              <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label="Verified" />
            )}
          </div>
          <p className="mt-0.5 truncate text-sm text-text-secondary">
            {therapist.professionalTitle}
          </p>
          <p className="text-xs text-muted">{therapist.qualification}</p>
        </div>
      </div>

      {/* Bio */}
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-text-secondary">
        {therapist.bio}
      </p>

      {/* Meta row */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="flex items-center gap-1 font-medium text-text">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden="true" />
          {therapist.rating}
          <span className="font-normal text-muted">({therapist.totalReviews})</span>
        </span>
        <span className="text-text-secondary">{therapist.yearsExperience} yrs exp</span>
        <span className="flex items-center gap-1 text-text-secondary">
          <ModeIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {modeLabel}
        </span>
      </div>

      {/* Specializations */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {therapist.specializations.slice(0, 3).map((spec) => (
          <span
            key={spec}
            className="rounded-full border border-border px-2.5 py-0.5 text-xs text-text-secondary"
          >
            {spec}
          </span>
        ))}
      </div>

      {/* Languages */}
      <p className="mt-2 text-xs text-muted">
        {therapist.languages.join(" · ")}
      </p>

      {/* Footer — pushed to bottom */}
      <div className="mt-auto border-t border-border pt-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-text">
              ₹{therapist.sessionFee.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-muted">per session</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {therapist.nextAvailableSlot}
            </span>
            <Link
              href={`/therapists/${therapist.slug}`}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
