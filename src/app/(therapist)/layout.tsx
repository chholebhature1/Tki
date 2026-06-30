import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { TherapistSidebar } from "@/features/dashboard/components/therapist-sidebar";
import { TherapistMobileNav } from "@/features/dashboard/components/therapist-mobile-nav";
import { NotificationBell } from "@/features/notifications/components";

export default async function TherapistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/therapist/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, avatar_url, role:roles!profiles_role_id_fkey(name)")
    .eq("id", user.id)
    .single();

  const role = (profile?.role as unknown as { name: string })?.name;
  if (role === "patient") redirect("/dashboard");
  if (role === "admin") redirect("/admin");

  const userInfo = {
    name: profile?.full_name || user.email || "Therapist",
    email: profile?.email || user.email || "",
    avatarUrl: profile?.avatar_url || null,
  };

  return (
    <div className="min-h-screen bg-surface">
      <TherapistMobileNav user={userInfo} />
      <div className="flex">
        <TherapistSidebar user={userInfo} />
        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-4 flex justify-end lg:mb-0 lg:absolute lg:right-8 lg:top-6">
            <Suspense fallback={null}>
              <NotificationBell userId={user.id} href="/therapist/notifications" />
            </Suspense>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
