import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Users } from "lucide-react";

export const metadata = { title: "My Patients" };

export default async function TherapistPatientsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tp } = await supabase
    .from("therapist_profiles")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!tp) redirect("/dashboard");

  // Get distinct patients from appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select("patient_profile_id, appointment_date, status, patient:profiles!appointments_patient_profile_id_fkey(full_name, email, city)")
    .eq("therapist_profile_id", tp.id)
    .in("status", ["confirmed", "completed"])
    .order("appointment_date", { ascending: false });

  // Deduplicate patients
  const patientMap = new Map<string, { name: string; email: string; city: string | null; lastDate: string; sessions: number }>();
  (appointments || []).forEach((a) => {
    const patient = a.patient as unknown as { full_name: string; email: string; city: string | null };
    const existing = patientMap.get(a.patient_profile_id);
    if (existing) {
      existing.sessions++;
    } else {
      patientMap.set(a.patient_profile_id, {
        name: patient.full_name,
        email: patient.email,
        city: patient.city,
        lastDate: a.appointment_date,
        sessions: 1,
      });
    }
  });

  const patients = Array.from(patientMap.entries()).map(([id, data]) => ({ id, ...data }));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">My Patients</h1>
          <p className="mt-1 text-sm text-text-secondary">{patients.length} patients</p>
        </div>
      </div>

      {patients.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface">
              <tr>
                <th className="px-4 py-3 font-medium text-text-secondary">Patient</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Location</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Sessions</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Last Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-surface/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-text">{p.name}</p>
                    <p className="text-xs text-muted">{p.email}</p>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{p.city || "—"}</td>
                  <td className="px-4 py-3 text-text-secondary">{p.sessions}</td>
                  <td className="px-4 py-3 text-text-secondary">{new Date(p.lastDate).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <Users className="mx-auto h-10 w-10 text-muted" aria-hidden="true" />
          <h2 className="mt-4 text-base font-semibold text-text">No patients yet</h2>
          <p className="mt-1 text-sm text-text-secondary">Your patients will appear here after their first appointment.</p>
        </div>
      )}

      <div className="h-16 lg:hidden" />
    </div>
  );
}
