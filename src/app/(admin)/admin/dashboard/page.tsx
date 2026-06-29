import Link from "next/link";
import { Users, UserCheck, Calendar, CheckCircle, Star, Clock, ArrowRight } from "lucide-react";
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} />
        <StatCard icon={Users} label="Patients" value={stats.totalPatients} />
        <StatCard icon={UserCheck} label="Therapists" value={stats.totalTherapists} />
        <StatCard icon={Clock} label="Pending Verification" value={stats.pendingVerification} />
        <StatCard icon={Calendar} label="Today's Appointments" value={stats.todayAppointments} />
        <StatCard icon={CheckCircle} label="Completed Sessions" value={stats.completedSessions} />
        <StatCard icon={Star} label="Avg Rating" value={stats.averageRating} />
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-semibold text-text">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link href="/admin/therapists" className="group flex items-center justify-between rounded-2xl border border-border bg-white p-4 transition-all hover:border-primary/30 hover:shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
                <UserCheck className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">Review Therapists</p>
                <p className="text-xs text-text-secondary">{stats.pendingVerification} pending</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <Link href="/admin/users" className="group flex items-center justify-between rounded-2xl border border-border bg-white p-4 transition-all hover:border-primary/30 hover:shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
                <Users className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">Manage Users</p>
                <p className="text-xs text-text-secondary">{stats.totalUsers} total</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <Link href="/admin/appointments" className="group flex items-center justify-between rounded-2xl border border-border bg-white p-4 transition-all hover:border-primary/30 hover:shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
                <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">View Appointments</p>
                <p className="text-xs text-text-secondary">{stats.todayAppointments} today</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
