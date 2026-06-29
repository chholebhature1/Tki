/**
 * Meeting lifecycle service.
 * Manages join/leave/end logic for consultations.
 * To be fully implemented in Phase 6.2.
 */

import type { TokenResponse, MeetingRole } from "../types";

/**
 * Joins a meeting — validates permissions and returns a token.
 */
export async function joinMeeting(
  _appointmentId: string,
  _userId: string,
  _role: MeetingRole
): Promise<TokenResponse> {
  throw new Error("Not implemented: joinMeeting will be built in Phase 6.2");
}

/**
 * Leaves a meeting — records attendance.
 */
export async function leaveMeeting(
  _appointmentId: string,
  _userId: string
): Promise<void> {
  throw new Error("Not implemented: leaveMeeting will be built in Phase 6.2");
}

/**
 * Ends a meeting — marks appointment as completed.
 */
export async function endMeeting(
  _appointmentId: string,
  _userId: string
): Promise<void> {
  throw new Error("Not implemented: endMeeting will be built in Phase 6.2");
}
