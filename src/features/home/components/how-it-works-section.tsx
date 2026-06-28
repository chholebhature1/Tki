import { Search, CalendarDays, CreditCard, Video } from "lucide-react";
import { Container } from "@/components/layout";
import { StepCard } from "./step-card";

const steps = [
  {
    icon: Search,
    title: "Find the Right Therapist",
    description: "Browse therapists by specialization, language, and experience.",
  },
  {
    icon: CalendarDays,
    title: "Choose a Time Slot",
    description: "View availability and select a convenient appointment.",
  },
  {
    icon: CreditCard,
    title: "Secure Your Booking",
    description: "Confirm instantly using Razorpay with secure online payment.",
  },
  {
    icon: Video,
    title: "Attend Your Session",
    description: "Join your private online consultation through TalkIndia.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container>
        {/* Header */}
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
            How TalkIndia Works
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            From finding the right therapist to attending your session — it
            takes just a few minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-12 sm:mt-14">
          {/* Connecting line — desktop only */}
          <div
            className="absolute inset-x-[12.5%] top-7 hidden h-px bg-border lg:block"
            aria-hidden="true"
          />

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, index) => (
              <StepCard
                key={step.title}
                icon={step.icon}
                step={index + 1}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
