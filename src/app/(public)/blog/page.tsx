import Link from "next/link";
import { Container } from "@/components/layout";
import { BlogRepository } from "@/features/blog";
import { Calendar, Clock, User } from "lucide-react";

export const metadata = {
  title: "Blog",
  description: "Mental health insights, therapy guides, and wellness tips from certified professionals.",
};

export default async function BlogPage(props: { searchParams: Promise<{ category?: string; page?: string }> }) {
  const searchParams = await props.searchParams;
  const categorySlug = searchParams.category;
  const page = Number(searchParams.page) || 1;

  const { posts, total } = await BlogRepository.getPublishedPosts(page, 12, categorySlug);
  const categories = await BlogRepository.getCategories();
  const totalPages = Math.ceil(total / 12);

  return (
    <section className="py-12 sm:py-16">
      <Container>
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-text sm:text-4xl">Blog</h1>
          <p className="mt-3 text-base text-text-secondary">
            Evidence-based mental health insights from certified professionals.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Link href="/blog" className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${!categorySlug ? "bg-primary text-white" : "border border-border text-text-secondary hover:border-primary hover:text-primary"}`}>
            All
          </Link>
          {categories.map((cat) => (
            <Link key={cat.id} href={`/blog?category=${cat.slug}`} className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${categorySlug === cat.slug ? "bg-primary text-white" : "border border-border text-text-secondary hover:border-primary hover:text-primary"}`}>
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const wordCount = (post.content || "").replace(/<[^>]*>/g, "").split(/\s+/).length;
              const readTime = Math.max(1, Math.ceil(wordCount / 200));

              return (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group rounded-2xl border border-border bg-white overflow-hidden transition-all hover:border-primary/30 hover:shadow-sm">
                  {post.cover_image_url && (
                    <div className="aspect-video overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                    </div>
                  )}
                  <div className="p-5">
                    {post.category_name && (
                      <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-[10px] font-medium text-primary">{post.category_name}</span>
                    )}
                    <h2 className="mt-2 text-base font-semibold text-text line-clamp-2 group-hover:text-primary">{post.title}</h2>
                    {post.excerpt && <p className="mt-2 text-sm text-text-secondary line-clamp-2">{post.excerpt}</p>}
                    <div className="mt-4 flex items-center gap-3 text-xs text-muted">
                      {post.author_name && <span className="flex items-center gap-1"><User className="h-3 w-3" />{post.author_name}</span>}
                      {post.published_at && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>}
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{readTime} min</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 text-center">
            <p className="text-text-secondary">No posts published yet. Check back soon!</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <Link key={i} href={`/blog?page=${i + 1}${categorySlug ? `&category=${categorySlug}` : ""}`}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${page === i + 1 ? "bg-primary text-white" : "border border-border text-text-secondary hover:border-primary"}`}
              >{i + 1}</Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
