"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { confirmPayment, markPaymentFailed, type PaymentResult } from "../services";

export async function confirmPaymentAction(
  appointmentId: string
): Promise<PaymentResult> {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "You must be logged in." };
  }

  return confirmPayment(appointmentId, user.id);
}

export async function markPaymentFailedAction(
  appointmentId: string
): Promise<PaymentResult> {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "You must be logged in." };
  }

  return markPaymentFailed(appointmentId, user.id);
}
