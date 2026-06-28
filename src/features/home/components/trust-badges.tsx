import { ShieldCheck, Lock, EyeOff } from "lucide-react";

const badges = [
  {
    icon: ShieldCheck,
    label: "Verified Therapists",
  },
  {
    icon: Lock,
    label: "Secure Payments",
  },
  {
    icon: EyeOff,
    label: "Private Sessions",
  },
] as const;

export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="flex items-center gap-2 text-sm text-text-secondary"
        >
          <badge.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
