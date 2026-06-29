import { Star } from "lucide-react";
import { AdminRepository } from "@/features/admin";

export const metadata = { title: "Manage Reviews" };

export default async function AdminReviewsPage() {
  const reviews = await AdminRepository.getReviews();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h1 className="text-2xl font-bold text-text">Reviews</h1>

      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface">
            <tr>
              <th className="px-4 py-3 font-medium text-text-secondary">Patient</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Therapist</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Rating</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Comment</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reviews.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-medium text-text">{r.patientName}</td>
                <td className="px-4 py-3 text-text-secondary">{r.therapistName}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-text">
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden="true" />
                    {r.rating}
                  </span>
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-text-secondary">{r.comment || "—"}</td>
                <td className="px-4 py-3 text-text-secondary">{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
