"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createBooking, lockSlot, type BookingResult } from "../services";

export interface CreateBookingActionInput {
  therapistProfileId: string;
  appointmentDate: string;
  startTime: string;
  durationMinutes: number;
  consultationMode: "online" | "offline" | "both";
  notes: string | null;
}

export async function createBookingAction(
  input: CreateBookingActionInput
): Promise<BookingResult> {
  const supabase = await createServerSupabaseClient();

  // Get the current authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "You must be logged in to book an appointment." };
  }

  return createBooking({
    patientId: user.id,
    therapistProfileId: input.therapistProfileId,
    appointmentDate: input.appointmentDate,
    startTime: input.startTime,
    durationMinutes: input.durationMinutes,
    consultationMode: input.consultationMode,
    notes: input.notes,
  });
}

export async function lockSlotAction(
  therapistProfileId: string,
  appointmentDate: string,
  startTime: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "You must be logged in." };
  }

  return lockSlot(therapistProfileId, user.id, appointmentDate, startTime);
}
