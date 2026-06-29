import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, CheckCircle, XCircle, Activity, Search, Plus, User } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DashboardRepository } from "@/features/appointments/repositories";
import { AppointmentCard } from "@/features/appointments";
import { StatCard } from "@/features/dashboard";

export const metadata = {
  title: "Dashboard",
};

export default async function PatientDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const dashboard = await DashboardRepository.getPatientDashboard(user.id);

  const greeting = getGreeting();
  const name = profile?.full_name?.split(" ")[0] || "there";

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text sm:text-3xl">
          {greeting}, {name}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {dashboard.nextAppointment
            ? `Your next session is on ${new Date(dashboard.nextAppointment.appointmentDate).toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}`
            : "You have no upcoming appointments."}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Calendar} label="Upcoming" value={dashboard.stats.upcoming} />
        <StatCard icon={CheckCircle} label="Completed" value={dashboard.stats.completed} />
        <StatCard icon={XCircle} label="Cancelled" value={dashboard.stats.cancelled} />
        <StatCard icon={Activity} label="Total" value={dashboard.stats.total} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link
          href="/find-therapists"
          className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 transition-all hover:border-primary/30 hover:shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
            <Search className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text">Find Therapist</p>
            <p className="text-xs text-text-secondary">Browse professionals</p>
          </div>
        </Link>
        <Link
          href="/find-therapists"
          className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 transition-all hover:border-primary/30 hover:shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
            <Plus className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text">Book Session</p>
            <p className="text-xs text-text-secondary">Schedule appointment</p>
          </div>
        </Link>
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 transition-all hover:border-primary/30 hover:shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
            <User className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text">Edit Profile</p>
            <p className="text-xs text-text-secondary">Update your info</p>
          </div>
        </Link>
      </div>

      {/* Upcoming Appointments */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">Upcoming Appointments</h2>
          <Link href="/dashboard/appointments" className="text-sm font-medium text-primary hover:text-primary-hover">
            View All
          </Link>
        </div>
        {dashboard.upcomingAppointments.length > 0 ? (
          <div className="mt-4 space-y-3">
            {dashboard.upcomingAppointments.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-border bg-white p-8 text-center">
            <Calendar className="mx-auto h-8 w-8 text-muted" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium text-text">No upcoming appointments</p>
            <p className="mt-1 text-xs text-text-secondary">Find a therapist and book your first session.</p>
            <Link
              href="/find-therapists"
              className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
            >
              Find Therapist
            </Link>
          </div>
        )}
      </section>

      {/* Recent Activity */}
      {dashboard.recentAppointments.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-text">Recent Activity</h2>
          <div className="mt-4 space-y-3">
            {dashboard.recentAppointments.slice(0, 3).map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} />
            ))}
          </div>
        </section>
      )}

      {/* Bottom padding for mobile nav */}
      <div className="h-16 lg:hidden" />
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
