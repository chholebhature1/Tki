"use client";

/**
 * Main consultation room component.
 * Will integrate LiveKit room in Phase 6.2.
 * Currently a placeholder showing the architectural structure.
 */

import { LoadingScreen } from "./loading-screen";

interface ConsultationRoomProps {
  appointmentId: string;
  token?: string;
}

export function ConsultationRoom({ appointmentId, token }: ConsultationRoomProps) {
  if (!token) {
    return <LoadingScreen message={`Preparing session for appointment ${appointmentId}...`} />;
  }

  // Phase 6.2 will integrate @livekit/components-react here
  return <LoadingScreen message="Connecting to video session..." />;
}
