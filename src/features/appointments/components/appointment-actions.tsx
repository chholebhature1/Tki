"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AppointmentDetail } from "../types";
import { cancelAppointmentAction } from "../actions";

interface AppointmentActionsProps {
  appointment: AppointmentDetail;
}

export function AppointmentActions({ appointment }: AppointmentActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canCancel = appointment.status === "confirmed";
  const canJoin = appointment.status === "confirmed";

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    setLoading(true);
    setError("");

    const result = await cancelAppointmentAction(appointment.id);
    if (!result.success) {
      setError(result.error || "Failed to cancel.");
      setLoading(false);
      return;
    }

    router.refresh();
  }

  if (!canCancel && !canJoin) return null;

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {canJoin && (
          <button
            type="button"
            disabled
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white opacity-50 cursor-not-allowed"
            title="Video consultation not yet available"
          >
            Join Session (Coming Soon)
          </button>
        )}
        {canCancel && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="rounded-lg border border-danger/30 px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/5 disabled:opacity-50"
          >
            {loading ? "Cancelling..." : "Cancel Appointment"}
          </button>
        )}
      </div>
    </div>
  );
}
