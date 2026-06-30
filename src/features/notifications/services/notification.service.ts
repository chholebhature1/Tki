import { NotificationRepository } from "../repositories";
import { sendEmail } from "./email.service";

const APP_NAME = process.env.APP_NAME || "TalkIndia";

interface NotifyOptions {
  userId: string;
  email?: string;
  title: string;
  message: string;
  type: string;
  category?: string;
  link?: string;
  emailSubject?: string;
  emailBody?: string;
}

/**
 * Centralized notification service.
 * 1. Creates in-app notification in Supabase.
 * 2. Attempts email via Resend (best-effort, never blocks main flow).
 */
export class NotificationService {
  static async notify(options: NotifyOptions): Promise<void> {
    let emailSent = false;

    // Send email (best-effort)
    if (options.email && options.emailBody) {
      emailSent = await sendEmail(
        options.email,
        options.emailSubject || `${APP_NAME}: ${options.title}`,
        options.emailBody
      );
    }

    // Create in-app notification
    await NotificationRepository.create(options.userId, {
      title: options.title,
      message: options.message,
      type: options.type,
      category: options.category,
      link: options.link,
      emailSent,
    });
  }

  // Convenience methods for common events
  static async bookingConfirmed(userId: string, email: string, therapistName: string, date: string, time: string) {
    await this.notify({
      userId, email,
      title: "Booking Confirmed",
      message: `Your appointment with ${therapistName} on ${date} at ${time} is confirmed.`,
      type: "appointment", category: "booking",
      link: "/dashboard/appointments",
      emailSubject: `${APP_NAME} — Booking Confirmed`,
      emailBody: emailTemplate("Booking Confirmed", `Your appointment with <strong>${therapistName}</strong> on ${date} at ${time} has been confirmed. You can join the session from your dashboard.`),
    });
  }

  static async bookingCancelled(userId: string, email: string, therapistName: string, date: string) {
    await this.notify({
      userId, email,
      title: "Appointment Cancelled",
      message: `Your appointment with ${therapistName} on ${date} has been cancelled.`,
      type: "appointment", category: "cancellation",
      link: "/dashboard/appointments",
      emailSubject: `${APP_NAME} — Appointment Cancelled`,
      emailBody: emailTemplate("Appointment Cancelled", `Your appointment with <strong>${therapistName}</strong> on ${date} has been cancelled.`),
    });
  }

  static async paymentSuccess(userId: string, email: string, amount: number, therapistName: string) {
    await this.notify({
      userId, email,
      title: "Payment Successful",
      message: `₹${amount.toLocaleString("en-IN")} paid for session with ${therapistName}.`,
      type: "payment", category: "payment",
      link: "/dashboard/appointments",
      emailSubject: `${APP_NAME} — Payment Confirmed`,
      emailBody: emailTemplate("Payment Successful", `Your payment of ₹${amount.toLocaleString("en-IN")} for a session with <strong>${therapistName}</strong> has been processed successfully.`),
    });
  }

  static async newBookingForTherapist(therapistUserId: string, email: string, patientName: string, date: string, time: string) {
    await this.notify({
      userId: therapistUserId, email,
      title: "New Booking",
      message: `${patientName} booked a session on ${date} at ${time}.`,
      type: "appointment", category: "booking",
      link: "/therapist/dashboard",
      emailSubject: `${APP_NAME} — New Booking`,
      emailBody: emailTemplate("New Booking", `<strong>${patientName}</strong> has booked a session with you on ${date} at ${time}. Check your dashboard for details.`),
    });
  }

  static async therapistApproved(userId: string, email: string) {
    await this.notify({
      userId, email,
      title: "Profile Approved!",
      message: "Your therapist profile has been verified. You are now visible to patients.",
      type: "verification", category: "verification",
      link: "/therapist/dashboard",
      emailSubject: `${APP_NAME} — Profile Approved`,
      emailBody: emailTemplate("You're Approved!", "Your professional profile has been verified. Patients can now find and book sessions with you."),
    });
  }

  static async welcome(userId: string, email: string, name: string) {
    await this.notify({
      userId, email,
      title: `Welcome to ${APP_NAME}!`,
      message: "Your account has been created successfully. Start by finding a therapist.",
      type: "system", category: "welcome",
      link: "/find-therapists",
      emailSubject: `Welcome to ${APP_NAME}`,
      emailBody: emailTemplate(`Welcome, ${name}!`, `Your ${APP_NAME} account is ready. Browse our verified therapists and book your first consultation today.`),
    });
  }
}

function emailTemplate(heading: string, body: string): string {
  const logoUrl = "https://tki-c62m.vercel.app/IMAGES/LOGO.png";
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fcf9;padding:40px 20px;margin:0"><div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;border:1px solid #dcefe3"><div style="text-align:center;margin-bottom:24px"><img src="${logoUrl}" alt="${APP_NAME}" width="140" height="40" style="height:40px;width:auto;object-fit:contain" /></div><h2 style="color:#1f2937;font-size:20px;margin:0 0 12px">${heading}</h2><p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 24px">${body}</p><a href="https://tki-c62m.vercel.app/dashboard" style="display:inline-block;background:#6FCF97;color:#fff;padding:12px 24px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:500">Go to Dashboard</a><hr style="border:none;border-top:1px solid #dcefe3;margin:24px 0"><p style="color:#9ca3af;font-size:12px;margin:0">${APP_NAME} — India's trusted mental healthcare marketplace.</p></div></body></html>`;
}
