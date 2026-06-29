import Link from "next/link";
import { Star, Clock, BadgeCheck } from "lucide-react";
import type { Therapist } from "@/features/therapists/types";

interface TherapistCardProps {
  therapist: Therapist;
}

export function TherapistCard({ therapist }: TherapistCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary/30 hover:shadow-sm">
      <div className="flex gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-light text-lg font-semibold text-primary">
          {therapist.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-base font-semibold text-text">{therapist.name}</h3>
            {therapist.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label="Verified" />}
          </div>
          <p className="mt-0.5 truncate text-sm text-text-secondary">{therapist.professionalTitle}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="flex items-center gap-1 font-medium text-text">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden="true" />
          {therapist.rating}
          <span className="font-normal text-muted">({therapist.totalReviews})</span>
        </span>
        <span className="text-text-secondary">{therapist.yearsExperience} yrs exp</span>
        <span className="text-text-secondary">₹{therapist.sessionFee.toLocaleString("en-IN")}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {therapist.specializations.slice(0, 3).map((spec) => (
          <span key={spec} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-text-secondary">
            {spec}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border pt-4 mt-4">
        <span className="flex items-center gap-1 text-xs font-medium text-primary">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {therapist.nextAvailableSlot}
        </span>
        <Link href={`/therapists/${therapist.slug}`} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover">
          View Profile
        </Link>
      </div>
    </article>
  );
}
