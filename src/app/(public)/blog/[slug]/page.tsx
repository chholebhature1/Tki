import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout";

const articles: Record<string, { title: string; category: string; date: string; readTime: string; content: string[] }> = {
  "understanding-anxiety": {
    title: "Understanding Anxiety: Signs, Causes, and What You Can Do",
    category: "Mental Health", date: "June 25, 2026", readTime: "5 min read",
    content: [
      "Anxiety is one of the most common mental health conditions affecting millions of Indians. While occasional worry is normal, persistent anxiety that interferes with daily life may require professional support.",
      "Common signs include excessive worry, restlessness, difficulty concentrating, sleep disturbances, muscle tension, and avoidance of social situations. Physical symptoms like rapid heartbeat, sweating, and shortness of breath are also common.",
      "Anxiety can be triggered by work pressure, financial stress, relationship difficulties, health concerns, or life transitions. It often has both genetic and environmental components.",
      "Evidence-based treatments include Cognitive Behavioral Therapy (CBT), mindfulness-based approaches, and in some cases, medication prescribed by a psychiatrist. The first step is speaking with a qualified mental health professional.",
      "If you're experiencing persistent anxiety, consider booking a consultation with one of our verified therapists. Early intervention leads to better outcomes.",
    ],
  },
  "therapy-first-session": {
    title: "What to Expect in Your First Therapy Session",
    category: "Getting Started", date: "June 20, 2026", readTime: "4 min read",
    content: [
      "Your first therapy session is primarily about getting to know your therapist and establishing a comfortable rapport. There's no pressure to share everything at once.",
      "Typically, your therapist will ask about what brought you to therapy, your general background, and what you hope to achieve. They may also explain their therapeutic approach and answer your questions.",
      "It's completely normal to feel nervous. Most therapists are trained to create a safe, non-judgmental space from the very first meeting.",
      "Before your session, it helps to think about what you'd like to discuss and any specific goals you have. But don't worry if you're not sure yet — that's what therapy helps you figure out.",
      "After the first session, you'll have a better sense of whether the therapist is a good fit. If not, it's perfectly acceptable to try someone else.",
    ],
  },
  "work-stress-burnout": {
    title: "Work Stress vs Burnout: How to Tell the Difference",
    category: "Workplace Wellness", date: "June 15, 2026", readTime: "6 min read",
    content: [
      "Work stress is a temporary response to demanding situations — tight deadlines, difficult projects, or challenging colleagues. It typically resolves when the stressor is removed.",
      "Burnout, on the other hand, is a state of chronic physical and emotional exhaustion. It develops gradually and is characterized by feelings of cynicism, detachment, and a sense that your work no longer matters.",
      "Key differences: Stress involves too much engagement, while burnout involves disengagement. Stress produces urgency and hyperactivity; burnout produces helplessness and hopelessness.",
      "Warning signs of burnout include dreading Monday mornings, feeling emotionally numb about work, declining performance despite effort, physical exhaustion, and withdrawal from colleagues.",
      "If you recognize burnout symptoms, speaking with a therapist who specializes in workplace wellness can help you develop boundaries, reassess priorities, and recover before it affects other areas of your life.",
    ],
  },
  "online-therapy-benefits": {
    title: "5 Benefits of Online Therapy You Might Not Know About",
    category: "Digital Health", date: "June 10, 2026", readTime: "3 min read",
    content: [
      "1. Accessibility: Online therapy removes geographic barriers. You can connect with specialized therapists regardless of where you live in India.",
      "2. Comfort: Many people find it easier to open up from the safety and privacy of their own home. This can lead to more productive sessions.",
      "3. Flexibility: Online sessions can often be scheduled outside traditional office hours, making it easier to fit therapy into a busy life.",
      "4. Reduced stigma: For those worried about being seen entering a therapist's office, online therapy provides complete discretion.",
      "5. Consistency: Travel issues, weather, or minor illness don't have to interrupt your therapeutic progress. You can attend sessions from anywhere with an internet connection.",
    ],
  },
};

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const article = articles[slug];
  if (!article) return { title: "Article Not Found" };
  return { title: article.title, description: article.content[0] };
}

export default async function BlogArticlePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const article = articles[slug];
  if (!article) notFound();

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <article className="mx-auto max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-hover">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
          </Link>

          <div className="mt-6 flex items-center gap-3 text-xs text-muted">
            <span className="rounded-full bg-primary-light px-2.5 py-0.5 font-medium text-primary">{article.category}</span>
            <span>{article.date}</span>
            <span>{article.readTime}</span>
          </div>

          <h1 className="mt-4 text-2xl font-bold text-text sm:text-3xl">{article.title}</h1>

          <div className="mt-8 space-y-4">
            {article.content.map((paragraph, i) => (
              <p key={i} className="text-sm leading-relaxed text-text-secondary">{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-primary-light p-6 text-center">
            <p className="text-base font-semibold text-text">Ready to talk to someone?</p>
            <p className="mt-1 text-sm text-text-secondary">Find a verified therapist and book your first session.</p>
            <Link href="/find-therapists" className="mt-4 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover">
              Find a Therapist
            </Link>
          </div>
        </article>
      </Container>
    </section>
  );
}
