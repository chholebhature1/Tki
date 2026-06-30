import { Container } from "@/components/layout";

export const metadata = {
  title: "FAQ",
  description: "Frequently asked questions about TalkIndia — appointments, payments, video consultations, and privacy.",
};

const faqs = [
  { category: "General", items: [
    { q: "What is TalkIndia?", a: "TalkIndia is India's trusted online mental healthcare marketplace. We connect patients with verified therapists for secure video consultations." },
    { q: "How are therapists verified?", a: "Every therapist must submit professional licenses, degree certificates, and government ID. Our team manually reviews each application before approval." },
    { q: "Is TalkIndia free to use?", a: "Browsing therapists is free. You only pay when you book an appointment. Prices are set by individual therapists." },
  ]},
  { category: "Appointments", items: [
    { q: "How do I book an appointment?", a: "Find a therapist, select a date and time, choose your consultation type, and complete payment. Your appointment is confirmed instantly." },
    { q: "Can I cancel an appointment?", a: "Yes. Free cancellation is available up to 24 hours before your session. After that, the booking is non-refundable." },
    { q: "Can I reschedule?", a: "You can reschedule confirmed appointments up to 2 times, subject to therapist availability." },
  ]},
  { category: "Payments", items: [
    { q: "What payment methods are accepted?", a: "We accept UPI, credit/debit cards, and net banking via Razorpay — India's most trusted payment gateway." },
    { q: "Is my payment information secure?", a: "All payments are processed through Razorpay with bank-level encryption. TalkIndia never stores your card details." },
    { q: "How do refunds work?", a: "Eligible refunds are processed within 5-7 business days to your original payment method." },
  ]},
  { category: "Video Consultation", items: [
    { q: "How do I join a session?", a: "A 'Join Session' button appears on your dashboard 15 minutes before your appointment time. Click it to enter the video room." },
    { q: "What if I have technical issues?", a: "Ensure your camera and microphone are enabled. Use Chrome or Firefox for best compatibility. Contact support if issues persist." },
    { q: "Are sessions recorded?", a: "No. TalkIndia never records video consultations. Your sessions are completely private." },
  ]},
  { category: "Privacy", items: [
    { q: "Who can see my information?", a: "Only you and your assigned therapist can see appointment details. Other patients cannot access your data." },
    { q: "Is my data stored securely?", a: "All data is stored on secure cloud infrastructure with encryption at rest and in transit." },
    { q: "Can I delete my account?", a: "Yes. Contact support to request account deletion. Your personal data will be removed per our privacy policy." },
  ]},
];

export default function FAQPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-text">Frequently Asked Questions</h1>
          <p className="mt-2 text-text-secondary">Find answers to common questions about TalkIndia.</p>

          <div className="mt-10 space-y-8">
            {faqs.map((section) => (
              <div key={section.category}>
                <h2 className="text-lg font-semibold text-text">{section.category}</h2>
                <div className="mt-3 space-y-3">
                  {section.items.map((item) => (
                    <details key={item.q} className="group rounded-xl border border-border bg-white">
                      <summary className="cursor-pointer px-5 py-4 text-sm font-medium text-text hover:text-primary">
                        {item.q}
                      </summary>
                      <p className="px-5 pb-4 text-sm leading-relaxed text-text-secondary">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
