"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../schemas/auth.schema";
import { resetPasswordAction } from "../actions/auth.actions";
import { FormField, Input } from "./form-field";
import { SubmitButton } from "./submit-button";

export function ResetPasswordForm() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data: ResetPasswordFormData) {
    setServerError("");
    const result = await resetPasswordAction(data);

    if (!result.success) {
      setServerError(result.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-light">
          <span className="text-xl">✓</span>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-text">Password updated</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Your password has been reset. Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {serverError && (
        <div className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
          {serverError}
        </div>
      )}

      <FormField label="New Password" error={errors.password}>
        <Input
          type="password"
          placeholder="Min 8 characters"
          autoComplete="new-password"
          hasError={!!errors.password}
          {...register("password")}
        />
      </FormField>

      <FormField label="Confirm Password" error={errors.confirmPassword}>
        <Input
          type="password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          hasError={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
      </FormField>

      <SubmitButton loading={isSubmitting}>Reset Password</SubmitButton>
    </form>
  );
}
