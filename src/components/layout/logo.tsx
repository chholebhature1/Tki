import Link from "next/link";
import Image from "next/image";
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
      <Image
        src="/IMAGES/LOGO.png"
        alt="TalkIndia"
        width={iconOnly ? 96 : 420}
        height={iconOnly ? 96 : 120}
        className={cn(
          "object-contain",
          iconOnly ? "h-24 w-24" : "h-12 w-auto"
        )}
        priority
      />
    </Link>
  );
}
