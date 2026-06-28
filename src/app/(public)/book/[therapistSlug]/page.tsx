import { Container } from "@/components/layout";
import { BookingWizard, mockTherapistBooking } from "@/features/booking";

export const metadata = {
  title: "Book Appointment",
};

export default function BookingPage() {
  return (
    <section className="bg-surface py-8 sm:py-10 lg:py-12">
      <Container>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Book an Appointment
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            with {mockTherapistBooking.name}
          </p>
        </div>

        <BookingWizard therapist={mockTherapistBooking} />
      </Container>
    </section>
  );
}
