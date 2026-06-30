import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, queryType, message, phone } = body;

    // Validation
    if (!fullName || !email || !queryType || !message) {
      return NextResponse.json({ error: "Please fill all required fields." }, { status: 400 });
    }

    // Save to database
    const supabase = await createServerSupabaseClient();
    const { error: dbError } = await supabase.from("queries").insert({
      full_name: fullName,
      email,
      phone: phone || null,
      query_type: queryType,
      message,
    });

    if (dbError) {
      console.error("Query insert error:", dbError);
      return NextResponse.json({ error: "Failed to submit query." }, { status: 500 });
    }

    // Send email notification via Resend (best-effort)
    try {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        const { Resend } = await import("resend");
        const resend = new Resend(resendKey);

        await resend.emails.send({
          from: "TalkIndia <no-reply@weberaexperts.com>",
          to: "swalihalbd@gmail.com",
          subject: `New Query: ${queryType} — ${fullName}`,
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #6FCF97; padding: 20px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 20px;">New Query on TalkIndia</h1>
              </div>
              <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr><td style="padding: 8px 0; color: #6b7280; width: 120px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${fullName}</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #6FCF97;">${email}</a></td></tr>
                  ${phone ? `<tr><td style="padding: 8px 0; color: #6b7280;">Phone</td><td style="padding: 8px 0;">${phone}</td></tr>` : ""}
                  <tr><td style="padding: 8px 0; color: #6b7280;">Type</td><td style="padding: 8px 0;">${queryType}</td></tr>
                </table>
                <div style="margin-top: 16px; padding: 16px; background: #f8fcf9; border-radius: 8px; border: 1px solid #dcefe3;">
                  <p style="margin: 0; font-size: 14px; color: #1f2937; white-space: pre-wrap;">${message}</p>
                </div>
                <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">Submitted on ${new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
              </div>
            </div>
          `,
        });
      }
    } catch {
      // Email failure should never block the query submission
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
