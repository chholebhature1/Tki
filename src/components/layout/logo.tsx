import Link from "next/link";
import { siteConfig } from "@/constants/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 font-semibold tracking-tight text-text",
        className
      )}
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
        T
      </span>
      {siteConfig.name}
    </Link>
  );
}
