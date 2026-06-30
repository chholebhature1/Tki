import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AppointmentRepository } from "@/features/appointments/repositories";
import { AppointmentStatusBadge } from "@/features/appointments";
import { Calendar, Clock, Video, MapPin, Search } from "lucide-react";

export const metadata = { title: "Schedule — TalkIndia Pro" };

export default async function TherapistAppointmentsPage(
  props: { searchParams: Promise<{ tab?: string; q?: string }> }
) {
  const searchParams = await props.searchParams;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tp } = await supabase
    .from("therapist_profiles")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!tp) redirect("/dashboard");

  const allAppointments = await AppointmentRepository.getTherapistAppointments(tp.id);
  const tab = searchParams.tab || "upcoming";
  const query = searchParams.q?.toLowerCase() || "";
  const today = new Date().toISOString().split("T")[0];

  const upcoming = allAppointments.filter((a) => a.appointmentDate >= today && (a.status === "confirmed" || a.status === "payment_pending"));
  const todayAppts = allAppointments.filter((a) => a.appointmentDate === today);
  const completed = allAppointments.filter((a) => a.status === "completed");
  const cancelled = allAppointments.filter((a) => a.status === "cancelled" || a.status === "no_show");

  const listMap: Record<string, typeof allAppointments> = { upcoming, today: todayAppts, completed, cancelled };
  let activeList = listMap[tab] || upcoming;

  // Search filter
  if (query) {
    activeList = activeList.filter(
      (a) =>
        a.patient.name?.toLowerCase().includes(query) ||
        a.patient.email?.toLowerCase().includes(query) ||
        a.bookingReference?.toLowerCase().includes(query)
    );
  }

  const tabs = [
    { id: "upcoming", label: "Upcoming", count: upcoming.length },
    { id: "today", label: "Today", count: todayAppts.length },
    { id: "completed", label: "Completed", count: completed.length },
    { id: "cancelled", label: "Cancelled", count: cancelled.length },
  ];

  const now = new Date();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header with search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Schedule</h1>
          <p className="mt-0.5 text-sm text-text-secondary">
            {todayAppts.length} today · {upcoming.length} upcoming
          </p>
        </div>
        <form className="relative" action="/therapist/appointments" method="GET">
          <input type="hidden" name="tab" value={tab} />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search patient or reference..."
            className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-4 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-64"
          />
        </form>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-white p-1">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`/therapist/appointments?tab=${t.id}${query ? `&q=${query}` : ""}`}
            className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-primary text-white"
                : "text-text-secondary hover:bg-surface hover:text-text"
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`ml-1.5 text-xs ${tab === t.id ? "text-white/80" : "text-muted"}`}>
                {t.count}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Appointment list with inline actions */}
      {activeList.length > 0 ? (
        <div className="space-y-3">
          {activeList.map((appt) => {
            const ModeIcon = appt.consultationMode === "offline" ? MapPin : Video;
            const isToday = appt.appointmentDate === today;
            const sessionStart = new Date(appt.appointmentDate + "T" + appt.startTime);
            const canJoin = appt.status === "confirmed" && isToday && now >= new Date(sessionStart.getTime() - 15 * 60000);

            return (
              <div key={appt.id} className="rounded-2xl border border-border bg-white p-5 transition-all hover:border-primary/30 hover:shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {/* Patient info */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-sm font-semibold text-text-secondary">
                      {appt.patient.name?.[0] || "P"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text">{appt.patient.name || "Patient"}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-text-secondary">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-primary" aria-hidden="true" />
                          {new Date(appt.appointmentDate).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-primary" aria-hidden="true" />
                          {appt.startTime} · {appt.durationMinutes}m
                        </span>
                        <span className="flex items-center gap-1">
                          <ModeIcon className="h-3 w-3 text-primary" aria-hidden="true" />
                          {appt.consultationMode === "online" ? "Video" : "In-Person"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <AppointmentStatusBadge status={appt.status} />
                    {canJoin && (
                      <Link
                        href={`/consultation/${appt.id}`}
                        className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover"
                      >
                        Join Now
                      </Link>
                    )}
                    {appt.status === "confirmed" && !canJoin && (
                      <Link
                        href={`/appointments/${appt.id}`}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface hover:text-text"
                      >
                        Details
                      </Link>
                    )}
                    {appt.status === "completed" && (
                      <Link
                        href={`/appointments/${appt.id}`}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface hover:text-text"
                      >
                        View
                      </Link>
                    )}
                  </div>
                </div>

                {/* Booking reference */}
                {appt.bookingReference && (
                  <p className="mt-2 text-[11px] text-muted">Ref: {appt.bookingReference}</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <Calendar className="mx-auto h-10 w-10 text-muted" aria-hidden="true" />
          <h2 className="mt-4 text-base font-semibold text-text">
            {query ? "No matching appointments" : `No ${tab} appointments`}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {query
              ? `No results for "${query}". Try a different search.`
              : tab === "upcoming"
                ? "New bookings from patients will appear here."
                : "Your appointment history will appear here."}
          </p>
          {!query && tab === "upcoming" && (
            <Link href="/therapist/availability" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
              Check Availability Settings
            </Link>
          )}
        </div>
      )}

      <div className="h-16 lg:hidden" />
    </div>
  );
}
