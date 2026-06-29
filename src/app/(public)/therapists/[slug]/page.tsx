import { notFound } from "next/navigation";
import { Container } from "@/components/layout";
import { TherapistRepository } from "@/features/therapists/repositories";
import { TherapistListingCard } from "@/features/therapists/components/therapist-listing-card";
import {
  ProfileHero,
  ProfileAbout,
  ProfileSpecializations,
  ProfileConsultationInfo,
  BookingCard,
} from "@/features/therapists/components/profile";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const therapist = await TherapistRepository.findBySlug(slug);
  if (!therapist) return { title: "Therapist Not Found" };
  return {
    title: therapist.name,
    description: `${therapist.professionalTitle} — ${therapist.bio}`,
  };
}

export default async function TherapistProfilePage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const therapist = await TherapistRepository.findBySlug(slug);

  if (!therapist) notFound();

  const similar = await TherapistRepository.findSimilar(therapist.id);

  return (
    <section className="py-8 sm:py-10 lg:py-12">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <ProfileHero therapist={therapist as never} />
            <ProfileAbout bio={therapist.bio} />
            <ProfileSpecializations specializations={therapist.specializations} />
            <ProfileConsultationInfo
              sessionDuration={50}
              consultationMode={therapist.consultationMode}
              responseTime="Usually responds within 2 hours"
              cancellationPolicy="Free cancellation up to 24 hours before the session"
            />
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-20">
              <BookingCard
                sessionFee={therapist.sessionFee}
                sessionDuration={50}
                nextAvailableSlot={therapist.nextAvailableSlot}
              />
            </div>
          </div>
        </div>

        {/* Mobile Booking CTA */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white px-4 py-3 lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-lg font-bold text-text">
                ₹{therapist.sessionFee.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-muted">50 min session</p>
            </div>
            <a href="/register" className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover">
              Book Appointment
            </a>
          </div>
        </div>

        {/* Similar Therapists */}
        {similar.length > 0 && (
          <div className="mt-12 border-t border-border pt-12">
            <h2 className="text-lg font-semibold text-text">Similar Therapists</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((t) => (
                <TherapistListingCard key={t.id} therapist={t} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
