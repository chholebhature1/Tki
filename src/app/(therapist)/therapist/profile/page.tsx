import { redirect } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, ExternalLink } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { TherapistRepository } from "@/features/therapists/repositories";
import { TherapistProfileForm } from "@/features/profile";
import { AppointmentStatusBadge } from "@/features/appointments";

export const metadata = { title: "Therapist Profile" };

export default async function TherapistProfilePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const result = await TherapistRepository.findByProfileId(user.id);
  if (!result) redirect("/dashboard");

  const { therapist, raw } = result;

  const defaultValues = {
    professionalTitle: raw.professional_title || "",
    biography: raw.biography || "",
    yearsExperience: raw.years_experience,
    consultationFee: Number(raw.consultation_fee),
    consultationMode: raw.consultation_mode as "online" | "offline" | "both",
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Professional Profile</h1>
          <p className="mt-1 text-sm text-text-secondary">Manage how patients see you.</p>
        </div>
        <Link
          href={`/therapists/${therapist.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover"
        >
          View Public Profile <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {/* Profile Preview */}
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-white p-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-light text-2xl font-bold text-primary">
          {therapist.name[0]}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold text-text">{therapist.name}</p>
            {therapist.verified && <BadgeCheck className="h-4 w-4 text-primary" aria-label="Verified" />}
          </div>
          <p className="text-sm text-text-secondary">{therapist.professionalTitle}</p>
          <div className="mt-1 flex items-center gap-3">
            <AppointmentStatusBadge status={raw.verification_status === "approved" ? "confirmed" : "payment_pending"} />
            <span className="text-xs text-muted">₹{therapist.sessionFee.toLocaleString("en-IN")}/session</span>
          </div>
        </div>
      </div>

      {/* Specializations & Languages (read-only summary) */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="text-base font-semibold text-text">Specializations & Languages</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {therapist.specializations.map((s) => (
            <span key={s} className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary">{s}</span>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {therapist.languages.map((l) => (
            <span key={l} className="rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">{l}</span>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">To update specializations or languages, contact support.</p>
      </div>

      {/* Editable Form */}
      <TherapistProfileForm therapistProfileId={raw.id} defaultValues={defaultValues} />

      <div className="h-16 lg:hidden" />
    </div>
  );
}
