import { UserCheck } from "lucide-react";
import { AdminRepository } from "@/features/admin";
import { TherapistActions } from "./therapist-actions";
import { VerificationBadge } from "@/features/admin/components/verification-badge";

export const metadata = { title: "Manage Therapists" };

export default async function AdminTherapistsPage() {
  const therapists = await AdminRepository.getTherapists();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Therapist Management</h1>
        <p className="text-sm text-text-secondary">{therapists.length} therapists</p>
      </div>

      {therapists.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <UserCheck className="mx-auto h-8 w-8 text-muted" aria-hidden="true" />
          <p className="mt-3 text-sm font-medium text-text">No therapists registered yet</p>
        </div>
      ) : (
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
                <tr key={t.id} className="hover:bg-surface/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-text">{t.name}</p>
                    <p className="text-xs text-muted">{t.email}</p>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{t.qualification || "—"}</td>
                  <td className="px-4 py-3 text-text-secondary">{t.yearsExperience} yrs</td>
                  <td className="px-4 py-3">
                    <VerificationBadge status={t.verificationStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <TherapistActions id={t.id} status={t.verificationStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
