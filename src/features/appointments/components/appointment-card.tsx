import Link from "next/link";
import { Calendar, Clock, Video, MapPin } from "lucide-react";
import type { AppointmentDetail } from "../types";
import { AppointmentStatusBadge } from "./appointment-status-badge";

interface AppointmentCardProps {
  appointment: AppointmentDetail;
  showTherapist?: boolean;
  showPatient?: boolean;
}

export function AppointmentCard({ appointment, showTherapist = true, showPatient = false }: AppointmentCardProps) {
  const ModeIcon = appointment.consultationMode === "offline" ? MapPin : Video;

  // Determine if session is joinable (today, confirmed, within 15 min window)
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const isToday = appointment.appointmentDate === today;
  const isConfirmed = appointment.status === "confirmed";
  let canJoin = false;

  if (isToday && isConfirmed && appointment.startTime) {
    const sessionStart = new Date(`${appointment.appointmentDate}T${appointment.startTime}`);
    const sessionEnd = new Date(sessionStart.getTime() + appointment.durationMinutes * 60000);
    canJoin = now >= new Date(sessionStart.getTime() - 15 * 60000) && now <= new Date(sessionEnd.getTime() + 15 * 60000);
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-5 transition-all hover:border-primary/30 hover:shadow-sm">
      <Link
        href={`/appointments/${appointment.id}`}
        className="flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <div className="flex items-center justify-between">
          <AppointmentStatusBadge status={appointment.status} />
          {appointment.bookingReference && (
            <span className="text-xs text-muted">{appointment.bookingReference}</span>
          )}
        </div>

        {showTherapist && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
              {appointment.therapist.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
            </div>
            <div>
              <p className="text-sm font-semibold text-text">{appointment.therapist.name}</p>
              <p className="text-xs text-text-secondary">{appointment.therapist.professionalTitle}</p>
            </div>
          </div>
        )}

        {showPatient && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-sm font-semibold text-text-secondary">
              {appointment.patient.name?.[0] || "P"}
            </div>
            <div>
              <p className="text-sm font-semibold text-text">{appointment.patient.name}</p>
              <p className="text-xs text-text-secondary">{appointment.patient.email}</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {new Date(appointment.appointmentDate).toLocaleDateString("en-IN", {
              weekday: "short", month: "short", day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {appointment.startTime?.slice(0, 5)} · {appointment.durationMinutes} min
          </span>
          <span className="flex items-center gap-1.5">
            <ModeIcon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {appointment.consultationMode === "online" ? "Online" : "In-Person"}
          </span>
        </div>
      </Link>

      {/* Join Session button — shows when session is joinable */}
      {canJoin && (
        <Link
          href={`/consultation/${appointment.id}`}
          className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary-hover"
        >
          <Video className="h-4 w-4" aria-hidden="true" />
          Join Session Now
        </Link>
      )}
    </div>
  );
}
