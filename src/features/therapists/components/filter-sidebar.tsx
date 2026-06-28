import { filterOptions } from "../constants";

interface FilterGroupProps {
  title: string;
  options: readonly string[];
}

function FilterGroup({ title, options }: FilterGroupProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-text">{title}</h3>
      <div className="space-y-1.5">
        {options.slice(0, 6).map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-text"
          >
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
              readOnly
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}

export function FilterSidebar() {
  return (
    <aside className="space-y-6" aria-label="Filters">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-text">Filters</h2>
        <button
          type="button"
          className="text-sm text-primary transition-colors hover:text-primary-hover"
        >
          Clear all
        </button>
      </div>

      <FilterGroup title="Specialization" options={filterOptions.specializations} />
      <FilterGroup title="Language" options={filterOptions.languages} />
      <FilterGroup title="Consultation Mode" options={filterOptions.consultationMode} />
      <FilterGroup title="Experience" options={filterOptions.experience} />
      <FilterGroup title="Gender" options={filterOptions.gender} />
      <FilterGroup title="Session Fee" options={filterOptions.fee} />
      <FilterGroup title="Rating" options={filterOptions.rating} />
      <FilterGroup title="Availability" options={filterOptions.availability} />
    </aside>
  );
}
