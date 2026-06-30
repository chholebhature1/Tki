import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.log("[EmailService] Resend not configured, skipping email.");
    return false;
  }

  const from = process.env.FROM_EMAIL || "TalkIndia <no-reply@weberaexperts.com>";

  try {
    await resend.emails.send({ from, to, subject, html });
    return true;
  } catch (error) {
    console.error("[EmailService] Failed to send email:", error);
    return false;
  }
}
