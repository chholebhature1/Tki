"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";
import { loginAction } from "../actions/auth.actions";
import { FormField, Input } from "./form-field";
import { SubmitButton } from "./submit-button";

export function LoginForm() {
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError("");
    const result = await loginAction(data);

    if (!result.success) {
      setServerError(result.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
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

      <FormField label="Password" error={errors.password}>
        <Input
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          hasError={!!errors.password}
          {...register("password")}
        />
      </FormField>

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-sm text-primary transition-colors hover:text-primary-hover"
        >
          Forgot password?
        </Link>
      </div>

      <SubmitButton loading={isSubmitting}>Log in</SubmitButton>
    </form>
  );
}
