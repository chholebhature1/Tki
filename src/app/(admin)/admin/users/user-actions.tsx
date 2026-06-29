"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { activateUserAction, deactivateUserAction } from "@/features/admin/actions";

export function UserActions({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    const msg = isActive
      ? "Deactivate this user? They will lose access to the platform."
      : "Activate this user? They will regain access.";
    if (!confirm(msg)) return;

    setLoading(true);
    if (isActive) {
      await deactivateUserAction(id);
    } else {
      await activateUserAction(id);
    }
    router.refresh();
    setLoading(false);
  }

  if (loading) return <span className="text-xs text-muted">Updating...</span>;

  return (
    <button
      onClick={toggle}
      className={`rounded-md px-2.5 py-1 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 ${isActive ? "bg-danger/10 text-danger hover:bg-danger/20 focus-visible:ring-danger" : "bg-success/10 text-success hover:bg-success/20 focus-visible:ring-success"}`}
    >
      {isActive ? "Deactivate" : "Activate"}
    </button>
  );
}
