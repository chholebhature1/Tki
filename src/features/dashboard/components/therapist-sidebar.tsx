import Link from "next/link";
import { LayoutDashboard, Calendar, Clock, Users, User, Settings, LogOut } from "lucide-react";
import { Logo } from "@/components/layout";

interface TherapistSidebarProps {
  user: { name: string; email: string; avatarUrl: string | null };
}

const navItems = [
  { href: "/therapist/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/therapist/appointments", icon: Calendar, label: "Appointments" },
  { href: "/therapist/availability", icon: Clock, label: "Availability" },
  { href: "/therapist/patients", icon: Users, label: "Patients" },
  { href: "/therapist/profile", icon: User, label: "Profile" },
  { href: "/therapist/settings", icon: Settings, label: "Settings" },
];

export function TherapistSidebar({ user }: TherapistSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-white lg:block" aria-label="Therapist navigation">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Logo className="text-lg" />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text"
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
              {user.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text">{user.name}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-danger"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
