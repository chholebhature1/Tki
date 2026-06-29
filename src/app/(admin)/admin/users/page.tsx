import { AdminRepository } from "@/features/admin";
import { UserActions } from "./user-actions";

export const metadata = { title: "Manage Users" };

export default async function AdminUsersPage() {
  const users = await AdminRepository.getUsers();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h1 className="text-2xl font-bold text-text">User Management</h1>

      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface">
            <tr>
              <th className="px-4 py-3 font-medium text-text-secondary">Name</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Role</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Status</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Joined</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-text">{u.name}</p>
                  <p className="text-xs text-muted">{u.email}</p>
                </td>
                <td className="px-4 py-3 capitalize text-text-secondary">{u.role}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${u.isActive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-secondary">{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                <td className="px-4 py-3">
                  <UserActions id={u.id} isActive={u.isActive} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
