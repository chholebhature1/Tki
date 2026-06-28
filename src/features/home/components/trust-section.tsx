import { ShieldCheck, Lock, Clock, Heart } from "lucide-react";
import { Container } from "@/components/layout";
import { TrustStrip } from "./trust-strip";
import { FeatureCard } from "./feature-card";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Mental Health Professionals",
    description:
      "Every therapist is licensed, credential-checked, and approved by our review team before they can accept bookings.",
  },
  {
    icon: Lock,
    title: "Private & Secure Sessions",
    description:
      "End-to-end encrypted video consultations. Your conversations stay between you and your therapist.",
  },
  {
    icon: Clock,
    title: "Book in Minutes",
    description:
      "Browse profiles, pick a time that works, pay securely, and confirm — all in under two minutes.",
  },
  {
    icon: Heart,
    title: "Personalized Care",
    description:
      "Filter by specialization, language, gender, and budget to find a therapist who truly fits your needs.",
  },
] as const;

export function TrustSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container>
        {/* Trust Strip */}
        <TrustStrip />

        {/* Feature Cards */}
        <div className="mt-16 sm:mt-20">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
              Why people choose TalkIndia
            </h2>
            <p className="mt-3 text-base leading-relaxed text-text-secondary">
              We make it simple to find quality mental healthcare that fits your
              life.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
