import { notFound } from "next/navigation";
import { Container } from "@/components/layout";
import { TherapistRepository } from "@/features/therapists/repositories";
import { TherapistListingCard } from "@/features/therapists/components/therapist-listing-card";
import { fallbackTherapists, fallbackProfiles } from "@/features/therapists/constants/fallback-therapists";
import {
  ProfileHero,
  ProfileAbout,
  ProfileSpecializations,
  ProfileConsultationInfo,
  ProfileAvailability,
  ProfileReviews,
  BookingCard,
} from "@/features/therapists/components/profile";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  let therapist = null;
  try {
    therapist = await TherapistRepository.findBySlug(slug);
  } catch { /* fallback below */ }

  if (!therapist) {
    const fallback = fallbackProfiles[slug];
    if (fallback) return { title: fallback.name, description: `${fallback.professionalTitle} — ${fallback.bio}` };
    return { title: "Therapist Not Found" };
  }
  return { title: therapist.name, description: `${therapist.professionalTitle} — ${therapist.bio}` };
}

export default async function TherapistProfilePage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;

  let therapist = null;
  let similar: typeof fallbackTherapists = [];

  try {
    therapist = await TherapistRepository.findBySlug(slug);
    if (therapist) {
      similar = await TherapistRepository.findSimilar(therapist.id);
    }
  } catch { /* use fallback */ }

  // Use fallback profile if DB unavailable
  const fallbackProfile = fallbackProfiles[slug];

  if (!therapist && !fallbackProfile) notFound();

  // If we have a detailed fallback profile, render full page
  if (!therapist && fallbackProfile) {
    return (
      <section className="py-8 sm:py-10 lg:py-12">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-8">
              <ProfileHero therapist={fallbackProfile as never} />
              <ProfileAbout bio={fallbackProfile.fullBio} />
              <ProfileSpecializations specializations={fallbackProfile.specializations} />
              <ProfileConsultationInfo
                sessionDuration={fallbackProfile.sessionDuration}
                consultationMode={fallbackProfile.consultationMode}
                responseTime={fallbackProfile.responseTime}
                cancellationPolicy={fallbackProfile.cancellationPolicy}
              />
              <ProfileAvailability availability={fallbackProfile.availability} />
              <ProfileReviews reviews={fallbackProfile.reviews} rating={fallbackProfile.rating} totalReviews={fallbackProfile.totalReviews} />
            </div>
            <div className="hidden lg:block">
              <div className="sticky top-20">
                <BookingCard slug={slug} sessionFee={fallbackProfile.sessionFee} sessionDuration={fallbackProfile.sessionDuration} nextAvailableSlot={fallbackProfile.nextAvailableSlot} />
              </div>
            </div>
          </div>

          {/* Mobile Booking CTA */}
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white px-4 py-3 lg:hidden">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div>
                <p className="text-lg font-bold text-text">₹{fallbackProfile.sessionFee.toLocaleString("en-IN")}</p>
                <p className="text-xs text-muted">{fallbackProfile.sessionDuration} min session</p>
              </div>
              <a href={`/book/${slug}`} className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover">Book Appointment</a>
            </div>
          </div>

          {/* Similar */}
          <div className="mt-12 border-t border-border pt-12">
            <h2 className="text-lg font-semibold text-text">Similar Therapists</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fallbackTherapists.filter((t) => t.slug !== slug).slice(0, 3).map((t) => (
                <TherapistListingCard key={t.id} therapist={t} />
              ))}
            </div>
          </div>
        </Container>
      </section>
    );
  }

  // Real data path
  if (!therapist) notFound();

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
              <BookingCard slug={therapist.slug} sessionFee={therapist.sessionFee} sessionDuration={50} nextAvailableSlot={therapist.nextAvailableSlot} />
            </div>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white px-4 py-3 lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-lg font-bold text-text">₹{therapist.sessionFee.toLocaleString("en-IN")}</p>
              <p className="text-xs text-muted">50 min session</p>
            </div>
            <a href={`/book/${therapist.slug}`} className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover">Book Appointment</a>
          </div>
        </div>

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
