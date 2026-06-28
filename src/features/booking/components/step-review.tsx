import { Calendar, Clock, Video, Phone } from "lucide-react";
import type { BookingState, BookingTherapistInfo } from "../types";

interface StepReviewProps {
  state: BookingState;
  therapist: BookingTherapistInfo;
}

export function StepReview({ state, therapist }: StepReviewProps) {
  const TypeIcon = state.consultationType === "video" ? Video : Phone;
  const typeLabel = state.consultationType === "video" ? "Video Consultation" : "Audio Consultation";

  const platformFee = 0;
  const total = therapist.sessionFee + platformFee;

  return (
    <div>
      <h2 className="text-lg font-semibold text-text">Review Your Booking</h2>
      <p className="mt-1 text-sm text-text-secondary">Please confirm the details before proceeding to payment.</p>

      <div className="mt-6 space-y-4">
        {/* Therapist */}
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted">Therapist</p>
          <p className="mt-0.5 text-sm font-semibold text-text">{therapist.name}</p>
          <p className="text-xs text-text-secondary">{therapist.qualification}</p>
        </div>

        {/* Appointment details */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
              <p className="text-xs text-muted">Date</p>
            </div>
            <p className="mt-1 text-sm font-medium text-text">
              {state.selectedDate
                ? new Date(state.selectedDate).toLocaleDateString("en-IN", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })
                : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
              <p className="text-xs text-muted">Time</p>
            </div>
            <p className="mt-1 text-sm font-medium text-text">{state.selectedTime || "—"}</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center gap-2">
              <TypeIcon className="h-4 w-4 text-primary" aria-hidden="true" />
              <p className="text-xs text-muted">Mode</p>
            </div>
            <p className="mt-1 text-sm font-medium text-text">{typeLabel}</p>
          </div>
        </div>

        {/* Fee breakdown */}
        <div className="rounded-xl border border-border p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Session fee ({therapist.sessionDuration} min)</span>
              <span className="text-text">₹{therapist.sessionFee.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Platform fee</span>
              <span className="text-primary font-medium">Free</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="font-semibold text-text">Total</span>
              <span className="font-semibold text-text">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Cancellation policy */}
        <p className="text-xs text-muted">
          Free cancellation up to 24 hours before the session. After that, the booking is non-refundable.
        </p>
      </div>
    </div>
  );
}
