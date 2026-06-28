import { Smartphone, CreditCard, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "../types";

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

const methods: { id: PaymentMethod; icon: typeof Smartphone; label: string; description: string; recommended?: boolean }[] = [
  {
    id: "upi",
    icon: Smartphone,
    label: "UPI",
    description: "Google Pay, PhonePe, Paytm, or any UPI app",
    recommended: true,
  },
  {
    id: "card",
    icon: CreditCard,
    label: "Credit / Debit Card",
    description: "Visa, Mastercard, RuPay",
  },
  {
    id: "netbanking",
    icon: Building2,
    label: "Net Banking",
    description: "All major Indian banks supported",
  },
];

export function PaymentMethodSelector({ selected, onSelect }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-text">Payment Method</h2>
      <div className="space-y-2">
        {methods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => onSelect(method.id)}
            className={cn(
              "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              selected === method.id
                ? "border-primary bg-primary-light"
                : "border-border hover:border-primary/30"
            )}
          >
            <div className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              selected === method.id ? "bg-primary/20" : "bg-surface"
            )}>
              <method.icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text">{method.label}</span>
                {method.recommended && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    Recommended
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-text-secondary">{method.description}</p>
            </div>
            <div className={cn(
              "h-4 w-4 shrink-0 rounded-full border-2",
              selected === method.id ? "border-primary bg-primary" : "border-border"
            )} aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
