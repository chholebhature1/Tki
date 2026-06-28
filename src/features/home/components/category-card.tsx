import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  className?: string;
}

export function CategoryCard({
  icon: Icon,
  title,
  description,
  href,
  className,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary/30 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light transition-colors group-hover:bg-primary/15">
        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>

      <h3 className="mt-4 text-base font-semibold text-text">{title}</h3>

      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-text-secondary">
        {description}
      </p>

      <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
        <span>Explore Therapists</span>
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </div>
    </Link>
  );
}
