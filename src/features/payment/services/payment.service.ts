"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface PaymentResult {
  success: boolean;
  error?: string;
}

/**
 * Confirms payment for an appointment.
 * Transitions: payment_pending → confirmed
 */
export async function confirmPayment(
  appointmentId: string,
  userId: string
): Promise<PaymentResult> {
  const supabase = await createServerSupabaseClient();

  // Verify appointment exists, belongs to user, and is in correct status
  const { data: appointment, error: fetchError } = await supabase
    .from("appointments")
    .select("id, status, patient_profile_id")
    .eq("id", appointmentId)
    .single();

  if (fetchError || !appointment) {
    return { success: false, error: "Appointment not found." };
  }

  if (appointment.patient_profile_id !== userId) {
    return { success: false, error: "You do not have permission to confirm this appointment." };
  }

  if (appointment.status !== "payment_pending") {
    return { success: false, error: `Cannot confirm appointment with status: ${appointment.status}` };
  }

  // Update status to confirmed
  const { error: updateError } = await supabase
    .from("appointments")
    .update({ status: "confirmed" })
    .eq("id", appointmentId);

  if (updateError) {
    return { success: false, error: "Failed to confirm appointment." };
  }

  return { success: true };
}

/**
 * Marks payment as failed. Appointment remains in payment_pending.
 * The patient can retry or the appointment will be cleaned up later.
 */
export async function markPaymentFailed(
  appointmentId: string,
  userId: string
): Promise<PaymentResult> {
  const supabase = await createServerSupabaseClient();

  // Verify ownership
  const { data: appointment } = await supabase
    .from("appointments")
    .select("id, status, patient_profile_id")
    .eq("id", appointmentId)
    .single();

  if (!appointment || appointment.patient_profile_id !== userId) {
    return { success: false, error: "Appointment not found or access denied." };
  }

  if (appointment.status !== "payment_pending") {
    return { success: false, error: "Appointment is not in a payable state." };
  }

  // For now, keep it as payment_pending (Razorpay will handle actual failure states later)
  // We could delete the appointment here, but keeping it allows retry
  return { success: true };
}
