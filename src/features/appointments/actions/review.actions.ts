"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface ReviewResult {
  success: boolean;
  error?: string;
}

export async function submitReviewAction(
  appointmentId: string,
  rating: number,
  comment: string
): Promise<ReviewResult> {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "You must be logged in." };

  // Verify the appointment belongs to this patient and is completed
  const { data: appointment } = await supabase
    .from("appointments")
    .select("id, patient_profile_id, therapist_profile_id, status")
    .eq("id", appointmentId)
    .single();

  if (!appointment) return { success: false, error: "Appointment not found." };
  if (appointment.patient_profile_id !== user.id) return { success: false, error: "Access denied." };
  if (appointment.status !== "completed") return { success: false, error: "Can only review completed sessions." };

  // Check if already reviewed
  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("appointment_id", appointmentId)
    .maybeSingle();

  if (existing) return { success: false, error: "You have already reviewed this session." };

  // Insert review
  const { error } = await supabase.from("reviews").insert({
    appointment_id: appointmentId,
    patient_profile_id: user.id,
    therapist_profile_id: appointment.therapist_profile_id,
    rating,
    comment: comment.trim() || null,
  });

  if (error) {
    return { success: false, error: "Could not submit review. Please try again." };
  }

  // Update therapist average rating (best-effort)
  try {
    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("therapist_profile_id", appointment.therapist_profile_id);

    if (reviews && reviews.length > 0) {
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await supabase
        .from("therapist_profiles")
        .update({ average_rating: Math.round(avg * 10) / 10, total_reviews: reviews.length })
        .eq("id", appointment.therapist_profile_id);
    }
  } catch { /* best-effort */ }

  return { success: true };
}
