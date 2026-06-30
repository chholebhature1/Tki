"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { changeUserRoleAction } from "@/features/admin/actions/role.actions";

export function RoleChanger({ userId, currentRole }: { userId: string; currentRole: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value;
    if (newRole === currentRole) return;

    const msg = newRole === "admin"
      ? "Promote to admin? This grants full platform access."
      : newRole === "therapist"
        ? "Change to therapist? A therapist profile will be created."
        : "Change to patient?";

    if (!confirm(msg)) {
      e.target.value = currentRole;
      return;
    }

    setLoading(true);
    await changeUserRoleAction(userId, newRole);
    router.refresh();
    setLoading(false);
  }

  if (loading) return <span className="text-xs text-muted">Updating...</span>;

  return (
    <select
      defaultValue={currentRole}
      onChange={handleChange}
      className="rounded-lg border border-border bg-white px-2 py-1 text-xs font-medium capitalize text-text focus:border-primary focus:outline-none"
    >
      <option value="patient">Patient</option>
      <option value="therapist">Therapist</option>
      <option value="admin">Admin</option>
    </select>
  );
}
