import { Calendar, Clock, Video, Phone } from "lucide-react";
import type { BookingState, BookingTherapistInfo } from "../types";

interface BookingSummarySidebarProps {
  state: BookingState;
  therapist: BookingTherapistInfo;
}

export function BookingSummarySidebar({ state, therapist }: BookingSummarySidebarProps) {
  const TypeIcon = state.consultationType === "video" ? Video : Phone;

  return (
    <div className="rounded-2xl border border-border bg-white p-6">
      <h3 className="text-sm font-semibold text-text">Booking Summary</h3>

      <div className="mt-4 space-y-3">
        {/* Therapist */}
        <div>
          <p className="text-sm font-medium text-text">{therapist.name}</p>
          <p className="text-xs text-text-secondary">{therapist.qualification}</p>
        </div>

        {/* Selected details */}
        {state.consultationType && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <TypeIcon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {state.consultationType === "video" ? "Video" : "Audio"} Consultation
          </div>
        )}
        {state.selectedDate && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Calendar className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {new Date(state.selectedDate).toLocaleDateString("en-IN", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
        )}
        {state.selectedTime && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {state.selectedTime} · {therapist.sessionDuration} min
          </div>
        )}
      </div>

      {/* Fee */}
      <div className="mt-5 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Total</span>
          <span className="text-lg font-bold text-text">
            ₹{therapist.sessionFee.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}
