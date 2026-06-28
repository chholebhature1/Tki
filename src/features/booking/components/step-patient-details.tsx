import type { PatientDetails } from "../types";
import { languageOptions } from "../constants";

interface StepPatientDetailsProps {
  details: PatientDetails | null;
  onChange: (details: PatientDetails) => void;
}

export function StepPatientDetails({ details, onChange }: StepPatientDetailsProps) {
  const current: PatientDetails = details || { reason: "", preferredLanguage: "English", notes: "" };

  function update(field: keyof PatientDetails, value: string) {
    onChange({ ...current, [field]: value });
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-text">Session Details</h2>
      <p className="mt-1 text-sm text-text-secondary">Help your therapist prepare for your session.</p>

      <div className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="reason" className="text-sm font-medium text-text">
            Reason for consultation <span className="text-danger">*</span>
          </label>
          <select
            id="reason"
            value={current.reason}
            onChange={(e) => update("reason", e.target.value)}
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select a reason...</option>
            <option value="anxiety">Anxiety</option>
            <option value="depression">Depression</option>
            <option value="stress">Stress & Burnout</option>
            <option value="relationships">Relationship Issues</option>
            <option value="grief">Grief & Loss</option>
            <option value="self-esteem">Self-Esteem</option>
            <option value="career">Career Challenges</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="language" className="text-sm font-medium text-text">
            Preferred language
          </label>
          <select
            id="language"
            value={current.preferredLanguage}
            onChange={(e) => update("preferredLanguage", e.target.value)}
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {languageOptions.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="notes" className="text-sm font-medium text-text">
            Additional notes <span className="text-xs text-muted">(optional)</span>
          </label>
          <textarea
            id="notes"
            rows={3}
            value={current.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Anything you'd like your therapist to know beforehand..."
            className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
    </div>
  );
}
