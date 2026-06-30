import Link from "next/link";
import { Home, CalendarDays, Users, Clock, User, TrendingUp, Bell, Settings, LogOut } from "lucide-react";
import { Logo } from "@/components/layout";

interface TherapistSidebarProps {
  user: { name: string; email: string; avatarUrl: string | null };
}

const navItems = [
  { href: "/therapist/dashboard", icon: Home, label: "Home" },
  { href: "/therapist/appointments", icon: CalendarDays, label: "Schedule" },
  { href: "/therapist/patients", icon: Users, label: "Patients" },
  { href: "/therapist/availability", icon: Clock, label: "Availability" },
  { href: "/therapist/earnings", icon: TrendingUp, label: "Earnings" },
  { href: "/therapist/notifications", icon: Bell, label: "Notifications" },
  { href: "/therapist/profile", icon: User, label: "Profile" },
  { href: "/therapist/settings", icon: Settings, label: "Settings" },
];

export function TherapistSidebar({ user }: TherapistSidebarProps) {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-white lg:block" aria-label="Therapist navigation">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-14 items-center border-b border-border px-5">
          <Logo className="text-base" />
          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">PRO</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-2 py-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text"
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
              {user.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-text">{user.name}</p>
              <p className="truncate text-[10px] text-muted">{user.email}</p>
            </div>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-surface hover:text-danger">
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" /> Log out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
