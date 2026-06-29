"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useConnectionState,
  useLocalParticipant,
  useRemoteParticipants,
  useRoomContext,
  useTracks,
  VideoTrack,
} from "@livekit/components-react";
import { ConnectionState, Track } from "livekit-client";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Clock, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
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

export function ConsultationReady(props: ConsultationReadyProps) {
  return (
    <LiveKitRoom
      token={props.token.token}
      serverUrl={props.token.serverUrl}
      connect={true}
      audio={true}
      video={true}
      className="flex h-screen flex-col bg-text"
    >
      <RoomAudioRenderer />
      <ConsultationRoomUI {...props} />
    </LiveKitRoom>
  );
}

function ConsultationRoomUI(props: ConsultationReadyProps) {
  const { role, therapistName, appointmentTime, duration } = props;
  const router = useRouter();
  const connectionState = useConnectionState();
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone]);

  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  // Session timer
  useEffect(() => {
    if (connectionState !== ConnectionState.Connected) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [connectionState]);

  const toggleAudio = useCallback(async () => {
    await localParticipant.setMicrophoneEnabled(!audioEnabled);
    setAudioEnabled(!audioEnabled);
  }, [localParticipant, audioEnabled]);

  const toggleVideo = useCallback(async () => {
    await localParticipant.setCameraEnabled(!videoEnabled);
    setVideoEnabled(!videoEnabled);
  }, [localParticipant, videoEnabled]);

  const handleLeave = useCallback(async () => {
    room.disconnect();
    // Only mark completed when therapist explicitly leaves via dialog
    // (Not on accidental disconnect)
    if (role === "therapist" && elapsed > 60) {
      // Only mark completed if session lasted more than 1 minute
      try {
        const { markCompletedAction } = await import("@/features/appointments/actions");
        const appointmentId = props.token.roomName.replace("tki-consultation-", "");
        await markCompletedAction(appointmentId);
      } catch {
        // Best effort — don't block navigation
      }
    }
    if (role === "patient") router.push("/dashboard");
    else router.push("/therapist/dashboard");
  }, [room, role, router, props.token.roomName, elapsed]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Connection states
  if (connectionState === ConnectionState.Connecting) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-text text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        <p className="mt-4 text-sm">Connecting to session...</p>
      </div>
    );
  }

  if (connectionState === ConnectionState.Disconnected) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-text text-white">
        <WifiOff className="h-8 w-8 text-white/60" />
        <p className="mt-4 text-sm">Disconnected from session</p>
        <button onClick={() => router.push("/dashboard")} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium">
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Get video tracks
  const localVideoTrack = tracks.find(
    (t) => t.participant.sid === localParticipant.sid && t.source === Track.Source.Camera
  );
  const remoteVideoTrack = tracks.find(
    (t) => t.participant.sid !== localParticipant.sid && t.source === Track.Source.Camera
  );

  const otherJoined = remoteParticipants.length > 0;

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 bg-text px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Wifi className="h-3.5 w-3.5 text-success" aria-hidden="true" />
            <span className="text-xs text-white/60">Connected</span>
          </div>
          <span className="text-xs text-white/40">·</span>
          <span className="text-xs text-white/60">{therapistName}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
            <Clock className="h-3 w-3 text-white/60" aria-hidden="true" />
            <span className="text-xs font-medium text-white">{formatTime(elapsed)}</span>
          </div>
          <span className="text-xs text-white/40">{appointmentTime} · {duration} min</span>
        </div>
      </header>

      {/* Participant Grid */}
      <div className="flex flex-1 items-center justify-center gap-4 p-4">
        {/* Remote Participant (main) */}
        <div className="relative flex aspect-video max-h-full w-full max-w-3xl items-center justify-center overflow-hidden rounded-2xl bg-white/5">
          {otherJoined && remoteVideoTrack ? (
            <VideoTrack trackRef={remoteVideoTrack} className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-3xl font-bold text-primary">
                {therapistName[0]}
              </div>
              {!otherJoined && (
                <p className="text-sm text-white/50">Waiting for {role === "patient" ? "therapist" : "patient"}...</p>
              )}
            </div>
          )}
          {otherJoined && (
            <div className="absolute bottom-3 left-3 rounded-lg bg-black/50 px-2.5 py-1">
              <span className="text-xs font-medium text-white">{therapistName}</span>
            </div>
          )}
        </div>

        {/* Local Participant (small) */}
        <div className="absolute bottom-24 right-4 h-32 w-44 overflow-hidden rounded-xl border-2 border-white/20 bg-white/5 sm:bottom-28 sm:right-6 sm:h-40 sm:w-56">
          {localVideoTrack && videoEnabled ? (
            <VideoTrack trackRef={localVideoTrack} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-lg font-bold text-primary">
                {localParticipant.name?.[0] || "Y"}
              </div>
            </div>
          )}
          <div className="absolute bottom-2 left-2 rounded bg-black/50 px-1.5 py-0.5">
            <span className="text-[10px] text-white">You</span>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-center gap-3 bg-text px-4 py-4 sm:py-5">
        <button
          onClick={toggleAudio}
          className={cn("flex h-12 w-12 items-center justify-center rounded-full transition-colors", audioEnabled ? "bg-white/10 text-white hover:bg-white/20" : "bg-danger text-white")}
          aria-label={audioEnabled ? "Mute microphone" : "Unmute microphone"}
        >
          {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </button>
        <button
          onClick={toggleVideo}
          className={cn("flex h-12 w-12 items-center justify-center rounded-full transition-colors", videoEnabled ? "bg-white/10 text-white hover:bg-white/20" : "bg-danger text-white")}
          aria-label={videoEnabled ? "Turn off camera" : "Turn on camera"}
        >
          {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </button>
        <button
          onClick={() => setShowLeaveDialog(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-danger text-white hover:bg-danger/90"
          aria-label="Leave consultation"
        >
          <PhoneOff className="h-5 w-5" />
        </button>
      </div>

      {/* Leave Dialog */}
      {showLeaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 text-center">
            <h2 className="text-lg font-semibold text-text">Leave Consultation?</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Are you sure you want to end this session?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowLeaveDialog(false)}
                className="flex-1 rounded-xl border border-border py-3 text-sm font-medium text-text hover:bg-surface"
              >
                Continue Session
              </button>
              <button
                onClick={handleLeave}
                className="flex-1 rounded-xl bg-danger py-3 text-sm font-medium text-white hover:bg-danger/90"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
