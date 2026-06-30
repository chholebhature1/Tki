import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ success: true, message: "Already subscribed!" });
      }
      return NextResponse.json({ error: "Could not subscribe. Try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Subscribed!" });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
