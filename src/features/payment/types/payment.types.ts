export type PaymentMethod = "upi" | "card" | "netbanking";

export type PaymentStatus = "idle" | "processing" | "success" | "failed";

export interface PaymentSummary {
  therapistName: string;
  therapistQualification: string;
  date: string;
  time: string;
  consultationType: string;
  duration: number;
  sessionFee: number;
  platformFee: number;
  total: number;
  bookingId: string;
}
