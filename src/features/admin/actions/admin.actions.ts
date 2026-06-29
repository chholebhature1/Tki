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
  return AdminRepository.updateVerificationStatus(therapistProfileId, "approved");
}

export async function rejectTherapistAction(therapistProfileId: string) {
  if (!(await verifyAdmin())) return { success: false, error: "Unauthorized" };
  return AdminRepository.updateVerificationStatus(therapistProfileId, "rejected");
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
