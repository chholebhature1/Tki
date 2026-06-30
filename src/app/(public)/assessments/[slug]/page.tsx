"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout";
import { ArrowLeft, CheckCircle } from "lucide-react";

const assessmentData: Record<string, { title: string; questions: { text: string; options: string[] }[] }> = {
  anxiety: {
    title: "Anxiety Assessment (GAD-7)",
    questions: [
      { text: "Feeling nervous, anxious, or on edge", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
      { text: "Not being able to stop or control worrying", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
      { text: "Worrying too much about different things", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
      { text: "Trouble relaxing", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
      { text: "Being so restless that it is hard to sit still", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
      { text: "Becoming easily annoyed or irritable", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
      { text: "Feeling afraid, as if something awful might happen", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
    ],
  },
  depression: {
    title: "Depression Screening (PHQ-9)",
    questions: [
      { text: "Little interest or pleasure in doing things", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
      { text: "Feeling down, depressed, or hopeless", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
      { text: "Trouble falling or staying asleep, or sleeping too much", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
      { text: "Feeling tired or having little energy", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
      { text: "Poor appetite or overeating", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
      { text: "Feeling bad about yourself", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
      { text: "Trouble concentrating on things", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
      { text: "Moving or speaking slowly, or being fidgety", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
      { text: "Thoughts that you would be better off dead", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
    ],
  },
  stress: {
    title: "Stress Level Check",
    questions: [
      { text: "How often have you felt overwhelmed by your responsibilities?", options: ["Never", "Rarely", "Sometimes", "Often"] },
      { text: "How often do you have trouble sleeping due to worry?", options: ["Never", "Rarely", "Sometimes", "Often"] },
      { text: "How often do you feel unable to cope with things?", options: ["Never", "Rarely", "Sometimes", "Often"] },
      { text: "How often do you experience physical tension (headaches, muscle pain)?", options: ["Never", "Rarely", "Sometimes", "Often"] },
      { text: "How often do you feel irritable or angry without clear reason?", options: ["Never", "Rarely", "Sometimes", "Often"] },
      { text: "How often do you find it hard to concentrate?", options: ["Never", "Rarely", "Sometimes", "Often"] },
      { text: "How often do you feel exhausted even after rest?", options: ["Never", "Rarely", "Sometimes", "Often"] },
    ],
  },
};

export default function AssessmentPage({ params }: { params: { slug: string } }) {
  const assessment = assessmentData[params.slug];
  const [answers, setAnswers] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);

  if (!assessment) return <div className="py-20 text-center text-text-secondary">Assessment not found.</div>;

  const score = answers.reduce((sum, a) => sum + a, 0);
  const maxScore = assessment.questions.length * 3;
  const percentage = Math.round((score / maxScore) * 100);

  function getResult() {
    if (percentage <= 25) return { level: "Minimal", color: "text-success", message: "Your responses suggest minimal symptoms. Continue maintaining your wellbeing." };
    if (percentage <= 50) return { level: "Mild", color: "text-info", message: "Your responses suggest mild symptoms. Consider speaking with a professional if these persist." };
    if (percentage <= 75) return { level: "Moderate", color: "text-warning", message: "Your responses suggest moderate symptoms. We recommend consulting a mental health professional." };
    return { level: "Severe", color: "text-danger", message: "Your responses suggest significant symptoms. Please reach out to a qualified therapist for support." };
  }

  if (completed) {
    const result = getResult();
    return (
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-lg text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-2xl font-bold text-text">Assessment Complete</h1>
            <div className="mt-6 rounded-2xl border border-border bg-white p-6">
              <p className="text-sm text-muted">Your score</p>
              <p className="mt-1 text-3xl font-bold text-text">{score} / {maxScore}</p>
              <p className={`mt-2 text-lg font-semibold ${result.color}`}>{result.level}</p>
              <p className="mt-3 text-sm text-text-secondary">{result.message}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/find-therapists" className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover">Find a Therapist</Link>
              <Link href="/assessments" className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-text hover:bg-surface">Take Another Assessment</Link>
            </div>
            <p className="mt-6 text-xs text-muted">This is a screening tool, not a diagnosis. Please consult a professional for proper evaluation.</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16">
      <Container>
        <div className="mx-auto max-w-2xl">
          <Link href="/assessments" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-hover">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-text">{assessment.title}</h1>
          <p className="mt-2 text-sm text-text-secondary">Over the last 2 weeks, how often have you been bothered by the following?</p>

          <div className="mt-8 space-y-6">
            {assessment.questions.map((q, qi) => (
              <div key={qi} className="rounded-xl border border-border bg-white p-5">
                <p className="text-sm font-medium text-text">{qi + 1}. {q.text}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, oi) => (
                    <button key={oi} type="button" onClick={() => { const newAnswers = [...answers]; newAnswers[qi] = oi; setAnswers(newAnswers); }}
                      className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${answers[qi] === oi ? "border-primary bg-primary-light text-primary font-medium" : "border-border text-text-secondary hover:border-primary/30"}`}
                    >{opt}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button type="button" onClick={() => setCompleted(true)} disabled={answers.length < assessment.questions.length || answers.includes(undefined as unknown as number)}
            className="mt-8 w-full rounded-xl bg-primary py-3.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            View Results
          </button>
        </div>
      </Container>
    </section>
  );
}
