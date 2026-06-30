import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Therapist } from "../types";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface RawTherapistRow {
  id: string;
  professional_title: string | null;
  years_experience: number;
  consultation_fee: number;
  biography: string | null;
  consultation_mode: "online" | "offline" | "both";
  average_rating: number;
  total_reviews: number;
  is_featured: boolean;
  verification_status: string;
  profile: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    gender: string | null;
    city: string | null;
  };
  therapist_specializations: { specialization: { name: string } }[];
  therapist_languages: { language: { name: string } }[];
}

function mapRowToTherapist(row: RawTherapistRow): Therapist {
  return {
    id: row.id,
    slug: slugify(row.profile.full_name),
    name: row.profile.full_name,
    qualification: row.professional_title || "",
    professionalTitle: row.professional_title || "",
    bio: row.biography || "",
    yearsExperience: row.years_experience,
    languages: row.therapist_languages?.map((tl) => tl.language.name) || [],
    specializations: row.therapist_specializations?.map((ts) => ts.specialization.name) || [],
    rating: Number(row.average_rating),
    totalReviews: row.total_reviews,
    sessionFee: Number(row.consultation_fee),
    consultationMode: row.consultation_mode,
    gender: (row.profile.gender as Therapist["gender"]) || "other",
    verified: row.verification_status === "approved",
    availableToday: true, // Placeholder until availability tables exist
    nextAvailableSlot: "Today, 3:00 PM", // Placeholder
  };
}

const THERAPIST_SELECT = `
  id,
  professional_title,
  years_experience,
  consultation_fee,
  biography,
  consultation_mode,
  average_rating,
  total_reviews,
  is_featured,
  verification_status,
  profile:profiles!therapist_profiles_profile_id_fkey (
    id, full_name, avatar_url, gender, city
  ),
  therapist_specializations (
    specialization:specializations (name)
  ),
  therapist_languages (
    language:languages (name)
  )
`;

export class TherapistRepository {
  static async findAll(): Promise<Therapist[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("therapist_profiles")
      .select(THERAPIST_SELECT)
      .eq("verification_status", "approved")
      .order("average_rating", { ascending: false });

    if (error || !data) return [];
    return (data as unknown as RawTherapistRow[]).map(mapRowToTherapist);
  }

  static async findBySlug(slug: string): Promise<Therapist | null> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("therapist_profiles")
      .select(THERAPIST_SELECT)
      .eq("verification_status", "approved");

    if (error || !data) return null;

    const rows = data as unknown as RawTherapistRow[];
    const match = rows.find((r) => slugify(r.profile.full_name) === slug);
    return match ? mapRowToTherapist(match) : null;
  }

  static async findFeatured(): Promise<Therapist[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("therapist_profiles")
      .select(THERAPIST_SELECT)
      .eq("verification_status", "approved")
      .eq("is_featured", true)
      .order("average_rating", { ascending: false })
      .limit(4);

    if (error || !data) return [];
    return (data as unknown as RawTherapistRow[]).map(mapRowToTherapist);
  }

  static async findSimilar(excludeId: string): Promise<Therapist[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("therapist_profiles")
      .select(THERAPIST_SELECT)
      .eq("verification_status", "approved")
      .neq("id", excludeId)
      .order("average_rating", { ascending: false })
      .limit(3);

    if (error || !data) return [];
    return (data as unknown as RawTherapistRow[]).map(mapRowToTherapist);
  }

  /**
   * Finds therapist profile by the auth user ID (profile_id).
   * Does NOT filter by verification_status — therapist sees own profile always.
   */
  static async findByProfileId(userId: string): Promise<{ therapist: Therapist; raw: RawTherapistRow } | null> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("therapist_profiles")
      .select(THERAPIST_SELECT)
      .eq("profile_id", userId)
      .single();

    if (error || !data) return null;
    const row = data as unknown as RawTherapistRow;
    return { therapist: mapRowToTherapist(row), raw: row };
  }

  /**
   * Updates therapist professional profile.
   */
  static async updateProfile(therapistProfileId: string, userId: string, updates: {
    professional_title?: string;
    biography?: string;
    years_experience?: number;
    consultation_fee?: number;
    consultation_mode?: string;
  }): Promise<{ success: boolean; error?: string }> {
    const supabase = await createServerSupabaseClient();

    // Verify ownership
    const { data: existing } = await supabase
      .from("therapist_profiles")
      .select("id, profile_id")
      .eq("id", therapistProfileId)
      .eq("profile_id", userId)
      .single();

    if (!existing) return { success: false, error: "Profile not found or access denied." };

    const { error } = await supabase
      .from("therapist_profiles")
      .update(updates)
      .eq("id", therapistProfileId);

    if (error) return { success: false, error: "Failed to update profile." };
    return { success: true };
  }
}
