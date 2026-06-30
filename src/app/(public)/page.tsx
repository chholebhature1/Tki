import { Suspense } from "react";
import Link from "next/link";
import { ClipboardCheck, BookOpen } from "lucide-react";
import { Container } from "@/components/layout";
import {
  HeroSection,
  TrustSection,
  CategoriesSection,
  HowItWorksSection,
  FeaturedTherapistsSection,
  TestimonialsSection,
  QuerySection,
} from "@/features/home";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <CategoriesSection />
      <HowItWorksSection />
      <Suspense fallback={null}>
        <FeaturedTherapistsSection />
      </Suspense>

      {/* Self-Help Tools Section */}
      <section className="bg-surface py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-md text-center">
            <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">Free Self-Help Tools</h2>
            <p className="mt-3 text-base text-text-secondary">Take the first step — understand your mental health with evidence-based assessments.</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
            <Link href="/assessments" className="group flex items-start gap-4 rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary/30 hover:shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light group-hover:bg-primary/15">
                <ClipboardCheck className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text">Mental Health Assessments</h3>
                <p className="mt-1 text-sm text-text-secondary">Free screenings for anxiety, depression, and stress. Takes 2-3 minutes.</p>
              </div>
            </Link>
            <Link href="/conditions" className="group flex items-start gap-4 rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary/30 hover:shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light group-hover:bg-primary/15">
                <BookOpen className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text">Condition Library</h3>
                <p className="mt-1 text-sm text-text-secondary">Learn about symptoms, causes, and treatment options for common conditions.</p>
              </div>
            </Link>
          </div>
        </Container>
      </section>

      <TestimonialsSection />
      <QuerySection />
    </>
  );
}
