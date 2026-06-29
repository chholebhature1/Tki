import { cn } from "@/lib/utils";

const verificationConfig: Record<string, { label: string; className: string }> = {
  approved: { label: "Approved", className: "bg-success/10 text-success" },
  rejected: { label: "Rejected", className: "bg-danger/10 text-danger" },
  pending: { label: "Pending", className: "bg-warning/10 text-warning" },
  submitted: { label: "Submitted", className: "bg-info/10 text-info" },
  draft: { label: "Draft", className: "bg-surface text-muted" },
  expired: { label: "Suspended", className: "bg-danger/10 text-danger" },
};

export function VerificationBadge({ status }: { status: string }) {
  const config = verificationConfig[status] || { label: status, className: "bg-surface text-muted" };
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", config.className)}>
      {config.label}
    </span>
  );
}
