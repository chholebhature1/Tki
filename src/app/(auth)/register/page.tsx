import Link from "next/link";
import { AuthCard, RegisterForm } from "@/features/auth";

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
      <RegisterForm />
    </AuthCard>
  );
}
