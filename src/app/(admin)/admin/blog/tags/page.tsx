"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { createTagAction, deleteTagAction } from "@/features/blog";

export default function AdminTagsPage() {
  const router = useRouter();
  const [tags, setTags] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/blog/tags").then((r) => r.json()).then(setTags).catch(() => {});
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !slug) return;
    setLoading(true);
    const result = await createTagAction(name, slug);
    if (result.success) {
      setName(""); setSlug("");
      setTags((prev) => [...prev, { id: result.id!, name, slug }]);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this tag?")) return;
    await deleteTagAction(id);
    setTags((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-text">Blog Tags</h1>

      <form onSubmit={handleCreate} className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs font-medium text-text-secondary">Name</label>
          <input type="text" value={name} onChange={(e) => { setName(e.target.value); setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")); }} placeholder="Tag name" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div className="w-32">
          <label className="text-xs font-medium text-text-secondary">Slug</label>
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        <button type="submit" disabled={loading} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50">
          <Plus className="h-4 w-4" />
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5">
            <span className="text-sm text-text">{tag.name}</span>
            <button type="button" onClick={() => handleDelete(tag.id)} className="rounded-full p-0.5 text-muted hover:text-danger">
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
        {tags.length === 0 && <p className="text-sm text-text-secondary">No tags yet.</p>}
      </div>
    </div>
  );
}
