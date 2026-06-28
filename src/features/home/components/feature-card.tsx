import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary/30 hover:shadow-sm",
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light transition-colors group-hover:bg-primary/15">
        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-text">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        {description}
      </p>
    </div>
  );
}
