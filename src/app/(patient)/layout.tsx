import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { DashboardMobileNav } from "@/features/dashboard/components/dashboard-mobile-nav";
import { NotificationBell } from "@/features/notifications/components";

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
      <DashboardMobileNav user={userInfo} />

      <div className="flex">
        <DashboardSidebar user={userInfo} />

        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Notification Bell - top right */}
          <div className="mb-4 flex justify-end lg:mb-0 lg:absolute lg:right-8 lg:top-6">
            <Suspense fallback={null}>
              <NotificationBell userId={user.id} href="/dashboard/notifications" />
            </Suspense>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
