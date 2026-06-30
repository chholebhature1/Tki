"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { profileSchema, type ProfileFormData } from "../schemas/profile.schema";

export type ProfileUpdateResult = { success: boolean; error?: string };

export async function updateProfileAction(data: ProfileFormData): Promise<ProfileUpdateResult> {
  const parsed = profileSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid input." };
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone || null,
      date_of_birth: parsed.data.dateOfBirth || null,
      gender: parsed.data.gender || null,
      city: parsed.data.city || null,
      state: parsed.data.state || null,
      emergency_contact: parsed.data.emergencyContact || null,
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: "Failed to update profile." };
  }

  return { success: true };
}
