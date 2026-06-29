import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AppointmentDetail } from "../types";
import { AppointmentRepository } from "./appointment.repository";

export interface DashboardSummary {
  nextAppointment: AppointmentDetail | null;
  upcomingAppointments: AppointmentDetail[];
  recentAppointments: AppointmentDetail[];
  stats: {
    upcoming: number;
    completed: number;
    cancelled: number;
    total: number;
  };
}

export class DashboardRepository {
  static async getPatientDashboard(userId: string): Promise<DashboardSummary> {
    const supabase = await createServerSupabaseClient();

    // Get counts in a single query
    const { data: allAppointments } = await supabase
      .from("appointments")
      .select("status")
      .eq("patient_profile_id", userId);

    const appointments = allAppointments || [];
    const stats = {
      upcoming: appointments.filter((a) => a.status === "confirmed" || a.status === "payment_pending").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
      total: appointments.length,
    };

    // Get upcoming and past using existing repository methods
    const upcoming = await AppointmentRepository.getUpcoming(userId);
    const past = await AppointmentRepository.getPast(userId);

    return {
      nextAppointment: upcoming[0] || null,
      upcomingAppointments: upcoming.slice(0, 5),
      recentAppointments: past.slice(0, 5),
      stats,
    };
  }
}
