"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { createCategoryAction, deleteCategoryAction } from "@/features/blog";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string; color: string | null }[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [color, setColor] = useState("#6FCF97");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/blog/categories").then((r) => r.json()).then(setCategories).catch(() => {});
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !slug) return;
    setLoading(true);
    const result = await createCategoryAction(name, slug, undefined, undefined, color);
    if (result.success) {
      setName(""); setSlug(""); router.refresh();
      setCategories((prev) => [...prev, { id: result.id!, name, slug, color }]);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    await deleteCategoryAction(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-text">Blog Categories</h1>

      <form onSubmit={handleCreate} className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs font-medium text-text-secondary">Name</label>
          <input type="text" value={name} onChange={(e) => { setName(e.target.value); setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")); }} placeholder="Category name" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div className="w-32">
          <label className="text-xs font-medium text-text-secondary">Slug</label>
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div className="w-16">
          <label className="text-xs font-medium text-text-secondary">Color</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="mt-1 h-9 w-full rounded border border-border" />
        </div>
        <button type="submit" disabled={loading} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50">
          <Plus className="h-4 w-4" />
        </button>
      </form>

      <div className="rounded-2xl border border-border bg-white">
        {categories.length > 0 ? (
          <div className="divide-y divide-border">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  {cat.color && <div className="h-4 w-4 rounded-full" style={{ backgroundColor: cat.color }} />}
                  <div>
                    <p className="text-sm font-medium text-text">{cat.name}</p>
                    <p className="text-xs text-muted">/{cat.slug}</p>
                  </div>
                </div>
                <button type="button" onClick={() => handleDelete(cat.id)} className="rounded p-1.5 text-muted hover:text-danger hover:bg-danger/5">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-6 text-center text-sm text-text-secondary">No categories yet.</p>
        )}
      </div>
    </div>
  );
}
