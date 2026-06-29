/**
 * Meeting service.
 * Orchestrates authorization and token generation for video consultations.
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { TokenResponse } from "../types";
import { getRoomName, buildParticipantIdentity, generateToken, validateLiveKitConfig } from "./livekit.service";
import { MeetingRepository } from "../repositories";

export interface MeetingAuthResult {
  success: boolean;
  data?: TokenResponse;
  error?: string;
}

/**
 * Authorizes a user to join a meeting and returns a LiveKit token.
 * 
 * Security checks:
 * 1. User is authenticated
 * 2. Appointment exists
 * 3. Appointment status is "confirmed"
 * 4. User is either the assigned patient or therapist
 * 5. LiveKit configuration is valid
 */
export async function authorizeMeetingJoin(
  appointmentId: string,
  userId: string
): Promise<MeetingAuthResult> {
  // Validate LiveKit config early
  try {
    validateLiveKitConfig();
  } catch {
    return { success: false, error: "Video service is not configured." };
  }

  // Validate participant
  const { valid, role, appointment } = await MeetingRepository.validateParticipant(appointmentId, userId);

  if (!valid || !role || !appointment) {
    return { success: false, error: "You are not authorized to join this session." };
  }

  // Get participant name from profile
  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .single();

  const participantName = profile?.full_name || "Participant";

  // Generate room name and token
  const roomName = getRoomName(appointmentId);
  const identity = buildParticipantIdentity(userId, role);

  const token = await generateToken(roomName, identity, participantName, role);

  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
  if (!serverUrl) {
    return { success: false, error: "Video service URL is not configured." };
  }

  return {
    success: true,
    data: {
      token,
      serverUrl,
      roomName,
    },
  };
}
