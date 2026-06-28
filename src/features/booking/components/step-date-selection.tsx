import { cn } from "@/lib/utils";
import type { BookingDate } from "../types";

interface StepDateSelectionProps {
  dates: BookingDate[];
  selected: string | null;
  onSelect: (date: string) => void;
}

export function StepDateSelection({ dates, selected, onSelect }: StepDateSelectionProps) {
  // Derive month/year from first date for context
  const firstDate = new Date(dates[0].date);
  const lastDate = new Date(dates[dates.length - 1].date);
  const monthLabel =
    firstDate.getMonth() === lastDate.getMonth()
      ? firstDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })
      : `${firstDate.toLocaleDateString("en-IN", { month: "short" })} – ${lastDate.toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`;

  return (
    <div>
      <h2 className="text-lg font-semibold text-text">Select a Date</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Choose a day for your appointment.
        <span className="ml-2 font-medium text-text">{monthLabel}</span>
      </p>

      <div className="mt-6 grid grid-cols-5 gap-2 sm:grid-cols-7">
        {dates.map((d) => (
          <button
            key={d.date}
            type="button"
            disabled={!d.available}
            onClick={() => onSelect(d.date)}
            aria-label={`${d.dayName} ${d.dayNumber} ${d.available ? "" : "(unavailable)"}`}
            className={cn(
              "flex flex-col items-center rounded-xl py-3 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
              !d.available && "cursor-not-allowed opacity-35",
              d.available && selected !== d.date && "border border-border hover:border-primary/30",
              selected === d.date && "border-2 border-primary bg-primary-light"
            )}
          >
            <span className="text-[10px] font-medium uppercase text-muted">{d.dayName}</span>
            <span className={cn(
              "mt-0.5 text-base font-semibold",
              selected === d.date ? "text-primary" : "text-text"
            )}>
              {d.dayNumber}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
