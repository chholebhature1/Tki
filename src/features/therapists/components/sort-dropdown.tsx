import type { SortOption } from "../types";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "highest-rated", label: "Highest Rated" },
  { value: "lowest-fee", label: "Lowest Fee" },
  { value: "most-experienced", label: "Most Experienced" },
  { value: "newest", label: "Newest" },
];

export function SortDropdown() {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="hidden text-sm text-text-secondary whitespace-nowrap sm:block">
        Sort by:
      </label>
      <select
        id="sort"
        aria-label="Sort therapists"
        className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        defaultValue="recommended"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
