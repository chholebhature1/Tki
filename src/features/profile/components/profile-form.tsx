"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { profileSchema, type ProfileFormData } from "../schemas/profile.schema";
import { updateProfileAction } from "../actions/profile.actions";
import { FormField, Input } from "@/features/auth/components/form-field";

interface ProfileFormProps {
  defaultValues: ProfileFormData & { email: string };
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const router = useRouter();
  const [serverMessage, setServerMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  async function onSubmit(data: ProfileFormData) {
    setServerMessage(null);
    const result = await updateProfileAction(data);

    if (!result.success) {
      setServerMessage({ type: "error", text: result.error || "Update failed." });
      return;
    }

    setServerMessage({ type: "success", text: "Profile updated successfully." });
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverMessage && (
        <div className={`rounded-lg px-4 py-3 text-sm ${serverMessage.type === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`} role="alert">
          {serverMessage.text}
        </div>
      )}

      {/* Personal Information */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="text-base font-semibold text-text">Personal Information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField label="Full Name" error={errors.fullName}>
            <Input type="text" placeholder="Your full name" hasError={!!errors.fullName} {...register("fullName")} />
          </FormField>
          <FormField label="Email">
            <Input type="email" value={defaultValues.email} disabled className="opacity-60 cursor-not-allowed" />
          </FormField>
          <FormField label="Phone Number" error={errors.phone}>
            <Input type="tel" placeholder="+91 98765 43210" hasError={!!errors.phone} {...register("phone")} />
          </FormField>
          <FormField label="Date of Birth" error={errors.dateOfBirth}>
            <Input type="date" hasError={!!errors.dateOfBirth} {...register("dateOfBirth")} />
          </FormField>
          <FormField label="Gender" error={errors.gender}>
            <select {...register("gender")} className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </FormField>
        </div>
      </div>

      {/* Contact & Location */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="text-base font-semibold text-text">Contact & Location</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField label="City" error={errors.city}>
            <Input type="text" placeholder="Mumbai" hasError={!!errors.city} {...register("city")} />
          </FormField>
          <FormField label="State" error={errors.state}>
            <Input type="text" placeholder="Maharashtra" hasError={!!errors.state} {...register("state")} />
          </FormField>
          <FormField label="Emergency Contact" error={errors.emergencyContact} className="sm:col-span-2">
            <Input type="tel" placeholder="Emergency contact number" hasError={!!errors.emergencyContact} {...register("emergencyContact")} />
          </FormField>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-primary px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
