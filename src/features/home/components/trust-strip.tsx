import { ShieldCheck, Lock, EyeOff, CalendarClock } from "lucide-react";

const highlights = [
  { icon: ShieldCheck, label: "Verified Therapists" },
  { icon: Lock, label: "Secure Payments" },
  { icon: EyeOff, label: "Confidential Consultations" },
  { icon: CalendarClock, label: "Online & Flexible Scheduling" },
] as const;

export function TrustStrip() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
      {highlights.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-4 shadow-xs sm:px-5"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light">
            <item.icon className="h-4 w-4 text-primary" aria-hidden="true" />
          </div>
          <span className="text-sm font-medium leading-tight text-text">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
