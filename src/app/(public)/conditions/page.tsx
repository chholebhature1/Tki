import Link from "next/link";
import { Brain, CloudRain, Flame, Heart, Users, Baby } from "lucide-react";
import { Container } from "@/components/layout";

export const metadata = {
  title: "Mental Health Conditions",
  description: "Learn about common mental health conditions. Understand symptoms, causes, and how therapy can help.",
};

const conditions = [
  { slug: "anxiety", icon: Brain, title: "Anxiety", description: "Persistent worry, panic attacks, and social anxiety. Learn what causes it and how therapy helps." },
  { slug: "depression", icon: CloudRain, title: "Depression", description: "Low mood, loss of motivation, and emotional fatigue. Understand treatment options available." },
  { slug: "stress", icon: Flame, title: "Stress & Burnout", description: "Work pressure, overwhelm, and chronic exhaustion. Find strategies for recovery." },
  { slug: "relationships", icon: Heart, title: "Relationship Issues", description: "Communication problems, trust, and intimacy challenges. How couples therapy works." },
  { slug: "family", icon: Users, title: "Family Conflicts", description: "Parenting challenges, sibling dynamics, and intergenerational patterns." },
  { slug: "child-teen", icon: Baby, title: "Child & Teen Mental Health", description: "Academic pressure, bullying, developmental concerns, and adolescent challenges." },
];

export default function ConditionsPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text">Mental Health Conditions</h1>
          <p className="mx-auto mt-2 max-w-2xl text-text-secondary">Understanding what you&apos;re experiencing is the first step toward feeling better.</p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {conditions.map((c) => (
            <Link key={c.slug} href={`/conditions/${c.slug}`} className="group rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary/30 hover:shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light transition-colors group-hover:bg-primary/15">
                <c.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-text">{c.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{c.description}</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
