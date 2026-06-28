import {
  Brain,
  CloudRain,
  Flame,
  Heart,
  Users,
  Briefcase,
  Baby,
  Pill,
} from "lucide-react";
import { Container } from "@/components/layout";
import { CategoryCard } from "./category-card";

const categories = [
  {
    icon: Brain,
    title: "Anxiety",
    description: "Manage worry, panic attacks, and social anxiety with expert guidance.",
    slug: "anxiety",
  },
  {
    icon: CloudRain,
    title: "Depression",
    description: "Find support for low mood, loss of motivation, and emotional fatigue.",
    slug: "depression",
  },
  {
    icon: Flame,
    title: "Stress Management",
    description: "Learn coping strategies for work pressure, burnout, and overwhelm.",
    slug: "stress-management",
  },
  {
    icon: Heart,
    title: "Relationships",
    description: "Work through communication issues, trust, and emotional intimacy.",
    slug: "relationships",
  },
  {
    icon: Users,
    title: "Family",
    description: "Navigate family conflicts, parenting challenges, and dynamics.",
    slug: "family",
  },
  {
    icon: Briefcase,
    title: "Career",
    description: "Address workplace stress, career transitions, and professional growth.",
    slug: "career",
  },
  {
    icon: Baby,
    title: "Child & Teen",
    description: "Specialized support for young minds dealing with academic or social pressure.",
    slug: "child-teen",
  },
  {
    icon: Pill,
    title: "Addiction",
    description: "Professional help for substance use, behavioral patterns, and recovery.",
    slug: "addiction",
  },
] as const;

export function CategoriesSection() {
  return (
    <section className="bg-surface py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="max-w-md">
          <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
            What are you looking for?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Browse by category to find a therapist who specializes in what
            you&apos;re going through.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
          {categories.map((category) => (
            <CategoryCard
              key={category.slug}
              icon={category.icon}
              title={category.title}
              description={category.description}
              href={`/find-therapists?specialization=${category.slug}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
