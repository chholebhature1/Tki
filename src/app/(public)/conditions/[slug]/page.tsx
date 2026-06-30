import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout";

const conditionData: Record<string, { title: string; overview: string; symptoms: string[]; causes: string[]; treatment: string[] }> = {
  anxiety: {
    title: "Anxiety",
    overview: "Anxiety disorders are the most common mental health conditions in India, affecting over 45 million people. While everyone experiences worry, clinical anxiety involves persistent, excessive fear that interferes with daily functioning.",
    symptoms: ["Excessive worry about everyday matters", "Restlessness or feeling on edge", "Difficulty concentrating", "Sleep disturbances", "Muscle tension and fatigue", "Panic attacks (racing heart, shortness of breath)", "Avoidance of social situations"],
    causes: ["Genetic predisposition", "Stressful life events", "Trauma history", "Work or academic pressure", "Health concerns", "Substance use", "Imbalanced brain chemistry"],
    treatment: ["Cognitive Behavioral Therapy (CBT)", "Mindfulness-based approaches", "Exposure therapy", "Medication (SSRIs, SNRIs)", "Relaxation techniques", "Lifestyle changes (exercise, sleep hygiene)"],
  },
  depression: {
    title: "Depression",
    overview: "Depression is more than feeling sad. It's a clinical condition that affects how you think, feel, and function. It's highly treatable, with most people experiencing significant improvement with proper support.",
    symptoms: ["Persistent sadness or empty feeling", "Loss of interest in activities", "Changes in appetite or weight", "Sleep problems", "Fatigue and low energy", "Feelings of worthlessness or guilt", "Difficulty concentrating", "Thoughts of self-harm"],
    causes: ["Brain chemistry imbalances", "Genetic factors", "Traumatic experiences", "Chronic stress", "Major life changes", "Social isolation", "Medical conditions"],
    treatment: ["Psychotherapy (CBT, interpersonal therapy)", "Antidepressant medication", "Behavioral activation", "Mindfulness meditation", "Regular exercise", "Support groups", "Combined therapy + medication"],
  },
  stress: {
    title: "Stress & Burnout",
    overview: "Chronic stress and burnout have become epidemic in modern workplaces. Unlike normal stress that resolves, burnout is a state of complete physical and emotional exhaustion that requires intentional recovery.",
    symptoms: ["Constant exhaustion despite rest", "Cynicism about work", "Reduced professional efficacy", "Physical symptoms (headaches, digestive issues)", "Emotional numbness", "Withdrawal from responsibilities", "Difficulty disconnecting from work"],
    causes: ["Excessive workload", "Lack of control", "Insufficient recognition", "Poor work-life balance", "Unclear expectations", "Dysfunctional workplace dynamics", "Perfectionism"],
    treatment: ["Boundary setting skills", "Stress management techniques", "Career counseling", "Mindfulness practices", "Time management strategies", "Workplace intervention", "Cognitive restructuring"],
  },
  relationships: {
    title: "Relationship Issues",
    overview: "Healthy relationships require ongoing effort. When communication breaks down, trust is damaged, or partners grow apart, professional support can help rebuild connection and understanding.",
    symptoms: ["Frequent arguments or silence", "Loss of emotional connection", "Trust issues", "Communication breakdown", "Resentment buildup", "Decreased intimacy", "Considering separation"],
    causes: ["Poor communication patterns", "Unresolved conflicts", "Life transitions (parenthood, relocation)", "Infidelity", "Different values or goals", "External stressors", "Attachment style differences"],
    treatment: ["Couples therapy", "Gottman Method", "Emotionally Focused Therapy (EFT)", "Communication skills training", "Individual therapy", "Conflict resolution strategies", "Pre-marital counseling"],
  },
  family: {
    title: "Family Conflicts",
    overview: "Family dynamics shape our mental health from childhood through adulthood. When conflicts arise, professional guidance can help families communicate, set boundaries, and heal together.",
    symptoms: ["Frequent family arguments", "Estrangement from family members", "Boundary violations", "Parenting disagreements", "Intergenerational conflicts", "Sibling rivalry in adulthood", "Caregiver burnout"],
    causes: ["Communication styles", "Unresolved childhood issues", "Cultural expectations", "Financial pressures", "Life transitions", "Mental health conditions in family", "Substance use in family"],
    treatment: ["Family therapy", "Structural family therapy", "Boundary setting", "Parent coaching", "Mediation", "Individual therapy", "Psychoeducation"],
  },
  "child-teen": {
    title: "Child & Teen Mental Health",
    overview: "Children and teenagers face unique mental health challenges. Early intervention is crucial — most adult mental health conditions have roots in childhood or adolescence.",
    symptoms: ["Academic decline", "Social withdrawal", "Behavioral changes", "Mood swings", "Sleep problems", "Self-harm", "Substance experimentation", "Excessive screen time"],
    causes: ["Academic pressure", "Bullying (online and offline)", "Family instability", "Social media impact", "Identity development", "Peer pressure", "Trauma or abuse"],
    treatment: ["Play therapy (younger children)", "CBT for teens", "Family-based interventions", "School counseling", "Art/music therapy", "Social skills training", "Parent-child interaction therapy"],
  },
};

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const condition = conditionData[slug];
  if (!condition) return { title: "Condition Not Found" };
  return { title: `${condition.title} — Mental Health`, description: condition.overview };
}

export default async function ConditionPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const condition = conditionData[slug];
  if (!condition) notFound();

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Link href="/conditions" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-hover"><ArrowLeft className="h-3.5 w-3.5" /> All Conditions</Link>
          <h1 className="mt-6 text-3xl font-bold text-text">{condition.title}</h1>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">{condition.overview}</p>

          <div className="mt-10 space-y-8">
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="text-lg font-semibold text-text">Common Symptoms</h2>
              <ul className="mt-3 space-y-2">{condition.symptoms.map((s) => <li key={s} className="flex items-start gap-2 text-sm text-text-secondary"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />{s}</li>)}</ul>
            </div>
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="text-lg font-semibold text-text">Possible Causes</h2>
              <ul className="mt-3 space-y-2">{condition.causes.map((c) => <li key={c} className="flex items-start gap-2 text-sm text-text-secondary"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-info" aria-hidden="true" />{c}</li>)}</ul>
            </div>
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="text-lg font-semibold text-text">Treatment Options</h2>
              <ul className="mt-3 space-y-2">{condition.treatment.map((t) => <li key={t} className="flex items-start gap-2 text-sm text-text-secondary"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" />{t}</li>)}</ul>
            </div>
          </div>

          <div className="mt-10 rounded-2xl bg-primary-light p-6 text-center">
            <p className="font-semibold text-text">Ready to get support?</p>
            <p className="mt-1 text-sm text-text-secondary">Our therapists specialize in {condition.title.toLowerCase()}.</p>
            <Link href={`/find-therapists?specialization=${slug}`} className="mt-4 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover">Find a Specialist</Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
