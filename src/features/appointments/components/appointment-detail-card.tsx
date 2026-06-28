import { Calendar, Clock, Video, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppointmentDetail } from "../types";

interface AppointmentDetailCardProps {
  appointment: AppointmentDetail;
}

const statusColors: Record<string, string> = {
  payment_pending: "bg-warning/10 text-warning",
  confirmed: "bg-primary/10 text-primary",
  cancelled: "bg-danger/10 text-danger",
  completed: "bg-success/10 text-success",
  rescheduled: "bg-info/10 text-info",
  no_show: "bg-danger/10 text-danger",
  refunded: "bg-muted/10 text-muted",
};

const statusLabels: Record<string, string> = {
  payment_pending: "Payment Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
  rescheduled: "Rescheduled",
  no_show: "No Show",
  refunded: "Refunded",
};

export function AppointmentDetailCard({ appointment }: AppointmentDetailCardProps) {
  const ModeIcon = appointment.consultationMode === "offline" ? MapPin : Video;
  const modeLabel = appointment.consultationMode === "both" ? "Online & In-Person" : appointment.consultationMode === "online" ? "Online" : "In-Person";

  return (
    <div className="space-y-6">
      {/* Status banner */}
      <div className="flex items-center justify-between">
        <span className={cn(
          "rounded-full px-3 py-1 text-xs font-semibold",
          statusColors[appointment.status] || "bg-surface text-muted"
        )}>
          {statusLabels[appointment.status] || appointment.status}
        </span>
        {appointment.bookingReference && (
          <span className="text-xs text-muted">Ref: {appointment.bookingReference}</span>
        )}
      </div>

      {/* Therapist info */}
      <div className="flex items-center gap-4 rounded-xl border border-border p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-light text-lg font-semibold text-primary">
          {appointment.therapist.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
        </div>
        <div>
          <p className="text-base font-semibold text-text">{appointment.therapist.name}</p>
          <p className="text-sm text-text-secondary">{appointment.therapist.professionalTitle}</p>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-border p-4">
          <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
          <div>
            <p className="text-xs text-muted">Date</p>
            <p className="text-sm font-medium text-text">
              {new Date(appointment.appointmentDate).toLocaleDateString("en-IN", {
                weekday: "long", month: "long", day: "numeric", year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border p-4">
          <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
          <div>
            <p className="text-xs text-muted">Time</p>
            <p className="text-sm font-medium text-text">
              {appointment.startTime} – {appointment.endTime} ({appointment.durationMinutes} min)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border p-4">
          <ModeIcon className="h-4 w-4 text-primary" aria-hidden="true" />
          <div>
            <p className="text-xs text-muted">Mode</p>
            <p className="text-sm font-medium text-text">{modeLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border p-4">
          <User className="h-4 w-4 text-primary" aria-hidden="true" />
          <div>
            <p className="text-xs text-muted">Patient</p>
            <p className="text-sm font-medium text-text">{appointment.patient.name}</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {appointment.notes && (
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted">Session Notes</p>
          <p className="mt-1 text-sm text-text-secondary">{appointment.notes}</p>
        </div>
      )}
    </div>
  );
}
