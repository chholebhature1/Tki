"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Search, Phone, HelpCircle } from "lucide-react";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  // Show after 3 seconds, don't show on dashboard pages
  useEffect(() => {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/therapist") || pathname.startsWith("/admin") || pathname.startsWith("/consultation")) {
      return;
    }
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Popup */}
      {open && (
        <div className="mb-3 w-72 rounded-2xl border border-border bg-white p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text">Need Help?</h3>
            <button type="button" onClick={() => setOpen(false)} className="rounded p-1 text-muted hover:text-text" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-xs text-text-secondary">We&apos;re here to guide you.</p>
          <div className="mt-4 space-y-2">
            <Link
              href="/find-therapists"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-sm text-text-secondary transition-colors hover:border-primary/30 hover:text-text"
            >
              <Search className="h-4 w-4 text-primary" aria-hidden="true" />
              Find a Therapist
            </Link>
            <Link
              href="/#contact-form"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-sm text-text-secondary transition-colors hover:border-primary/30 hover:text-text"
            >
              <HelpCircle className="h-4 w-4 text-primary" aria-hidden="true" />
              Submit a Query
            </Link>
            <a
              href="tel:18602662345"
              className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-sm text-text-secondary transition-colors hover:border-primary/30 hover:text-text"
            >
              <Phone className="h-4 w-4 text-danger" aria-hidden="true" />
              Crisis Helpline
            </a>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 hover:bg-primary-hover"
        aria-label={open ? "Close help menu" : "Need help?"}
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
