import type { AvailabilitySlot } from "../../types";

interface ProfileAvailabilityProps {
  availability: AvailabilitySlot[];
}

export function ProfileAvailability({ availability }: ProfileAvailabilityProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-text">Weekly Availability</h2>
      <div className="mt-3 space-y-2">
        {availability.map((day) => (
          <div
            key={day.day}
            className="flex items-start gap-4 rounded-xl border border-border px-4 py-3"
          >
            <span className="w-24 shrink-0 text-sm font-medium text-text">
              {day.day}
            </span>
            {day.slots.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {day.slots.map((slot) => (
                  <span
                    key={slot}
                    className="rounded-md bg-primary-light px-2.5 py-1 text-xs font-medium text-primary"
                  >
                    {slot}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-muted">Unavailable</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
