import { Calendar, Clock, Video, ShieldCheck } from "lucide-react";
import type { PaymentSummary } from "../types";

interface OrderSummaryProps {
  summary: PaymentSummary;
}

export function OrderSummary({ summary }: OrderSummaryProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6">
      <h3 className="text-sm font-semibold text-text">Order Summary</h3>

      {/* Therapist */}
      <div className="mt-4 border-b border-border pb-4">
        <p className="text-sm font-medium text-text">{summary.therapistName}</p>
        <p className="text-xs text-text-secondary">{summary.therapistQualification}</p>
      </div>

      {/* Details */}
      <div className="mt-4 space-y-2.5">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Calendar className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {summary.date}
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {summary.time} · {summary.duration} min
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Video className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {summary.consultationType}
        </div>
      </div>

      {/* Fee */}
      <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-text-secondary">Session fee</span>
          <span className="text-text">₹{summary.sessionFee.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Platform fee</span>
          <span className="font-medium text-primary">Free</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2 font-semibold">
          <span className="text-text">Total</span>
          <span className="text-text">₹{summary.total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Trust */}
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-surface p-3">
        <ShieldCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <p className="text-xs text-text-secondary">
          Secured by Razorpay. Your payment information is encrypted.
        </p>
      </div>
    </div>
  );
}
