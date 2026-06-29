import { MicOff } from "lucide-react";
import type { MeetingParticipant } from "../types";

interface ParticipantTileProps {
  participant: MeetingParticipant;
}

export function ParticipantTile({ participant }: ParticipantTileProps) {
  return (
    <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-text/5">
      {/* Placeholder — will be replaced with actual video track */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-2xl font-bold text-primary">
        {participant.name[0]}
      </div>

      {/* Name badge */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/50 px-2.5 py-1">
        <span className="text-xs font-medium text-white">{participant.name}</span>
        {participant.isMuted && <MicOff className="h-3 w-3 text-white/70" aria-label="Muted" />}
      </div>
    </div>
  );
}
