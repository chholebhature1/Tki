import Link from "next/link";
import { AuthCard, RegisterForm, GoogleSignInButton } from "@/features/auth";

export const metadata = {
  title: "Create Account",
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Join TalkIndia to book appointments with verified therapists."
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
            Log in
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
            <span className="bg-white px-3 text-muted">or register with email</span>
          </div>
        </div>

        <RegisterForm />
      </div>
    </AuthCard>
  );
}
