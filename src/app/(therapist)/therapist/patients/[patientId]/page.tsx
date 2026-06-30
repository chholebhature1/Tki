import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AppointmentStatusBadge } from "@/features/appointments";
import { ArrowLeft, Calendar, Video, MapPin, User, Mail, Phone, MapPinIcon } from "lucide-react";

export const metadata = { title: "Patient Details — TalkIndia Pro" };

export default async function PatientDetailPage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tp } = await supabase
    .from("therapist_profiles")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!tp) redirect("/dashboard");

  // Get patient profile
  const { data: patient } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, city, state, gender, date_of_birth")
    .eq("id", patientId)
    .single();

  if (!patient) notFound();

  // Get all appointments between this therapist and this patient
  const { data: appointments } = await supabase
    .from("appointments")
    .select("id, appointment_date, start_time, end_time, duration_minutes, consultation_mode, status, booking_reference, notes, created_at")
    .eq("therapist_profile_id", tp.id)
    .eq("patient_profile_id", patientId)
    .order("appointment_date", { ascending: false });

  const appts = appointments || [];
  const completed = appts.filter((a) => a.status === "completed").length;
  const upcoming = appts.filter((a) => a.status === "confirmed").length;
  const cancelled = appts.filter((a) => a.status === "cancelled" || a.status === "no_show").length;
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back navigation */}
      <Link href="/therapist/patients" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Patients
      </Link>

      {/* Patient header */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-light text-xl font-bold text-primary">
            {patient.full_name?.[0] || "P"}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-text">{patient.full_name}</h1>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary">
              {patient.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted" aria-hidden="true" /> {patient.email}
                </span>
              )}
              {patient.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-muted" aria-hidden="true" /> {patient.phone}
                </span>
              )}
              {patient.city && (
                <span className="flex items-center gap-1.5">
                  <MapPinIcon className="h-3.5 w-3.5 text-muted" aria-hidden="true" /> {patient.city}{patient.state ? `, ${patient.state}` : ""}
                </span>
              )}
              {patient.gender && (
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted" aria-hidden="true" /> {patient.gender}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-5 grid grid-cols-3 gap-4 border-t border-border pt-5">
          <div className="text-center">
            <p className="text-xl font-bold text-text">{completed}</p>
            <p className="text-xs text-text-secondary">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-primary">{upcoming}</p>
            <p className="text-xs text-text-secondary">Upcoming</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-text">{cancelled}</p>
            <p className="text-xs text-text-secondary">Cancelled</p>
          </div>
        </div>
      </div>

      {/* Session history */}
      <section>
        <h2 className="mb-3 text-base font-semibold text-text">Session History ({appts.length})</h2>
        {appts.length > 0 ? (
          <div className="space-y-2">
            {appts.map((appt) => {
              const ModeIcon = appt.consultation_mode === "offline" ? MapPin : Video;
              const isUpcoming = appt.appointment_date >= today && appt.status === "confirmed";

              return (
                <div key={appt.id} className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isUpcoming ? "bg-primary/10" : "bg-surface"}`}>
                      <ModeIcon className={`h-4 w-4 ${isUpcoming ? "text-primary" : "text-muted"}`} aria-hidden="true" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-text">
                          {new Date(appt.appointment_date).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                        </p>
                        <AppointmentStatusBadge status={appt.status} />
                      </div>
                      <p className="text-xs text-text-secondary">
                        {appt.start_time?.slice(0, 5)} · {appt.duration_minutes} min · {appt.consultation_mode === "online" ? "Video" : "In-Person"}
                      </p>
                    </div>
                  </div>
                  {isUpcoming && (
                    <Link
                      href={`/consultation/${appt.id}`}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover"
                    >
                      Join
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-white p-8 text-center">
            <Calendar className="mx-auto h-8 w-8 text-muted" aria-hidden="true" />
            <p className="mt-2 text-sm text-text-secondary">No session history with this patient.</p>
          </div>
        )}
      </section>

      <div className="h-16 lg:hidden" />
    </div>
  );
}
