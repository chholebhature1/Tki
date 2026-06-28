import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AppointmentDetail } from "../types";

export class AppointmentRepository {
  static async findById(id: string): Promise<AppointmentDetail | null> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("appointments")
      .select(`
        id,
        appointment_date,
        start_time,
        end_time,
        duration_minutes,
        consultation_mode,
        status,
        booking_reference,
        notes,
        created_at,
        cancelled_at,
        completed_at,
        patient:profiles!appointments_patient_profile_id_fkey (
          id,
          full_name,
          email
        ),
        therapist:therapist_profiles!appointments_therapist_profile_id_fkey (
          id,
          professional_title,
          profile:profiles!therapist_profiles_profile_id_fkey (
            full_name,
            avatar_url
          )
        )
      `)
      .eq("id", id)
      .single();

    if (error || !data) return null;

    // Transform snake_case DB response to camelCase app type
    const therapistData = data.therapist as unknown as {
      id: string;
      professional_title: string | null;
      profile: { full_name: string; avatar_url: string | null };
    };

    const patientData = data.patient as unknown as {
      id: string;
      full_name: string;
      email: string;
    };

    return {
      id: data.id,
      appointmentDate: data.appointment_date,
      startTime: data.start_time,
      endTime: data.end_time,
      durationMinutes: data.duration_minutes,
      consultationMode: data.consultation_mode,
      status: data.status,
      bookingReference: data.booking_reference,
      notes: data.notes,
      createdAt: data.created_at,
      cancelledAt: data.cancelled_at,
      completedAt: data.completed_at,
      therapist: {
        id: therapistData.id,
        name: therapistData.profile.full_name,
        professionalTitle: therapistData.professional_title,
        qualification: null, // Can extend later
        avatarUrl: therapistData.profile.avatar_url,
      },
      patient: {
        id: patientData.id,
        name: patientData.full_name,
        email: patientData.email,
      },
    };
  }

  static async findByPatient(patientId: string): Promise<AppointmentDetail[]> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("appointments")
      .select(`
        id,
        appointment_date,
        start_time,
        end_time,
        duration_minutes,
        consultation_mode,
        status,
        booking_reference,
        notes,
        created_at,
        cancelled_at,
        completed_at,
        therapist:therapist_profiles!appointments_therapist_profile_id_fkey (
          id,
          professional_title,
          profile:profiles!therapist_profiles_profile_id_fkey (
            full_name,
            avatar_url
          )
        )
      `)
      .eq("patient_profile_id", patientId)
      .order("appointment_date", { ascending: false });

    if (error || !data) return [];

    return data.map((row) => {
      const therapistData = row.therapist as unknown as {
        id: string;
        professional_title: string | null;
        profile: { full_name: string; avatar_url: string | null };
      };

      return {
        id: row.id,
        appointmentDate: row.appointment_date,
        startTime: row.start_time,
        endTime: row.end_time,
        durationMinutes: row.duration_minutes,
        consultationMode: row.consultation_mode,
        status: row.status,
        bookingReference: row.booking_reference,
        notes: row.notes,
        createdAt: row.created_at,
        cancelledAt: row.cancelled_at,
        completedAt: row.completed_at,
        therapist: {
          id: therapistData.id,
          name: therapistData.profile.full_name,
          professionalTitle: therapistData.professional_title,
          qualification: null,
          avatarUrl: therapistData.profile.avatar_url,
        },
        patient: {
          id: patientId,
          name: "",
          email: "",
        },
      };
    });
  }
}
