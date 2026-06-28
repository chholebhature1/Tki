export interface MockTestimonial {
  id: string;
  name: string;
  city: string;
  category: string;
  rating: number;
  quote: string;
  verified: boolean;
}

export const mockTestimonials: MockTestimonial[] = [
  {
    id: "1",
    name: "Ananya",
    city: "Mumbai",
    category: "Anxiety",
    rating: 5,
    quote:
      "I was skeptical about online therapy, but my therapist made me feel heard from the very first session. The booking process was straightforward and I felt safe throughout.",
    verified: true,
  },
  {
    id: "2",
    name: "Rahul",
    city: "Bangalore",
    category: "Career",
    rating: 5,
    quote:
      "Work stress was affecting my sleep and relationships. After six sessions, I have better coping strategies and my manager noticed the difference. Grateful I took this step.",
    verified: true,
  },
  {
    id: "3",
    name: "Sneha",
    city: "Delhi",
    category: "Relationships",
    rating: 4,
    quote:
      "Finding a therapist who spoke my language and understood my cultural context made all the difference. The platform made it easy to filter and compare before committing.",
    verified: true,
  },
];
