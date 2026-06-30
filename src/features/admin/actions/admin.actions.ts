"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AdminRepository } from "../repositories";

async function verifyAdmin(): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role:roles!profiles_role_id_fkey(name)")
    .eq("id", user.id)
    .single();

  return (profile?.role as unknown as { name: string })?.name === "admin";
}

export async function approveTherapistAction(therapistProfileId: string) {
  if (!(await verifyAdmin())) return { success: false, error: "Unauthorized" };
  const result = await AdminRepository.updateVerificationStatus(therapistProfileId, "approved");

  // Notify therapist
  if (result.success) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: tp } = await supabase.from("therapist_profiles").select("profile:profiles!therapist_profiles_profile_id_fkey(id, email)").eq("id", therapistProfileId).single();
      const profile = tp?.profile as unknown as { id: string; email: string } | null;
      if (profile) {
        const { NotificationService } = await import("@/features/notifications/services");
        await NotificationService.therapistApproved(profile.id, profile.email);
      }
    } catch { /* best-effort */ }
  }

  return result;
}

export async function rejectTherapistAction(therapistProfileId: string) {
  if (!(await verifyAdmin())) return { success: false, error: "Unauthorized" };
  const result = await AdminRepository.updateVerificationStatus(therapistProfileId, "rejected");

  // Notify therapist
  if (result.success) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: tp } = await supabase.from("therapist_profiles").select("profile:profiles!therapist_profiles_profile_id_fkey(id, email)").eq("id", therapistProfileId).single();
      const profile = tp?.profile as unknown as { id: string; email: string } | null;
      if (profile) {
        const { NotificationService } = await import("@/features/notifications/services");
        await NotificationService.notify({
          userId: profile.id, email: profile.email,
          title: "Verification Rejected",
          message: "Your therapist profile was not approved. Please review your documents and resubmit.",
          type: "verification", category: "verification", link: "/therapist/profile",
        });
      }
    } catch { /* best-effort */ }
  }

  return result;
}

export async function suspendTherapistAction(therapistProfileId: string) {
  if (!(await verifyAdmin())) return { success: false, error: "Unauthorized" };
  return AdminRepository.updateVerificationStatus(therapistProfileId, "expired");
}

export async function activateUserAction(userId: string) {
  if (!(await verifyAdmin())) return { success: false, error: "Unauthorized" };
  return AdminRepository.updateUserActiveStatus(userId, true);
}

export async function deactivateUserAction(userId: string) {
  if (!(await verifyAdmin())) return { success: false, error: "Unauthorized" };
  return AdminRepository.updateUserActiveStatus(userId, false);
}
