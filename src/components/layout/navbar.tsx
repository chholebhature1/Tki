"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks } from "@/constants/site";
import { Container } from "./container";
import { Logo } from "./logo";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; name?: string; role?: string } | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Check auth state on mount and on auth changes
  useEffect(() => {
    const supabase = createClient();

    async function getUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        // Fetch role
        const { data: profile } = await supabase
          .from("profiles")
          .select("role:roles!profiles_role_id_fkey(name)")
          .eq("id", authUser.id)
          .single();
        const role = (profile?.role as unknown as { name: string })?.name || "patient";
        setUser({ email: authUser.email, name: authUser.user_metadata?.full_name || authUser.email, role });
      } else {
        setUser(null);
      }
    }

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Re-fetch role on auth change
        getUser();
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    if (!mobileMenuOpen && !profileOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setProfileOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen, profileOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    if (!profileOpen) return;

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-profile-menu]")) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [profileOpen]);

  async function handleLogout() {
    setProfileOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  }

  const initials = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";
  const dashboardHref = user?.role === "therapist" ? "/therapist/dashboard" : user?.role === "admin" ? "/admin/dashboard" : "/dashboard";
  const profileHref = user?.role === "therapist" ? "/therapist/profile" : user?.role === "admin" ? "/admin/settings" : "/dashboard/profile";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <Container>
        <nav
          className="flex h-16 items-center justify-between"
          aria-label="Main navigation"
        >
          <Logo className="text-xl" />

          {/* Desktop Navigation */}
          <ul className="hidden items-center gap-1 lg:flex" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-primary"
                      : "text-text-secondary hover:text-text"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Auth Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <div className="relative" data-profile-menu>
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
                  aria-expanded={profileOpen}
                  aria-label="Account menu"
                >
                  {initials}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border bg-white p-1.5 shadow-lg">
                    <p className="truncate px-3 py-2 text-xs text-muted">{user.email}</p>
                    <Link
                      href={dashboardHref}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-text"
                    >
                      <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                      Dashboard
                    </Link>
                    <Link
                      href={profileHref}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-text"
                    >
                      <User className="h-4 w-4" aria-hidden="true" />
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-danger"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text"
                >
                  Log in
                </Link>
                <Link
                  href="/find-therapists"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                >
                  Book Appointment
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-text-secondary transition-colors hover:text-text lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </nav>
      </Container>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="border-t border-border lg:hidden">
          <Container>
            <div className="space-y-1 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary-light text-primary"
                      : "text-text-secondary hover:bg-surface hover:text-text"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2 border-t border-divider pt-4">
                {user ? (
                  <>
                    <Link
                      href={dashboardHref}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:text-text"
                    >
                      <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                      Dashboard
                    </Link>
                    <Link
                      href={profileHref}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:text-text"
                    >
                      <User className="h-4 w-4" aria-hidden="true" />
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                      className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:text-danger"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-md px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:text-text"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/find-therapists"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                    >
                      Book Appointment
                    </Link>
                  </>
                )}
              </div>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
