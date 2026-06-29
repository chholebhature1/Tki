import { Users, UserCheck, Calendar, CheckCircle, Star, Clock } from "lucide-react";
import { AdminRepository } from "@/features/admin";
import { StatCard } from "@/features/dashboard";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const stats = await AdminRepository.getStats();

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text sm:text-3xl">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">Platform overview and management.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} />
        <StatCard icon={Users} label="Patients" value={stats.totalPatients} />
        <StatCard icon={UserCheck} label="Therapists" value={stats.totalTherapists} />
        <StatCard icon={Clock} label="Pending Verification" value={stats.pendingVerification} />
        <StatCard icon={Calendar} label="Today's Appointments" value={stats.todayAppointments} />
        <StatCard icon={CheckCircle} label="Completed Sessions" value={stats.completedSessions} />
        <StatCard icon={Star} label="Avg Rating" value={stats.averageRating} />
      </div>
    </div>
  );
}
