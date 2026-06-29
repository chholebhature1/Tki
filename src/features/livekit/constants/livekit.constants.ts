/** Room name prefix for all TalkIndia consultation rooms */
export const ROOM_PREFIX = "tki-consultation";

/** Token expiration in seconds (2 hours) */
export const TOKEN_EXPIRATION_SECONDS = 7200;

/** How early before scheduled time a participant can join (minutes) */
export const EARLY_JOIN_MINUTES = 15;

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
