"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface AvailabilitySlotInput {
  weekday: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  bufferAfter: number;
  isActive: boolean;
}

export async function getTherapistAvailability(therapistProfileId: string) {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from("therapist_availability")
    .select("id, weekday, start_time, end_time, slot_duration_minutes, buffer_after_minutes, is_active")
    .eq("therapist_profile_id", therapistProfileId)
    .order("weekday")
    .order("start_time");

  return data || [];
}

export async function updateAvailabilityAction(
  therapistProfileId: string,
  slots: AvailabilitySlotInput[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient();

  // Verify ownership
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const { data: tp } = await supabase
    .from("therapist_profiles")
    .select("id")
    .eq("id", therapistProfileId)
    .eq("profile_id", user.id)
    .single();

  if (!tp) return { success: false, error: "Access denied." };

  // Validate: end > start for each slot
  for (const slot of slots) {
    if (slot.startTime >= slot.endTime) {
      return { success: false, error: `Invalid time range on day ${slot.weekday}.` };
    }
    if (slot.slotDuration < 15 || slot.slotDuration > 120) {
      return { success: false, error: "Slot duration must be between 15 and 120 minutes." };
    }
  }

  // Delete existing and re-insert (simpler than diffing)
  await supabase
    .from("therapist_availability")
    .delete()
    .eq("therapist_profile_id", therapistProfileId);

  if (slots.length > 0) {
    const rows = slots.map((s) => ({
      therapist_profile_id: therapistProfileId,
      weekday: s.weekday,
      start_time: s.startTime,
      end_time: s.endTime,
      slot_duration_minutes: s.slotDuration,
      buffer_after_minutes: s.bufferAfter,
      is_active: s.isActive,
    }));

    const { error } = await supabase.from("therapist_availability").insert(rows);
    if (error) return { success: false, error: "Failed to save availability." };
  }

  return { success: true };
}

export async function getTherapistBlockedPeriods(therapistProfileId: string) {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from("therapist_blocked_periods")
    .select("id, start_datetime, end_datetime, reason")
    .eq("therapist_profile_id", therapistProfileId)
    .order("start_datetime");

  return data || [];
}

export async function addBlockedPeriodAction(
  therapistProfileId: string,
  startDatetime: string,
  endDatetime: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const { data: tp } = await supabase
    .from("therapist_profiles")
    .select("id")
    .eq("id", therapistProfileId)
    .eq("profile_id", user.id)
    .single();

  if (!tp) return { success: false, error: "Access denied." };

  if (startDatetime >= endDatetime) {
    return { success: false, error: "End date must be after start date." };
  }

  const { error } = await supabase.from("therapist_blocked_periods").insert({
    therapist_profile_id: therapistProfileId,
    start_datetime: startDatetime,
    end_datetime: endDatetime,
    reason,
  });

  if (error) return { success: false, error: "Failed to add blocked period." };
  return { success: true };
}

export async function removeBlockedPeriodAction(
  periodId: string,
  therapistProfileId: string
): Promise<{ success: boolean }> {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };

  // Verify ownership via therapist profile
  const { data: tp } = await supabase
    .from("therapist_profiles")
    .select("id")
    .eq("id", therapistProfileId)
    .eq("profile_id", user.id)
    .single();

  if (!tp) return { success: false };

  await supabase.from("therapist_blocked_periods").delete().eq("id", periodId);
  return { success: true };
}
