export default function TherapistDashboardLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-52 rounded-lg bg-surface" />
          <div className="mt-2 h-4 w-36 rounded-lg bg-surface" />
        </div>
        <div className="h-11 w-44 rounded-xl bg-surface" />
      </div>

      {/* Today's sessions */}
      <div className="rounded-2xl border border-border bg-white">
        <div className="border-b border-border px-5 py-4">
          <div className="h-5 w-36 rounded bg-surface" />
        </div>
        <div className="divide-y divide-border">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="h-4 w-12 rounded bg-surface" />
              <div className="h-3 w-3 rounded-full bg-surface" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-32 rounded bg-surface" />
                <div className="h-3 w-24 rounded bg-surface" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="h-48 rounded-2xl border border-border bg-white" />
        <div className="space-y-4">
          <div className="h-36 rounded-2xl border border-border bg-white" />
          <div className="h-32 rounded-2xl border border-border bg-white" />
        </div>
      </div>
    </div>
  );
}
