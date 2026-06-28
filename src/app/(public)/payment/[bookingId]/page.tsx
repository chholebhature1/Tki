import { Container } from "@/components/layout";
import { PaymentPageContent } from "@/features/payment";

export const metadata = {
  title: "Complete Payment",
};

export default function PaymentPage() {
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
        <PaymentPageContent />
      </Container>
    </section>
  );
}
