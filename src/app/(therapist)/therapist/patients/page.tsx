import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Users, Calendar, Search, ArrowRight } from "lucide-react";

export const metadata = { title: "Patients — TalkIndia Pro" };

export default async function TherapistPatientsPage(
  props: { searchParams: Promise<{ q?: string }> }
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

  const query = searchParams.q?.toLowerCase() || "";

  // Get distinct patients from appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select("patient_profile_id, appointment_date, status, patient:profiles!appointments_patient_profile_id_fkey(full_name, email, city, phone)")
    .eq("therapist_profile_id", tp.id)
    .in("status", ["confirmed", "completed"])
    .order("appointment_date", { ascending: false });

  // Deduplicate patients and compute stats
  const patientMap = new Map<string, {
    name: string; email: string; city: string | null; phone: string | null;
    lastDate: string; firstDate: string; sessions: number; upcoming: number;
  }>();

  const today = new Date().toISOString().split("T")[0];
  (appointments || []).forEach((a) => {
    const patient = a.patient as unknown as { full_name: string; email: string; city: string | null; phone: string | null };
    const existing = patientMap.get(a.patient_profile_id);
    if (existing) {
      existing.sessions++;
      if (a.appointment_date < existing.firstDate) existing.firstDate = a.appointment_date;
      if (a.appointment_date >= today && a.status === "confirmed") existing.upcoming++;
    } else {
      patientMap.set(a.patient_profile_id, {
        name: patient.full_name,
        email: patient.email,
        city: patient.city,
        phone: patient.phone,
        lastDate: a.appointment_date,
        firstDate: a.appointment_date,
        sessions: 1,
        upcoming: a.appointment_date >= today && a.status === "confirmed" ? 1 : 0,
      });
    }
  });

  let patients = Array.from(patientMap.entries()).map(([id, data]) => ({ id, ...data }));

  // Search filter
  if (query) {
    patients = patients.filter(
      (p) =>
        p.name?.toLowerCase().includes(query) ||
        p.email?.toLowerCase().includes(query) ||
        p.city?.toLowerCase().includes(query)
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Patients</h1>
          <p className="mt-0.5 text-sm text-text-secondary">
            {patientMap.size} total patients
          </p>
        </div>
        <form className="relative" action="/therapist/patients" method="GET">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search by name, email, or city..."
            className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-4 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-64"
          />
        </form>
      </div>

      {/* Patient cards — mobile-friendly, clickable */}
      {patients.length > 0 ? (
        <div className="space-y-3">
          {patients.map((p) => (
            <Link
              key={p.id}
              href={`/therapist/patients/${p.id}`}
              className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 transition-all hover:border-primary/30 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {/* Avatar */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
                {p.name?.[0] || "P"}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-text">{p.name}</p>
                  {p.upcoming > 0 && (
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      {p.upcoming} upcoming
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-text-secondary">
                  <span>{p.email}</span>
                  {p.city && <span>· {p.city}</span>}
                </div>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    {p.sessions} session{p.sessions !== 1 ? "s" : ""}
                  </span>
                  <span>
                    Last: {new Date(p.lastDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <ArrowRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <Users className="mx-auto h-10 w-10 text-muted" aria-hidden="true" />
          <h2 className="mt-4 text-base font-semibold text-text">
            {query ? "No matching patients" : "No patients yet"}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {query
              ? `No results for "${query}".`
              : "Your patients will appear here after their first session."}
          </p>
        </div>
      )}

      <div className="h-16 lg:hidden" />
    </div>
  );
}
