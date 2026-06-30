import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/layout";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with TalkIndia support. We're here to help with appointments, payments, and platform questions.",
};

export default function ContactPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div>
            <h1 className="text-3xl font-bold text-text">Get in Touch</h1>
            <p className="mt-2 text-text-secondary">Have a question? We&apos;d love to hear from you.</p>

            <form className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-sm font-medium text-text">Name</label>
                  <input id="name" type="text" placeholder="Your name" className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-text">Email</label>
                  <input id="email" type="email" placeholder="you@example.com" className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-sm font-medium text-text">Subject</label>
                <input id="subject" type="text" placeholder="How can we help?" className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="message" className="text-sm font-medium text-text">Message</label>
                <textarea id="message" rows={5} placeholder="Your message..." className="w-full resize-none rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <button type="button" className="rounded-xl bg-primary px-8 py-3 text-sm font-medium text-white hover:bg-primary-hover">Send Message</button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-6 lg:pl-8">
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="text-lg font-semibold text-text">Contact Information</h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div><p className="text-sm font-medium text-text">Email</p><p className="text-sm text-text-secondary">support@talkindia.in</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div><p className="text-sm font-medium text-text">Phone</p><p className="text-sm text-text-secondary">+91 98765 43210</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div><p className="text-sm font-medium text-text">Office</p><p className="text-sm text-text-secondary">Mumbai, Maharashtra, India</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div><p className="text-sm font-medium text-text">Hours</p><p className="text-sm text-text-secondary">Mon–Sat: 9:00 AM – 6:00 PM IST</p></div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
              <p className="text-xs font-medium text-danger">Emergency Disclaimer</p>
              <p className="mt-1 text-xs text-text-secondary">
                TalkIndia is not an emergency service. If you are in crisis, please contact AASRA (9820466726) or Vandrevala Foundation (1860 2662 345).
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
