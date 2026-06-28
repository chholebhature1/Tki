import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout";
import { TherapistCard } from "./therapist-card";
import { mockTherapists } from "../constants/mock-therapists";

export function FeaturedTherapistsSection() {
  return (
    <section className="bg-surface py-16 sm:py-20 lg:py-24">
      <Container>
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
              Featured Therapists
            </h2>
            <p className="mt-3 text-base leading-relaxed text-text-secondary">
              Experienced, verified professionals ready to support your mental
              health journey.
            </p>
          </div>
          <Link
            href="/find-therapists"
            className="group flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
          >
            View All Therapists
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {mockTherapists.map((therapist) => (
            <TherapistCard key={therapist.id} therapist={therapist} />
          ))}
        </div>
      </Container>
    </section>
  );
}
