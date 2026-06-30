import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if this is a first login (send welcome notification)
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Check if user has any notifications (proxy for "first login")
          const { count } = await supabase
            .from("notifications")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id);

          if (count === 0) {
            // First login — send welcome
            const { NotificationService } = await import("@/features/notifications/services");
            const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
            await NotificationService.welcome(user.id, user.email || "", name);
          }
        }
      } catch { /* Never block auth callback */ }

      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
