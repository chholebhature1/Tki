import { notFound } from "next/navigation";
import { Container } from "@/components/layout";
import { AppointmentDetailCard, AppointmentRepository } from "@/features/appointments";

export const metadata = {
  title: "Appointment Details",
};

export default async function AppointmentDetailPage(
  props: { params: Promise<{ appointmentId: string }> }
) {
  const { appointmentId } = await props.params;
  const appointment = await AppointmentRepository.findById(appointmentId);

  if (!appointment) {
    notFound();
  }

  return (
    <section className="py-8 sm:py-10 lg:py-12">
      <Container>
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Appointment Details
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            View your appointment information and status.
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-white p-6 sm:p-8">
            <AppointmentDetailCard appointment={appointment} />
          </div>
        </div>
      </Container>
    </section>
  );
}
