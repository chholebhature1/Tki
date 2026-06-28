export const siteConfig = {
  name: "TalkIndia",
  description:
    "Find the right mental health professional with confidence. Book verified therapists, attend secure video consultations, and take the first step toward better mental health.",
  url: "https://talkindia.in",
  ogImage: "/og.png",
  links: {
    twitter: "https://twitter.com/talkindia",
    instagram: "https://instagram.com/talkindia",
  },
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Find Therapist", href: "/find-therapists" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerLinks = {
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  patients: [
    { label: "Find Therapist", href: "/find-therapists" },
    { label: "Book Appointment", href: "/find-therapists" },
  ],
  therapists: [
    { label: "Join as Therapist", href: "/register/therapist" },
    { label: "Verification", href: "/register/therapist" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
} as const;
