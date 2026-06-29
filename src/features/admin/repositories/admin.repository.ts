import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface AdminStats {
  totalUsers: number;
  totalPatients: number;
  totalTherapists: number;
  pendingVerification: number;
  todayAppointments: number;
  completedSessions: number;
  averageRating: number;
}

export interface AdminTherapist {
  id: string;
  profileId: string;
  name: string;
  email: string;
  qualification: string | null;
  yearsExperience: number;
  verificationStatus: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface AdminReview {
  id: string;
  patientName: string;
  therapistName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export class AdminRepository {
  static async getStats(): Promise<AdminStats> {
    const supabase = await createServerSupabaseClient();
    const today = new Date().toISOString().split("T")[0];

    const [profiles, therapists, pendingTh, todayAppts, completedAppts, reviews] = await Promise.all([
      supabase.from("profiles").select("id, role:roles!profiles_role_id_fkey(name)"),
      supabase.from("therapist_profiles").select("id"),
      supabase.from("therapist_profiles").select("id").eq("verification_status", "pending").or("verification_status.eq.submitted"),
      supabase.from("appointments").select("id").eq("appointment_date", today),
      supabase.from("appointments").select("id").eq("status", "completed"),
      supabase.from("reviews").select("rating"),
    ]);

    const allProfiles = profiles.data || [];
    const patients = allProfiles.filter((p) => (p.role as unknown as { name: string })?.name === "patient").length;

    const avgRating = reviews.data && reviews.data.length > 0
      ? reviews.data.reduce((sum, r) => sum + r.rating, 0) / reviews.data.length
      : 0;

    return {
      totalUsers: allProfiles.length,
      totalPatients: patients,
      totalTherapists: (therapists.data || []).length,
      pendingVerification: (pendingTh.data || []).length,
      todayAppointments: (todayAppts.data || []).length,
      completedSessions: (completedAppts.data || []).length,
      averageRating: Math.round(avgRating * 10) / 10,
    };
  }

  static async getTherapists(): Promise<AdminTherapist[]> {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("therapist_profiles")
      .select(`id, profile_id, professional_title, years_experience, verification_status, created_at,
        profile:profiles!therapist_profiles_profile_id_fkey(full_name, email)`)
      .order("created_at", { ascending: false });

    return (data || []).map((t) => {
      const profile = t.profile as unknown as { full_name: string; email: string };
      return {
        id: t.id,
        profileId: t.profile_id,
        name: profile.full_name,
        email: profile.email,
        qualification: t.professional_title,
        yearsExperience: t.years_experience,
        verificationStatus: t.verification_status,
        createdAt: t.created_at,
      };
    });
  }

  static async getUsers(): Promise<AdminUser[]> {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email, is_active, created_at, role:roles!profiles_role_id_fkey(name)")
      .order("created_at", { ascending: false });

    return (data || []).map((u) => ({
      id: u.id,
      name: u.full_name,
      email: u.email,
      role: (u.role as unknown as { name: string })?.name || "unknown",
      isActive: u.is_active,
      createdAt: u.created_at,
    }));
  }

  static async getReviews(): Promise<AdminReview[]> {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("reviews")
      .select(`id, rating, comment, created_at,
        patient:profiles!reviews_patient_profile_id_fkey(full_name),
        therapist:therapist_profiles!reviews_therapist_profile_id_fkey(
          profile:profiles!therapist_profiles_profile_id_fkey(full_name)
        )`)
      .order("created_at", { ascending: false });

    return (data || []).map((r) => {
      const patient = r.patient as unknown as { full_name: string };
      const therapist = r.therapist as unknown as { profile: { full_name: string } };
      return {
        id: r.id,
        patientName: patient.full_name,
        therapistName: therapist.profile.full_name,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.created_at,
      };
    });
  }

  static async updateVerificationStatus(therapistProfileId: string, status: string): Promise<{ success: boolean }> {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("therapist_profiles")
      .update({ verification_status: status })
      .eq("id", therapistProfileId);
    return { success: !error };
  }

  static async updateUserActiveStatus(userId: string, isActive: boolean): Promise<{ success: boolean }> {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("profiles")
      .update({ is_active: isActive })
      .eq("id", userId);
    return { success: !error };
  }
}
