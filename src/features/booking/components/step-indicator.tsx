import { cn } from "@/lib/utils";

const steps = ["Type", "Date", "Time", "Details", "Review"];

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Booking progress" className="mb-8 overflow-x-auto">
      <ol className="flex items-center gap-1 sm:gap-2 min-w-max">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                  i + 1 < currentStep && "bg-primary text-white",
                  i + 1 === currentStep && "bg-primary text-white",
                  i + 1 > currentStep && "border border-border bg-surface text-muted"
                )}
                aria-current={i + 1 === currentStep ? "step" : undefined}
              >
                {i + 1 < currentStep ? "✓" : i + 1}
              </span>
              <span className={cn(
                "hidden text-xs font-medium sm:block",
                i + 1 <= currentStep ? "text-text" : "text-muted"
              )}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                "h-px w-3 sm:w-6",
                i + 1 < currentStep ? "bg-primary" : "bg-border"
              )} aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
