export default function TherapistAppointmentsLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-32 rounded-lg bg-surface" />
          <div className="mt-2 h-4 w-44 rounded-lg bg-surface" />
        </div>
        <div className="h-10 w-64 rounded-xl bg-surface" />
      </div>
      <div className="h-12 rounded-xl border border-border bg-white" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl border border-border bg-white" />
        ))}
      </div>
    </div>
  );
}
