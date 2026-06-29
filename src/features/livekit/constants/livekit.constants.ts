/** Room name prefix for all TalkIndia consultation rooms */
export const ROOM_PREFIX = "tki-consultation";

/** Token expiration in seconds (2 hours) */
export const TOKEN_EXPIRATION_SECONDS = 7200;

/** How early before scheduled time a participant can join (minutes) */
export const EARLY_JOIN_MINUTES = 15;

/** How late after scheduled end a participant can still join (minutes) */
export const LATE_JOIN_MINUTES = 15;

/** Default session duration in minutes */
export const DEFAULT_SESSION_DURATION = 50;

/** Connection timeout in milliseconds */
export const CONNECTION_TIMEOUT_MS = 30000;

/** Supported media types */
export const SUPPORTED_MEDIA = {
  audio: true,
  video: true,
  screenShare: false, // Disabled for therapy sessions
} as const;

/** Meeting roles */
export const MEETING_ROLES = {
  PATIENT: "patient",
  THERAPIST: "therapist",
} as const;
