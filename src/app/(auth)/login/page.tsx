import Link from "next/link";
import { AuthCard, LoginForm } from "@/features/auth";

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
      <LoginForm />
    </AuthCard>
  );
}
