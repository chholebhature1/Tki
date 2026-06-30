"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

async function verifyAdmin(): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase.from("profiles").select("role:roles!profiles_role_id_fkey(name)").eq("id", user.id).single();
  return (data?.role as unknown as { name: string })?.name === "admin";
}

export async function changeUserRoleAction(userId: string, newRole: string): Promise<{ success: boolean; error?: string }> {
  if (!(await verifyAdmin())) return { success: false, error: "Unauthorized" };

  const supabase = await createServerSupabaseClient();

  // Get role ID
  const { data: role } = await supabase.from("roles").select("id").eq("name", newRole).single();
  if (!role) return { success: false, error: "Invalid role." };

  // Update profile role
  const { error } = await supabase.from("profiles").update({ role_id: role.id }).eq("id", userId);
  if (error) return { success: false, error: "Failed to update role." };

  // If promoting to therapist, create therapist_profiles entry if not exists
  if (newRole === "therapist") {
    const { data: existing } = await supabase.from("therapist_profiles").select("id").eq("profile_id", userId).maybeSingle();
    if (!existing) {
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", userId).single();
      await supabase.from("therapist_profiles").insert({
        profile_id: userId,
        professional_title: "Therapist",
        license_number: `TKI-${Date.now().toString(36).toUpperCase()}`,
        years_experience: 1,
        consultation_fee: 1000,
        biography: `${profile?.full_name || "Therapist"} is a mental health professional.`,
        consultation_mode: "online",
        verification_status: "approved",
      });
    }
  }

  return { success: true };
}

export async function createTestAppointmentAction(
  patientId: string,
  therapistProfileId: string,
  minutesFromNow: number = 5
): Promise<{ success: boolean; appointmentId?: string; error?: string }> {
  if (!(await verifyAdmin())) return { success: false, error: "Unauthorized" };

  const supabase = await createServerSupabaseClient();

  const now = new Date();
  const startTime = new Date(now.getTime() + minutesFromNow * 60000);
  const endTime = new Date(startTime.getTime() + 50 * 60000);

  const date = startTime.toISOString().split("T")[0];
  const start = `${startTime.getHours().toString().padStart(2, "0")}:${startTime.getMinutes().toString().padStart(2, "0")}`;
  const end = `${endTime.getHours().toString().padStart(2, "0")}:${endTime.getMinutes().toString().padStart(2, "0")}`;

  const { data, error } = await supabase.from("appointments").insert({
    patient_profile_id: patientId,
    therapist_profile_id: therapistProfileId,
    appointment_date: date,
    start_time: start,
    end_time: end,
    duration_minutes: 50,
    consultation_mode: "online",
    status: "confirmed",
    booking_reference: `TKI-TEST-${Date.now().toString(36).toUpperCase()}`,
  }).select("id").single();

  if (error) return { success: false, error: error.message };
  return { success: true, appointmentId: data.id };
}
