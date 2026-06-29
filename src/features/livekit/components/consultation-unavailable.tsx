import Link from "next/link";
import { Clock, XCircle, CreditCard, CheckCircle } from "lucide-react";
import { Container } from "@/components/layout";

type UnavailableReason = "too_early" | "ended" | "cancelled" | "payment_pending" | "unauthorized" | "not_found";

interface ConsultationUnavailableProps {
  reason: UnavailableReason;
  scheduledDate?: string;
  scheduledTime?: string;
}

const config: Record<UnavailableReason, { icon: typeof Clock; title: string; color: string }> = {
  too_early: { icon: Clock, title: "Session hasn't started yet", color: "bg-info/10 text-info" },
  ended: { icon: CheckCircle, title: "Session has ended", color: "bg-muted/10 text-muted" },
  cancelled: { icon: XCircle, title: "Appointment cancelled", color: "bg-danger/10 text-danger" },
  payment_pending: { icon: CreditCard, title: "Payment required", color: "bg-warning/10 text-warning" },
  unauthorized: { icon: XCircle, title: "Access denied", color: "bg-danger/10 text-danger" },
  not_found: { icon: XCircle, title: "Appointment not found", color: "bg-danger/10 text-danger" },
};

const descriptions: Record<UnavailableReason, string> = {
  too_early: "You can join 15 minutes before the scheduled time.",
  ended: "This consultation has already been completed.",
  cancelled: "This appointment was cancelled and is no longer available.",
  payment_pending: "Please complete payment before joining the consultation.",
  unauthorized: "You don't have permission to access this consultation.",
  not_found: "The appointment you're looking for doesn't exist.",
};

export function ConsultationUnavailable({ reason, scheduledDate, scheduledTime }: ConsultationUnavailableProps) {
  const { icon: Icon, title, color } = config[reason];

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Container className="max-w-md text-center">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${color}`}>
          <Icon className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-xl font-bold text-text">{title}</h1>
        <p className="mt-2 text-sm text-text-secondary">{descriptions[reason]}</p>

        {reason === "too_early" && scheduledDate && scheduledTime && (
          <div className="mt-4 rounded-xl border border-border bg-surface p-4">
            <p className="text-xs text-muted">Scheduled for</p>
            <p className="mt-1 text-sm font-semibold text-text">{scheduledDate} at {scheduledTime}</p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Link href="/dashboard" className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover">
            Go to Dashboard
          </Link>
          {reason === "payment_pending" && (
            <Link href="/dashboard/appointments" className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-text hover:border-primary/30">
              View Appointments
            </Link>
          )}
        </div>
      </Container>
    </div>
  );
}
