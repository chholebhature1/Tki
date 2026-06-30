"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface CreateBookingInput {
  patientId: string;
  therapistProfileId: string;
  appointmentDate: string;
  startTime: string;
  durationMinutes: number;
  consultationMode: "online" | "offline" | "both";
  notes: string | null;
}

export interface BookingResult {
  success: boolean;
  appointmentId?: string;
  bookingReference?: string;
  error?: string;
}

function generateBookingReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TKI-${timestamp}-${random}`;
}

function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [h, m] = startTime.split(":").map(Number);
  const totalMinutes = h * 60 + m + durationMinutes;
  const endH = Math.floor(totalMinutes / 60);
  const endM = totalMinutes % 60;
  return `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;
}

export async function createBooking(input: CreateBookingInput): Promise<BookingResult> {
  const supabase = await createServerSupabaseClient();

  // 1. Verify therapist exists and is approved
  const { data: therapist } = await supabase
    .from("therapist_profiles")
    .select("id, verification_status")
    .eq("id", input.therapistProfileId)
    .single();

  if (!therapist || therapist.verification_status !== "approved") {
    return { success: false, error: "Therapist is not available." };
  }

  // 2. Check for existing booking at this slot
  const { data: existing } = await supabase
    .from("appointments")
    .select("id")
    .eq("therapist_profile_id", input.therapistProfileId)
    .eq("appointment_date", input.appointmentDate)
    .eq("start_time", input.startTime)
    .in("status", ["confirmed", "payment_pending"])
    .maybeSingle();

  if (existing) {
    return { success: false, error: "This time slot is no longer available." };
  }

  // 3. Verify slot lock exists and belongs to this patient
  const { data: lock } = await supabase
    .from("slot_locks")
    .select("id, patient_id, expires_at")
    .eq("therapist_profile_id", input.therapistProfileId)
    .eq("appointment_date", input.appointmentDate)
    .eq("start_time", input.startTime)
    .maybeSingle();

  if (lock) {
    const isExpired = new Date(lock.expires_at) < new Date();
    if (isExpired) {
      // Clean up expired lock
      await supabase.from("slot_locks").delete().eq("id", lock.id);
      return { success: false, error: "Your slot reservation has expired. Please select a new time." };
    }
    if (lock.patient_id !== input.patientId) {
      return { success: false, error: "This slot is reserved by another patient." };
    }
  }

  // 4. Create the appointment
  const endTime = calculateEndTime(input.startTime, input.durationMinutes);
  const bookingReference = generateBookingReference();

  const { data: appointment, error } = await supabase
    .from("appointments")
    .insert({
      patient_profile_id: input.patientId,
      therapist_profile_id: input.therapistProfileId,
      appointment_date: input.appointmentDate,
      start_time: input.startTime,
      end_time: endTime,
      duration_minutes: input.durationMinutes,
      consultation_mode: input.consultationMode,
      status: "payment_pending",
      booking_reference: bookingReference,
      notes: input.notes,
    })
    .select("id")
    .single();

  if (error || !appointment) {
    if (error?.code === "23505") {
      return { success: false, error: "This time slot is no longer available." };
    }
    return { success: false, error: "Could not create booking. Please try again." };
  }

  // 5. Remove the slot lock (if any)
  if (lock) {
    await supabase.from("slot_locks").delete().eq("id", lock.id);
  }

  // 6. Send notifications (best-effort, never blocks booking)
  try {
    const { NotificationService } = await import("@/features/notifications/services");
    // Get patient and therapist info for notification
    const { data: patientProfile } = await supabase.from("profiles").select("full_name, email").eq("id", input.patientId).single();
    const { data: therapistData } = await supabase.from("therapist_profiles").select("profile:profiles!therapist_profiles_profile_id_fkey(id, full_name, email)").eq("id", input.therapistProfileId).single();
    const therapistUser = therapistData?.profile as unknown as { id: string; full_name: string; email: string } | null;

    const dateLabel = new Date(input.appointmentDate).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });

    if (therapistUser) {
      await NotificationService.newBookingForTherapist(therapistUser.id, therapistUser.email, patientProfile?.full_name || "Patient", dateLabel, input.startTime);
    }
  } catch { /* Notification failure must never block booking */ }

  return {
    success: true,
    appointmentId: appointment.id,
    bookingReference,
  };
}

export async function lockSlot(
  therapistProfileId: string,
  patientId: string,
  appointmentDate: string,
  startTime: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient();

  // Clean up any expired locks for this slot
  await supabase
    .from("slot_locks")
    .delete()
    .eq("therapist_profile_id", therapistProfileId)
    .eq("appointment_date", appointmentDate)
    .eq("start_time", startTime)
    .lt("expires_at", new Date().toISOString());

  // Try to insert a new lock
  const { error } = await supabase.from("slot_locks").insert({
    therapist_profile_id: therapistProfileId,
    patient_id: patientId,
    appointment_date: appointmentDate,
    start_time: startTime,
  });

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "This slot is currently being booked by someone else." };
    }
    return { success: false, error: "Could not reserve slot." };
  }

  return { success: true };
}
