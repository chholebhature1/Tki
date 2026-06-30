"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/get-base-url";
import { redirect } from "next/navigation";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type LoginFormData,
  type RegisterFormData,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
} from "../schemas/auth.schema";

export type AuthResult = {
  success: boolean;
  message: string;
};

/**
 * Normalizes Supabase auth errors to prevent user enumeration
 * and information leakage.
 */
function safeAuthError(error: { message: string }, context: string): string {
  const msg = error.message.toLowerCase();

  // Login errors — generic message
  if (context === "login") {
    return "Invalid email or password.";
  }

  // Registration — only reveal if email is taken (Supabase exposes this anyway via signup)
  if (context === "register") {
    if (msg.includes("already registered") || msg.includes("already been registered")) {
      return "An account with this email already exists.";
    }
    return "Could not create account. Please try again.";
  }

  // Password reset — always show success to prevent enumeration
  if (context === "forgot") {
    return "If an account exists, a reset link has been sent.";
  }

  // Generic fallback
  return "Something went wrong. Please try again.";
}

export async function loginAction(data: LoginFormData): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Invalid input." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, message: safeAuthError(error, "login") };
  }

  return { success: true, message: "Login successful." };
}

export async function registerAction(
  data: RegisterFormData
): Promise<AuthResult> {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Invalid input." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        phone: parsed.data.phone,
      },
    },
  });

  if (error) {
    return { success: false, message: safeAuthError(error, "register") };
  }

  // Send welcome notification + email (best-effort)
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { NotificationService } = await import("@/features/notifications/services");
      await NotificationService.welcome(user.id, parsed.data.email, parsed.data.fullName);
    }
  } catch { /* Never block registration */ }

  return {
    success: true,
    message: "Account created! Please check your email to verify.",
  };
}

export async function forgotPasswordAction(
  data: ForgotPasswordFormData
): Promise<AuthResult> {
  const parsed = forgotPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Invalid input." };
  }

  const supabase = await createServerSupabaseClient();
  const baseUrl = getBaseUrl();

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${baseUrl}/auth/callback?next=/reset-password`,
  });

  // Always return success to prevent email enumeration
  return {
    success: true,
    message: "If an account exists with that email, a reset link has been sent.",
  };
}

export async function resetPasswordAction(
  data: ResetPasswordFormData
): Promise<AuthResult> {
  const parsed = resetPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Invalid input." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, message: "Could not update password. The link may have expired." };
  }

  return { success: true, message: "Password updated successfully." };
}

export async function logoutAction(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}
