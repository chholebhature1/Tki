"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveTherapistAction, rejectTherapistAction, suspendTherapistAction } from "@/features/admin/actions";

interface TherapistActionsProps {
  id: string;
  status: string;
}

export function TherapistActions({ id, status }: TherapistActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handle(action: (id: string) => Promise<{ success: boolean }>, confirmMsg: string) {
    if (!confirm(confirmMsg)) return;
    setLoading(true);
    await action(id);
    router.refresh();
    setLoading(false);
  }

  if (loading) {
    return <span className="text-xs text-muted">Processing...</span>;
  }

  return (
    <div className="flex gap-2">
      {status !== "approved" && (
        <button
          onClick={() => handle(approveTherapistAction, "Approve this therapist? They will appear in search results.")}
          className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Approve
        </button>
      )}
      {status !== "rejected" && status !== "expired" && (
        <button
          onClick={() => handle(rejectTherapistAction, "Reject this therapist? They will not appear in search.")}
          className="rounded-md bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger hover:bg-danger/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
        >
          Reject
        </button>
      )}
      {status === "approved" && (
        <button
          onClick={() => handle(suspendTherapistAction, "Suspend this therapist? They will be removed from search.")}
          className="rounded-md bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning hover:bg-warning/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning"
        >
          Suspend
        </button>
      )}
    </div>
  );
}
