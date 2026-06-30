import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Detect role and redirect to correct portal
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // First login welcome notification
        try {
          const { count } = await supabase
            .from("notifications")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id);

          if (count === 0) {
            const { NotificationService } = await import("@/features/notifications/services");
            const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
            await NotificationService.welcome(user.id, user.email || "", name);
          }
        } catch { /* Never block auth */ }

        // If explicit `next` was provided and is safe, use it
        if (next && next.startsWith("/") && !next.startsWith("//")) {
          return NextResponse.redirect(`${origin}${next}`);
        }

        // Smart role-based redirect
        const { data: profile } = await supabase
          .from("profiles")
          .select("role:roles!profiles_role_id_fkey(name)")
          .eq("id", user.id)
          .single();

        const role = (profile?.role as unknown as { name: string })?.name;

        if (role === "admin") return NextResponse.redirect(`${origin}/admin/dashboard`);
        if (role === "therapist") return NextResponse.redirect(`${origin}/therapist/dashboard`);
        return NextResponse.redirect(`${origin}/dashboard`);
      }

      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
