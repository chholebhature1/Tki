import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AppointmentCard } from "@/features/appointments";

export const metadata = { title: "Manage Appointments" };

export default async function AdminAppointmentsPage() {
  const supabase = await createServerSupabaseClient();

  // Get all appointments (admin view — uses raw query since RLS allows admin)
  const { data } = await supabase
    .from("appointments")
    .select(`id, appointment_date, start_time, end_time, duration_minutes, consultation_mode, status, booking_reference, notes, created_at, cancelled_at, completed_at,
      patient:profiles!appointments_patient_profile_id_fkey(id, full_name, email),
      therapist:therapist_profiles!appointments_therapist_profile_id_fkey(id, professional_title, profile:profiles!therapist_profiles_profile_id_fkey(full_name, avatar_url))
    `)
    .order("appointment_date", { ascending: false })
    .limit(30);

  const appointments = (data || []).map((row) => {
    const therapist = row.therapist as unknown as { id: string; professional_title: string | null; profile: { full_name: string; avatar_url: string | null } };
    const patient = row.patient as unknown as { id: string; full_name: string; email: string };
    return {
      id: row.id, appointmentDate: row.appointment_date, startTime: row.start_time,
      endTime: row.end_time, durationMinutes: row.duration_minutes, consultationMode: row.consultation_mode,
      status: row.status, bookingReference: row.booking_reference, notes: row.notes,
      createdAt: row.created_at, cancelledAt: row.cancelled_at, completedAt: row.completed_at,
      therapist: { id: therapist.id, name: therapist.profile.full_name, professionalTitle: therapist.professional_title, qualification: null, avatarUrl: therapist.profile.avatar_url },
      patient: { id: patient.id, name: patient.full_name, email: patient.email },
    };
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h1 className="text-2xl font-bold text-text">Appointments</h1>
      <div className="space-y-3">
        {appointments.length > 0 ? appointments.map((a) => (
          <AppointmentCard key={a.id} appointment={a} showPatient />
        )) : (
          <p className="text-sm text-text-secondary">No appointments found.</p>
        )}
      </div>
    </div>
  );
}
