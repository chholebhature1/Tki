import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AppointmentCard } from "@/features/appointments";
import { AppointmentRepository } from "@/features/appointments/repositories";
import { Calendar } from "lucide-react";

export const metadata = { title: "My Appointments" };

export default async function TherapistAppointmentsPage(
  props: { searchParams: Promise<{ tab?: string }> }
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
  const today = new Date().toISOString().split("T")[0];

  const upcoming = allAppointments.filter((a) => a.appointmentDate >= today && (a.status === "confirmed" || a.status === "payment_pending"));
  const todayAppts = allAppointments.filter((a) => a.appointmentDate === today);
  const completed = allAppointments.filter((a) => a.status === "completed");
  const cancelled = allAppointments.filter((a) => a.status === "cancelled" || a.status === "no_show");

  const activeList = tab === "today" ? todayAppts : tab === "completed" ? completed : tab === "cancelled" ? cancelled : upcoming;

  const tabs = [
    { id: "upcoming", label: "Upcoming", count: upcoming.length },
    { id: "today", label: "Today", count: todayAppts.length },
    { id: "completed", label: "Completed", count: completed.length },
    { id: "cancelled", label: "Cancelled", count: cancelled.length },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold text-text">Appointments</h1>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-white p-1">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`/therapist/appointments?tab=${t.id}`}
            className={`flex-1 rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors ${tab === t.id ? "bg-primary text-white" : "text-text-secondary hover:bg-surface hover:text-text"}`}
          >
            {t.label} {t.count > 0 && <span className={`ml-1 text-xs ${tab === t.id ? "text-white/80" : "text-muted"}`}>({t.count})</span>}
          </Link>
        ))}
      </div>

      {/* List */}
      {activeList.length > 0 ? (
        <div className="space-y-3">
          {activeList.map((appt) => (
            <AppointmentCard key={appt.id} appointment={appt} showTherapist={false} showPatient />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <Calendar className="mx-auto h-10 w-10 text-muted" aria-hidden="true" />
          <h2 className="mt-4 text-base font-semibold text-text">No {tab} appointments</h2>
          <p className="mt-1 text-sm text-text-secondary">Your appointment history will appear here.</p>
        </div>
      )}

      <div className="h-16 lg:hidden" />
    </div>
  );
}
