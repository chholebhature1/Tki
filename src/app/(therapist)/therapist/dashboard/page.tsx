import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, CheckCircle, Users, Clock } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { TherapistDashboardRepository } from "@/features/appointments/repositories";
import { AppointmentCard } from "@/features/appointments";
import { StatCard } from "@/features/dashboard";

export const metadata = {
  title: "Therapist Dashboard",
};

export default async function TherapistDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get therapist profile ID
  const { data: therapistProfile } = await supabase
    .from("therapist_profiles")
    .select("id, professional_title, verification_status")
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

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text sm:text-3xl">
          Welcome, {name}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {dashboard.stats.todaySessions > 0
            ? `You have ${dashboard.stats.todaySessions} session${dashboard.stats.todaySessions > 1 ? "s" : ""} today.`
            : "No sessions scheduled for today."}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Calendar} label="Today's Sessions" value={dashboard.stats.todaySessions} />
        <StatCard icon={Clock} label="Upcoming" value={dashboard.stats.upcoming} />
        <StatCard icon={CheckCircle} label="Completed Today" value={dashboard.stats.completedToday} />
        <StatCard icon={Users} label="Active Patients" value={dashboard.stats.activePatients} />
      </div>

      {/* Today's Schedule */}
      <section>
        <h2 className="text-lg font-semibold text-text">Today&apos;s Schedule</h2>
        {dashboard.todayAppointments.length > 0 ? (
          <div className="mt-4 space-y-3">
            {dashboard.todayAppointments.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} showTherapist={false} showPatient />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-border bg-white p-8 text-center">
            <Calendar className="mx-auto h-8 w-8 text-muted" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium text-text">No sessions today</p>
            <p className="mt-1 text-xs text-text-secondary">Enjoy your day off!</p>
          </div>
        )}
      </section>

      {/* Upcoming */}
      {dashboard.upcomingAppointments.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-text">Upcoming Sessions</h2>
          <div className="mt-4 space-y-3">
            {dashboard.upcomingAppointments.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} showTherapist={false} showPatient />
            ))}
          </div>
        </section>
      )}

      {/* Availability Summary */}
      <section>
        <h2 className="text-lg font-semibold text-text">Availability</h2>
        <div className="mt-4 rounded-2xl border border-border bg-white p-5">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-text">{dashboard.availability.workingDays}</p>
              <p className="text-xs text-text-secondary">Working Days</p>
            </div>
            <div>
              <p className="text-xl font-bold text-text">{dashboard.availability.consultationHours}</p>
              <p className="text-xs text-text-secondary">Consultation Hours</p>
            </div>
            <div>
              <p className="text-xl font-bold text-text">{dashboard.availability.slotDuration} min</p>
              <p className="text-xs text-text-secondary">Slot Duration</p>
            </div>
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <Link
              href="/therapist/availability"
              className="text-sm font-medium text-primary hover:text-primary-hover"
            >
              Manage Availability →
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-semibold text-text">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            href="/therapist/availability"
            className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 transition-all hover:border-primary/30 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
              <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">Manage Availability</p>
              <p className="text-xs text-text-secondary">Update your schedule</p>
            </div>
          </Link>
          <Link
            href="/therapist/profile"
            className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 transition-all hover:border-primary/30 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
              <Users className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">View Profile</p>
              <p className="text-xs text-text-secondary">See your public page</p>
            </div>
          </Link>
          <Link
            href="/therapist/settings"
            className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 transition-all hover:border-primary/30 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
              <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">Appointments</p>
              <p className="text-xs text-text-secondary">View all sessions</p>
            </div>
          </Link>
        </div>
      </section>

      <div className="h-16 lg:hidden" />
    </div>
  );
}
