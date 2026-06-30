import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { IndianRupee, TrendingUp, Calendar, Star } from "lucide-react";
import { StatCard } from "@/features/dashboard";

export const metadata = { title: "Earnings — TalkIndia Pro" };

export default async function TherapistEarningsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tp } = await supabase
    .from("therapist_profiles")
    .select("id, consultation_fee, average_rating, total_reviews, total_sessions")
    .eq("profile_id", user.id)
    .single();

  if (!tp) redirect("/dashboard");

  const { data: completedAppts } = await supabase
    .from("appointments")
    .select("id, appointment_date")
    .eq("therapist_profile_id", tp.id)
    .eq("status", "completed");

  const totalCompleted = completedAppts?.length || 0;
  const estimatedRevenue = totalCompleted * Number(tp.consultation_fee) * 0.9; // After 10% platform fee
  const thisMonth = (completedAppts || []).filter((a) => {
    const d = new Date(a.appointment_date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const monthlyRevenue = thisMonth * Number(tp.consultation_fee) * 0.9;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold text-text">Earnings & Analytics</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={IndianRupee} label="Total Earnings" value={Math.round(estimatedRevenue)} />
        <StatCard icon={TrendingUp} label="This Month" value={Math.round(monthlyRevenue)} />
        <StatCard icon={Calendar} label="Total Sessions" value={totalCompleted} />
        <StatCard icon={Star} label="Avg Rating" value={Number(tp.average_rating)} />
      </div>

      {/* Revenue breakdown */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="text-base font-semibold text-text">Revenue Summary</h2>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-text-secondary">Session Fee</span>
            <span className="font-medium text-text">₹{Number(tp.consultation_fee).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-text-secondary">Platform Commission (10%)</span>
            <span className="text-text-secondary">- ₹{(Number(tp.consultation_fee) * 0.1).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-text">Net per Session</span>
            <span className="font-semibold text-primary">₹{(Number(tp.consultation_fee) * 0.9).toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="text-base font-semibold text-text">Performance</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-text">{tp.total_sessions}</p>
            <p className="text-xs text-text-secondary">Lifetime Sessions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-text">{tp.total_reviews}</p>
            <p className="text-xs text-text-secondary">Reviews</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-text">{Number(tp.average_rating).toFixed(1)}</p>
            <p className="text-xs text-text-secondary">Rating</p>
          </div>
        </div>
      </div>

      <div className="h-16 lg:hidden" />
    </div>
  );
}
