export default function TherapistPatientsLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-28 rounded-lg bg-surface" />
          <div className="mt-2 h-4 w-32 rounded-lg bg-surface" />
        </div>
        <div className="h-10 w-64 rounded-xl bg-surface" />
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 rounded-2xl border border-border bg-white" />
        ))}
      </div>
    </div>
  );
}
