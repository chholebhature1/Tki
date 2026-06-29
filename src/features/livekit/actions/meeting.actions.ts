"use server";

import type { TokenResponse } from "../types";

/**
 * Generates a meeting token for the authenticated user.
 * Validates appointment ownership and timing.
 * To be implemented in Phase 6.2.
 */
export async function generateMeetingTokenAction(
  _appointmentId: string
): Promise<TokenResponse> {
  throw new Error("Not implemented: generateMeetingTokenAction will be built in Phase 6.2");
}

/**
 * Records that the user has joined the meeting.
 */
export async function joinMeetingAction(
  _appointmentId: string
): Promise<{ success: boolean; error?: string }> {
  throw new Error("Not implemented: joinMeetingAction will be built in Phase 6.2");
}

/**
 * Records that the user has left the meeting.
 */
export async function leaveMeetingAction(
  _appointmentId: string
): Promise<{ success: boolean }> {
  throw new Error("Not implemented: leaveMeetingAction will be built in Phase 6.2");
}
