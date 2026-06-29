import Link from "next/link";
import { CheckCircle, Calendar, Clock, Video } from "lucide-react";
import type { PaymentSummary } from "../types";

interface PaymentSuccessProps {
  summary: PaymentSummary;
  onViewAppointment?: () => void;
}

export function PaymentSuccess({ summary, onViewAppointment }: PaymentSuccessProps) {
  return (
    <div className="mx-auto max-w-md text-center">
      {/* Success icon */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
        <CheckCircle className="h-8 w-8 text-primary" aria-hidden="true" />
      </div>

      <h1 className="mt-6 text-2xl font-bold text-text">Booking Confirmed!</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Your appointment has been successfully booked. A confirmation email has been sent.
      </p>

      {/* Booking ID */}
      <div className="mt-6 rounded-xl border border-border bg-surface px-4 py-3">
        <p className="text-xs text-muted">Booking ID</p>
        <p className="mt-0.5 text-sm font-semibold text-text">{summary.bookingId}</p>
      </div>

      {/* Appointment details */}
      <div className="mt-4 rounded-xl border border-border bg-white p-4 text-left">
        <p className="text-sm font-semibold text-text">{summary.therapistName}</p>
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Calendar className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {summary.date}
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {summary.time} · {summary.duration} min
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Video className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {summary.consultationType}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <p className="mt-4 text-xs text-muted">
        You&apos;ll receive a meeting link via email 15 minutes before the session.
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3">
        {onViewAppointment ? (
          <button
            type="button"
            onClick={onViewAppointment}
            className="block w-full rounded-xl bg-primary py-3.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            View Appointment
          </button>
        ) : (
          <Link
            href="/dashboard/appointments"
            className="block w-full rounded-xl bg-primary py-3.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            View Appointment
          </Link>
        )}
        <Link
          href="/dashboard"
          className="block w-full rounded-xl border border-border py-3.5 text-center text-sm font-medium text-text transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Go to Dashboard
        </Link>
        <button
          type="button"
          disabled
          className="w-full rounded-xl border border-border py-3.5 text-center text-sm font-medium text-muted opacity-50 cursor-not-allowed"
        >
          Download Receipt (Coming Soon)
        </button>
      </div>
    </div>
  );
}
