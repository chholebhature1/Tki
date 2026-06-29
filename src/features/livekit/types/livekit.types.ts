export type MeetingRole = "patient" | "therapist";

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "reconnecting" | "failed";

export type MeetingState = "waiting" | "active" | "ended";

export interface MeetingParticipant {
  identity: string;
  name: string;
  role: MeetingRole;
  isSpeaking: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
}

export interface MediaState {
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenShareEnabled: boolean;
}

export interface MeetingPermissions {
  canPublishAudio: boolean;
  canPublishVideo: boolean;
  canSubscribe: boolean;
}

export interface RoomInfo {
  name: string;
  appointmentId: string;
  therapistId: string;
  patientId: string;
  scheduledStart: string;
  duration: number;
}

export interface TokenResponse {
  token: string;
  serverUrl: string;
  roomName: string;
}
