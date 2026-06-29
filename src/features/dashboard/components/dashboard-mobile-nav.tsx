import Link from "next/link";
import { LayoutDashboard, Calendar, User, Search } from "lucide-react";
import { Logo } from "@/components/layout";

interface DashboardMobileNavProps {
  user: { name: string; email: string; avatarUrl: string | null };
}

export function DashboardMobileNav({ user }: DashboardMobileNavProps) {
  return (
    <>
      {/* Top bar */}
      <div className="flex h-14 items-center justify-between border-b border-border bg-white px-4 lg:hidden">
        <Logo className="text-lg" />
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
          {user.name[0]}
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white lg:hidden" aria-label="Dashboard navigation">
        <div className="flex items-center justify-around py-2">
          {[
            { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
            { href: "/find-therapists", icon: Search, label: "Search" },
            { href: "/dashboard/appointments", icon: Calendar, label: "Appts" },
            { href: "/dashboard/profile", icon: User, label: "Profile" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1 text-text-secondary"
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
