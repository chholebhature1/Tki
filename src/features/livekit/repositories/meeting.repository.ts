/**
 * Meeting repository.
 * Queries appointment data for meeting authorization.
 * Uses existing appointments table — no separate video_sessions table needed for MVP.
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { RoomInfo, MeetingRole } from "../types";
import { getRoomName } from "../services/livekit.service";

interface AppointmentParticipantData {
  id: string;
  appointment_date: string;
  start_time: string;
  duration_minutes: number;
  status: string;
  patient_profile_id: string;
  therapist_profile_id: string;
}

export class MeetingRepository {
  /**
   * Validates that a user is an authorized participant of a confirmed appointment.
   * Returns the participant's role if valid, null otherwise.
   */
  static async validateParticipant(
    appointmentId: string,
    userId: string
  ): Promise<{ valid: boolean; role: MeetingRole | null; appointment: AppointmentParticipantData | null }> {
    const supabase = await createServerSupabaseClient();

    const { data: appointment, error } = await supabase
      .from("appointments")
      .select("id, appointment_date, start_time, duration_minutes, status, patient_profile_id, therapist_profile_id")
      .eq("id", appointmentId)
      .single();

    if (error || !appointment) {
      return { valid: false, role: null, appointment: null };
    }

    // Only confirmed appointments can generate tokens
    if (appointment.status !== "confirmed") {
      return { valid: false, role: null, appointment: null };
    }

    // Check if user is the patient
    if (appointment.patient_profile_id === userId) {
      return { valid: true, role: "patient", appointment };
    }

    // Check if user is the therapist (via therapist_profiles)
    const { data: therapistProfile } = await supabase
      .from("therapist_profiles")
      .select("id")
      .eq("id", appointment.therapist_profile_id)
      .eq("profile_id", userId)
      .single();

    if (therapistProfile) {
      return { valid: true, role: "therapist", appointment };
    }

    return { valid: false, role: null, appointment: null };
  }

  /**
   * Gets room information for a confirmed appointment.
   */
  static async getRoomInfo(appointmentId: string): Promise<RoomInfo | null> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("appointments")
      .select("id, appointment_date, start_time, duration_minutes, patient_profile_id, therapist_profile_id, status")
      .eq("id", appointmentId)
      .eq("status", "confirmed")
      .single();

    if (error || !data) return null;

    return {
      name: getRoomName(appointmentId),
      appointmentId: data.id,
      therapistId: data.therapist_profile_id,
      patientId: data.patient_profile_id,
      scheduledStart: `${data.appointment_date}T${data.start_time}`,
      duration: data.duration_minutes,
    };
  }

  /**
   * Records a participant joining the meeting.
   * No-op until session_attendance table is created.
   */
  static async recordJoin(_appointmentId: string, _userId: string): Promise<void> {
    // Will insert into session_attendance when table exists
  }

  /**
   * Records a participant leaving the meeting.
   * No-op until session_attendance table is created.
   */
  static async recordLeave(_appointmentId: string, _userId: string): Promise<void> {
    // Will update session_attendance when table exists
  }
}
