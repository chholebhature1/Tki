"use client";

import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface SeoPanelProps {
  title: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  slug: string;
  content: string;
  ogImage: string;
}

function calculateSeoScore(props: SeoPanelProps): { score: number; checks: { label: string; pass: boolean }[] } {
  const { title, metaTitle, metaDescription, focusKeyword, content, ogImage } = props;
  const plainContent = content.replace(/<[^>]*>/g, "").toLowerCase();
  const keyword = focusKeyword.toLowerCase();

  const checks = [
    { label: "Has meta title", pass: metaTitle.length > 0 },
    { label: "Meta title ≤ 60 chars", pass: metaTitle.length > 0 && metaTitle.length <= 60 },
    { label: "Has meta description", pass: metaDescription.length > 0 },
    { label: "Meta description 120-160 chars", pass: metaDescription.length >= 120 && metaDescription.length <= 160 },
    { label: "Has focus keyword", pass: focusKeyword.length > 0 },
    { label: "Keyword in title", pass: keyword.length > 0 && title.toLowerCase().includes(keyword) },
    { label: "Keyword in content", pass: keyword.length > 0 && plainContent.includes(keyword) },
    { label: "Content > 300 words", pass: plainContent.split(/\s+/).filter(Boolean).length > 300 },
    { label: "Has heading in content", pass: content.includes("<h2") || content.includes("<h3") },
    { label: "Has OG image", pass: ogImage.length > 0 },
  ];

  const score = Math.round((checks.filter((c) => c.pass).length / checks.length) * 100);
  return { score, checks };
}

export function SeoScorePanel(props: SeoPanelProps) {
  const { score, checks } = calculateSeoScore(props);

  const color = score >= 80 ? "text-success" : score >= 50 ? "text-warning" : "text-danger";
  const bg = score >= 80 ? "bg-success/10" : score >= 50 ? "bg-warning/10" : "bg-danger/10";

  return (
    <div className="space-y-3">
      {/* Score */}
      <div className={`rounded-xl ${bg} p-3 text-center`}>
        <p className={`text-2xl font-bold ${color}`}>{score}%</p>
        <p className="text-[10px] text-text-secondary">SEO Score</p>
      </div>

      {/* Checks */}
      <div className="space-y-1.5">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-2 text-xs">
            {check.pass ? (
              <CheckCircle className="h-3.5 w-3.5 shrink-0 text-success" />
            ) : (
              <XCircle className="h-3.5 w-3.5 shrink-0 text-danger" />
            )}
            <span className={check.pass ? "text-text-secondary" : "text-text"}>{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GooglePreview({ title, slug, description }: { title: string; slug: string; description: string }) {
  const displayTitle = title || "Post Title";
  const displayUrl = `https://talkindia.in/blog/${slug || "post-slug"}`;
  const displayDesc = description || "Add a meta description to see how your post appears in search results.";

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Google Preview</p>
      <div className="mt-2 space-y-0.5">
        <p className="truncate text-sm font-medium text-[#1a0dab]">{displayTitle.slice(0, 60)}</p>
        <p className="truncate text-xs text-[#006621]">{displayUrl}</p>
        <p className="line-clamp-2 text-xs text-[#545454]">{displayDesc.slice(0, 160)}</p>
      </div>
    </div>
  );
}

export function CharCounter({ value, max, label }: { value: number; max: number; label: string }) {
  const color = value === 0 ? "text-muted" : value <= max ? "text-success" : "text-danger";
  return (
    <span className={`text-[10px] ${color}`}>{value}/{max} {label}</span>
  );
}
