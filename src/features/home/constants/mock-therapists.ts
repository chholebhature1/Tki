export interface MockTherapist {
  id: string;
  name: string;
  slug: string;
  qualification: string;
  yearsExperience: number;
  languages: string[];
  specializations: string[];
  rating: number;
  sessionFee: number;
  availableToday: boolean;
}

export const mockTherapists: MockTherapist[] = [
  {
    id: "1",
    name: "Dr. Priya Sharma",
    slug: "dr-priya-sharma",
    qualification: "Ph.D. Clinical Psychology",
    yearsExperience: 12,
    languages: ["English", "Hindi"],
    specializations: ["Anxiety", "Depression", "Stress"],
    rating: 4.9,
    sessionFee: 1500,
    availableToday: true,
  },
  {
    id: "2",
    name: "Dr. Arjun Mehta",
    slug: "dr-arjun-mehta",
    qualification: "M.D. Psychiatry",
    yearsExperience: 8,
    languages: ["English", "Hindi", "Gujarati"],
    specializations: ["Relationships", "Family", "Career"],
    rating: 4.8,
    sessionFee: 2000,
    availableToday: true,
  },
  {
    id: "3",
    name: "Dr. Kavitha Nair",
    slug: "dr-kavitha-nair",
    qualification: "M.Phil. Clinical Psychology",
    yearsExperience: 10,
    languages: ["English", "Malayalam", "Tamil"],
    specializations: ["Child & Teen", "Anxiety", "ADHD"],
    rating: 4.9,
    sessionFee: 1200,
    availableToday: false,
  },
  {
    id: "4",
    name: "Dr. Rohit Kapoor",
    slug: "dr-rohit-kapoor",
    qualification: "Ph.D. Counseling Psychology",
    yearsExperience: 15,
    languages: ["English", "Hindi", "Punjabi"],
    specializations: ["Addiction", "Stress", "Trauma"],
    rating: 4.7,
    sessionFee: 1800,
    availableToday: true,
  },
];
