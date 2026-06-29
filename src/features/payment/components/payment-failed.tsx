import { XCircle } from "lucide-react";

interface PaymentFailedProps {
  onRetry: () => void;
  onChangeMethod: () => void;
  errorMessage?: string;
}

export function PaymentFailed({ onRetry, onChangeMethod, errorMessage }: PaymentFailedProps) {
  return (
    <div className="mx-auto max-w-md text-center">
      {/* Error icon */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
        <XCircle className="h-8 w-8 text-danger" aria-hidden="true" />
      </div>

      <h1 className="mt-6 text-2xl font-bold text-text">Payment Failed</h1>
      <p className="mt-2 text-sm text-text-secondary">
        {errorMessage || "We couldn\u0027t process your payment. Your appointment has not been confirmed and no amount has been charged."}
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="w-full rounded-xl bg-primary py-3.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Retry Payment
        </button>
        <button
          type="button"
          onClick={onChangeMethod}
          className="w-full rounded-xl border border-border py-3.5 text-center text-sm font-medium text-text transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Choose Another Method
        </button>
        <a
          href="/contact"
          className="w-full rounded-xl border border-border py-3.5 text-center text-sm font-medium text-text-secondary transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Contact Support
        </a>
      </div>

      <p className="mt-6 text-xs text-muted">
        If you continue experiencing issues, please contact us at support@talkindia.in
      </p>
    </div>
  );
}
