import type { TherapistProfile } from "../types";

export const mockProfile: TherapistProfile = {
  id: "1",
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
    {
      id: "r1",
      name: "Ananya",
      rating: 5,
      comment: "Dr. Sharma helped me understand my anxiety patterns and gave me practical tools I still use daily. She is patient, warm, and truly listens.",
      date: "2 weeks ago",
      category: "Anxiety",
      verified: true,
    },
    {
      id: "r2",
      name: "Rahul",
      rating: 5,
      comment: "After months of struggling with work stress, I finally feel like I have a handle on things. The sessions were structured and actionable.",
      date: "1 month ago",
      category: "Stress",
      verified: true,
    },
    {
      id: "r3",
      name: "Meera",
      rating: 4,
      comment: "Very professional and knowledgeable. The only reason for 4 stars is that scheduling was sometimes tricky, but the sessions themselves were excellent.",
      date: "1 month ago",
      category: "Depression",
      verified: true,
    },
    {
      id: "r4",
      name: "Vikram",
      rating: 5,
      comment: "I was hesitant about online therapy but Dr. Sharma made me comfortable from the first session. Highly recommend for anyone dealing with grief.",
      date: "2 months ago",
      category: "Grief",
      verified: true,
    },
    {
      id: "r5",
      name: "Sneha",
      rating: 5,
      comment: "Compassionate and skilled. She helped me rebuild my confidence after a very difficult period. I looked forward to each session.",
      date: "3 months ago",
      category: "Self-Esteem",
      verified: true,
    },
  ],
};
