import Link from "next/link";
import { Bell, Lock, Shield, Clock, Trash2, User } from "lucide-react";

export const metadata = { title: "Settings" };

export default function TherapistSettingsPage() {
  const sections = [
    { icon: User, title: "Professional Profile", description: "Update your qualifications, bio, and fee", href: "/therapist/profile" },
    { icon: Clock, title: "Availability", description: "Manage your weekly schedule and holidays", href: "/therapist/availability" },
    { icon: Bell, title: "Notifications", description: "Choose what notifications you receive", href: "/therapist/notifications" },
    { icon: Lock, title: "Password & Security", description: "Update your password and security settings", href: "/forgot-password" },
    { icon: Shield, title: "Privacy", description: "Control your data and privacy preferences", href: "/privacy-policy" },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Settings</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage your account and professional preferences.</p>
      </div>

      <div className="space-y-3">
        {sections.map((s) => (
          <Link key={s.title} href={s.href} className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 transition-all hover:border-primary/30 hover:shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
              <s.icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">{s.title}</p>
              <p className="text-xs text-text-secondary">{s.description}</p>
            </div>
          </Link>
        ))}

        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10">
              <Trash2 className="h-5 w-5 text-danger" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">Delete Account</p>
              <p className="text-xs text-text-secondary">Permanently remove your therapist profile and all data.</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted">Contact support@talkindia.in to request account deletion.</p>
        </div>
      </div>

      <div className="h-16 lg:hidden" />
    </div>
  );
}
