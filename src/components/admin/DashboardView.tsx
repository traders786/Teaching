import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { DashboardStats, Lead, DemoSession } from '../../types';
import {
  Users,
  Calendar,
  GraduationCap,
  IndianRupee,
  Clock,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Sparkles,
  PhoneCall,
  CheckCircle,
} from 'lucide-react';
import { Badge } from '../ui/Badge';

interface DashboardViewProps {
  onNavigateToLeads: () => void;
  onNavigateToDemos: () => void;
  onNavigateToStudents: () => void;
  onNavigateToBatches: () => void;
  onNavigateToPayments: () => void;
  onOpenLeadDetail: (lead: Lead) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToLeads,
  onNavigateToDemos,
  onNavigateToStudents,
  onNavigateToBatches,
  onNavigateToPayments,
  onOpenLeadDetail,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [upcomingDemos, setUpcomingDemos] = useState<DemoSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDashboardStats();
      setStats(data.stats);
      setRecentLeads(data.recentLeads || []);
      setUpcomingDemos(data.upcomingDemos || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2 text-slate-500">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs">Aggregating live operations telemetry...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8">
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error || 'Unable to display dashboard.'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 text-left">
      {/* Top Welcome & Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Operations Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time enrollment funnel, demo schedules, and small-batch capacity monitoring
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToLeads}
            className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            Review New Leads ({stats.new_leads ?? stats.newLeads ?? 0})
          </button>
          <button
            onClick={onNavigateToDemos}
            className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            Today's Demos ({stats.demos_scheduled ?? stats.demoScheduled ?? 0})
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (6 core metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inflow */}
        <div
          onClick={onNavigateToLeads}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-amber-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Total Inbound Leads</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.total_leads ?? stats.totalLeads ?? 0}</div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">
            {stats.new_leads ?? stats.newLeads ?? 0} awaiting initial call
          </div>
        </div>

        {/* Demo Pipeline */}
        <div
          onClick={onNavigateToDemos}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-amber-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Demo Pipeline</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.demos_scheduled ?? stats.demoScheduled ?? 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {stats.demos_attended ?? stats.demoCompleted ?? 0} completed sessions
          </div>
        </div>

        {/* Active Students */}
        <div
          onClick={onNavigateToStudents}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-amber-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Active Students</span>
            <GraduationCap className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.active_students ?? stats.activeStudents ?? 0}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            {stats.paid_conversions ?? stats.convertedStudents ?? 0} paid enrollments
          </div>
        </div>

        {/* Total Revenue */}
        <div
          onClick={onNavigateToPayments}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-amber-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Verified Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{(stats.total_revenue_inr ?? stats.totalRevenue ?? 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {stats.batches_count ?? stats.batchesCount ?? 0} cohorts currently active
          </div>
        </div>
      </div>

      {/* Two-Column Working Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Recent Inbound Leads */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Inbound Registrations</h3>
              <p className="text-[11px] text-slate-500">Click any parent or student to view notes or schedule</p>
            </div>
            <button
              onClick={onNavigateToLeads}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentLeads.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No leads registered yet.</p>
            ) : (
              recentLeads.slice(0, 6).map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => onOpenLeadDetail(lead)}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/80 -mx-2 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {lead.student_name}
                      </span>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-medium">
                        {lead.student_class}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>P: {lead.parent_name}</span>
                      <span>•</span>
                      <span>{lead.mobile_number}</span>
                      {lead.city && <span>• {lead.city}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="lead" value={lead.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Today's Demos & Batch Occupancy */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Demos */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Upcoming Live Demos</h3>
                <p className="text-[11px] text-slate-500">2-Student interactive evaluations</p>
              </div>
              <button
                onClick={onNavigateToDemos}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingDemos.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No upcoming demos scheduled today.</p>
              ) : (
                upcomingDemos.slice(0, 4).map((demo) => (
                  <div
                    key={demo.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{demo.student_name || demo.title || 'Demo Evaluation'}</span>
                      <Badge variant="demo" value={demo.status} />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{demo.scheduled_at || (demo.date ? `${demo.date} ${demo.start_time}` : 'Scheduled')}</span>
                      <span>Coach: {demo.teacher_name || 'Assigned Coach'}</span>
                    </div>
                    {demo.meeting_link && (
                      <a
                        href={demo.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-semibold text-amber-700 hover:underline block"
                      >
                        Join Room: {demo.meeting_link}
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Strict Batch Cap Reminder */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Operational Rule: 8 Students Target Batch</span>
            </div>
            <p className="leading-relaxed text-amber-900/90">
              Active batches must not exceed 9 enrolled students. When a batch reaches 8 students, the system flags
              it as "Near Full" so coordinators open the next cohort.
            </p>
            <button
              onClick={onNavigateToBatches}
              className="text-xs font-bold text-amber-800 hover:underline pt-1 block"
            >
              Inspect Batch Capacities →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
