import { Clock, Video, RefreshCcw, XCircle } from "lucide-react";

interface ProfileConsultationInfoProps {
  sessionDuration: number;
  consultationMode: string;
  responseTime: string;
  cancellationPolicy: string;
}

export function ProfileConsultationInfo({
  sessionDuration,
  consultationMode,
  responseTime,
  cancellationPolicy,
}: ProfileConsultationInfoProps) {
  const items = [
    { icon: Clock, label: "Session Duration", value: `${sessionDuration} minutes` },
    { icon: Video, label: "Consultation", value: consultationMode === "both" ? "Online & In-Person" : consultationMode === "online" ? "Online" : "In-Person" },
    { icon: RefreshCcw, label: "Response Time", value: responseTime },
    { icon: XCircle, label: "Cancellation", value: cancellationPolicy },
  ];

  return (
    <section>
      <h2 className="text-lg font-semibold text-text">Consultation Details</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-start gap-3 rounded-xl border border-border p-4">
            <item.icon className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-xs text-muted">{item.label}</p>
              <p className="text-sm font-medium text-text">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
