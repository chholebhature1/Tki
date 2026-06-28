import { cn } from "@/lib/utils";
import type { TimeSlot } from "../types";

interface StepTimeSelectionProps {
  slots: TimeSlot[];
  selected: string | null;
  onSelect: (time: string) => void;
}

export function StepTimeSelection({ slots, selected, onSelect }: StepTimeSelectionProps) {
  const morning = slots.filter((s) => s.period === "morning");
  const afternoon = slots.filter((s) => s.period === "afternoon");
  const evening = slots.filter((s) => s.period === "evening");

  const sections = [
    { label: "Morning", slots: morning },
    { label: "Afternoon", slots: afternoon },
    { label: "Evening", slots: evening },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-text">Select a Time</h2>
      <p className="mt-1 text-sm text-text-secondary">Pick an available slot that works for you.</p>

      <div className="mt-6 space-y-5">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="mb-2 text-xs font-semibold uppercase text-muted">{section.label}</p>
            <div className="flex flex-wrap gap-2">
              {section.slots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => onSelect(slot.time)}
                  aria-label={`${slot.time}${!slot.available ? " (unavailable)" : ""}`}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                    !slot.available && "cursor-not-allowed border border-border text-muted opacity-40 line-through",
                    slot.available && selected !== slot.time && "border border-border text-text hover:border-primary/30",
                    selected === slot.time && "border-2 border-primary bg-primary-light text-primary"
                  )}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
