import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Container } from "@/components/layout";
import {
  AppointmentDetailCard,
  AppointmentActions,
  AppointmentRepository,
  ReviewForm,
} from "@/features/appointments";

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

  // Check if patient has already reviewed this appointment
  let hasReviewed = false;
  if (appointment.status === "completed") {
    const supabase = await createServerSupabaseClient();
    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("appointment_id", appointmentId)
      .maybeSingle();
    hasReviewed = !!existing;
  }

  const showReviewForm = appointment.status === "completed" && !hasReviewed;

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

            {/* Actions */}
            <div className="mt-6 border-t border-border pt-6">
              <AppointmentActions appointment={appointment} />
            </div>
          </div>

          {/* Review Form — shows after session is completed and not yet reviewed */}
          {showReviewForm && (
            <div className="mt-6">
              <ReviewForm
                appointmentId={appointmentId}
                therapistName={appointment.therapist.name}
              />
            </div>
          )}

          {/* Already reviewed */}
          {appointment.status === "completed" && hasReviewed && (
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary-light p-5 text-center">
              <p className="text-sm font-medium text-text">✓ You&apos;ve reviewed this session</p>
              <p className="mt-1 text-xs text-text-secondary">Thank you for your feedback!</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
