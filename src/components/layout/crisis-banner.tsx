"use client";

import { useState, useEffect, useRef } from "react";
import { Phone, X } from "lucide-react";

export function CrisisBanner() {
  const [dismissed, setDismissed] = useState(true);
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;
    const stored = localStorage.getItem("crisis-banner-dismissed");
    if (!stored) {
      // Use timeout to avoid sync setState in effect
      setTimeout(() => setDismissed(false), 0);
    }
  }, []);

  function handleDismiss() {
    setDismissed(true);
    localStorage.setItem("crisis-banner-dismissed", "1");
  }

  if (dismissed) return null;

  return (
    <div className="relative bg-text text-white" role="alert">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-x-4 px-4 py-2 text-center text-xs sm:text-sm">
        <Phone className="hidden h-3.5 w-3.5 shrink-0 sm:block" aria-hidden="true" />
        <p>
          <span className="font-medium">In crisis?</span>{" "}
          <span className="text-white/80">
            Vandrevala Foundation:{" "}
            <a href="tel:18602662345" className="font-medium text-white underline underline-offset-2 hover:text-primary-light">1860-2662-345</a>
            {" "}|{" "}NIMHANS:{" "}
            <a href="tel:08046110007" className="font-medium text-white underline underline-offset-2 hover:text-primary-light">080-46110007</a>
            {" "}|{" "}iCall:{" "}
            <a href="tel:9152987821" className="font-medium text-white underline underline-offset-2 hover:text-primary-light">9152987821</a>
          </span>
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-white/60 hover:text-white"
          aria-label="Dismiss crisis banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
