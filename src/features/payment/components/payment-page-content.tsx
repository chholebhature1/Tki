"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { PaymentMethod, PaymentStatus, PaymentSummary } from "../types";
import { mockPaymentSummary } from "../constants";
import { confirmPaymentAction, markPaymentFailedAction } from "../actions";
import { PaymentMethodSelector } from "./payment-method-selector";
import { OrderSummary } from "./order-summary";
import { PaymentProcessing } from "./payment-processing";
import { PaymentSuccess } from "./payment-success";
import { PaymentFailed } from "./payment-failed";

interface PaymentPageContentProps {
  appointmentInfo?: PaymentSummary;
  appointmentId?: string;
}

export function PaymentPageContent({ appointmentInfo, appointmentId }: PaymentPageContentProps) {
  const summary = appointmentInfo || mockPaymentSummary;
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [error, setError] = useState("");

  const processPayment = useCallback(async () => {
    setStatus("processing");
    setError("");

    // Simulated payment (instant for demo — no real gateway configured)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Confirm the appointment in the database
    if (appointmentId) {
      const result = await confirmPaymentAction(appointmentId);
      if (!result.success) {
        setError(result.error || "Payment confirmation failed.");
        setStatus("failed");
        await markPaymentFailedAction(appointmentId);
        return;
      }
    }

    setStatus("success");
  }, [appointmentId]);

  const handleRetry = useCallback(() => {
    processPayment();
  }, [processPayment]);

  const resetToIdle = useCallback(() => {
    setStatus("idle");
    setError("");
  }, []);

  // Processing state
  if (status === "processing") {
    return (
      <div className="py-12">
        <PaymentProcessing />
      </div>
    );
  }

  // Success state
  if (status === "success") {
    return (
      <div className="py-12">
        <PaymentSuccess
          summary={summary}
          onViewAppointment={
            appointmentId
              ? () => router.push(`/appointments/${appointmentId}`)
              : undefined
          }
        />
      </div>
    );
  }

  // Failed state
  if (status === "failed") {
    return (
      <div className="py-12">
        <PaymentFailed
          onRetry={handleRetry}
          onChangeMethod={resetToIdle}
          errorMessage={error}
        />
      </div>
    );
  }

  // Default: payment selection
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <PaymentMethodSelector selected={method} onSelect={setMethod} />

        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-medium text-text">Cancellation Policy</p>
          <p className="mt-1 text-xs text-text-secondary">
            Free cancellation up to 24 hours before the session. After that, the booking is non-refundable.
          </p>
        </div>

        <button
          type="button"
          onClick={processPayment}
          className="w-full rounded-xl bg-primary py-3.5 text-base font-medium text-white transition-all hover:bg-primary-hover hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Pay ₹{summary.total.toLocaleString("en-IN")}
        </button>
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-20">
          <OrderSummary summary={summary} />
        </div>
      </div>

      <div className="lg:hidden">
        <OrderSummary summary={summary} />
      </div>
    </div>
  );
}
