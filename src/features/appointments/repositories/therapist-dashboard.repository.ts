import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AppointmentDetail } from "../types";
import { AppointmentRepository } from "./appointment.repository";

export interface TherapistDashboardData {
  todayAppointments: AppointmentDetail[];
  upcomingAppointments: AppointmentDetail[];
  stats: {
    todaySessions: number;
    upcoming: number;
    completedToday: number;
    activePatients: number;
  };
  availability: {
    workingDays: number;
    consultationHours: string;
    slotDuration: number;
  };
}

export class TherapistDashboardRepository {
  static async getDashboard(therapistProfileId: string): Promise<TherapistDashboardData> {
    const supabase = await createServerSupabaseClient();
    const today = new Date().toISOString().split("T")[0];

    // Get all therapist appointments
    const allAppointments = await AppointmentRepository.getTherapistAppointments(therapistProfileId);

    // Today's appointments
    const todayAppointments = allAppointments.filter(
      (a) => a.appointmentDate === today
    );

    // Upcoming (future confirmed)
    const upcomingAppointments = allAppointments
      .filter((a) => a.appointmentDate > today && (a.status === "confirmed" || a.status === "payment_pending"))
      .sort((a, b) => a.appointmentDate.localeCompare(b.appointmentDate))
      .slice(0, 5);

    // Stats
    const completedToday = todayAppointments.filter((a) => a.status === "completed").length;
    const todaySessions = todayAppointments.filter(
      (a) => a.status === "confirmed" || a.status === "completed"
    ).length;

    // Active patients (distinct patients with confirmed/completed in last 90 days)
    const recentPatientIds = new Set(
      allAppointments
        .filter((a) => a.status === "completed" || a.status === "confirmed")
        .map((a) => a.patient.id)
    );

    // Availability summary
    const { data: availabilityRules } = await supabase
      .from("therapist_availability")
      .select("weekday, start_time, end_time, slot_duration_minutes")
      .eq("therapist_profile_id", therapistProfileId)
      .eq("is_active", true);

    const rules = availabilityRules || [];
    const workingDays = new Set(rules.map((r: { weekday: number }) => r.weekday)).size;
    const slotDuration = rules[0]?.slot_duration_minutes || 50;

    // Calculate total consultation hours per week
    let totalMinutes = 0;
    for (const rule of rules as { start_time: string; end_time: string }[]) {
      const [sh, sm] = rule.start_time.split(":").map(Number);
      const [eh, em] = rule.end_time.split(":").map(Number);
      totalMinutes += (eh * 60 + em) - (sh * 60 + sm);
    }
    const hours = Math.round(totalMinutes / 60);

    return {
      todayAppointments,
      upcomingAppointments,
      stats: {
        todaySessions,
        upcoming: upcomingAppointments.length,
        completedToday,
        activePatients: recentPatientIds.size,
      },
      availability: {
        workingDays,
        consultationHours: `${hours}h/week`,
        slotDuration,
      },
    };
  }
}
