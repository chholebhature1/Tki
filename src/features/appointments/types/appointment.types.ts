export interface AppointmentDetail {
  id: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  consultationMode: "online" | "offline" | "both";
  status: "payment_pending" | "confirmed" | "cancelled" | "completed" | "rescheduled" | "no_show" | "refunded";
  bookingReference: string | null;
  notes: string | null;
  createdAt: string;
  cancelledAt: string | null;
  completedAt: string | null;
  therapist: {
    id: string;
    name: string;
    professionalTitle: string | null;
    qualification: string | null;
    avatarUrl: string | null;
  };
  patient: {
    id: string;
    name: string;
    email: string;
  };
}
