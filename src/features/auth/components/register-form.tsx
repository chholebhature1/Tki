"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "../schemas/auth.schema";
import { registerAction } from "../actions/auth.actions";
import { FormField, Input } from "./form-field";
import { SubmitButton } from "./submit-button";

export function RegisterForm() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    setServerError("");
    const result = await registerAction(data);

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
          <span className="text-xl">✓</span>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-text">Check your email</h2>
        <p className="mt-2 text-sm text-text-secondary">
          We&apos;ve sent a verification link to your email. Please click it to
          activate your account.
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

      <FormField label="Full Name" error={errors.fullName}>
        <Input
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          hasError={!!errors.fullName}
          {...register("fullName")}
        />
      </FormField>

      <FormField label="Email" error={errors.email}>
        <Input
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          hasError={!!errors.email}
          {...register("email")}
        />
      </FormField>

      <FormField label="Phone Number" error={errors.phone}>
        <Input
          type="tel"
          placeholder="+91 98765 43210"
          autoComplete="tel"
          hasError={!!errors.phone}
          {...register("phone")}
        />
      </FormField>

      <FormField label="Password" error={errors.password}>
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

      <SubmitButton loading={isSubmitting}>Create Account</SubmitButton>
    </form>
  );
}
