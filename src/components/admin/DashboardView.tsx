import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Lead, DemoSession, Teacher } from '../../types';
import {
  Users,
  Calendar,
  GraduationCap,
  IndianRupee,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Video,
  UserPlus,
  RefreshCw,
  X,
  Layers,
  Radio,
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
  const [stats, setStats] = useState<any | null>(null);
  const [exceptions, setExceptions] = useState<any | null>(null);
  const [recentPlacements, setRecentPlacements] = useState<any[]>([]);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [upcomingDemos, setUpcomingDemos] = useState<DemoSession[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quick Action Modals from Exception Center
  const [assignTeacherModal, setAssignTeacherModal] = useState<{ open: boolean; batch: any | null }>({ open: false, batch: null });
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [meetLinkModal, setMeetLinkModal] = useState<{ open: boolean; batch: any | null }>({ open: false, batch: null });
  const [newMeetUrl, setNewMeetUrl] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashData, teacherData] = await Promise.all([
        api.getDashboardStats(),
        api.getTeachers(),
      ]);
      setStats(dashData.stats || dashData.metrics);
      setExceptions((dashData as any).exceptions || null);
      setRecentPlacements((dashData as any).recentPlacements || []);
      setRecentLeads(dashData.recentLeads || []);
      setUpcomingDemos(dashData.upcomingDemos || []);
      setTeachers(teacherData.teachers || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTeacherModal.batch || !selectedTeacherId) return;
    setActionLoading(true);
    try {
      await api.assignBatchTeacher(assignTeacherModal.batch.id, selectedTeacherId);
      setAssignTeacherModal({ open: false, batch: null });
      setSelectedTeacherId('');
      loadDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to assign teacher.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveMeetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetLinkModal.batch || !newMeetUrl) return;
    setActionLoading(true);
    try {
      await api.updateBatchMeetingLink(meetLinkModal.batch.id, newMeetUrl);
      setMeetLinkModal({ open: false, batch: null });
      setNewMeetUrl('');
      loadDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to update meeting link.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRetryPlacement = async (enrollmentId: string) => {
    try {
      await api.retryAutoPlace(enrollmentId);
      loadDashboard();
    } catch (err: any) {
      alert(err.message || 'Placement retry failed.');
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2 text-slate-500">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs">Aggregating live academy operations & placement telemetry...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8">
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error || 'Unable to display operations control center.'}</span>
        </div>
      </div>
    );
  }

  const needsAttentionCount =
    (exceptions?.batchesNeedsTeacher?.length || 0) +
    (exceptions?.batchesMissingMeet?.length || 0) +
    (exceptions?.studentsWaitingPlacement?.length || 0) +
    (exceptions?.pendingPaymentsCount || 0);

  return (
    <div className="p-6 md:p-8 space-y-8 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Operations Control Center</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              Automated Academy
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated student placement, 8-student cohort capacity tracking, and exception management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDashboard}
            className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={onNavigateToBatches}
            className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            Manage Cohorts ({stats.batches_count ?? stats.activeBatches ?? 0})
          </button>
        </div>
      </div>

      {/* EXCEPTION CENTER: Needs Attention Section */}
      {needsAttentionCount > 0 ? (
        <div className="bg-amber-500/10 border border-amber-300/80 rounded-2xl p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                {needsAttentionCount}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Needs Attention (Exception Center)</h3>
                <p className="text-[11px] text-slate-600">Actionable operational items requiring administrative review</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-amber-900 bg-amber-200/60 px-2.5 py-1 rounded-full">
              Automated Rules Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {/* 1. Batches Needing Teacher */}
            {exceptions?.batchesNeedsTeacher?.map((b: any) => (
              <div key={b.id} className="p-3.5 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{b.batch_name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                    Needs Teacher
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {b.schedule_days} • {b.schedule_time} ({b.enrolled_count || 0}/{b.max_capacity || 8} students)
                </div>
                <button
                  onClick={() => setAssignTeacherModal({ open: true, batch: b })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Assign Teacher</span>
                </button>
              </div>
            ))}

            {/* 2. Batches Missing Meet Link */}
            {exceptions?.batchesMissingMeet?.map((b: any) => (
              <div key={b.id} className="p-3.5 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{b.batch_name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Missing Meet Link
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Coach: {b.teacher_name || 'Assigned Coach'} • {b.schedule_days}
                </div>
                <button
                  onClick={() => setMeetLinkModal({ open: true, batch: b })}
                  className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Publish Meet URL</span>
                </button>
              </div>
            ))}

            {/* 3. Students Waiting for Placement */}
            {exceptions?.studentsWaitingPlacement?.map((enr: any) => (
              <div key={enr.id} className="p-3.5 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{enr.student_name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    Waiting Placement
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {enr.course_name} • {enr.class_grade || 'Junior'}
                </div>
                <button
                  onClick={() => handleRetryPlacement(enr.id)}
                  className="w-full mt-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Auto-Place in Batch</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900">Automation Engine Operational: </span>
              <span>All active enrollments are assigned, batch capacities are balanced, and all classes have links published.</span>
            </div>
          </div>
          <button
            onClick={onNavigateToBatches}
            className="text-emerald-800 font-bold hover:underline shrink-0"
          >
            View Cohorts →
          </button>
        </div>
      )}

      {/* Primary KPI Grid (6 core metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Active Students */}
        <div
          onClick={onNavigateToStudents}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-amber-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Active Students</span>
            <GraduationCap className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.active_students ?? stats.activeStudents ?? 0}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
            {stats.paid_conversions ?? stats.convertedStudents ?? 0} converted
          </div>
        </div>

        {/* Active Batches */}
        <div
          onClick={onNavigateToBatches}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-amber-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Active Batches</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.batches_count ?? stats.activeBatches ?? 0}</div>
          <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
            {stats.fullBatches || 0} cohorts at full cap (8/8)
          </div>
        </div>

        {/* Classes Today */}
        <div
          onClick={onNavigateToBatches}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-amber-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Classes Today</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.classes_today ?? stats.classesToday ?? 0}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Live speech sessions</div>
        </div>

        {/* Total Inbound Leads */}
        <div
          onClick={onNavigateToLeads}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-amber-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Inbound Leads</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.total_leads ?? stats.totalLeads ?? 0}</div>
          <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
            {stats.new_leads ?? stats.newLeads ?? 0} awaiting call
          </div>
        </div>

        {/* Demo Pipeline */}
        <div
          onClick={onNavigateToDemos}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-amber-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Demo Pipeline</span>
            <Sparkles className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.demos_scheduled ?? stats.demoScheduled ?? 0}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {stats.demos_attended ?? stats.demoCompleted ?? 0} completed
          </div>
        </div>

        {/* Verified Revenue */}
        <div
          onClick={onNavigateToPayments}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-amber-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{(stats.total_revenue_inr ?? stats.totalRevenue ?? 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Fee verified</div>
        </div>
      </div>

      {/* Two-Column Working Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Automated Placement Trace & Inbound Leads */}
        <div className="lg:col-span-7 space-y-6">
          {/* Automated Placement Stream */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Automated Batch Placement Logs</h3>
                <p className="text-[11px] text-slate-500">Trace of demand batch creation, teacher assignments, and capacity fills</p>
              </div>
              <button
                onClick={onNavigateToStudents}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
              >
                <span>View Students</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentPlacements.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No automated placement events recorded yet.</p>
              ) : (
                recentPlacements.slice(0, 5).map((p) => (
                  <div key={p.id} className="py-3 flex items-start justify-between gap-3 text-left">
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{p.student_name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-100 text-slate-700">
                          {p.course_name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">{p.reason}</p>
                      <div className="text-[10px] text-slate-400">
                        {p.batch_name ? `Cohort: ${p.batch_name}` : 'Unassigned'} • Coach: {p.teacher_name || 'Pending'} • {p.created_at}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        p.status === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'WAITING_FOR_TEACHER'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status === 'SUCCESS' ? 'Placed' : p.status === 'WAITING_FOR_TEACHER' ? 'Needs Coach' : p.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Leads */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Admissions Registrations</h3>
                <p className="text-[11px] text-slate-500">Parent inquiries and demo requests</p>
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
              {recentLeads.slice(0, 4).map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => onOpenLeadDetail(lead)}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/80 -mx-2 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">{lead.student_name}</span>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-medium">
                        {lead.student_class}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>P: {lead.parent_name}</span>
                      <span>•</span>
                      <span>{lead.mobile_number}</span>
                    </div>
                  </div>
                  <Badge variant="lead" value={lead.status} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Live Demos & Policy Summary */}
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
                  <div key={demo.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{demo.title || 'Demo Evaluation'}</span>
                      <Badge variant="demo" value={demo.status} />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{demo.date ? `${demo.date} ${demo.start_time}` : 'Scheduled'}</span>
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

          {/* Automatic Academy Operating Principles Card */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-300 text-xs text-amber-950 space-y-3">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Academy Automation Rules</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-700 list-disc pl-4">
              <li><strong className="text-slate-900">8-Student Hard Cap:</strong> Batches lock at 8 members. The 9th enrollment automatically triggers the next cohort.</li>
              <li><strong className="text-slate-900">Max Catch-Up:</strong> Students will not be assigned to cohorts with &gt;2 sessions already elapsed.</li>
              <li><strong className="text-slate-900">Workload Balancing:</strong> Teachers are assigned automatically based on expertise, schedule availability, and current load.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MODAL: Assign Teacher to Batch */}
      {assignTeacherModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Assign Teacher to Batch</h3>
                <p className="text-xs text-slate-500">{assignTeacherModal.batch?.batch_name}</p>
              </div>
              <button
                onClick={() => setAssignTeacherModal({ open: false, batch: null })}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignTeacher} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Select Qualified Teacher</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">-- Choose Teacher --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.qualification || 'Educator'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignTeacherModal({ open: false, batch: null })}
                  className="px-3.5 py-2 border border-slate-300 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !selectedTeacherId}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  {actionLoading ? 'Assigning...' : 'Assign Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Publish Meeting Link */}
      {meetLinkModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Publish Google Meet Link</h3>
                <p className="text-xs text-slate-500">{meetLinkModal.batch?.batch_name}</p>
              </div>
              <button
                onClick={() => setMeetLinkModal({ open: false, batch: null })}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMeetLink} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Google Meet URL</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/xxx-yyyy-zzz"
                  value={newMeetUrl}
                  onChange={(e) => setNewMeetUrl(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[11px] text-slate-400">
                  This link will automatically be accessible to all enrolled students and the assigned teacher.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMeetLinkModal({ open: false, batch: null })}
                  className="px-3.5 py-2 border border-slate-300 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !newMeetUrl}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  {actionLoading ? 'Publishing...' : 'Publish Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
