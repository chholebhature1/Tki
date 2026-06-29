import { AdminRepository } from "@/features/admin";
import { TherapistActions } from "./therapist-actions";
import { AppointmentStatusBadge } from "@/features/appointments";

export const metadata = { title: "Manage Therapists" };

export default async function AdminTherapistsPage() {
  const therapists = await AdminRepository.getTherapists();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h1 className="text-2xl font-bold text-text">Therapist Management</h1>

      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface">
            <tr>
              <th className="px-4 py-3 font-medium text-text-secondary">Name</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Qualification</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Experience</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Status</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {therapists.map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-text">{t.name}</p>
                  <p className="text-xs text-muted">{t.email}</p>
                </td>
                <td className="px-4 py-3 text-text-secondary">{t.qualification || "—"}</td>
                <td className="px-4 py-3 text-text-secondary">{t.yearsExperience} yrs</td>
                <td className="px-4 py-3">
                  <AppointmentStatusBadge status={t.verificationStatus === "approved" ? "confirmed" : t.verificationStatus === "rejected" ? "cancelled" : "payment_pending"} />
                </td>
                <td className="px-4 py-3">
                  <TherapistActions id={t.id} status={t.verificationStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
