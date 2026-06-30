import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NotificationRepository } from "@/features/notifications";
import { NotificationsList } from "@/features/notifications/components";

export const metadata = { title: "Notifications" };

export default async function PatientNotificationsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const notifications = await NotificationRepository.findByUser(user.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Notifications</h1>
        <p className="mt-1 text-sm text-text-secondary">Stay updated on your appointments and sessions.</p>
      </div>
      <NotificationsList notifications={notifications} />
      <div className="h-16 lg:hidden" />
    </div>
  );
}
