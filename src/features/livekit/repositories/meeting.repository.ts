/**
 * Meeting repository — manages video session records in Supabase.
 * The video_sessions table will be created when this feature is fully implemented.
 * For now, this is a placeholder following the repository pattern.
 */

import type { RoomInfo } from "../types";

export class MeetingRepository {
  /**
   * Gets meeting room info for an appointment.
   * To be implemented when video_sessions table is created.
   */
  static async getRoomInfo(_appointmentId: string): Promise<RoomInfo | null> {
    // Will query video_sessions table in Phase 6.2
    return null;
  }

  /**
   * Records a participant joining the meeting.
   */
  static async recordJoin(_appointmentId: string, _userId: string): Promise<void> {
    // Will insert into session_attendance in Phase 6.2
  }

  /**
   * Records a participant leaving the meeting.
   */
  static async recordLeave(_appointmentId: string, _userId: string): Promise<void> {
    // Will update session_attendance in Phase 6.2
  }
}
