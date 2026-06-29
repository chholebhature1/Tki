import { Container } from "@/components/layout";
import { PaymentPageContent } from "@/features/payment";
import { AppointmentRepository } from "@/features/appointments";

export const metadata = {
  title: "Complete Payment",
};

export default async function PaymentPage(
  props: { params: Promise<{ bookingId: string }> }
) {
  const { bookingId } = await props.params;

  // Load real appointment data
  const appointment = await AppointmentRepository.findById(bookingId);

  const paymentInfo = appointment
    ? {
        therapistName: appointment.therapist.name,
        therapistQualification: appointment.therapist.professionalTitle || "",
        date: new Date(appointment.appointmentDate).toLocaleDateString("en-IN", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        time: appointment.startTime,
        consultationType: appointment.consultationMode === "online" ? "Video Consultation" : "In-Person",
        duration: appointment.durationMinutes,
        sessionFee: 1500,
        platformFee: 0,
        total: 1500,
        bookingId: appointment.bookingReference || bookingId,
      }
    : undefined;

  return (
    <section className="bg-surface py-8 sm:py-10 lg:py-12">
      <Container>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Complete Payment
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Choose a payment method to confirm your booking.
          </p>
        </div>
        <PaymentPageContent
          appointmentInfo={paymentInfo}
          appointmentId={appointment ? bookingId : undefined}
        />
      </Container>
    </section>
  );
}
