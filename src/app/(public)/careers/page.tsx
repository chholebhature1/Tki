import Link from "next/link";
import { Container } from "@/components/layout";
import { Heart, Code, PenTool, Users, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Careers",
  description: "Join TalkIndia and help make mental healthcare accessible to everyone in India.",
};

const openings = [
  {
    title: "Therapist Onboarding Specialist",
    type: "Full-time",
    location: "Remote",
    icon: Users,
    description: "Help verify and onboard licensed mental health professionals onto the TalkIndia platform. Build relationships with therapists and ensure quality standards.",
  },
  {
    title: "Content Writer — Mental Health",
    type: "Part-time / Freelance",
    location: "Remote",
    icon: PenTool,
    description: "Create evidence-based articles, guides, and resources about mental health conditions, coping strategies, and wellness tips.",
  },
  {
    title: "Full-Stack Engineering Intern",
    type: "Internship",
    location: "Remote",
    icon: Code,
    description: "Work with Next.js, Supabase, and TypeScript to build features that help patients connect with therapists seamlessly.",
  },
];

export default function CareersPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        {/* Hero */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-1.5 text-xs font-medium text-primary">
            <Heart className="h-3.5 w-3.5" aria-hidden="true" /> We&apos;re Hiring
          </div>
          <h1 className="mt-4 text-3xl font-bold text-text sm:text-4xl">
            Build the Future of Mental Healthcare
          </h1>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            TalkIndia is on a mission to make quality mental healthcare accessible to every Indian. 
            Join us and help break the stigma, one consultation at a time.
          </p>
        </div>

        {/* Values */}
        <div className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-3">
          {[
            { label: "Impact-Driven", desc: "Every feature you build helps someone get the help they need" },
            { label: "Remote-First", desc: "Work from anywhere in India with flexible hours" },
            { label: "Growth-Focused", desc: "Learn, build, and grow alongside a passionate team" },
          ].map((v) => (
            <div key={v.label} className="rounded-2xl border border-border bg-white p-5 text-center">
              <p className="text-sm font-semibold text-text">{v.label}</p>
              <p className="mt-1 text-xs text-text-secondary">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Open Roles */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-xl font-bold text-text">Open Positions</h2>
          <div className="mt-6 space-y-4">
            {openings.map((role) => (
              <div key={role.title} className="rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary/30 hover:shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light">
                    <role.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-text">{role.title}</h3>
                      <span className="rounded-full bg-surface px-2.5 py-0.5 text-[10px] font-medium text-text-secondary">{role.type}</span>
                      <span className="rounded-full bg-surface px-2.5 py-0.5 text-[10px] font-medium text-text-secondary">{role.location}</span>
                    </div>
                    <p className="mt-2 text-sm text-text-secondary">{role.description}</p>
                    <a
                      href="mailto:careers@talkindia.in"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover"
                    >
                      Apply Now <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mx-auto mt-16 max-w-lg rounded-2xl border border-primary/20 bg-primary-light p-8 text-center">
          <h3 className="text-lg font-bold text-text">Don&apos;t see your role?</h3>
          <p className="mt-2 text-sm text-text-secondary">
            We&apos;re always looking for passionate people. Send us your resume and tell us how you want to contribute.
          </p>
          <a
            href="mailto:careers@talkindia.in"
            className="mt-4 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Send Your Resume
          </a>
        </div>

        {/* Therapist callout */}
        <div className="mx-auto mt-10 max-w-lg text-center">
          <p className="text-sm text-text-secondary">
            Are you a licensed therapist?{" "}
            <Link href="/register" className="font-medium text-primary hover:text-primary-hover">
              Join as a Therapist →
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
