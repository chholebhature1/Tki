"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, Users, User } from "lucide-react";
import { Logo } from "@/components/layout";

interface TherapistMobileNavProps {
  user: { name: string; email: string; avatarUrl: string | null };
}

const mobileItems = [
  { href: "/therapist/dashboard", icon: Home, label: "Today" },
  { href: "/therapist/appointments", icon: CalendarDays, label: "Schedule" },
  { href: "/therapist/patients", icon: Users, label: "Patients" },
  { href: "/therapist/profile", icon: User, label: "Profile" },
];

export function TherapistMobileNav({ user }: TherapistMobileNavProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/therapist/dashboard") return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Top bar */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-white px-4 lg:hidden">
        <Logo className="text-base" />
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">PRO</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
            {user.name[0]}
          </div>
        </div>
      </header>

      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white lg:hidden" aria-label="Therapist navigation">
        <div className="flex items-center justify-around py-2">
          {mobileItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                  active ? "text-primary" : "text-text-secondary"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
