"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface SaveAssessmentInput {
  assessmentType: string;
  score: number;
  maxScore: number;
  severity: string;
  answers: number[];
}

export async function saveAssessmentResultAction(input: SaveAssessmentInput): Promise<{ success: boolean }> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Only save if user is logged in — assessment works without login too
  if (!user) return { success: false };

  const { error } = await supabase.from("assessment_results").insert({
    patient_profile_id: user.id,
    assessment_type: input.assessmentType,
    score: input.score,
    max_score: input.maxScore,
    severity: input.severity,
    answers: input.answers,
  });

  if (error) return { success: false };
  return { success: true };
}
