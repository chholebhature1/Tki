import Link from "next/link";
import { ShieldCheck, Heart, Users, Video } from "lucide-react";
import { Container } from "@/components/layout";

export const metadata = {
  title: "About Us",
  description: "TalkIndia is India's trusted mental healthcare marketplace connecting patients with verified therapists for secure online consultations.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-surface py-16 sm:py-20">
        <Container className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">About TalkIndia</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">
            We&apos;re building India&apos;s most trusted platform for mental healthcare — making it simple to find verified therapists and attend secure consultations from home.
          </p>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-white p-8">
              <h2 className="text-xl font-bold text-text">Our Mission</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                To make quality mental healthcare accessible to every Indian by connecting them with licensed, verified professionals through a seamless digital platform.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-8">
              <h2 className="text-xl font-bold text-text">Our Vision</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                To become India&apos;s most trusted mental healthcare marketplace — where finding the right therapist is as simple as booking a consultation in minutes.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="bg-surface py-16">
        <Container>
          <h2 className="text-2xl font-bold text-text">Our Values</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, title: "Trust", description: "Every therapist is verified before accepting patients." },
              { icon: Heart, title: "Compassion", description: "We design every interaction with empathy and care." },
              { icon: Users, title: "Accessibility", description: "Quality mental healthcare for everyone, regardless of location." },
              { icon: Video, title: "Privacy", description: "End-to-end encrypted consultations. Your sessions are yours." },
            ].map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-white p-6">
                <v.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="mt-3 text-base font-semibold text-text">{v.title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{v.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16">
        <Container className="text-center">
          <h2 className="text-2xl font-bold text-text">Ready to take the first step?</h2>
          <p className="mt-2 text-text-secondary">Find a verified therapist and book your consultation today.</p>
          <Link href="/find-therapists" className="mt-6 inline-block rounded-xl bg-primary px-8 py-3.5 text-sm font-medium text-white hover:bg-primary-hover">
            Find a Therapist
          </Link>
        </Container>
      </section>
    </>
  );
}
