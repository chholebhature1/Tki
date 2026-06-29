import Link from "next/link";
import { AuthCard, LoginForm, GoogleSignInButton } from "@/features/auth";

export const metadata = {
  title: "Log In",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Log in to manage your appointments and consultations."
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:text-primary-hover">
            Create one
          </Link>
        </p>
      }
    >
      <div className="space-y-6">
        <GoogleSignInButton />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-muted">or continue with email</span>
          </div>
        </div>

        <LoginForm />
      </div>
    </AuthCard>
  );
}
