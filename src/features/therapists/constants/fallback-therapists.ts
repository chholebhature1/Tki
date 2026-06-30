import type { Therapist } from "../types";
import type { TherapistProfile } from "../types";

/**
 * Detailed fallback therapists shown when Supabase is unavailable.
 * When real data loads from DB, these are replaced entirely.
 */
export const fallbackTherapists: Therapist[] = [
  {
    id: "fallback-1",
    slug: "dr-priya-sharma",
    name: "Dr. Priya Sharma",
    qualification: "Ph.D. Clinical Psychology",
    professionalTitle: "Clinical Psychologist",
    bio: "Specializing in evidence-based therapies for anxiety and mood disorders. Over a decade of clinical experience helping individuals build resilience through CBT, mindfulness, and acceptance-based approaches.",
    yearsExperience: 12,
    languages: ["English", "Hindi"],
    specializations: ["Anxiety", "Depression", "Stress", "Self-Esteem", "Grief"],
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
    bio: "Experienced psychiatrist helping individuals and couples navigate life transitions and relationship challenges through medication management and psychotherapy.",
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
  {
    id: "fallback-3",
    slug: "dr-kavitha-nair",
    name: "Dr. Kavitha Nair",
    qualification: "M.Phil. Clinical Psychology",
    professionalTitle: "Child & Adolescent Psychologist",
    bio: "Dedicated to supporting young minds through academic pressure, social challenges, and developmental concerns using play therapy, CBT, and family-based interventions.",
    yearsExperience: 10,
    languages: ["English", "Malayalam", "Tamil"],
    specializations: ["Child & Teen", "Anxiety", "ADHD"],
    rating: 4.9,
    totalReviews: 87,
    sessionFee: 1200,
    consultationMode: "online",
    gender: "female",
    verified: true,
    availableToday: false,
    nextAvailableSlot: "Tomorrow, 10:00 AM",
  },
  {
    id: "fallback-4",
    slug: "dr-rohit-kapoor",
    name: "Dr. Rohit Kapoor",
    qualification: "Ph.D. Counseling Psychology",
    professionalTitle: "Addiction Counselor",
    bio: "Helping individuals recover from substance use and behavioral addictions through structured, compassionate therapy and evidence-based relapse prevention strategies.",
    yearsExperience: 15,
    languages: ["English", "Hindi", "Punjabi"],
    specializations: ["Addiction", "Stress", "Trauma"],
    rating: 4.7,
    totalReviews: 63,
    sessionFee: 1800,
    consultationMode: "both",
    gender: "male",
    verified: true,
    availableToday: true,
    nextAvailableSlot: "Today, 4:00 PM",
  },
];

/**
 * Detailed fallback profile for therapist detail pages.
 */
export const fallbackProfiles: Record<string, TherapistProfile> = {
  "dr-priya-sharma": {
    id: "fallback-1",
    slug: "dr-priya-sharma",
    name: "Dr. Priya Sharma",
    qualification: "Ph.D. Clinical Psychology",
    professionalTitle: "Clinical Psychologist",
    bio: "Specializing in evidence-based therapies for anxiety and mood disorders with over a decade of clinical experience.",
    fullBio: `Dr. Priya Sharma is a licensed clinical psychologist with over 12 years of experience helping individuals navigate anxiety, depression, and stress-related challenges.

She integrates Cognitive Behavioral Therapy (CBT), mindfulness-based approaches, and acceptance and commitment therapy (ACT) to create personalized treatment plans.

Dr. Sharma believes in creating a safe, non-judgmental space where clients can explore their thoughts and feelings at their own pace. Her approach is collaborative — working together to build practical coping strategies that fit into everyday life.

She has worked in hospital settings, private practice, and community mental health programs across India before founding her online practice.`,
    yearsExperience: 12,
    languages: ["English", "Hindi"],
    specializations: ["Anxiety", "Depression", "Stress", "Self-Esteem", "Grief"],
    rating: 4.9,
    totalReviews: 142,
    sessionFee: 1500,
    sessionDuration: 50,
    consultationMode: "online",
    gender: "female",
    verified: true,
    availableToday: true,
    nextAvailableSlot: "Today, 3:00 PM",
    responseTime: "Usually responds within 2 hours",
    cancellationPolicy: "Free cancellation up to 24 hours before the session",
    education: [
      { degree: "Ph.D. Clinical Psychology", institution: "NIMHANS, Bangalore", year: 2012 },
      { degree: "M.Phil. Clinical Psychology", institution: "NIMHANS, Bangalore", year: 2009 },
      { degree: "M.A. Psychology", institution: "Delhi University", year: 2007 },
    ],
    certifications: [
      { name: "Certified CBT Practitioner", issuer: "Beck Institute", year: 2014 },
      { name: "Mindfulness-Based Stress Reduction", issuer: "UCSD Center", year: 2016 },
      { name: "Trauma-Focused CBT", issuer: "Medical University of SC", year: 2018 },
    ],
    availability: [
      { day: "Monday", slots: ["9:00 AM", "11:00 AM", "3:00 PM", "5:00 PM"] },
      { day: "Tuesday", slots: ["10:00 AM", "2:00 PM", "4:00 PM"] },
      { day: "Wednesday", slots: ["9:00 AM", "11:00 AM", "3:00 PM"] },
      { day: "Thursday", slots: ["10:00 AM", "12:00 PM", "4:00 PM", "6:00 PM"] },
      { day: "Friday", slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },
      { day: "Saturday", slots: ["10:00 AM", "12:00 PM"] },
      { day: "Sunday", slots: [] },
    ],
    reviews: [
      { id: "r1", name: "Ananya", rating: 5, comment: "Dr. Sharma helped me understand my anxiety patterns and gave me practical tools I still use daily.", date: "2 weeks ago", category: "Anxiety", verified: true },
      { id: "r2", name: "Rahul", rating: 5, comment: "After months of struggling with work stress, I finally feel like I have a handle on things.", date: "1 month ago", category: "Stress", verified: true },
      { id: "r3", name: "Meera", rating: 4, comment: "Very professional and knowledgeable. The sessions were excellent.", date: "1 month ago", category: "Depression", verified: true },
    ],
  },
  "dr-arjun-mehta": {
    id: "fallback-2",
    slug: "dr-arjun-mehta",
    name: "Dr. Arjun Mehta",
    qualification: "M.D. Psychiatry",
    professionalTitle: "Psychiatrist",
    bio: "Experienced psychiatrist helping individuals and couples navigate life transitions through medication and psychotherapy.",
    fullBio: `Dr. Arjun Mehta is a board-certified psychiatrist with 8 years of experience in treating relationship difficulties, family conflicts, and career-related stress.

His approach combines medication management (when appropriate) with evidence-based psychotherapy techniques including couples therapy, cognitive restructuring, and solution-focused brief therapy.

Dr. Mehta is fluent in English, Hindi, and Gujarati, making his practice accessible to a diverse patient population across India.`,
    yearsExperience: 8,
    languages: ["English", "Hindi", "Gujarati"],
    specializations: ["Relationships", "Family", "Career"],
    rating: 4.8,
    totalReviews: 98,
    sessionFee: 2000,
    sessionDuration: 50,
    consultationMode: "both",
    gender: "male",
    verified: true,
    availableToday: true,
    nextAvailableSlot: "Today, 5:30 PM",
    responseTime: "Usually responds within 3 hours",
    cancellationPolicy: "Free cancellation up to 24 hours before the session",
    education: [
      { degree: "M.D. Psychiatry", institution: "AIIMS, New Delhi", year: 2016 },
      { degree: "MBBS", institution: "Gujarat Medical University", year: 2012 },
    ],
    certifications: [
      { name: "Gottman Method Couples Therapy", issuer: "Gottman Institute", year: 2019 },
      { name: "Psychopharmacology Update", issuer: "Indian Psychiatric Society", year: 2021 },
    ],
    availability: [
      { day: "Monday", slots: ["10:00 AM", "2:00 PM", "5:30 PM"] },
      { day: "Tuesday", slots: ["9:00 AM", "11:00 AM", "4:00 PM"] },
      { day: "Wednesday", slots: ["10:00 AM", "3:00 PM"] },
      { day: "Thursday", slots: ["9:00 AM", "2:00 PM", "5:00 PM"] },
      { day: "Friday", slots: ["10:00 AM", "12:00 PM", "4:00 PM"] },
      { day: "Saturday", slots: ["10:00 AM"] },
      { day: "Sunday", slots: [] },
    ],
    reviews: [
      { id: "r4", name: "Vikram", rating: 5, comment: "Dr. Mehta understood my family dynamics quickly. His advice was practical and culturally sensitive.", date: "3 weeks ago", category: "Family", verified: true },
      { id: "r5", name: "Sneha", rating: 5, comment: "Helped us communicate better as a couple. We look forward to every session.", date: "1 month ago", category: "Relationships", verified: true },
      { id: "r6", name: "Amit", rating: 4, comment: "Good medication management and follow-up. Professional approach.", date: "2 months ago", category: "Career", verified: true },
    ],
  },
};
