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
        width={iconOnly ? 32 : 140}
        height={iconOnly ? 32 : 40}
        className={cn(
          "object-contain",
          iconOnly ? "h-8 w-8" : "h-9 w-auto sm:h-10"
        )}
        priority
      />
    </Link>
  );
}
