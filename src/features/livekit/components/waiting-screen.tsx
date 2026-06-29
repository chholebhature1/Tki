import { Clock } from "lucide-react";

interface WaitingScreenProps {
  therapistName: string;
  scheduledTime: string;
}

export function WaitingScreen({ therapistName, scheduledTime }: WaitingScreenProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
        <Clock className="h-7 w-7 text-primary" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-text">Waiting for {therapistName}</h2>
      <p className="mt-2 text-sm text-text-secondary">
        Your session is scheduled for {scheduledTime}. Please stay on this page.
      </p>
    </div>
  );
}
