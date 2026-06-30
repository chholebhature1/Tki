import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, CheckCircle, Users, Clock, Video, ArrowRight, Star, TrendingUp } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { TherapistDashboardRepository } from "@/features/appointments/repositories";
import { StatCard } from "@/features/dashboard";

export const metadata = { title: "Therapist Dashboard" };

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

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header — Productivity focused */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">{greeting}, Dr. {name}</h1>
          <p className="mt-0.5 text-sm text-text-secondary">
            {dashboard.stats.todaySessions > 0
              ? `${dashboard.stats.todaySessions} session${dashboard.stats.todaySessions > 1 ? "s" : ""} scheduled today`
              : "No sessions today — enjoy your break"}
          </p>
        </div>
        {dashboard.todayAppointments.length > 0 && (
          <Link href={`/consultation/${dashboard.todayAppointments[0].id}`} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-primary-hover">
            <Video className="h-4 w-4" aria-hidden="true" /> Join Next Session
          </Link>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Calendar} label="Today" value={dashboard.stats.todaySessions} />
        <StatCard icon={Clock} label="Upcoming" value={dashboard.stats.upcoming} />
        <StatCard icon={Users} label="Patients" value={dashboard.stats.activePatients} />
        <StatCard icon={CheckCircle} label="Completed" value={dashboard.stats.completedToday} />
      </div>

      {/* Two-column layout: Schedule + Sidebar */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main — Today's Schedule */}
        <div className="space-y-6">
          {/* Today's Queue */}
          <section className="rounded-2xl border border-border bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-text">Today&apos;s Schedule</h2>
              <Link href="/therapist/appointments" className="text-xs font-medium text-primary hover:text-primary-hover">View All →</Link>
            </div>
            {dashboard.todayAppointments.length > 0 ? (
              <div className="mt-4 space-y-3">
                {dashboard.todayAppointments.map((appt) => (
                  <div key={appt.id} className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-surface/50">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
                        {appt.patient.name?.[0] || "P"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text">{appt.patient.name || "Patient"}</p>
                        <p className="text-xs text-text-secondary">{appt.startTime} · {appt.durationMinutes} min · {appt.consultationMode === "online" ? "Video" : "In-Person"}</p>
                      </div>
                    </div>
                    <Link href={`/consultation/${appt.id}`} className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20">
                      Join
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 text-center py-8">
                <Calendar className="mx-auto h-8 w-8 text-muted" aria-hidden="true" />
                <p className="mt-2 text-sm text-text-secondary">No sessions scheduled for today</p>
              </div>
            )}
          </section>

          {/* Upcoming Sessions */}
          {dashboard.upcomingAppointments.length > 0 && (
            <section className="rounded-2xl border border-border bg-white p-5">
              <h2 className="text-base font-semibold text-text">Upcoming Sessions</h2>
              <div className="mt-4 space-y-2">
                {dashboard.upcomingAppointments.map((appt) => (
                  <div key={appt.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-text">{appt.patient.name || "Patient"}</p>
                      <p className="text-xs text-muted">{new Date(appt.appointmentDate).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })} · {appt.startTime}</p>
                    </div>
                    <span className="text-xs text-text-secondary">{appt.consultationMode === "online" ? "Video" : "In-Person"}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar — Quick Info */}
        <div className="space-y-4">
          {/* Performance */}
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
                  <TrendingUp className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> Total Sessions
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
            <Link href="/therapist/earnings" className="mt-4 block text-xs font-medium text-primary hover:text-primary-hover">View Analytics →</Link>
          </div>

          {/* Availability */}
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
            <Link href="/therapist/availability" className="mt-4 block text-xs font-medium text-primary hover:text-primary-hover">Manage Schedule →</Link>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-border bg-white p-5">
            <h3 className="text-sm font-semibold text-text">Quick Actions</h3>
            <div className="mt-3 space-y-2">
              {[
                { href: "/therapist/appointments", label: "All Appointments" },
                { href: "/therapist/patients", label: "My Patients" },
                { href: "/therapist/profile", label: "Edit Profile" },
                { href: "/therapist/availability", label: "Manage Availability" },
              ].map((action) => (
                <Link key={action.href} href={action.href} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-text">
                  {action.label}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-16 lg:hidden" />
    </div>
  );
}
