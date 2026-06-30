"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { TherapistRepository } from "@/features/therapists/repositories";
import { therapistProfileSchema, type TherapistProfileFormData } from "../schemas/therapist-profile.schema";

export async function updateTherapistProfileAction(
  therapistProfileId: string,
  data: TherapistProfileFormData
): Promise<{ success: boolean; error?: string }> {
  const parsed = therapistProfileSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid input." };
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in." };
  }

  return TherapistRepository.updateProfile(therapistProfileId, user.id, {
    professional_title: parsed.data.professionalTitle,
    biography: parsed.data.biography,
    years_experience: parsed.data.yearsExperience,
    consultation_fee: parsed.data.consultationFee,
    consultation_mode: parsed.data.consultationMode,
  });
}
