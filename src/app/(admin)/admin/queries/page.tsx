import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { MessageCircle, Mail, Phone, Clock } from "lucide-react";

export const metadata = { title: "Patient Queries — Admin" };

export default async function AdminQueriesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: queries } = await supabase
    .from("queries")
    .select("*")
    .order("created_at", { ascending: false });

  const allQueries = queries || [];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Patient Queries</h1>
          <p className="mt-1 text-sm text-text-secondary">{allQueries.length} total queries</p>
        </div>
      </div>

      {allQueries.length > 0 ? (
        <div className="space-y-4">
          {allQueries.map((q) => (
            <div key={q.id} className="rounded-2xl border border-border bg-white p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-text">{q.full_name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      q.status === "new" ? "bg-primary-light text-primary" : "bg-surface text-muted"
                    }`}>
                      {q.status}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" aria-hidden="true" /> {q.email}
                    </span>
                    {q.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" aria-hidden="true" /> {q.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {new Date(q.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-border bg-surface px-3 py-1 text-[10px] font-medium text-text-secondary">
                  {q.query_type}
                </span>
              </div>
              <div className="mt-3 rounded-lg bg-surface p-3">
                <p className="text-sm text-text whitespace-pre-wrap">{q.message}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <MessageCircle className="mx-auto h-10 w-10 text-muted" aria-hidden="true" />
          <h2 className="mt-4 text-base font-semibold text-text">No queries yet</h2>
          <p className="mt-1 text-sm text-text-secondary">Patient queries from the homepage will appear here.</p>
        </div>
      )}
    </div>
  );
}
