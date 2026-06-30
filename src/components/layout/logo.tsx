import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Show only the icon (no text) — useful for tight spaces */
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex shrink-0 items-center",
        className
      )}
      aria-label="TalkIndia — Home"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/IMAGES/LOGO.png"
        alt="TalkIndia"
        className={cn(
          "object-contain",
          iconOnly ? "h-24 w-24" : "h-[120px] w-auto"
        )}
      />
    </Link>
  );
}
