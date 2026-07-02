"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate hardcoded admin credentials
    if (username !== "tk@admin" || password !== "tk@admin123") {
      setError("Invalid admin credentials.");
      setLoading(false);
      return;
    }

    // Sign in with the actual admin Supabase account
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: "usefullother6@gmail.com",
      password: "tk@admin123",
    });

    if (authError) {
      setError("Authentication failed. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-text">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-text">Admin Panel</h1>
          <p className="mt-1 text-sm text-text-secondary">Enter admin credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="admin-username" className="block text-sm font-medium text-text">Username</label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Admin username"
              required
              className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-text">Password</label>
            <div className="relative mt-1.5">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                required
                className="w-full rounded-xl border border-border bg-white px-4 py-3 pr-10 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-text py-3 text-sm font-medium text-white hover:bg-text/90 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Access Admin Panel"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          This area is restricted to authorized administrators only.
        </p>
      </div>
    </div>
  );
}
