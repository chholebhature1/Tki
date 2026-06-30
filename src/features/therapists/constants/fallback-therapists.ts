import type { Therapist } from "../types";

/**
 * Fallback therapists shown when Supabase is unavailable.
 * When real data loads, these are replaced entirely.
 */
export const fallbackTherapists: Therapist[] = [
  {
    id: "fallback-1",
    slug: "dr-priya-sharma",
    name: "Dr. Priya Sharma",
    qualification: "Ph.D. Clinical Psychology",
    professionalTitle: "Clinical Psychologist",
    bio: "Specializing in CBT and mindfulness for anxiety, depression, and stress. Over a decade of experience helping individuals build resilience.",
    yearsExperience: 12,
    languages: ["English", "Hindi"],
    specializations: ["Anxiety", "Depression", "Stress"],
    rating: 4.9,
    totalReviews: 142,
    sessionFee: 1500,
    consultationMode: "online",
    gender: "female",
    verified: true,
    availableToday: true,
    nextAvailableSlot: "Today, 3:00 PM",
  },
  {
    id: "fallback-2",
    slug: "dr-arjun-mehta",
    name: "Dr. Arjun Mehta",
    qualification: "M.D. Psychiatry",
    professionalTitle: "Psychiatrist",
    bio: "Experienced psychiatrist helping individuals and couples navigate life transitions through medication and psychotherapy.",
    yearsExperience: 8,
    languages: ["English", "Hindi", "Gujarati"],
    specializations: ["Relationships", "Family", "Career"],
    rating: 4.8,
    totalReviews: 98,
    sessionFee: 2000,
    consultationMode: "both",
    gender: "male",
    verified: true,
    availableToday: true,
    nextAvailableSlot: "Today, 5:30 PM",
  },
];
