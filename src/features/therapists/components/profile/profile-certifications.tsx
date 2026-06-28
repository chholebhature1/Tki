import { Award } from "lucide-react";
import type { Certification } from "../../types";

interface ProfileCertificationsProps {
  certifications: Certification[];
}

export function ProfileCertifications({ certifications }: ProfileCertificationsProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-text">Certifications</h2>
      <div className="mt-3 space-y-2">
        {certifications.map((cert, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl border border-border p-4"
          >
            <Award className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-text">{cert.name}</p>
              <p className="text-xs text-text-secondary">
                {cert.issuer} · {cert.year}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
