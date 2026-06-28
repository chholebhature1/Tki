import { Search } from "lucide-react";

export function SearchHeader() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
          Find a Therapist
        </h1>
        <p className="mt-2 text-base text-text-secondary">
          Browse verified mental health professionals and find the right match for you.
        </p>
      </div>
      <div className="relative max-w-xl">
        <Search
          className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search by name, specialization, or condition..."
          className="w-full rounded-xl border border-border bg-white py-3 pl-11 pr-4 text-sm text-text placeholder:text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="Search therapists"
        />
      </div>
    </div>
  );
}
