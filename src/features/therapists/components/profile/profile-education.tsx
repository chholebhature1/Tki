import type { Education } from "../../types";

interface ProfileEducationProps {
  education: Education[];
}

export function ProfileEducation({ education }: ProfileEducationProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-text">Education</h2>
      <div className="mt-3 space-y-3">
        {education.map((edu, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-text">{edu.degree}</p>
              <p className="text-sm text-text-secondary">
                {edu.institution} · {edu.year}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
