"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { TokenResponse } from "../types";
import { authorizeMeetingJoin } from "../services";

/**
 * Generates a meeting token for the authenticated user.
 * 
 * Security:
 * - Requires authentication
 * - Validates appointment ownership (patient or assigned therapist)
 * - Only confirmed appointments generate tokens
 * - Never exposes API secret to client
 * 
 * Returns: { token, serverUrl, roomName }
 */
export async function generateMeetingTokenAction(
  appointmentId: string
): Promise<{ success: boolean; data?: TokenResponse; error?: string }> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in to join a session." };
  }

  return authorizeMeetingJoin(appointmentId, user.id);
}

/**
 * Records that the user joined the meeting (for attendance tracking).
 * Placeholder — will integrate with session_attendance when table is created.
 */
export async function joinMeetingAction(
  appointmentId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  // Validate the user is a participant
  const { MeetingRepository } = await import("../repositories");
  const { valid } = await MeetingRepository.validateParticipant(appointmentId, user.id);

  if (!valid) {
    return { success: false, error: "You are not a participant of this session." };
  }

  // Record join (no-op until session_attendance table exists)
  await MeetingRepository.recordJoin(appointmentId, user.id);

  return { success: true };
}

/**
 * Records that the user left the meeting.
 */
export async function leaveMeetingAction(
  appointmentId: string
): Promise<{ success: boolean }> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false };

  const { MeetingRepository } = await import("../repositories");
  await MeetingRepository.recordLeave(appointmentId, user.id);

  return { success: true };
}
