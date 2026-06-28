import Link from "next/link";
import { AuthCard, ForgotPasswordForm } from "@/features/auth";

export const metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Forgot your password?"
      description="Enter your email and we'll send you a link to reset it."
      footer={
        <p>
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
            Log in
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
