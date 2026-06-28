export function PaymentProcessing() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-3 border-primary/20 border-t-primary" />
      <h2 className="mt-6 text-lg font-semibold text-text">Processing Payment</h2>
      <p className="mt-2 text-sm text-text-secondary">
        Please wait while we confirm your payment. Do not close this page.
      </p>
    </div>
  );
}
