"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/get-base-url";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
  const supabase = await createServerSupabaseClient();
  const baseUrl = getBaseUrl();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${baseUrl}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    return { success: false, error: "Could not connect to Google. Please try again." };
  }

  if (data.url) {
    redirect(data.url);
  }

  return { success: false, error: "Could not initiate Google sign-in." };
}
