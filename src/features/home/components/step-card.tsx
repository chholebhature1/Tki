import type { LucideIcon } from "lucide-react";

interface StepCardProps {
  icon: LucideIcon;
  step: number;
  title: string;
  description: string;
}

export function StepCard({ icon: Icon, step, title, description }: StepCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Step number + icon */}
      <div className="relative">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light">
          <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
          {step}
        </span>
      </div>

      {/* Content */}
      <h3 className="mt-4 text-base font-semibold text-text">{title}</h3>
      <p className="mt-2 max-w-[220px] text-sm leading-relaxed text-text-secondary">
        {description}
      </p>
    </div>
  );
}
