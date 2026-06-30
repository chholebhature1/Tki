"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { therapistProfileSchema, type TherapistProfileFormData } from "../schemas/therapist-profile.schema";
import { updateTherapistProfileAction } from "../actions/therapist-profile.actions";
import { FormField, Input } from "@/features/auth/components/form-field";

interface TherapistProfileFormProps {
  therapistProfileId: string;
  defaultValues: TherapistProfileFormData;
}

export function TherapistProfileForm({ therapistProfileId, defaultValues }: TherapistProfileFormProps) {
  const router = useRouter();
  const [serverMessage, setServerMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TherapistProfileFormData>({
    resolver: zodResolver(therapistProfileSchema),
    defaultValues,
  });

  async function onSubmit(data: TherapistProfileFormData) {
    setServerMessage(null);
    const result = await updateTherapistProfileAction(therapistProfileId, data);

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

      {/* Professional Info */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="text-base font-semibold text-text">Professional Information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField label="Professional Title" error={errors.professionalTitle}>
            <Input type="text" placeholder="Clinical Psychologist" hasError={!!errors.professionalTitle} {...register("professionalTitle")} />
          </FormField>
          <FormField label="Years of Experience" error={errors.yearsExperience}>
            <Input type="number" placeholder="10" hasError={!!errors.yearsExperience} {...register("yearsExperience", { valueAsNumber: true })} />
          </FormField>
          <FormField label="Consultation Fee (₹)" error={errors.consultationFee}>
            <Input type="number" placeholder="1500" hasError={!!errors.consultationFee} {...register("consultationFee", { valueAsNumber: true })} />
          </FormField>
          <FormField label="Consultation Mode" error={errors.consultationMode}>
            <select {...register("consultationMode")} className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="online">Online</option>
              <option value="offline">In-Person</option>
              <option value="both">Both</option>
            </select>
          </FormField>
        </div>
      </div>

      {/* Biography */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="text-base font-semibold text-text">Biography</h2>
        <div className="mt-4">
          <FormField label="About You" error={errors.biography}>
            <textarea
              {...register("biography")}
              rows={5}
              placeholder="Describe your approach to therapy, specializations, and what patients can expect..."
              className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
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
