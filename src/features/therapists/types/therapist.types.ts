export type ConsultationMode = "online" | "offline" | "both";

export interface Therapist {
  id: string;
  slug: string;
  name: string;
  qualification: string;
  professionalTitle: string;
  bio: string;
  yearsExperience: number;
  languages: string[];
  specializations: string[];
  rating: number;
  totalReviews: number;
  sessionFee: number;
  consultationMode: ConsultationMode;
  gender: "male" | "female" | "other";
  verified: boolean;
  availableToday: boolean;
  nextAvailableSlot: string;
}

export type SortOption =
  | "recommended"
  | "highest-rated"
  | "lowest-fee"
  | "most-experienced"
  | "newest";

export interface TherapistFilters {
  specialization?: string;
  language?: string;
  consultationMode?: ConsultationMode;
  experience?: string;
  gender?: string;
  maxFee?: number;
  minRating?: number;
  availability?: "today" | "tomorrow";
}
