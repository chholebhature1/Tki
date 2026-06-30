"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Plus, Trash2, Calendar } from "lucide-react";
import {
  updateAvailabilityAction,
  addBlockedPeriodAction,
  removeBlockedPeriodAction,
  type AvailabilitySlotInput,
} from "@/features/booking/actions/manage-availability.actions";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface AvailabilityManagerProps {
  therapistProfileId: string;
  initialAvailability: { id: string; weekday: number; start_time: string; end_time: string; slot_duration_minutes: number; buffer_after_minutes: number; is_active: boolean }[];
  initialBlocked: { id: string; start_datetime: string; end_datetime: string; reason: string | null }[];
}

export function AvailabilityManager({ therapistProfileId, initialAvailability, initialBlocked }: AvailabilityManagerProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Group availability by day
  const [schedule, setSchedule] = useState<Record<number, { startTime: string; endTime: string; slotDuration: number; bufferAfter: number; isActive: boolean }[]>>(() => {
    const grouped: Record<number, { startTime: string; endTime: string; slotDuration: number; bufferAfter: number; isActive: boolean }[]> = {};
    for (let i = 0; i < 7; i++) grouped[i] = [];
    initialAvailability.forEach((a) => {
      grouped[a.weekday].push({
        startTime: a.start_time, endTime: a.end_time,
        slotDuration: a.slot_duration_minutes, bufferAfter: a.buffer_after_minutes, isActive: a.is_active,
      });
    });
    return grouped;
  });

  const [blocked, setBlocked] = useState(initialBlocked);
  const [newBlockStart, setNewBlockStart] = useState("");
  const [newBlockEnd, setNewBlockEnd] = useState("");
  const [newBlockReason, setNewBlockReason] = useState("");

  function addSlot(day: number) {
    setSchedule((s) => ({
      ...s,
      [day]: [...s[day], { startTime: "09:00", endTime: "13:00", slotDuration: 50, bufferAfter: 10, isActive: true }],
    }));
  }

  function removeSlot(day: number, index: number) {
    setSchedule((s) => ({ ...s, [day]: s[day].filter((_, i) => i !== index) }));
  }

  function updateSlot(day: number, index: number, field: string, value: string | number | boolean) {
    setSchedule((s) => ({
      ...s,
      [day]: s[day].map((slot, i) => i === index ? { ...slot, [field]: value } : slot),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    const slots: AvailabilitySlotInput[] = [];
    for (const [day, daySlots] of Object.entries(schedule)) {
      daySlots.forEach((slot) => {
        slots.push({ weekday: Number(day), startTime: slot.startTime, endTime: slot.endTime, slotDuration: slot.slotDuration, bufferAfter: slot.bufferAfter, isActive: slot.isActive });
      });
    }

    const result = await updateAvailabilityAction(therapistProfileId, slots);
    if (result.success) {
      setMessage({ type: "success", text: "Schedule saved successfully." });
      router.refresh();
    } else {
      setMessage({ type: "error", text: result.error || "Failed to save." });
    }
    setSaving(false);
  }

  async function handleAddBlocked() {
    if (!newBlockStart || !newBlockEnd) return;
    const result = await addBlockedPeriodAction(therapistProfileId, newBlockStart, newBlockEnd, newBlockReason);
    if (result.success) {
      setNewBlockStart(""); setNewBlockEnd(""); setNewBlockReason("");
      router.refresh();
    }
  }

  async function handleRemoveBlocked(id: string) {
    await removeBlockedPeriodAction(id, therapistProfileId);
    setBlocked((b) => b.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm ${message.type === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`} role="alert">
          {message.text}
        </div>
      )}

      {/* Weekly Schedule */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="flex items-center gap-2 text-base font-semibold text-text">
          <Clock className="h-4 w-4 text-primary" aria-hidden="true" /> Weekly Schedule
        </h2>
        <div className="mt-4 space-y-4">
          {DAYS.map((day, dayIndex) => (
            <div key={day} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text">{day}</span>
                <button type="button" onClick={() => addSlot(dayIndex)} className="text-xs font-medium text-primary hover:text-primary-hover">
                  <Plus className="inline h-3 w-3" /> Add Slot
                </button>
              </div>
              {schedule[dayIndex].length === 0 && (
                <p className="mt-2 text-xs text-muted">No availability set</p>
              )}
              {schedule[dayIndex].map((slot, idx) => (
                <div key={idx} className="mt-2 flex flex-wrap items-center gap-2">
                  <input type="time" value={slot.startTime} onChange={(e) => updateSlot(dayIndex, idx, "startTime", e.target.value)} className="rounded-lg border border-border px-2 py-1.5 text-xs" aria-label="Start time" />
                  <span className="text-xs text-muted">to</span>
                  <input type="time" value={slot.endTime} onChange={(e) => updateSlot(dayIndex, idx, "endTime", e.target.value)} className="rounded-lg border border-border px-2 py-1.5 text-xs" aria-label="End time" />
                  <select value={slot.slotDuration} onChange={(e) => updateSlot(dayIndex, idx, "slotDuration", Number(e.target.value))} className="rounded-lg border border-border px-2 py-1.5 text-xs" aria-label="Slot duration">
                    <option value={30}>30 min</option><option value={45}>45 min</option><option value={50}>50 min</option><option value={60}>60 min</option>
                  </select>
                  <button type="button" onClick={() => removeSlot(dayIndex, idx)} className="rounded p-1 text-danger hover:bg-danger/10" aria-label="Remove slot">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
        <button type="button" onClick={handleSave} disabled={saving} className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60">
          {saving ? "Saving..." : "Save Schedule"}
        </button>
      </div>

      {/* Blocked Periods */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="flex items-center gap-2 text-base font-semibold text-text">
          <Calendar className="h-4 w-4 text-primary" aria-hidden="true" /> Blocked Periods
        </h2>
        <p className="mt-1 text-xs text-text-secondary">Mark dates when you are unavailable (vacations, holidays, etc.)</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <input type="datetime-local" value={newBlockStart} onChange={(e) => setNewBlockStart(e.target.value)} className="rounded-lg border border-border px-3 py-2 text-xs" aria-label="Block start" />
          <input type="datetime-local" value={newBlockEnd} onChange={(e) => setNewBlockEnd(e.target.value)} className="rounded-lg border border-border px-3 py-2 text-xs" aria-label="Block end" />
          <input type="text" value={newBlockReason} onChange={(e) => setNewBlockReason(e.target.value)} placeholder="Reason (optional)" className="rounded-lg border border-border px-3 py-2 text-xs" />
          <button type="button" onClick={handleAddBlocked} className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-primary-hover">Add</button>
        </div>

        {blocked.length > 0 && (
          <div className="mt-4 space-y-2">
            {blocked.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <div>
                  <p className="text-xs font-medium text-text">
                    {new Date(p.start_datetime).toLocaleDateString("en-IN")} — {new Date(p.end_datetime).toLocaleDateString("en-IN")}
                  </p>
                  {p.reason && <p className="text-xs text-muted">{p.reason}</p>}
                </div>
                <button type="button" onClick={() => handleRemoveBlocked(p.id)} className="text-danger hover:bg-danger/10 rounded p-1" aria-label="Remove">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-16 lg:hidden" />
    </div>
  );
}
