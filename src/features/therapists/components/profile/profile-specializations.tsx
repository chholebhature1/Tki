interface ProfileSpecializationsProps {
  specializations: string[];
}

export function ProfileSpecializations({ specializations }: ProfileSpecializationsProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-text">Areas of Expertise</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {specializations.map((spec) => (
          <span
            key={spec}
            className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-text-secondary"
          >
            {spec}
          </span>
        ))}
      </div>
    </section>
  );
}
