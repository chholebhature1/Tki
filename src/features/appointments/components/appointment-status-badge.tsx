import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  payment_pending: { label: "Payment Pending", className: "bg-warning/10 text-warning" },
  confirmed: { label: "Confirmed", className: "bg-primary/10 text-primary" },
  cancelled: { label: "Cancelled", className: "bg-danger/10 text-danger" },
  completed: { label: "Completed", className: "bg-success/10 text-success" },
  rescheduled: { label: "Rescheduled", className: "bg-info/10 text-info" },
  no_show: { label: "No Show", className: "bg-danger/10 text-danger" },
  refunded: { label: "Refunded", className: "bg-muted/10 text-muted" },
};

interface AppointmentStatusBadgeProps {
  status: string;
  className?: string;
}

export function AppointmentStatusBadge({ status, className }: AppointmentStatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-surface text-muted" };

  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", config.className, className)}>
      {config.label}
    </span>
  );
}
