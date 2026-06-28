import { AuthCard, ResetPasswordForm } from "@/features/auth";

export const metadata = {
  title: "Reset Password",
};

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Set a new password"
      description="Choose a strong password for your account."
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
