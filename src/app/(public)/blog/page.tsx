import Link from "next/link";
import { Container } from "@/components/layout";

export const metadata = {
  title: "Blog",
  description: "Mental health articles, tips, and resources from TalkIndia's team of verified professionals.",
};

const articles = [
  {
    slug: "understanding-anxiety",
    title: "Understanding Anxiety: Signs, Causes, and What You Can Do",
    excerpt: "Anxiety is one of the most common mental health concerns in India. Learn to recognize the signs and discover evidence-based strategies for managing it.",
    category: "Mental Health",
    date: "June 25, 2026",
    readTime: "5 min read",
  },
  {
    slug: "therapy-first-session",
    title: "What to Expect in Your First Therapy Session",
    excerpt: "Feeling nervous about starting therapy? Here's everything you need to know to feel prepared and make the most of your first consultation.",
    category: "Getting Started",
    date: "June 20, 2026",
    readTime: "4 min read",
  },
  {
    slug: "work-stress-burnout",
    title: "Work Stress vs Burnout: How to Tell the Difference",
    excerpt: "Stress and burnout are not the same. Understanding the distinction can help you take the right steps before things escalate.",
    category: "Workplace Wellness",
    date: "June 15, 2026",
    readTime: "6 min read",
  },
  {
    slug: "online-therapy-benefits",
    title: "5 Benefits of Online Therapy You Might Not Know About",
    excerpt: "Online therapy has become a preferred option for millions. Here's why it might be the right choice for your mental health journey.",
    category: "Digital Health",
    date: "June 10, 2026",
    readTime: "3 min read",
  },
];

export default function BlogPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-text">Blog & Resources</h1>
          <p className="mt-2 text-text-secondary">Evidence-based mental health articles from our team.</p>

          <div className="mt-10 space-y-6">
            {articles.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="block rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary/30 hover:shadow-sm">
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-medium text-primary">{article.category}</span>
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-text">{article.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{article.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
