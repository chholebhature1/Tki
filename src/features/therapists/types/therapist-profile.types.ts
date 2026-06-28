import type { Therapist } from "./therapist.types";

export interface Education {
  degree: string;
  institution: string;
  year: number;
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  category: string;
  verified: boolean;
}

export interface AvailabilitySlot {
  day: string;
  slots: string[];
}

export interface TherapistProfile extends Therapist {
  fullBio: string;
  sessionDuration: number;
  responseTime: string;
  cancellationPolicy: string;
  education: Education[];
  certifications: Certification[];
  availability: AvailabilitySlot[];
  reviews: Review[];
}
