import Link from "next/link";
import { Logo } from "@/components/layout";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Logo className="text-xl" />
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text">{title}</h1>
            <p className="mt-1.5 text-sm text-text-secondary">{description}</p>
          </div>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="mt-6 text-center text-sm text-text-secondary">
            {footer}
          </div>
        )}

        {/* Back to home */}
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-muted transition-colors hover:text-text-secondary"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
