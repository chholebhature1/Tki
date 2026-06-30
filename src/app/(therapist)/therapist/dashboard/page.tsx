import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, CheckCircle, Users, Clock, Video, Star, TrendingUp } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { TherapistDashboardRepository } from "@/features/appointments/repositories";

export const metadata = { title: "Today — TalkIndia Pro" };

export default async function TherapistDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: therapistProfile } = await supabase
    .from("therapist_profiles")
    .select("id, professional_title, verification_status, average_rating, total_reviews, total_sessions, consultation_fee")
    .eq("profile_id", user.id)
    .single();

  if (!therapistProfile) redirect("/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const dashboard = await TherapistDashboardRepository.getDashboard(therapistProfile.id);
  const name = profile?.full_name?.split(" ")[0] || "Doctor";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const now = new Date();

  // Classify today's sessions relative to now
  const confirmedToday = dashboard.todayAppointments.filter((a) => a.status === "confirmed");
  const completedToday = dashboard.todayAppointments.filter((a) => a.status === "completed");

  // Find the active/next joinable session
  const activeSession = confirmedToday.find((appt) => {
    const start = new Date(`${appt.appointmentDate}T${appt.startTime}`);
    const end = new Date(start.getTime() + appt.durationMinutes * 60000);
    return now >= new Date(start.getTime() - 15 * 60000) && now <= new Date(end.getTime() + 15 * 60000);
  });

  // Next upcoming session (not yet joinable)
  const nextSession = !activeSession
    ? confirmedToday.find((appt) => {
        const start = new Date(`${appt.appointmentDate}T${appt.startTime}`);
        return start > now;
      })
    : null;

  // Compute time until next session
  let timeUntilNext = "";
  if (nextSession) {
    const start = new Date(`${nextSession.appointmentDate}T${nextSession.startTime}`);
    const diffMin = Math.round((start.getTime() - now.getTime()) / 60000);
    if (diffMin < 60) timeUntilNext = `in ${diffMin} min`;
    else timeUntilNext = `in ${Math.floor(diffMin / 60)}h ${diffMin % 60}m`;
  }

  const remaining = confirmedToday.length;
  const done = completedToday.length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">{greeting}, Dr. {name}</h1>
          <p className="mt-0.5 text-sm text-text-secondary">
            {remaining > 0
              ? `${done} done · ${remaining} remaining today`
              : done > 0
                ? `${done} session${done > 1 ? "s" : ""} completed today`
                : "No sessions today — enjoy your break"}
          </p>
        </div>

        {/* Primary action — contextual */}
        {activeSession ? (
          <Link
            href={`/consultation/${activeSession.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Video className="h-4 w-4" aria-hidden="true" />
            Join — {activeSession.patient.name?.split(" ")[0] || "Patient"}
          </Link>
        ) : nextSession ? (
          <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text-secondary">
            <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
            Next session {timeUntilNext}
          </div>
        ) : null}
      </header>

      {/* Today's Sessions — the focus */}
      <section className="rounded-2xl border border-border bg-white" aria-labelledby="today-heading">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id="today-heading" className="text-base font-semibold text-text">Today&apos;s Sessions</h2>
          <Link href="/therapist/appointments" className="text-xs font-medium text-primary hover:text-primary-hover">
            Full Schedule →
          </Link>
        </div>

        {confirmedToday.length > 0 || completedToday.length > 0 ? (
          <div className="divide-y divide-border">
            {dashboard.todayAppointments
              .filter((a) => a.status === "confirmed" || a.status === "completed")
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((appt) => {
                // Format time: "10:49:49.817928" → "10:49"
                const displayTime = appt.startTime?.slice(0, 5) || "—";
                const start = new Date(`${appt.appointmentDate}T${appt.startTime}`);
                const end = new Date(start.getTime() + appt.durationMinutes * 60000);
                const isActive = appt.status === "confirmed" && now >= new Date(start.getTime() - 15 * 60000) && now <= new Date(end.getTime() + 15 * 60000);
                const isPast = appt.status === "completed" || now > new Date(end.getTime() + 15 * 60000);
                const isFuture = appt.status === "confirmed" && !isActive && !isPast;

                return (
                  <div
                    key={appt.id}
                    className={`flex items-center gap-4 px-5 py-4 transition-colors ${
                      isActive ? "bg-primary/5" : isPast ? "opacity-60" : ""
                    }`}
                  >
                    {/* Time column */}
                    <div className="w-14 shrink-0 text-center">
                      <p className={`text-sm font-semibold ${isActive ? "text-primary" : "text-text"}`}>
                        {displayTime}
                      </p>
                      <p className="text-[10px] text-muted">{appt.durationMinutes}m</p>
                    </div>

                    {/* Divider dot */}
                    <div className="flex flex-col items-center">
                      <div className={`h-3 w-3 rounded-full border-2 ${
                        isActive ? "border-primary bg-primary" :
                        isPast ? "border-muted bg-muted" :
                        "border-border bg-white"
                      }`} />
                    </div>

                    {/* Patient info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text">
                        {appt.patient.name || "Patient"}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {appt.consultationMode === "online" ? "Video" : "In-Person"}
                        {isActive && " · In progress"}
                        {isPast && " · Completed"}
                        {isFuture && (() => {
                          const diff = Math.round((start.getTime() - now.getTime()) / 60000);
                          if (diff <= 0) return " · Starting soon";
                          if (diff < 60) return ` · Starts in ${diff}m`;
                          return ` · Starts in ${Math.floor(diff / 60)}h ${diff % 60}m`;
                        })()}
                      </p>
                    </div>

                    {/* Action */}
                    {isActive && (
                      <Link
                        href={`/consultation/${appt.id}`}
                        className="shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover"
                      >
                        Join
                      </Link>
                    )}
                    {isPast && (
                      <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-[10px] font-medium text-muted">
                        <CheckCircle className="mr-1 inline h-3 w-3" aria-hidden="true" />Done
                      </span>
                    )}
                    {isFuture && (
                      <span className="shrink-0 text-xs text-muted">{displayTime}</span>
                    )}
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="px-5 py-10 text-center">
            <Calendar className="mx-auto h-8 w-8 text-muted" aria-hidden="true" />
            <p className="mt-2 text-sm text-text-secondary">No sessions scheduled for today</p>
            <Link href="/therapist/availability" className="mt-3 inline-block text-xs font-medium text-primary hover:text-primary-hover">
              Check Availability →
            </Link>
          </div>
        )}
      </section>

      {/* Two-column: Upcoming + Sidebar */}
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Upcoming days */}
        {dashboard.upcomingAppointments.length > 0 && (
          <section className="rounded-2xl border border-border bg-white p-5">
            <h2 className="text-base font-semibold text-text">Coming Up</h2>
            <div className="mt-4 space-y-2">
              {dashboard.upcomingAppointments.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text">{appt.patient.name || "Patient"}</p>
                    <p className="text-xs text-muted">
                      {new Date(appt.appointmentDate).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })} · {appt.startTime?.slice(0, 5)} · {appt.durationMinutes}m
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-text-secondary">
                    {appt.consultationMode === "online" ? "Video" : "In-Person"}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/therapist/appointments" className="mt-4 block text-xs font-medium text-primary hover:text-primary-hover">
              View Full Schedule →
            </Link>
          </section>
        )}

        {/* If no upcoming, fill space */}
        {dashboard.upcomingAppointments.length === 0 && (
          <section className="rounded-2xl border border-border bg-white p-5">
            <h2 className="text-base font-semibold text-text">Coming Up</h2>
            <div className="mt-4 py-6 text-center">
              <Calendar className="mx-auto h-7 w-7 text-muted" aria-hidden="true" />
              <p className="mt-2 text-sm text-text-secondary">No upcoming sessions</p>
            </div>
          </section>
        )}

        {/* Performance sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-white p-5">
            <h3 className="text-sm font-semibold text-text">Performance</h3>
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-text-secondary">
                  <Star className="h-3.5 w-3.5 text-warning" aria-hidden="true" /> Rating
                </span>
                <span className="text-sm font-semibold text-text">{Number(therapistProfile.average_rating).toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-text-secondary">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> Sessions
                </span>
                <span className="text-sm font-semibold text-text">{therapistProfile.total_sessions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-text-secondary">
                  <Users className="h-3.5 w-3.5 text-info" aria-hidden="true" /> Reviews
                </span>
                <span className="text-sm font-semibold text-text">{therapistProfile.total_reviews}</span>
              </div>
            </div>
            <Link href="/therapist/earnings" className="mt-4 block text-xs font-medium text-primary hover:text-primary-hover">
              View Earnings →
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5">
            <h3 className="text-sm font-semibold text-text">Availability</h3>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-text">{dashboard.availability.workingDays}</p>
                <p className="text-[10px] text-muted">Days</p>
              </div>
              <div>
                <p className="text-lg font-bold text-text">{dashboard.availability.consultationHours}</p>
                <p className="text-[10px] text-muted">Hours</p>
              </div>
              <div>
                <p className="text-lg font-bold text-text">{dashboard.availability.slotDuration}m</p>
                <p className="text-[10px] text-muted">Slot</p>
              </div>
            </div>
            <Link href="/therapist/availability" className="mt-4 block text-xs font-medium text-primary hover:text-primary-hover">
              Manage Schedule →
            </Link>
          </div>
        </div>
      </div>

      <div className="h-16 lg:hidden" />
    </div>
  );
}
