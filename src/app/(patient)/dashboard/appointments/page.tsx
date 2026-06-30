import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Search } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AppointmentRepository } from "@/features/appointments/repositories";
import { AppointmentCard } from "@/features/appointments";

export const metadata = { title: "My Appointments" };

export default async function PatientAppointmentsPage(
  props: { searchParams: Promise<{ tab?: string }> }
) {
  const searchParams = await props.searchParams;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const tab = searchParams.tab || "upcoming";

  // Fetch all appointments once, filter client-side by tab
  const upcoming = await AppointmentRepository.getUpcoming(user.id);
  const past = await AppointmentRepository.getPast(user.id);

  const completedAppointments = past.filter((a) => a.status === "completed");
  const cancelledAppointments = past.filter((a) => a.status === "cancelled" || a.status === "no_show" || a.status === "refunded");

  const activeAppointments =
    tab === "completed" ? completedAppointments :
    tab === "cancelled" ? cancelledAppointments :
    upcoming;

  const tabs = [
    { id: "upcoming", label: "Upcoming", count: upcoming.length },
    { id: "completed", label: "Completed", count: completedAppointments.length },
    { id: "cancelled", label: "Cancelled", count: cancelledAppointments.length },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">My Appointments</h1>
          <p className="mt-1 text-sm text-text-secondary">
            View and manage your therapy sessions.
          </p>
        </div>
        <Link
          href="/find-therapists"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Book New Session
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-white p-1">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`/dashboard/appointments?tab=${t.id}`}
            className={`flex-1 rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-primary text-white"
                : "text-text-secondary hover:bg-surface hover:text-text"
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`ml-1.5 text-xs ${tab === t.id ? "text-white/80" : "text-muted"}`}>
                ({t.count})
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Appointment List */}
      {activeAppointments.length > 0 ? (
        <div className="space-y-3">
          {activeAppointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <Calendar className="mx-auto h-10 w-10 text-muted" aria-hidden="true" />
          <h2 className="mt-4 text-base font-semibold text-text">
            {tab === "upcoming" ? "No upcoming appointments" :
             tab === "completed" ? "No completed sessions yet" :
             "No cancelled appointments"}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {tab === "upcoming"
              ? "Find a therapist and book your first session."
              : "Your appointment history will appear here."}
          </p>
          {tab === "upcoming" && (
            <Link
              href="/find-therapists"
              className="mt-5 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover"
            >
              Find a Therapist
            </Link>
          )}
        </div>
      )}

      {/* Bottom padding for mobile nav */}
      <div className="h-16 lg:hidden" />
    </div>
  );
}
