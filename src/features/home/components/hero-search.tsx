import Link from "next/link";
import { Search } from "lucide-react";

/**
 * Presentational search bar that links to the Find Therapist page.
 * Styled as an input but acts as a navigation element.
 */
export function HeroSearch() {
  return (
    <Link
      href="/find-therapists"
      className="group relative flex w-full max-w-lg items-center rounded-xl border border-border bg-white py-3.5 pl-11 pr-4 text-sm text-muted transition-all hover:border-primary/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <Search
        className="absolute left-4 h-4 w-4 text-muted group-hover:text-primary transition-colors"
        aria-hidden="true"
      />
      <span>Search by therapist, specialization, or condition...</span>
    </Link>
  );
}
