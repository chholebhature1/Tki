"use client";

import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaState } from "../types";

interface ControlBarProps {
  mediaState: MediaState;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onLeave: () => void;
}

export function ControlBar({ mediaState, onToggleAudio, onToggleVideo, onLeave }: ControlBarProps) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl bg-white/90 px-6 py-3 shadow-sm backdrop-blur-sm border border-border">
      <button
        onClick={onToggleAudio}
        className={cn("flex h-11 w-11 items-center justify-center rounded-full transition-colors", mediaState.audioEnabled ? "bg-surface text-text hover:bg-border" : "bg-danger/10 text-danger")}
        aria-label={mediaState.audioEnabled ? "Mute microphone" : "Unmute microphone"}
      >
        {mediaState.audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
      </button>
      <button
        onClick={onToggleVideo}
        className={cn("flex h-11 w-11 items-center justify-center rounded-full transition-colors", mediaState.videoEnabled ? "bg-surface text-text hover:bg-border" : "bg-danger/10 text-danger")}
        aria-label={mediaState.videoEnabled ? "Turn off camera" : "Turn on camera"}
      >
        {mediaState.videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
      </button>
      <button
        onClick={onLeave}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-danger text-white hover:bg-danger/90"
        aria-label="Leave meeting"
      >
        <PhoneOff className="h-5 w-5" />
      </button>
    </div>
  );
}
