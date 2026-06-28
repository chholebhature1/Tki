import type { BookingDate, TimeSlot, BookingTherapistInfo } from "../types";

export const mockTherapistBooking: BookingTherapistInfo = {
  name: "Dr. Priya Sharma",
  slug: "dr-priya-sharma",
  qualification: "Ph.D. Clinical Psychology",
  sessionFee: 1500,
  sessionDuration: 50,
  consultationMode: "online",
};

export function generateMockDates(): BookingDate[] {
  const dates: BookingDate[] = [];
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayName = d.toLocaleDateString("en-IN", { weekday: "short" });
    const dayNumber = d.getDate();
    const label = d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
    // Sundays unavailable
    const available = d.getDay() !== 0;

    dates.push({
      date: d.toISOString().split("T")[0],
      label,
      dayName,
      dayNumber,
      available,
    });
  }

  return dates;
}

export const mockTimeSlots: TimeSlot[] = [
  { time: "9:00 AM", period: "morning", available: true },
  { time: "9:30 AM", period: "morning", available: false },
  { time: "10:00 AM", period: "morning", available: true },
  { time: "10:30 AM", period: "morning", available: true },
  { time: "11:00 AM", period: "morning", available: false },
  { time: "11:30 AM", period: "morning", available: true },
  { time: "12:00 PM", period: "afternoon", available: true },
  { time: "12:30 PM", period: "afternoon", available: false },
  { time: "1:00 PM", period: "afternoon", available: true },
  { time: "2:00 PM", period: "afternoon", available: true },
  { time: "2:30 PM", period: "afternoon", available: true },
  { time: "3:00 PM", period: "afternoon", available: false },
  { time: "4:00 PM", period: "evening", available: true },
  { time: "4:30 PM", period: "evening", available: true },
  { time: "5:00 PM", period: "evening", available: false },
  { time: "5:30 PM", period: "evening", available: true },
  { time: "6:00 PM", period: "evening", available: true },
];

export const languageOptions = [
  "English",
  "Hindi",
  "Tamil",
  "Telugu",
  "Bengali",
  "Marathi",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Punjabi",
] as const;
