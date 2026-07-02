import { notFound } from "next/navigation";
import { BlogRepository } from "@/features/blog";
import { PostEditor } from "@/features/blog/components";

export const metadata = { title: "Edit Post — Admin" };

export default async function AdminEditPostPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const post = await BlogRepository.getPostById(id);
  if (!post) notFound();

  const categories = await BlogRepository.getCategories();
  const tags = await BlogRepository.getTags();

  const editorPost = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || "",
    content: post.content,
    cover_image_url: post.cover_image_url || "",
    category_id: post.category_id || "",
    meta_title: post.meta_title || "",
    meta_description: post.meta_description || "",
    focus_keyword: post.focus_keyword || "",
    secondary_keywords: post.secondary_keywords || [],
    canonical_url: post.canonical_url || "",
    robots: post.robots,
    seo_notes: post.seo_notes || "",
    og_title: post.og_title || "",
    og_description: post.og_description || "",
    og_image_url: post.og_image_url || "",
    status: post.status,
    featured: post.featured,
    scheduled_at: post.scheduled_at || "",
    reviewer_profile_id: post.reviewer_profile_id || "",
    reviewed_date: post.reviewed_date || "",
    search_keywords: post.search_keywords || [],
    tag_ids: post.tags?.map((t) => t.id) || [],
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h1 className="text-2xl font-bold text-text">Edit Post</h1>
      <PostEditor post={editorPost} categories={categories} tags={tags} />
    </div>
  );
}
