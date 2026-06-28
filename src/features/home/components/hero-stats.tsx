const stats = [
  { value: "500+", label: "Verified Therapists" },
  { value: "50,000+", label: "Sessions Completed" },
  { value: "4.9", label: "Average Rating" },
] as const;

export function HeroStats() {
  return (
    <div className="grid grid-cols-3 gap-4 sm:gap-8">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="text-xl font-bold text-text sm:text-2xl">
            {stat.value}
          </p>
          <p className="mt-1 text-xs text-text-secondary sm:text-sm">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
