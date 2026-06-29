/**
 * LiveKit core service.
 * Handles configuration validation and JWT token generation.
 * ALL secrets stay server-side. Never expose apiKey/apiSecret to client.
 */

import { AccessToken } from "livekit-server-sdk";
import { ROOM_PREFIX, TOKEN_EXPIRATION_SECONDS } from "../constants";
import type { MeetingRole } from "../types";

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

/** Generates a room name from appointment ID */
export function getRoomName(appointmentId: string): string {
  return `${ROOM_PREFIX}-${appointmentId}`;
}

/** Builds a unique participant identity */
export function buildParticipantIdentity(userId: string, role: MeetingRole): string {
  return `${role}_${userId}`;
}

/**
 * Generates a LiveKit access token for a participant.
 * The token grants room access with audio/video publish permissions.
 */
export async function generateToken(
  roomName: string,
  participantIdentity: string,
  participantName: string,
  role: MeetingRole
): Promise<string> {
  const { apiKey, apiSecret } = validateLiveKitConfig();

  const token = new AccessToken(apiKey, apiSecret, {
    identity: participantIdentity,
    name: participantName,
    ttl: TOKEN_EXPIRATION_SECONDS,
    metadata: JSON.stringify({ role }),
  });

  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return await token.toJwt();
}
