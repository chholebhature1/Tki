import { Star, BadgeCheck, Video, MapPin } from "lucide-react";
import type { TherapistProfile } from "../../types";

interface ProfileHeroProps {
  therapist: TherapistProfile;
}

export function ProfileHero({ therapist }: ProfileHeroProps) {
  const modeLabel =
    therapist.consultationMode === "both"
      ? "Online & In-Person"
      : therapist.consultationMode === "online"
        ? "Online"
        : "In-Person";
  const ModeIcon = therapist.consultationMode === "offline" ? MapPin : Video;

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
      {/* Avatar */}
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-3xl font-bold text-primary sm:h-32 sm:w-32">
        {therapist.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-text sm:text-3xl">
            {therapist.name}
          </h1>
          {therapist.verified && (
            <BadgeCheck className="h-5 w-5 text-primary" aria-label="Verified therapist" />
          )}
        </div>

        <p className="mt-1 text-base text-text-secondary">
          {therapist.professionalTitle} · {therapist.qualification}
        </p>

        {/* Meta */}
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span className="flex items-center gap-1 font-medium text-text">
            <Star className="h-4 w-4 fill-warning text-warning" aria-hidden="true" />
            {therapist.rating}
            <span className="font-normal text-muted">({therapist.totalReviews} reviews)</span>
          </span>
          <span className="text-text-secondary">
            {therapist.yearsExperience} years experience
          </span>
          <span className="flex items-center gap-1 text-text-secondary">
            <ModeIcon className="h-4 w-4" aria-hidden="true" />
            {modeLabel}
          </span>
        </div>

        {/* Languages */}
        <div className="mt-3 flex flex-wrap gap-2">
          {therapist.languages.map((lang) => (
            <span
              key={lang}
              className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-text-secondary"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
