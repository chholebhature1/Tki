"use client";

import { useState } from "react";
import { createTestAppointmentAction } from "@/features/admin/actions/role.actions";

export default function AdminToolsPage() {
  const [patientId, setPatientId] = useState("");
  const [therapistProfileId, setTherapistProfileId] = useState("");
  const [minutes, setMinutes] = useState("5");
  const [result, setResult] = useState<{ success: boolean; appointmentId?: string; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    setResult(null);
    const res = await createTestAppointmentAction(patientId, therapistProfileId, Number(minutes));
    setResult(res);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Admin Tools</h1>
        <p className="mt-1 text-sm text-text-secondary">Create test data for development and demo purposes.</p>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="text-base font-semibold text-text">Create Test Appointment</h2>
        <p className="mt-1 text-xs text-text-secondary">Creates a confirmed appointment starting in the specified minutes.</p>

        <div className="mt-4 space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text">Patient Profile ID</label>
            <input type="text" value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="UUID of the patient (from profiles.id)" className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text">Therapist Profile ID</label>
            <input type="text" value={therapistProfileId} onChange={(e) => setTherapistProfileId(e.target.value)} placeholder="UUID from therapist_profiles.id" className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            <p className="text-xs text-muted">Demo therapist: 00000000-0000-0000-0001-000000000001</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text">Start in (minutes)</label>
            <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <button onClick={handleCreate} disabled={loading || !patientId || !therapistProfileId} className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50">
            {loading ? "Creating..." : "Create Appointment"}
          </button>
        </div>

        {result && (
          <div className={`mt-4 rounded-lg px-4 py-3 text-sm ${result.success ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
            {result.success ? (
              <div>
                <p>✓ Appointment created!</p>
                <p className="mt-1 text-xs">ID: {result.appointmentId}</p>
                <p className="text-xs">Join at: /consultation/{result.appointmentId}</p>
              </div>
            ) : (
              <p>{result.error}</p>
            )}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-base font-semibold text-text">How to Test Video Consultation</h2>
        <ol className="mt-3 space-y-2 text-sm text-text-secondary list-decimal list-inside">
          <li>Go to /admin/users and change a user&apos;s role to &quot;therapist&quot;</li>
          <li>Copy the patient&apos;s profile ID and the therapist_profiles.id</li>
          <li>Use the form above to create a confirmed appointment (5 min from now)</li>
          <li>Open /consultation/[appointment-id] in two browser windows</li>
          <li>Log in as patient in one, therapist in the other</li>
          <li>Both will enter the LiveKit video room</li>
        </ol>
      </div>
    </div>
  );
}
