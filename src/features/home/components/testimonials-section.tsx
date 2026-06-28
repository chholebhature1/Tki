import { Container } from "@/components/layout";
import { TestimonialCard } from "./testimonial-card";
import { mockTestimonials } from "../constants/mock-testimonials";

export function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container>
        {/* Header */}
        <div className="max-w-md">
          <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
            What our patients say
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Real experiences from people who took the first step toward better
            mental health.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mockTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </Container>
    </section>
  );
}
