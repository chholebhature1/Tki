"use client";

import { useRouter } from "next/navigation";
import { activateUserAction, deactivateUserAction } from "@/features/admin/actions";

export function UserActions({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();

  async function toggle() {
    if (isActive) {
      await deactivateUserAction(id);
    } else {
      await activateUserAction(id);
    }
    router.refresh();
  }

  return (
    <button onClick={toggle} className={`rounded-md px-2.5 py-1 text-xs font-medium ${isActive ? "bg-danger/10 text-danger hover:bg-danger/20" : "bg-success/10 text-success hover:bg-success/20"}`}>
      {isActive ? "Deactivate" : "Activate"}
    </button>
  );
}
