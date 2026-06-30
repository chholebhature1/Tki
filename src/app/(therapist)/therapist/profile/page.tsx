import { redirect } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, ExternalLink, Lock, LogOut } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { TherapistRepository } from "@/features/therapists/repositories";
import { TherapistProfileForm } from "@/features/profile";
import { AppointmentStatusBadge } from "@/features/appointments";

export const metadata = { title: "Profile — TalkIndia Pro" };

export default async function TherapistProfilePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const result = await TherapistRepository.findByProfileId(user.id);
  if (!result) redirect("/dashboard");

  const { therapist, raw } = result;

  const { data: accountProfile } = await supabase
    .from("profiles")
    .select("email, phone, created_at")
    .eq("id", user.id)
    .single();

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
          <h1 className="text-2xl font-bold text-text">Profile</h1>
          <p className="mt-1 text-sm text-text-secondary">Manage how patients see you and your account settings.</p>
        </div>
        <Link
          href={`/therapists/${therapist.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          View Public Profile <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {/* Profile Preview Card */}
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

      {/* Specializations & Languages */}
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

      {/* Editable Professional Form */}
      <TherapistProfileForm therapistProfileId={raw.id} defaultValues={defaultValues} />

      {/* Account Settings — merged from Settings page */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="text-base font-semibold text-text">Account</h2>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">Email</span>
            <span className="font-medium text-text">{accountProfile?.email || user.email}</span>
          </div>
          {accountProfile?.phone && (
            <div className="flex justify-between">
              <span className="text-text-secondary">Phone</span>
              <span className="font-medium text-text">{accountProfile.phone}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-text-secondary">Member since</span>
            <span className="font-medium text-text">
              {accountProfile?.created_at
                ? new Date(accountProfile.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
                : "—"}
            </span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/forgot-password" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-secondary hover:border-primary/30 hover:text-text">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Change Password
          </Link>
          <form action="/api/auth/logout" method="POST" className="inline">
            <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-secondary hover:border-danger/30 hover:text-danger">
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" /> Log Out
            </button>
          </form>
        </div>
      </div>

      <div className="h-16 lg:hidden" />
    </div>
  );
}
