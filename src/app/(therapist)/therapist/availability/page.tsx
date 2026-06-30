import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getTherapistAvailability, getTherapistBlockedPeriods } from "@/features/booking/actions/manage-availability.actions";
import { AvailabilityManager } from "./availability-manager";

export const metadata = { title: "Manage Availability" };

export default async function TherapistAvailabilityPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: tp } = await supabase
    .from("therapist_profiles")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!tp) redirect("/dashboard");

  const availability = await getTherapistAvailability(tp.id);
  const blockedPeriods = await getTherapistBlockedPeriods(tp.id);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Availability Management</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Set your weekly schedule. Patients will only see slots you make available.
        </p>
      </div>

      <AvailabilityManager
        therapistProfileId={tp.id}
        initialAvailability={availability}
        initialBlocked={blockedPeriods}
      />
    </div>
  );
}
