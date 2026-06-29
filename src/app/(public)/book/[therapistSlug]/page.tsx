import { notFound } from "next/navigation";
import { Container } from "@/components/layout";
import { BookingWizard } from "@/features/booking";
import { TherapistRepository } from "@/features/therapists/repositories";

export const metadata = {
  title: "Book Appointment",
};

export default async function BookingPage(
  props: { params: Promise<{ therapistSlug: string }> }
) {
  const { therapistSlug } = await props.params;
  const therapist = await TherapistRepository.findBySlug(therapistSlug);

  if (!therapist) notFound();

  const bookingInfo = {
    name: therapist.name,
    slug: therapist.slug,
    qualification: therapist.qualification,
    sessionFee: therapist.sessionFee,
    sessionDuration: 50,
    consultationMode: therapist.consultationMode,
    therapistProfileId: therapist.id,
  };

  return (
    <section className="bg-surface py-8 sm:py-10 lg:py-12">
      <Container>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Book an Appointment
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            with {therapist.name}
          </p>
        </div>

        <BookingWizard therapist={bookingInfo} />
      </Container>
    </section>
  );
}
