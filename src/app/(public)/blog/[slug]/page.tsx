import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/layout";
import { BlogRepository } from "@/features/blog";
import { ArrowLeft, Calendar, Clock, User, Share2, Printer } from "lucide-react";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await BlogRepository.getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt || "";

  return {
    title,
    description,
    openGraph: {
      title: post.og_title || title,
      description: post.og_description || description,
      images: post.og_image_url || post.cover_image_url ? [{ url: (post.og_image_url || post.cover_image_url)! }] : undefined,
      type: "article",
      publishedTime: post.published_at || undefined,
    },
    robots: post.robots.replace("_", ", "),
    alternates: post.canonical_url ? { canonical: post.canonical_url } : undefined,
  };
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = await BlogRepository.getPostBySlug(slug);
  if (!post) notFound();

  const wordCount = post.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Generate TOC from headings
  const headingRegex = /<h([23])[^>]*>(.*?)<\/h[23]>/g;
  const toc: { level: number; text: string; id: string }[] = [];
  let match;
  let contentWithIds = post.content;
  while ((match = headingRegex.exec(post.content)) !== null) {
    const id = match[2].replace(/<[^>]*>/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    toc.push({ level: Number(match[1]), text: match[2].replace(/<[^>]*>/g, ""), id });
    contentWithIds = contentWithIds.replace(match[0], `<h${match[1]} id="${id}">${match[2]}</h${match[1]}>`);
  }

  // JSON-LD Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.meta_description || post.excerpt,
    image: post.cover_image_url,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: post.author_name || "TalkIndia" },
    publisher: { "@type": "Organization", name: "TalkIndia", logo: { "@type": "ImageObject", url: "https://tki-c62m.vercel.app/IMAGES/LOGO.png" } },
    ...(post.reviewer_profile_id && { reviewedBy: { "@type": "Person", name: "Medical Reviewer" } }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <article className="py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs text-muted" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-primary">Blog</Link>
              {post.category_name && <><span>/</span><Link href={`/blog?category=${post.category_slug}`} className="hover:text-primary">{post.category_name}</Link></>}
            </nav>

            {/* Header */}
            <header className="mt-6">
              {post.category_name && (
                <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">{post.category_name}</span>
              )}
              <h1 className="mt-3 text-3xl font-bold leading-tight text-text sm:text-4xl">{post.title}</h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                {post.author_name && <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{post.author_name}</span>}
                {post.published_at && <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>}
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{readTime} min read</span>
              </div>
            </header>

            {/* Cover Image */}
            {post.cover_image_url && (
              <div className="mt-6 aspect-video overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover" />
              </div>
            )}

            {/* TOC */}
            {toc.length > 2 && (
              <nav className="mt-8 rounded-xl border border-border bg-surface p-5" aria-label="Table of contents">
                <p className="text-sm font-semibold text-text">In this article</p>
                <ul className="mt-2 space-y-1.5">
                  {toc.map((item) => (
                    <li key={item.id} className={item.level === 3 ? "ml-4" : ""}>
                      <a href={`#${item.id}`} className="text-sm text-text-secondary hover:text-primary">{item.text}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {/* Content */}
            <div className="prose prose-green mt-8 max-w-none text-text prose-headings:text-text prose-a:text-primary prose-strong:text-text" dangerouslySetInnerHTML={{ __html: contentWithIds }} />

            {/* Sources */}
            {post.sources && post.sources.length > 0 && (
              <div className="mt-8 rounded-xl border border-border bg-surface p-5">
                <p className="text-sm font-semibold text-text">References</p>
                <ul className="mt-2 space-y-1.5">
                  {post.sources.map((s) => (
                    <li key={s.id} className="text-sm">
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{s.title}</a>
                      <span className="ml-2 text-xs text-muted">({s.type})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Medical Reviewer */}
            {post.reviewed_date && (
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary-light p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">✓</div>
                <div>
                  <p className="text-xs font-medium text-text">Medically Reviewed</p>
                  <p className="text-xs text-text-secondary">Last reviewed: {new Date(post.reviewed_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
              </div>
            )}

            {/* Share + Actions */}
            <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
              <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary">
                <ArrowLeft className="h-4 w-4" /> Back to Blog
              </Link>
              <div className="flex gap-2">
                <button type="button" onClick={() => {}} className="rounded-lg border border-border p-2 text-text-secondary hover:text-primary" aria-label="Share">
                  <Share2 className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => {}} className="rounded-lg border border-border p-2 text-text-secondary hover:text-primary" aria-label="Print">
                  <Printer className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Updated badge */}
            {post.updated_at && post.published_at && post.updated_at > post.published_at && (
              <p className="mt-4 text-xs text-muted">Last updated: {new Date(post.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            )}
          </div>
        </Container>
      </article>
    </>
  );
}
