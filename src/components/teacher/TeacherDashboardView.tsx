import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  Users,
  FileText,
  LifeBuoy,
  Video,
  Clock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Play,
  ClipboardCheck,
  Copy,
  Check,
  DollarSign,
} from 'lucide-react';
import { api } from '../../lib/api';
import { TeacherTab } from './TeacherLayout';
import { ClassSession, DemoSession } from '../../types';

interface TeacherDashboardViewProps {
  onNavigateTab: (tab: TeacherTab) => void;
  onOpenEvaluation: (demoId: string) => void;
  onSuccessToast?: (msg: string) => void;
  onErrorToast?: (msg: string) => void;
}

export function TeacherDashboardView({
  onNavigateTab,
  onOpenEvaluation,
  onSuccessToast,
  onErrorToast,
}: TeacherDashboardViewProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    teacher: any;
    metrics: {
      todayClassesCount: number;
      upcomingDemosCount: number;
      activeStudentsCount: number;
      pendingHomeworkCount: number;
      openTicketsCount: number;
    };
    todayClasses: any[];
    upcomingDemos: any[];
  } | null>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getTeacherDashboard();
      setData(res);
    } catch (err: any) {
      if (onErrorToast) onErrorToast('Unable to load teaching dashboard. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-slate-200/80 rounded-xl"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200/70 rounded-xl"></div>
          ))}
        </div>
        <div className="h-64 bg-slate-200/70 rounded-xl"></div>
      </div>
    );
  }

  const teacherName = data?.teacher?.name || 'Educator';
  const metrics = data?.metrics || {
    todayClassesCount: 0,
    upcomingDemosCount: 0,
    activeStudentsCount: 0,
    pendingHomeworkCount: 0,
    openTicketsCount: 0,
  };

  return (
    <div className="space-y-8">
      {/* Header greeting */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#10182C] tracking-tight">
            Good morning, {teacherName}
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Here is your active teaching overview for today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('classes')}
            className="px-4 py-2 bg-[#10182C] text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>My Batches</span>
          </button>
          <button
            onClick={() => onNavigateTab('demos')}
            className="px-4 py-2 bg-[#F27C00] text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition flex items-center gap-2 shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Demo Students</span>
          </button>
        </div>
      </div>

      {/* Useful Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          onClick={() => onNavigateTab('classes')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-400 cursor-pointer transition shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">Today's Classes</span>
            <Calendar className="w-4 h-4 text-[#F27C00]" />
          </div>
          <div className="text-2xl font-bold text-[#10182C]">{metrics.todayClassesCount}</div>
          <div className="text-[11px] text-slate-600 mt-1">Scheduled cohorts</div>
        </div>

        <div
          onClick={() => onNavigateTab('demos')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-400 cursor-pointer transition shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">Upcoming Demos</span>
            <Sparkles className="w-4 h-4 text-[#F27C00]" />
          </div>
          <div className="text-2xl font-bold text-[#10182C]">{metrics.upcomingDemosCount}</div>
          <div className="text-[11px] text-slate-600 mt-1">Assigned demo slots</div>
        </div>

        <div
          onClick={() => onNavigateTab('classes')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-400 cursor-pointer transition shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">Active Students</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-[#10182C]">{metrics.activeStudentsCount}</div>
          <div className="text-[11px] text-slate-600 mt-1">Across your cohorts</div>
        </div>

        <div
          onClick={() => onNavigateTab('homework')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-400 cursor-pointer transition shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">Pending Homework</span>
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-[#10182C]">{metrics.pendingHomeworkCount}</div>
          <div className="text-[11px] text-slate-600 mt-1">Awaiting mentor review</div>
        </div>

        <div
          onClick={() => onNavigateTab('helpdesk')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-400 cursor-pointer transition shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">Open Tickets</span>
            <LifeBuoy className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-[#10182C]">{metrics.openTicketsCount}</div>
          <div className="text-[11px] text-slate-600 mt-1">Support conversations</div>
        </div>
      </div>

      {/* Teacher Google Meet & Room Link Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 shadow-xs border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#F27C00]/20 border border-[#F27C00]/40 flex items-center justify-center shrink-0">
            <Video className="w-6 h-6 text-[#F27C00]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Your Permanent Google Meet Link:</span>
              {data?.teacher?.google_meet_link ? (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  ACTIVE ROOM
                </span>
              ) : (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                  NOT CONFIGURED
                </span>
              )}
            </div>
            <div className="text-xs text-slate-300 mt-0.5 font-mono">
              {data?.teacher?.google_meet_link || 'Set your link once in profile (e.g. meet.google.com/xxx-yyyy-zzz) to auto-attach to all demos'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {data?.teacher?.google_meet_link && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(data.teacher.google_meet_link);
                if (onSuccessToast) onSuccessToast('Meeting link copied to clipboard!');
              }}
              className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>
          )}

          <button
            onClick={() => onNavigateTab('profile')}
            className="px-4 py-2 bg-[#F27C00] hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>{data?.teacher?.google_meet_link ? 'Edit Meet Link' : 'Set Meet Link'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SECTION: TODAY'S CLASSES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#10182C] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#F27C00]" />
              Today's Scheduled Classes
            </h2>
            <p className="text-xs text-slate-500">Classes ready for live delivery today</p>
          </div>
          <button
            onClick={() => onNavigateTab('classes')}
            className="text-xs font-semibold text-[#F27C00] hover:underline flex items-center gap-1"
          >
            <span>View All Batches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {data?.todayClasses && data.todayClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.todayClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-amber-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {cls.grade_group || 'Class 4-7'}
                      </span>
                      <h3 className="font-bold text-[#10182C] text-base mt-2">{cls.batch_name}</h3>
                      <p className="text-xs text-slate-500">{cls.course_name}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                        {cls.student_count || 8} / {cls.target_capacity || 8} Students
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <Clock className="w-4 h-4 text-[#F27C00]" />
                      <span>{cls.start_time} – {cls.end_time} IST</span>
                    </div>
                    <div className="text-xs text-slate-600">
                      <strong>Topic:</strong> {cls.topic}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <a
                    href={cls.meeting_link || 'https://meet.google.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-2.5 bg-[#F27C00] text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Play className="w-4 h-4" />
                    <span>JOIN CLASS</span>
                  </a>
                  <button
                    onClick={() => onNavigateTab('classes')}
                    className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center text-slate-500">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">No classes scheduled for today.</p>
            <p className="text-xs text-slate-600 mt-1">Check your assigned cohorts in Class Management.</p>
          </div>
        )}
      </section>

      {/* SECTION: UPCOMING DEMOS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#10182C] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F27C00]" />
              Upcoming Demo Students
            </h2>
            <p className="text-xs text-slate-500">1-on-1 or small-group assessment demos assigned to you</p>
          </div>
          <button
            onClick={() => onNavigateTab('demos')}
            className="text-xs font-semibold text-[#F27C00] hover:underline flex items-center gap-1"
          >
            <span>View All Demos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {data?.upcomingDemos && data.upcomingDemos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.upcomingDemos.map((demo) => (
              <div
                key={demo.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-amber-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded uppercase tracking-wider">
                        {demo.status}
                      </span>
                      <h4 className="font-bold text-[#10182C] text-base mt-2">
                        {demo.student_name || 'Demo Student'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {demo.student_class || 'Class 6'} &bull; {demo.city || 'India'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                    <div><strong>Parent:</strong> {demo.parent_name || 'Parent'}</div>
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#F27C00]" />
                      <span>{demo.date} at {demo.start_time}</span>
                    </div>
                    {demo.evaluation_outcome && (
                      <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        Outcome: {demo.evaluation_outcome}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={demo.meeting_link || 'https://meet.google.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-2 bg-[#10182C] text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
                  >
                    Start Demo
                  </a>
                  <button
                    onClick={() => onOpenEvaluation(demo.id)}
                    className="flex-1 py-2 bg-[#F27C00] text-white rounded-lg text-xs font-semibold hover:bg-amber-600 transition flex items-center justify-center gap-1"
                  >
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    <span>Evaluate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center text-slate-500">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">No demo sessions assigned yet.</p>
            <p className="text-xs text-slate-600 mt-1">When parents request free demos on Upspeaq, assigned demos will appear here.</p>
          </div>
        )}
      </section>
    </div>
  );
}
