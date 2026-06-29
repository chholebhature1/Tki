import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { BookingDate, TimeSlot } from "../types";

interface AvailabilityRule {
  weekday: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  buffer_after_minutes: number;
}

/**
 * Generates available time slots for a therapist on a specific date.
 * Takes into account: availability rules, blocked periods, existing appointments, and active locks.
 */
export class AvailabilityRepository {
  static async getAvailableDates(
    therapistProfileId: string,
    daysAhead: number = 14
  ): Promise<BookingDate[]> {
    const supabase = await createServerSupabaseClient();

    // Get therapist's active availability rules
    const { data: rules } = await supabase
      .from("therapist_availability")
      .select("weekday")
      .eq("therapist_profile_id", therapistProfileId)
      .eq("is_active", true);

    const availableWeekdays = new Set(
      (rules || []).map((r: { weekday: number }) => r.weekday)
    );

    // Get blocked periods
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + daysAhead);

    const { data: blocked } = await supabase
      .from("therapist_blocked_periods")
      .select("start_datetime, end_datetime")
      .eq("therapist_profile_id", therapistProfileId)
      .gte("end_datetime", today.toISOString())
      .lte("start_datetime", endDate.toISOString());

    const blockedDates = new Set<string>();
    (blocked || []).forEach((b: { start_datetime: string; end_datetime: string }) => {
      const start = new Date(b.start_datetime);
      const end = new Date(b.end_datetime);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        blockedDates.add(d.toISOString().split("T")[0]);
      }
    });

    // Generate date list
    const dates: BookingDate[] = [];
    for (let i = 1; i <= daysAhead; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      const jsDay = d.getDay(); // 0=Sun, 1=Mon...
      const dbDay = jsDay; // Our DB uses 0=Sun too (generate_series 1-6 = Mon-Sat)

      const available = availableWeekdays.has(dbDay) && !blockedDates.has(dateStr);

      dates.push({
        date: dateStr,
        label: d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" }),
        dayName: d.toLocaleDateString("en-IN", { weekday: "short" }),
        dayNumber: d.getDate(),
        available,
      });
    }

    return dates;
  }

  static async getAvailableSlots(
    therapistProfileId: string,
    date: string
  ): Promise<TimeSlot[]> {
    const supabase = await createServerSupabaseClient();
    const targetDate = new Date(date);
    const weekday = targetDate.getDay();

    // Get availability rules for this weekday
    const { data: rules } = await supabase
      .from("therapist_availability")
      .select("start_time, end_time, slot_duration_minutes, buffer_after_minutes")
      .eq("therapist_profile_id", therapistProfileId)
      .eq("weekday", weekday)
      .eq("is_active", true);

    if (!rules || rules.length === 0) return [];

    // Get existing appointments on this date
    const { data: appointments } = await supabase
      .from("appointments")
      .select("start_time")
      .eq("therapist_profile_id", therapistProfileId)
      .eq("appointment_date", date)
      .in("status", ["confirmed", "payment_pending"]);

    const bookedTimes = new Set(
      (appointments || []).map((a: { start_time: string }) => a.start_time)
    );

    // Get active slot locks on this date
    const { data: locks } = await supabase
      .from("slot_locks")
      .select("start_time")
      .eq("therapist_profile_id", therapistProfileId)
      .eq("appointment_date", date)
      .gt("expires_at", new Date().toISOString());

    const lockedTimes = new Set(
      (locks || []).map((l: { start_time: string }) => l.start_time)
    );

    // Generate slots from rules
    const slots: TimeSlot[] = [];

    for (const rule of rules as AvailabilityRule[]) {
      const [startH, startM] = rule.start_time.split(":").map(Number);
      const [endH, endM] = rule.end_time.split(":").map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      const interval = rule.slot_duration_minutes + rule.buffer_after_minutes;

      for (let m = startMinutes; m + rule.slot_duration_minutes <= endMinutes; m += interval) {
        const hours = Math.floor(m / 60);
        const mins = m % 60;
        const timeStr = `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
        const displayTime = formatTime(hours, mins);

        const period = hours < 12 ? "morning" : hours < 17 ? "afternoon" : "evening";
        const available = !bookedTimes.has(timeStr) && !lockedTimes.has(timeStr);

        slots.push({ time: displayTime, period, available });
      }
    }

    return slots;
  }
}

function formatTime(hours: number, mins: number): string {
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${h}:${mins.toString().padStart(2, "0")} ${ampm}`;
}
