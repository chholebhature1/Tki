"use client";

/**
 * Placeholder for the actual LiveKit video room.
 * Displays meeting info and confirms the token was generated.
 * Phase 6.4 will replace this with the real LiveKit room.
 */

import { Video, User, Clock } from "lucide-react";
import type { TokenResponse, MeetingRole } from "../types";

interface ConsultationReadyProps {
  token: TokenResponse;
  participantName: string;
  role: MeetingRole;
  therapistName: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
}

export function ConsultationReady({
  token,
  participantName,
  role,
  therapistName,
  appointmentDate,
  appointmentTime,
  duration,
}: ConsultationReadyProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
          <Video className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>

        <h1 className="mt-6 text-xl font-bold text-text">Ready to Join</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Your video consultation is ready. The room will connect in the next phase.
        </p>

        {/* Session Info */}
        <div className="mt-6 space-y-3 text-left">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-4">
            <User className="h-4 w-4 text-primary" aria-hidden="true" />
            <div>
              <p className="text-xs text-muted">
                {role === "patient" ? "Your Therapist" : "Patient"}
              </p>
              <p className="text-sm font-medium text-text">{therapistName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-4">
            <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
            <div>
              <p className="text-xs text-muted">Session</p>
              <p className="text-sm font-medium text-text">{appointmentDate} · {appointmentTime} · {duration} min</p>
            </div>
          </div>
        </div>

        {/* Debug info (will be removed in Phase 6.4) */}
        <div className="mt-6 rounded-xl border border-border bg-surface p-4 text-left">
          <p className="text-xs font-medium text-muted">Connection Details</p>
          <p className="mt-1 text-xs text-text-secondary">Room: {token.roomName}</p>
          <p className="text-xs text-text-secondary">Participant: {participantName}</p>
          <p className="text-xs text-text-secondary">Role: {role}</p>
          <p className="text-xs text-success">✓ Token generated successfully</p>
        </div>
      </div>
    </div>
  );
}
