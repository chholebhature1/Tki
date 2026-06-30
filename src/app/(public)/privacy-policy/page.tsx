import { Container } from "@/components/layout";

export const metadata = {
  title: "Privacy Policy",
  description: "TalkIndia Privacy Policy — how we collect, use, and protect your personal and health information.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <article className="prose-sm mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-text">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted">Last updated: June 2026</p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-text-secondary">
            <section><h2 className="text-lg font-semibold text-text">1. Information We Collect</h2><p className="mt-2">We collect information you provide during registration (name, email, phone), appointment booking (consultation preferences, session notes), and payment processing (handled by Razorpay — we do not store payment card details).</p></section>

            <section><h2 className="text-lg font-semibold text-text">2. How We Use Your Information</h2><p className="mt-2">Your information is used to: facilitate therapist matching, process appointments, enable video consultations, send appointment reminders, and improve our platform. We never sell your data to third parties.</p></section>

            <section><h2 className="text-lg font-semibold text-text">3. Video Consultation Privacy</h2><p className="mt-2">Video sessions are conducted through encrypted connections via LiveKit. TalkIndia does not record, store, or access the content of your therapy sessions. Sessions are between you and your therapist only.</p></section>

            <section><h2 className="text-lg font-semibold text-text">4. Cookies</h2><p className="mt-2">We use essential cookies for authentication and session management. We do not use tracking cookies or share cookie data with advertisers.</p></section>

            <section><h2 className="text-lg font-semibold text-text">5. Data Security</h2><p className="mt-2">All data is encrypted in transit (TLS) and at rest. We use Supabase as our database provider with Row Level Security ensuring users can only access their own data. Access to production systems is restricted to authorized personnel.</p></section>

            <section><h2 className="text-lg font-semibold text-text">6. Your Rights</h2><p className="mt-2">You may request access to, correction of, or deletion of your personal data at any time by contacting support@talkindia.in. Account deletion requests are processed within 30 days.</p></section>

            <section><h2 className="text-lg font-semibold text-text">7. Contact</h2><p className="mt-2">For privacy-related inquiries, contact: support@talkindia.in</p></section>
          </div>
        </article>
      </Container>
    </section>
  );
}
