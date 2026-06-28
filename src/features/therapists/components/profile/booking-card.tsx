import Link from "next/link";
import { Clock, Calendar } from "lucide-react";

interface BookingCardProps {
  sessionFee: number;
  sessionDuration: number;
  nextAvailableSlot: string;
}

export function BookingCard({ sessionFee, sessionDuration, nextAvailableSlot }: BookingCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <div className="text-center">
        <p className="text-2xl font-bold text-text">
          ₹{sessionFee.toLocaleString("en-IN")}
        </p>
        <p className="mt-1 text-sm text-muted">per session</p>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="text-text-secondary">{sessionDuration} minutes</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="text-text-secondary">{nextAvailableSlot}</span>
        </div>
      </div>

      <Link
        href="/register"
        className="mt-6 block w-full rounded-xl bg-primary py-3.5 text-center text-base font-medium text-white transition-all hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Book Appointment
      </Link>

      <p className="mt-3 text-center text-xs text-muted">
        Free cancellation up to 24 hours before
      </p>
    </div>
  );
}
