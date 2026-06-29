import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/features/admin/components";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role:roles!profiles_role_id_fkey(name)")
    .eq("id", user.id)
    .single();

  const role = (profile?.role as unknown as { name: string })?.name;
  if (role !== "admin") redirect("/dashboard");

  const userInfo = { name: profile?.full_name || "Admin", email: profile?.email || "" };

  return (
    <div className="min-h-screen bg-surface">
      <div className="flex">
        <AdminSidebar user={userInfo} />
        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
