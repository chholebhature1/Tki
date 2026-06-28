import { Container } from "@/components/layout";
import { mockProfile } from "@/features/therapists/constants";
import {
  ProfileHero,
  ProfileAbout,
  ProfileSpecializations,
  ProfileEducation,
  ProfileCertifications,
  ProfileConsultationInfo,
  ProfileAvailability,
  ProfileReviews,
  BookingCard,
  SimilarTherapists,
} from "@/features/therapists/components/profile";

export function generateMetadata() {
  return {
    title: mockProfile.name,
    description: `${mockProfile.professionalTitle} — ${mockProfile.bio}`,
  };
}

export default function TherapistProfilePage() {
  const therapist = mockProfile;

  return (
    <section className="py-8 sm:py-10 lg:py-12">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main Content */}
          <div className="space-y-8">
            <ProfileHero therapist={therapist} />
            <ProfileAbout bio={therapist.fullBio} />
            <ProfileSpecializations specializations={therapist.specializations} />
            <ProfileConsultationInfo
              sessionDuration={therapist.sessionDuration}
              consultationMode={therapist.consultationMode}
              responseTime={therapist.responseTime}
              cancellationPolicy={therapist.cancellationPolicy}
            />
            <ProfileEducation education={therapist.education} />
            <ProfileCertifications certifications={therapist.certifications} />
            <ProfileAvailability availability={therapist.availability} />
            <ProfileReviews
              reviews={therapist.reviews}
              rating={therapist.rating}
              totalReviews={therapist.totalReviews}
            />
          </div>

          {/* Sticky Booking Card — Desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <BookingCard
                sessionFee={therapist.sessionFee}
                sessionDuration={therapist.sessionDuration}
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
              <p className="text-xs text-muted">{therapist.sessionDuration} min session</p>
            </div>
            <a
              href="/register"
              className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Book Appointment
            </a>
          </div>
        </div>

        {/* Similar Therapists */}
        <div className="mt-12 border-t border-border pt-12">
          <SimilarTherapists currentId={therapist.id} />
        </div>
      </Container>
    </section>
  );
}
