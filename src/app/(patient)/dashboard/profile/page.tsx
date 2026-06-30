import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/features/profile";

export const metadata = { title: "My Profile" };

export default async function PatientProfilePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, phone, date_of_birth, gender, city, state, emergency_contact, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  const defaultValues = {
    fullName: profile.full_name || "",
    email: profile.email || user.email || "",
    phone: profile.phone || "",
    dateOfBirth: profile.date_of_birth || "",
    gender: profile.gender || "",
    city: profile.city || "",
    state: profile.state || "",
    emergencyContact: profile.emergency_contact || "",
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text">My Profile</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage your personal information.</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-white p-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-light text-2xl font-bold text-primary">
          {(profile.full_name || "U")[0]}
        </div>
        <div>
          <p className="text-base font-semibold text-text">{profile.full_name}</p>
          <p className="text-sm text-text-secondary">{profile.email}</p>
          <button type="button" disabled className="mt-2 text-xs font-medium text-primary opacity-50 cursor-not-allowed">
            Change Photo (Coming Soon)
          </button>
        </div>
      </div>

      {/* Form */}
      <ProfileForm defaultValues={defaultValues} />

      <div className="h-16 lg:hidden" />
    </div>
  );
}
