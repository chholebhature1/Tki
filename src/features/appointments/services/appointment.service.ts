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
  const result = await verifyAndTransition(appointmentId, userId, "cancelled", role, {
    cancelled_at: new Date().toISOString(),
  });

  // Send cancellation notifications (best-effort)
  if (result.success) {
    try {
      const { createServerSupabaseClient } = await import("@/lib/supabase/server");
      const supabase = await createServerSupabaseClient();
      const { NotificationService } = await import("@/features/notifications/services");

      const { data: appt } = await supabase.from("appointments")
        .select("patient_profile_id, therapist_profile_id, appointment_date")
        .eq("id", appointmentId).single();

      if (appt) {
        const dateLabel = new Date(appt.appointment_date).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });

        // Get names and emails
        const { data: patient } = await supabase.from("profiles").select("full_name, email").eq("id", appt.patient_profile_id).single();
        const { data: tpData } = await supabase.from("therapist_profiles")
          .select("profile:profiles!therapist_profiles_profile_id_fkey(id, full_name, email)")
          .eq("id", appt.therapist_profile_id).single();
        const therapistProfile = tpData?.profile as unknown as { id: string; full_name: string; email: string } | null;

        // Notify patient
        if (patient) {
          await NotificationService.bookingCancelled(appt.patient_profile_id, patient.email, therapistProfile?.full_name || "Therapist", dateLabel);
        }
        // Notify therapist
        if (therapistProfile) {
          await NotificationService.notify({
            userId: therapistProfile.id, email: therapistProfile.email,
            title: "Booking Cancelled",
            message: `${patient?.full_name || "Patient"} cancelled their appointment on ${dateLabel}.`,
            type: "appointment", category: "cancellation", link: "/therapist/dashboard",
          });
        }
      }
    } catch { /* Never block cancellation */ }
  }

  return result;
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
  const result = await verifyAndTransition(appointmentId, userId, "completed", "therapist", {
    completed_at: new Date().toISOString(),
  });

  // Send completion + review reminder notifications (best-effort)
  if (result.success) {
    try {
      const supabase = await createServerSupabaseClient();
      const { NotificationService } = await import("@/features/notifications/services");

      const { data: appt } = await supabase.from("appointments")
        .select("patient_profile_id, therapist_profile_id, appointment_date")
        .eq("id", appointmentId).single();

      if (appt) {
        const { data: patient } = await supabase.from("profiles").select("full_name, email").eq("id", appt.patient_profile_id).single();
        const { data: tpData } = await supabase.from("therapist_profiles")
          .select("profile:profiles!therapist_profiles_profile_id_fkey(id, full_name, email)")
          .eq("id", appt.therapist_profile_id).single();
        const therapistProfile = tpData?.profile as unknown as { id: string; full_name: string; email: string } | null;

        // Notify patient — session completed
        if (patient) {
          await NotificationService.notify({
            userId: appt.patient_profile_id, email: patient.email,
            title: "Consultation Completed",
            message: `Your session with ${therapistProfile?.full_name || "your therapist"} has been completed.`,
            type: "appointment", category: "consultation", link: `/appointments/${appointmentId}`,
            emailSubject: "TalkIndia — Session Completed",
            emailBody: undefined, // Use default template
          });

          // Review reminder
          await NotificationService.notify({
            userId: appt.patient_profile_id, email: patient.email,
            title: "How was your session?",
            message: "Please take a moment to rate your therapist. Your feedback helps other patients.",
            type: "review", category: "reminder", link: `/appointments/${appointmentId}`,
          });
        }

        // Notify therapist — session completed
        if (therapistProfile) {
          await NotificationService.notify({
            userId: therapistProfile.id, email: therapistProfile.email,
            title: "Session Completed",
            message: `Your consultation with ${patient?.full_name || "patient"} has been marked as completed.`,
            type: "appointment", category: "consultation", link: "/therapist/dashboard",
          });
        }
      }
    } catch { /* Never block completion */ }
  }

  return result;
}

export async function markNoShow(
  appointmentId: string,
  userId: string
): Promise<AppointmentStatusTransitionResult> {
  return verifyAndTransition(appointmentId, userId, "no_show", "therapist");
}
