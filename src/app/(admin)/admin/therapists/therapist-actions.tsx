"use client";

import { useRouter } from "next/navigation";
import { approveTherapistAction, rejectTherapistAction, suspendTherapistAction } from "@/features/admin/actions";

interface TherapistActionsProps {
  id: string;
  status: string;
}

export function TherapistActions({ id, status }: TherapistActionsProps) {
  const router = useRouter();

  async function handle(action: (id: string) => Promise<{ success: boolean }>) {
    await action(id);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      {status !== "approved" && (
        <button onClick={() => handle(approveTherapistAction)} className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20">
          Approve
        </button>
      )}
      {status !== "rejected" && (
        <button onClick={() => handle(rejectTherapistAction)} className="rounded-md bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger hover:bg-danger/20">
          Reject
        </button>
      )}
      {status === "approved" && (
        <button onClick={() => handle(suspendTherapistAction)} className="rounded-md bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning hover:bg-warning/20">
          Suspend
        </button>
      )}
    </div>
  );
}
