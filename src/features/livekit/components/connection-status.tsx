import type { ConnectionStatus as ConnectionStatusType } from "../types";
import { cn } from "@/lib/utils";

interface ConnectionStatusProps {
  status: ConnectionStatusType;
}

const statusConfig: Record<ConnectionStatusType, { label: string; color: string }> = {
  connecting: { label: "Connecting...", color: "bg-warning" },
  connected: { label: "Connected", color: "bg-success" },
  disconnected: { label: "Disconnected", color: "bg-muted" },
  reconnecting: { label: "Reconnecting...", color: "bg-warning" },
  failed: { label: "Connection Failed", color: "bg-danger" },
};

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2 text-xs text-text-secondary">
      <span className={cn("h-2 w-2 rounded-full", config.color)} aria-hidden="true" />
      {config.label}
    </div>
  );
}
