import { AlertCircle } from "lucide-react";

interface ErrorScreenProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorScreen({ title = "Connection Failed", message = "Unable to join the session.", onRetry }: ErrorScreenProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/10">
        <AlertCircle className="h-7 w-7 text-danger" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-text">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-text-secondary">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover">
          Try Again
        </button>
      )}
    </div>
  );
}
