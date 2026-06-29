"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AppointmentStatusTransitionResult = {
  success: boolean;
  error?: string;
};

type AppointmentStatus = "payment_pending" | "confirmed" | "cancelled" | "completed" | "rescheduled" | "no_show" | "refunded";

/** Valid status transitions map */
const VALID_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  payment_pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled", "rescheduled", "no_show"],
  cancelled: ["refunded"],
  completed: [],
  rescheduled: ["confirmed", "cancelled"],
  no_show: [],
  refunded: [],
};

function canTransition(from: AppointmentStatus, to: AppointmentStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

async function verifyAndTransition(
  appointmentId: string,
  userId: string,
  targetStatus: AppointmentStatus,
  role: "patient" | "therapist" | "admin",
  additionalUpdates?: Record<string, unknown>
): Promise<AppointmentStatusTransitionResult> {
  const supabase = await createServerSupabaseClient();

  // Fetch appointment
  const { data: appointment, error } = await supabase
    .from("appointments")
    .select("id, status, patient_profile_id, therapist_profile_id")
    .eq("id", appointmentId)
    .single();

  if (error || !appointment) {
    return { success: false, error: "Appointment not found." };
  }

  // Verify ownership
  if (role === "patient" && appointment.patient_profile_id !== userId) {
    return { success: false, error: "You do not have permission for this appointment." };
  }

  if (role === "therapist") {
    // Verify user is the assigned therapist
    const { data: tp } = await supabase
      .from("therapist_profiles")
      .select("id")
      .eq("profile_id", userId)
      .eq("id", appointment.therapist_profile_id)
      .single();

    if (!tp) {
      return { success: false, error: "You are not assigned to this appointment." };
    }
  }

  // Validate transition
  const currentStatus = appointment.status as AppointmentStatus;
  if (!canTransition(currentStatus, targetStatus)) {
    return {
      success: false,
      error: `Cannot transition from "${currentStatus}" to "${targetStatus}".`,
    };
  }

  // Update
  const updatePayload: Record<string, unknown> = {
    status: targetStatus,
    ...additionalUpdates,
  };

  const { error: updateError } = await supabase
    .from("appointments")
    .update(updatePayload)
    .eq("id", appointmentId);

  if (updateError) {
    return { success: false, error: "Failed to update appointment." };
  }

  return { success: true };
}

export async function cancelAppointment(
  appointmentId: string,
  userId: string,
  role: "patient" | "therapist" | "admin"
): Promise<AppointmentStatusTransitionResult> {
  return verifyAndTransition(appointmentId, userId, "cancelled", role, {
    cancelled_at: new Date().toISOString(),
  });
}

export async function rescheduleAppointment(
  appointmentId: string,
  userId: string,
  role: "patient" | "therapist"
): Promise<AppointmentStatusTransitionResult> {
  return verifyAndTransition(appointmentId, userId, "rescheduled", role);
}

export async function markCompleted(
  appointmentId: string,
  userId: string
): Promise<AppointmentStatusTransitionResult> {
  return verifyAndTransition(appointmentId, userId, "completed", "therapist", {
    completed_at: new Date().toISOString(),
  });
}

export async function markNoShow(
  appointmentId: string,
  userId: string
): Promise<AppointmentStatusTransitionResult> {
  return verifyAndTransition(appointmentId, userId, "no_show", "therapist");
}
