"use client";

import { useState, useCallback } from "react";
import type { PaymentMethod, PaymentStatus } from "../types";
import { mockPaymentSummary } from "../constants";
import { PaymentMethodSelector } from "./payment-method-selector";
import { OrderSummary } from "./order-summary";
import { PaymentProcessing } from "./payment-processing";
import { PaymentSuccess } from "./payment-success";
import { PaymentFailed } from "./payment-failed";

export function PaymentPageContent() {
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [status, setStatus] = useState<PaymentStatus>("idle");

  const processPayment = useCallback(() => {
    setStatus("processing");

    // Mock processing delay (2.5 seconds)
    setTimeout(() => {
      // 80% success rate for demo purposes
      const success = Math.random() > 0.2;
      setStatus(success ? "success" : "failed");
    }, 2500);
  }, []);

  const resetToIdle = useCallback(() => {
    setStatus("idle");
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
        <PaymentSuccess summary={mockPaymentSummary} />
      </div>
    );
  }

  // Failed state
  if (status === "failed") {
    return (
      <div className="py-12">
        <PaymentFailed
          onRetry={processPayment}
          onChangeMethod={resetToIdle}
        />
      </div>
    );
  }

  // Default: payment selection
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      {/* Main */}
      <div className="space-y-6">
        <PaymentMethodSelector selected={method} onSelect={setMethod} />

        {/* Cancellation policy */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-medium text-text">Cancellation Policy</p>
          <p className="mt-1 text-xs text-text-secondary">
            Free cancellation up to 24 hours before the session. After that, the booking is non-refundable.
          </p>
        </div>

        {/* Pay button */}
        <button
          type="button"
          onClick={processPayment}
          className="w-full rounded-xl bg-primary py-3.5 text-base font-medium text-white transition-all hover:bg-primary-hover hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Pay ₹{mockPaymentSummary.total.toLocaleString("en-IN")}
        </button>
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-20">
          <OrderSummary summary={mockPaymentSummary} />
        </div>
      </div>

      {/* Mobile summary */}
      <div className="lg:hidden">
        <OrderSummary summary={mockPaymentSummary} />
      </div>
    </div>
  );
}
