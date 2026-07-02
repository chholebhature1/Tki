"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Eye, Send, Copy, Clock } from "lucide-react";
import { TiptapEditor } from "./tiptap-editor";
import { SeoScorePanel, GooglePreview, CharCounter } from "./seo-panel";
import { createPostAction, updatePostAction, publishPostAction } from "../actions";

interface PostEditorProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    cover_image_url: string;
    category_id: string;
    meta_title: string;
    meta_description: string;
    focus_keyword: string;
    secondary_keywords: string[];
    canonical_url: string;
    robots: string;
    seo_notes: string;
    og_title: string;
    og_description: string;
    og_image_url: string;
    status: string;
    featured: boolean;
    scheduled_at: string;
    reviewer_profile_id: string;
    reviewed_date: string;
    search_keywords: string[];
    tag_ids: string[];
  };
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function PostEditor({ post, categories, tags }: PostEditorProps) {
  const router = useRouter();
  const isEdit = !!post;
  const [activeTab, setActiveTab] = useState("content");
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Form state
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [slugManual, setSlugManual] = useState(false);
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [coverImage, setCoverImage] = useState(post?.cover_image_url || "");
  const [categoryId, setCategoryId] = useState(post?.category_id || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(post?.tag_ids || []);
  const [metaTitle, setMetaTitle] = useState(post?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(post?.meta_description || "");
  const [focusKeyword, setFocusKeyword] = useState(post?.focus_keyword || "");
  const [canonicalUrl, setCanonicalUrl] = useState(post?.canonical_url || "");
  const [robots, setRobots] = useState(post?.robots || "index_follow");
  const [seoNotes, setSeoNotes] = useState(post?.seo_notes || "");
  const [ogTitle, setOgTitle] = useState(post?.og_title || "");
  const [ogDescription, setOgDescription] = useState(post?.og_description || "");
  const [ogImage, setOgImage] = useState(post?.og_image_url || "");
  const [status, setStatus] = useState(post?.status || "draft");
  const [featured, setFeatured] = useState(post?.featured || false);
  const [scheduledAt, setScheduledAt] = useState(post?.scheduled_at || "");
  const [reviewerProfileId, setReviewerProfileId] = useState(post?.reviewer_profile_id || "");
  const [reviewedDate, setReviewedDate] = useState(post?.reviewed_date || "");

  // Auto slug from title
  useEffect(() => {
    if (!slugManual && !isEdit) {
      setSlug(slugify(title));
    }
  }, [title, slugManual, isEdit]);

  // Word count & reading time
  const plainText = content.replace(/<[^>]*>/g, "");
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  const headingCount = (content.match(/<h[1-6]/g) || []).length;
  const imageCount = (content.match(/<img/g) || []).length;
  const linkCount = (content.match(/<a /g) || []).length;

  const buildFormData = useCallback(() => ({
    title, slug, excerpt, content, cover_image_url: coverImage || undefined,
    category_id: categoryId || undefined, meta_title: metaTitle || undefined,
    meta_description: metaDescription || undefined, focus_keyword: focusKeyword || undefined,
    secondary_keywords: [] as string[], canonical_url: canonicalUrl || undefined,
    robots, seo_notes: seoNotes || undefined, og_title: ogTitle || undefined,
    og_description: ogDescription || undefined, og_image_url: ogImage || undefined,
    status, featured, scheduled_at: scheduledAt || undefined,
    reviewer_profile_id: reviewerProfileId || undefined,
    reviewed_date: reviewedDate || undefined, search_keywords: [] as string[],
    tag_ids: selectedTags,
  }), [title, slug, excerpt, content, coverImage, categoryId, metaTitle, metaDescription, focusKeyword, canonicalUrl, robots, seoNotes, ogTitle, ogDescription, ogImage, status, featured, scheduledAt, reviewerProfileId, reviewedDate, selectedTags]);

  // Auto-save every 30s
  useEffect(() => {
    if (!isEdit || !title || !content) return;
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(async () => {
      await updatePostAction(post!.id, buildFormData());
      setLastSaved(new Date());
    }, 30000);
    return () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); };
  }, [title, content, isEdit, post, buildFormData]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "P") {
        e.preventDefault();
        handlePublish();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  async function handleSave() {
    if (!title || !content) { setMessage({ type: "error", text: "Title and content are required." }); return; }
    setSaving(true); setMessage(null);

    const data = buildFormData();
    const result = isEdit
      ? await updatePostAction(post!.id, data)
      : await createPostAction(data);

    if (result.success) {
      setLastSaved(new Date());
      setMessage({ type: "success", text: "Saved!" });
      if (!isEdit && result.id) router.push(`/admin/blog/${result.id}/edit`);
    } else {
      setMessage({ type: "error", text: result.error || "Failed to save." });
    }
    setSaving(false);
  }

  async function handlePublish() {
    if (!isEdit) { await handleSave(); return; }
    const result = await publishPostAction(post!.id);
    if (result.success) {
      setStatus("published");
      setMessage({ type: "success", text: "Published!" });
      router.refresh();
    } else {
      setMessage({ type: "error", text: result.error || "Failed to publish." });
    }
  }

  function copyUrl() {
    navigator.clipboard.writeText(`${window.location.origin}/blog/${slug}`);
    setMessage({ type: "success", text: "URL copied!" });
  }

  const tabs = [
    { id: "content", label: "Content" },
    { id: "seo", label: "SEO" },
    { id: "social", label: "Social" },
    { id: "medical", label: "Medical" },
    { id: "publish", label: "Publish" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
      {/* Main Editor */}
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-1 rounded-xl border border-border bg-white p-1">
          {tabs.map((tab) => (
            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${activeTab === tab.id ? "bg-primary text-white" : "text-text-secondary hover:bg-surface"}`}
            >{tab.label}</button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="rounded-2xl border border-border bg-white p-5">
          {activeTab === "content" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text">Title *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" className="mt-1 w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Slug</label>
                <div className="mt-1 flex gap-2">
                  <input type="text" value={slug} onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }} className="flex-1 rounded-xl border border-border px-4 py-2 text-xs text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                  <button type="button" onClick={copyUrl} className="rounded-lg border border-border px-2 py-1 text-xs text-text-secondary hover:bg-surface" title="Copy URL"><Copy className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-text">Category</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none">
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-text">Tags</label>
                  <div className="mt-1 flex flex-wrap gap-1.5 rounded-xl border border-border p-2 min-h-[40px]">
                    {tags.map((t) => (
                      <button key={t.id} type="button" onClick={() => setSelectedTags((prev) => prev.includes(t.id) ? prev.filter((x) => x !== t.id) : [...prev, t.id])}
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors ${selectedTags.includes(t.id) ? "bg-primary text-white" : "bg-surface text-text-secondary hover:bg-primary/10"}`}
                      >{t.name}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-text">Cover Image URL</label>
                <input type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." className="mt-1 w-full rounded-xl border border-border px-4 py-2 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                {coverImage && <div className="mt-2 h-32 rounded-lg overflow-hidden border border-border"><img src={coverImage} alt="" className="h-full w-full object-cover" /></div>}
              </div>
              <div>
                <label className="text-sm font-medium text-text">Content *</label>
                <div className="mt-1">
                  <TiptapEditor content={content} onChange={setContent} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-text">Excerpt</label>
                <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} placeholder="Brief summary for listings..." className="mt-1 w-full resize-none rounded-xl border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between"><label className="text-sm font-medium text-text">Meta Title</label><CharCounter value={metaTitle.length} max={60} label="" /></div>
                <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder={title || "SEO title"} className="mt-1 w-full rounded-xl border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <div className="flex items-center justify-between"><label className="text-sm font-medium text-text">Meta Description</label><CharCounter value={metaDescription.length} max={160} label="" /></div>
                <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} placeholder="Describe this post for search engines..." className="mt-1 w-full resize-none rounded-xl border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Focus Keyword</label>
                <input type="text" value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} placeholder="Primary keyword" className="mt-1 w-full rounded-xl border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Canonical URL</label>
                <input type="url" value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} placeholder="https://..." className="mt-1 w-full rounded-xl border border-border px-4 py-2 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Robots</label>
                <select value={robots} onChange={(e) => setRobots(e.target.value)} className="mt-1 w-full rounded-xl border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none">
                  <option value="index_follow">Index, Follow</option>
                  <option value="index_nofollow">Index, NoFollow</option>
                  <option value="noindex_follow">NoIndex, Follow</option>
                  <option value="noindex_nofollow">NoIndex, NoFollow</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-text">SEO Notes</label>
                <textarea value={seoNotes} onChange={(e) => setSeoNotes(e.target.value)} rows={2} placeholder="Internal notes for SEO team..." className="mt-1 w-full resize-none rounded-xl border border-border px-4 py-2 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <GooglePreview title={metaTitle || title} slug={slug} description={metaDescription || excerpt} />
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text">OG Title</label>
                <input type="text" value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} placeholder={metaTitle || title || "OG Title"} className="mt-1 w-full rounded-xl border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-sm font-medium text-text">OG Description</label>
                <textarea value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} rows={2} placeholder={metaDescription || excerpt || "Social description"} className="mt-1 w-full resize-none rounded-xl border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-sm font-medium text-text">OG Image URL</label>
                <input type="url" value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder={coverImage || "https://..."} className="mt-1 w-full rounded-xl border border-border px-4 py-2 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                {(ogImage || coverImage) && <div className="mt-2 h-32 rounded-lg overflow-hidden border border-border"><img src={ogImage || coverImage} alt="" className="h-full w-full object-cover" /></div>}
              </div>
            </div>
          )}

          {activeTab === "medical" && (
            <div className="space-y-4">
              <p className="text-xs text-text-secondary">Medical trust signals improve E-E-A-T for healthcare content.</p>
              <div>
                <label className="text-sm font-medium text-text">Medical Reviewer (Profile ID)</label>
                <input type="text" value={reviewerProfileId} onChange={(e) => setReviewerProfileId(e.target.value)} placeholder="Reviewer profile ID" className="mt-1 w-full rounded-xl border border-border px-4 py-2 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Reviewed Date</label>
                <input type="date" value={reviewedDate} onChange={(e) => setReviewedDate(e.target.value)} className="mt-1 w-full rounded-xl border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
          )}

          {activeTab === "publish" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full rounded-xl border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none">
                  <option value="draft">Draft</option>
                  <option value="in_review">In Review</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              {status === "scheduled" && (
                <div>
                  <label className="text-sm font-medium text-text">Schedule Date</label>
                  <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="mt-1 w-full rounded-xl border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              )}
              <div className="flex items-center gap-3">
                <input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                <label htmlFor="featured" className="text-sm font-medium text-text">Featured Post</label>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {message && <div className={`rounded-lg px-3 py-2 text-xs ${message.type === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>{message.text}</div>}
        <div className="flex items-center gap-3">
          <button type="button" onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50">
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save"}
          </button>
          {isEdit && (
            <button type="button" onClick={handlePublish} className="inline-flex items-center gap-2 rounded-xl border border-primary px-5 py-2.5 text-sm font-medium text-primary hover:bg-primary/5">
              <Send className="h-4 w-4" /> Publish
            </button>
          )}
          {isEdit && slug && (
            <Link href={`/blog/${slug}`} target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface">
              <Eye className="h-4 w-4" /> Preview
            </Link>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-4">
        <SeoScorePanel title={title} metaTitle={metaTitle} metaDescription={metaDescription} focusKeyword={focusKeyword} slug={slug} content={content} ogImage={ogImage || coverImage} />

        <div className="rounded-xl border border-border bg-white p-4 space-y-2">
          <p className="text-xs font-semibold text-text">Stats</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-muted">Words</span><p className="font-semibold text-text">{wordCount.toLocaleString()}</p></div>
            <div><span className="text-muted">Read Time</span><p className="font-semibold text-text">{readTime} min</p></div>
            <div><span className="text-muted">Headings</span><p className="font-semibold text-text">{headingCount}</p></div>
            <div><span className="text-muted">Images</span><p className="font-semibold text-text">{imageCount}</p></div>
            <div><span className="text-muted">Links</span><p className="font-semibold text-text">{linkCount}</p></div>
            <div><span className="text-muted">Status</span><p className="font-semibold text-text capitalize">{status}</p></div>
          </div>
        </div>

        {lastSaved && (
          <div className="flex items-center gap-1.5 text-[10px] text-muted">
            <Clock className="h-3 w-3" /> Last saved {lastSaved.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
      </div>
    </div>
  );
}
