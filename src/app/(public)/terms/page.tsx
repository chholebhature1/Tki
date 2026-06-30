import { Container } from "@/components/layout";

export const metadata = {
  title: "Terms & Conditions",
  description: "TalkIndia Terms of Service — user responsibilities, payment policies, cancellation rules, and consultation guidelines.",
};

export default function TermsPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <article className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-text">Terms & Conditions</h1>
          <p className="mt-2 text-sm text-muted">Last updated: June 2026</p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-text-secondary">
            <section><h2 className="text-lg font-semibold text-text">1. Acceptance of Terms</h2><p className="mt-2">By using TalkIndia, you agree to these terms. If you do not agree, please do not use our platform.</p></section>

            <section><h2 className="text-lg font-semibold text-text">2. User Responsibilities</h2><p className="mt-2">Users must provide accurate information during registration. You are responsible for maintaining the confidentiality of your account credentials. Misuse of the platform, including fraudulent bookings or abusive behavior toward therapists, may result in account suspension.</p></section>

            <section><h2 className="text-lg font-semibold text-text">3. Appointments</h2><p className="mt-2">Appointments are confirmed only after successful payment verification. TalkIndia acts as a marketplace — we facilitate connections between patients and independent therapists but do not provide medical advice directly.</p></section>

            <section><h2 className="text-lg font-semibold text-text">4. Payments</h2><p className="mt-2">All payments are processed securely through Razorpay. Consultation fees are set by individual therapists. TalkIndia charges a platform commission on completed sessions.</p></section>

            <section><h2 className="text-lg font-semibold text-text">5. Cancellation Policy</h2><p className="mt-2">Free cancellation is available up to 24 hours before the scheduled appointment. Cancellations within 24 hours may not be eligible for a refund. Therapist-initiated cancellations always result in a full refund.</p></section>

            <section><h2 className="text-lg font-semibold text-text">6. Refund Policy</h2><p className="mt-2">Eligible refunds are processed within 5-7 business days to the original payment method. Partial refunds may apply based on the cancellation timing.</p></section>

            <section><h2 className="text-lg font-semibold text-text">7. Video Consultations</h2><p className="mt-2">Video sessions require a stable internet connection, camera, and microphone. TalkIndia is not responsible for technical issues on the user&apos;s end. Sessions are not recorded by the platform.</p></section>

            <section><h2 className="text-lg font-semibold text-text">8. Limitation of Liability</h2><p className="mt-2">TalkIndia is a technology platform connecting patients with independent therapists. We do not guarantee specific therapeutic outcomes. Therapists are independent professionals responsible for the quality of their services.</p></section>

            <section><h2 className="text-lg font-semibold text-text">9. Contact</h2><p className="mt-2">For questions about these terms, contact: support@talkindia.in</p></section>
          </div>
        </article>
      </Container>
    </section>
  );
}
