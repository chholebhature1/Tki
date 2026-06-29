/**
 * LiveKit configuration and token service.
 * ALL LiveKit secrets stay server-side only.
 */

import { ROOM_PREFIX } from "../constants";

/** Validates LiveKit environment configuration. Throws if missing. */
export function validateLiveKitConfig(): { url: string; apiKey: string; apiSecret: string } {
  const url = process.env.LIVEKIT_URL;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!url) throw new Error("LIVEKIT_URL environment variable is not set.");
  if (!apiKey) throw new Error("LIVEKIT_API_KEY environment variable is not set.");
  if (!apiSecret) throw new Error("LIVEKIT_API_SECRET environment variable is not set.");

  return { url, apiKey, apiSecret };
}

/** Generates a unique room name from an appointment ID */
export function getRoomName(appointmentId: string): string {
  return `${ROOM_PREFIX}-${appointmentId}`;
}

/**
 * Generates a LiveKit access token for a participant.
 * To be implemented in Phase 6.2.
 */
export async function generateToken(
  _roomName: string,
  _participantIdentity: string,
  _participantName: string
): Promise<string> {
  throw new Error("Not implemented: generateToken will be built in Phase 6.2");
}

/**
 * Validates a participant's permission to join a meeting.
 * To be implemented in Phase 6.2.
 */
export async function validateParticipant(
  _appointmentId: string,
  _userId: string
): Promise<boolean> {
  throw new Error("Not implemented: validateParticipant will be built in Phase 6.2");
}
