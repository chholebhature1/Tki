import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { DashboardMobileNav } from "@/features/dashboard/components/dashboard-mobile-nav";

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  // Get profile for sidebar
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, avatar_url")
    .eq("id", user.id)
    .single();

  const userInfo = {
    name: profile?.full_name || user.email || "Patient",
    email: profile?.email || user.email || "",
    avatarUrl: profile?.avatar_url || null,
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile Nav */}
      <DashboardMobileNav user={userInfo} />

      <div className="flex">
        {/* Desktop Sidebar */}
        <DashboardSidebar user={userInfo} />

        {/* Main Content */}
        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
