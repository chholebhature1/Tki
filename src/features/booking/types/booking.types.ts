export type ConsultationType = "video" | "audio";

export type TimeSlotPeriod = "morning" | "afternoon" | "evening";

export interface TimeSlot {
  time: string;
  period: TimeSlotPeriod;
  available: boolean;
}

export interface BookingDate {
  date: string; // ISO string
  label: string; // "Mon, Jul 7"
  dayName: string;
  dayNumber: number;
  available: boolean;
}

export interface PatientDetails {
  reason: string;
  preferredLanguage: string;
  notes: string;
}

export interface BookingState {
  step: number;
  consultationType: ConsultationType | null;
  selectedDate: string | null;
  selectedTime: string | null;
  patientDetails: PatientDetails | null;
}

export interface BookingTherapistInfo {
  name: string;
  slug: string;
  qualification: string;
  sessionFee: number;
  sessionDuration: number;
  consultationMode: string;
}
