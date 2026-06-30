"use client";

import { useState } from "react";
import { Clock, Shield, MessageCircle } from "lucide-react";

const QUERY_TYPES = [
  "Help choosing a therapist",
  "How therapy works on TalkIndia",
  "Billing & payments",
  "Technical issue",
  "Partnership inquiry",
  "Other",
];

export function QuerySection() {
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", queryType: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="bg-white py-16 sm:py-20" id="contact-form">
        <div className="mx-auto max-w-lg px-4 text-center">
          <div className="rounded-2xl border border-primary/20 bg-primary-light p-8">
            <MessageCircle className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
            <h3 className="mt-4 text-xl font-bold text-text">Query Submitted!</h3>
            <p className="mt-2 text-sm text-text-secondary">
              Thank you for reaching out. Our team will get back to you within 24 hours.
            </p>
            <button
              type="button"
              onClick={() => { setSubmitted(false); setFormData({ fullName: "", email: "", phone: "", queryType: "", message: "" }); }}
              className="mt-5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface"
            >
              Submit Another Query
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 sm:py-20" id="contact-form">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* Left — Info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[2px] text-primary">Get in Touch</p>
            <h2 className="mt-2 text-2xl font-bold text-text sm:text-3xl">
              Not Sure Where to Start?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-text-secondary">
              Whether you&apos;re exploring therapy for the first time or need help navigating our platform, 
              our team is here to guide you. No question is too small.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light">
                  <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">Quick Response</p>
                  <p className="text-xs text-text-secondary">We respond within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light">
                  <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">100% Confidential</p>
                  <p className="text-xs text-text-secondary">Your information is never shared</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light">
                  <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">No Commitment</p>
                  <p className="text-xs text-text-secondary">Just ask — no booking required</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="qf-name" className="block text-sm font-medium text-text">Full Name <span className="text-danger">*</span></label>
                <input
                  id="qf-name"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Your name"
                  className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="qf-email" className="block text-sm font-medium text-text">Email <span className="text-danger">*</span></label>
                <input
                  id="qf-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="qf-phone" className="block text-sm font-medium text-text">Phone <span className="text-muted">(optional)</span></label>
                <input
                  id="qf-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="qf-type" className="block text-sm font-medium text-text">Query Type <span className="text-danger">*</span></label>
                <select
                  id="qf-type"
                  required
                  value={formData.queryType}
                  onChange={(e) => setFormData({ ...formData, queryType: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select a topic</option>
                  {QUERY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="qf-message" className="block text-sm font-medium text-text">Message <span className="text-danger">*</span></label>
              <textarea
                id="qf-message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us how we can help..."
                className="mt-1.5 w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {error && <p className="mt-3 text-sm text-danger">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-xl bg-primary py-3.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Send Your Query"}
            </button>

            <p className="mt-3 text-center text-[11px] text-muted">
              By submitting, you agree to our Privacy Policy. We&apos;ll only use your information to respond to your query.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
