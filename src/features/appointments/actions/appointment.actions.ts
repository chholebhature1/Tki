"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  cancelAppointment,
  rescheduleAppointment,
  markCompleted,
  markNoShow,
  type AppointmentStatusTransitionResult,
} from "../services";

async function getAuthenticatedUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function cancelAppointmentAction(
  appointmentId: string
): Promise<AppointmentStatusTransitionResult> {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: "You must be logged in." };
  return cancelAppointment(appointmentId, user.id, "patient");
}

export async function cancelAppointmentAsTherapistAction(
  appointmentId: string
): Promise<AppointmentStatusTransitionResult> {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: "You must be logged in." };
  return cancelAppointment(appointmentId, user.id, "therapist");
}

export async function rescheduleAppointmentAction(
  appointmentId: string
): Promise<AppointmentStatusTransitionResult> {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: "You must be logged in." };
  return rescheduleAppointment(appointmentId, user.id, "patient");
}

export async function markCompletedAction(
  appointmentId: string
): Promise<AppointmentStatusTransitionResult> {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: "You must be logged in." };
  return markCompleted(appointmentId, user.id);
}

export async function markNoShowAction(
  appointmentId: string
): Promise<AppointmentStatusTransitionResult> {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: "You must be logged in." };
  return markNoShow(appointmentId, user.id);
}
