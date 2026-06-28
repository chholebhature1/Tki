import { Video, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConsultationType } from "../types";

interface StepConsultationTypeProps {
  selected: ConsultationType | null;
  onSelect: (type: ConsultationType) => void;
}

const options: { type: ConsultationType; icon: typeof Video; label: string; description: string }[] = [
  {
    type: "video",
    icon: Video,
    label: "Video Consultation",
    description: "Face-to-face session through secure video call",
  },
  {
    type: "audio",
    icon: Phone,
    label: "Audio Consultation",
    description: "Voice-only session for a more comfortable experience",
  },
];

export function StepConsultationType({ selected, onSelect }: StepConsultationTypeProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-text">Choose Consultation Type</h2>
      <p className="mt-1 text-sm text-text-secondary">How would you like to connect with your therapist?</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((opt) => (
          <button
            key={opt.type}
            type="button"
            onClick={() => onSelect(opt.type)}
            className={cn(
              "flex items-start gap-4 rounded-2xl border p-5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              selected === opt.type
                ? "border-primary bg-primary-light"
                : "border-border bg-white hover:border-primary/30"
            )}
          >
            <div className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              selected === opt.type ? "bg-primary/20" : "bg-surface"
            )}>
              <opt.icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">{opt.label}</p>
              <p className="mt-0.5 text-xs text-text-secondary">{opt.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
