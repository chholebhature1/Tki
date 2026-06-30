import { z } from "zod";

export const therapistProfileSchema = z.object({
  professionalTitle: z.string().min(2, "Title is required"),
  biography: z.string().min(20, "Biography must be at least 20 characters").max(1000, "Biography must be under 1000 characters"),
  yearsExperience: z.number().min(0, "Must be 0 or more").max(50, "Must be 50 or less"),
  consultationFee: z.number().min(100, "Minimum fee is ₹100").max(50000, "Maximum fee is ₹50,000"),
  consultationMode: z.enum(["online", "offline", "both"]),
});

export type TherapistProfileFormData = z.infer<typeof therapistProfileSchema>;
