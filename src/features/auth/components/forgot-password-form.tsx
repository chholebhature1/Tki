"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../schemas/auth.schema";
import { forgotPasswordAction } from "../actions/auth.actions";
import { FormField, Input } from "./form-field";
import { SubmitButton } from "./submit-button";

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setServerError("");
    const result = await forgotPasswordAction(data);

    if (!result.success) {
      setServerError(result.message);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-light">
          <span className="text-xl">✉</span>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-text">Check your email</h2>
        <p className="mt-2 text-sm text-text-secondary">
          If an account exists with that email, we&apos;ve sent a password reset
          link.
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

      <FormField label="Email" error={errors.email}>
        <Input
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          hasError={!!errors.email}
          {...register("email")}
        />
      </FormField>

      <SubmitButton loading={isSubmitting}>Send Reset Link</SubmitButton>
    </form>
  );
}
