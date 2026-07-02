import Link from "next/link";
import { Plus, FileText, Pencil, Copy, Trash2 } from "lucide-react";
import { BlogRepository } from "@/features/blog";

export const metadata = { title: "Blog — Admin" };

export default async function AdminBlogPage(props: { searchParams: Promise<{ status?: string; page?: string }> }) {
  const searchParams = await props.searchParams;
  const status = searchParams.status || "all";
  const page = Number(searchParams.page) || 1;

  const { posts, total } = await BlogRepository.listPosts({ status: status === "all" ? undefined : status, page, perPage: 20 });
  const categories = await BlogRepository.getCategories();

  const statuses = [
    { id: "all", label: "All" },
    { id: "draft", label: "Drafts" },
    { id: "published", label: "Published" },
    { id: "scheduled", label: "Scheduled" },
    { id: "archived", label: "Archived" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Blog Posts</h1>
          <p className="mt-1 text-sm text-text-secondary">{total} total posts</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> New Post
        </Link>
      </div>

      {/* Status Filter */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-white p-1">
        {statuses.map((s) => (
          <Link
            key={s.id}
            href={`/admin/blog?status=${s.id}`}
            className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-center text-sm font-medium transition-colors ${
              status === s.id ? "bg-primary text-white" : "text-text-secondary hover:bg-surface hover:text-text"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {/* Posts Table */}
      {posts.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface">
              <tr>
                <th className="px-4 py-3 font-medium text-text-secondary">Title</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Status</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Category</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Date</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-surface/50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/blog/${post.id}/edit`} className="font-medium text-text hover:text-primary">
                      {post.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted">/blog/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      post.status === "published" ? "bg-success/10 text-success" :
                      post.status === "draft" ? "bg-surface text-muted" :
                      post.status === "scheduled" ? "bg-info/10 text-info" :
                      "bg-warning/10 text-warning"
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{post.category_name || "—"}</td>
                  <td className="px-4 py-3 text-xs text-text-secondary">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      : new Date(post.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Link href={`/admin/blog/${post.id}/edit`} className="rounded p-1.5 text-text-secondary hover:bg-surface hover:text-primary" title="Edit">
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <Link href={`/blog/${post.slug}`} className="rounded p-1.5 text-text-secondary hover:bg-surface hover:text-primary" title="View" target="_blank">
                        <FileText className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-muted" aria-hidden="true" />
          <h2 className="mt-4 text-base font-semibold text-text">No posts yet</h2>
          <p className="mt-1 text-sm text-text-secondary">Create your first blog post to get started.</p>
          <Link href="/admin/blog/new" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
            Create Post
          </Link>
        </div>
      )}
    </div>
  );
}
