export const siteConfig = {
  name: "TalkIndia",
  description:
    "Find the right mental health professional with confidence. Book verified therapists, attend secure video consultations, and take the first step toward better mental health.",
  url: "https://tki-c62m.vercel.app",
  ogImage: "/og.png",
  links: {
    twitter: "https://twitter.com/talkindia",
    instagram: "https://instagram.com/talkindia",
  },
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Find Therapist", href: "/find-therapists" },
  { label: "Assessments", href: "/assessments" },
  { label: "Conditions", href: "/conditions" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
] as const;

export const footerLinks = {
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ],
  patients: [
    { label: "Find Therapist", href: "/find-therapists" },
    { label: "Assessments", href: "/assessments" },
    { label: "Conditions", href: "/conditions" },
  ],
  therapists: [
    { label: "Join as Therapist", href: "/register" },
    { label: "FAQ", href: "/faq" },
  ],
  resources: [
    { label: "Anxiety", href: "/conditions/anxiety" },
    { label: "Depression", href: "/conditions/depression" },
    { label: "Stress", href: "/conditions/stress" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "FAQ", href: "/faq" },
  ],
} as const;
