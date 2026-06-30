import Link from "next/link";
import { ClipboardCheck, Brain, Heart, Flame } from "lucide-react";
import { Container } from "@/components/layout";

export const metadata = {
  title: "Mental Health Assessments",
  description: "Take free, evidence-based mental health screenings. Understand your anxiety, depression, and stress levels.",
};

const assessments = [
  { slug: "anxiety", icon: Brain, title: "Anxiety Assessment (GAD-7)", description: "A 7-question screening tool for generalized anxiety disorder. Takes 2 minutes.", questions: 7, time: "2 min" },
  { slug: "depression", icon: Heart, title: "Depression Screening (PHQ-9)", description: "A 9-question tool used worldwide to screen for depression severity. Takes 3 minutes.", questions: 9, time: "3 min" },
  { slug: "stress", icon: Flame, title: "Stress Level Check", description: "Understand your current stress levels and whether professional support could help. Takes 2 minutes.", questions: 7, time: "2 min" },
];

export default function AssessmentsPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <ClipboardCheck className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
            <h1 className="mt-4 text-3xl font-bold text-text">Mental Health Assessments</h1>
            <p className="mt-2 text-text-secondary">Free, confidential, evidence-based screenings to help you understand your mental health.</p>
          </div>

          <div className="mt-10 space-y-4">
            {assessments.map((a) => (
              <Link key={a.slug} href={`/assessments/${a.slug}`} className="flex items-start gap-4 rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary/30 hover:shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light">
                  <a.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-semibold text-text">{a.title}</h2>
                  <p className="mt-1 text-sm text-text-secondary">{a.description}</p>
                  <div className="mt-2 flex gap-3 text-xs text-muted">
                    <span>{a.questions} questions</span>
                    <span>{a.time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-surface p-6 text-center">
            <p className="text-xs text-text-secondary">These assessments are screening tools, not diagnostic instruments. For a proper evaluation, please consult a qualified mental health professional.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
