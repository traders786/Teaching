import React, { useState, useEffect } from 'react';
import { DemoSession, Teacher } from '../../types';
import { api } from '../../lib/api';
import { Badge } from '../ui/Badge';
import {
  Calendar,
  Clock,
  Video,
  UserCheck,
  UserX,
  Plus,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Modal } from '../ui/Modal';

interface DemosViewProps {
  teachers: Teacher[];
  onSuccessToast: (msg: string) => void;
  onErrorToast: (msg: string) => void;
}

export const DemosView: React.FC<DemosViewProps> = ({ teachers, onSuccessToast, onErrorToast }) => {
  const [demos, setDemos] = useState<DemoSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Attendance/Outcome Modal state
  const [selectedDemo, setSelectedDemo] = useState<DemoSession | null>(null);
  const [demoOutcome, setDemoOutcome] = useState<'ATTENDED' | 'NO_SHOW' | 'CANCELLED' | 'CONVERTED'>('ATTENDED');
  const [teacherFeedback, setTeacherFeedback] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadDemos();
  }, [filterStatus]);

  const loadDemos = async () => {
    setLoading(true);
    try {
      const res = await api.getDemos({
        status: filterStatus !== 'ALL' ? filterStatus : undefined,
      });
      setDemos(res.demos || []);
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to load demo sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOutcome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDemo) return;
    setUpdating(true);
    try {
      await api.updateDemo(selectedDemo.id, {
        status: demoOutcome,
        teacher_feedback: teacherFeedback.trim() || undefined,
      });
      setSelectedDemo(null);
      loadDemos();
      onSuccessToast(`Demo outcome recorded as ${demoOutcome}`);
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to update demo');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Interactive Demo Sessions</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage live 2-student trial evaluations, track attendance, and record coach feedback
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadDemos()}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            title="Refresh Demos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Philosophy Banner */}
      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between gap-4 text-xs text-amber-950">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-amber-700 shrink-0" />
          <span>
            <strong>The 2-Student Demo Standard:</strong> We keep trial sessions strictly capped at 2 students so
            the mentor can spend 20 minutes directly evaluating the child's tone, hesitation, and expression.
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'SCHEDULED', 'ATTENDED', 'CONVERTED', 'NO_SHOW', 'CANCELLED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterStatus === st
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st === 'ALL' ? 'All Sessions' : st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Demos Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Student & Grade</th>
                <th className="py-3 px-4">Scheduled Slot</th>
                <th className="py-3 px-4">Educator</th>
                <th className="py-3 px-4">Meeting Room</th>
                <th className="py-3 px-4">Session Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {demos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    {loading ? 'Loading scheduled trials...' : 'No demo sessions found.'}
                  </td>
                </tr>
              ) : (
                demos.map((demo) => (
                  <tr key={demo.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{demo.student_name}</div>
                      <div className="text-[11px] text-slate-500">
                        {demo.student_class} • Parent: {demo.parent_name} ({demo.parent_phone})
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{demo.scheduled_at}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">Duration: {demo.duration_minutes} mins</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">{demo.teacher_name || 'Assigned Coach'}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      {demo.meeting_link ? (
                        <a
                          href={demo.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-700 hover:underline inline-flex items-center gap-1 font-semibold text-[11px]"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Enter Room</span>
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant="demo" value={demo.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedDemo(demo);
                          setDemoOutcome((demo.status as any) || 'ATTENDED');
                          setTeacherFeedback(demo.teacher_feedback || '');
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Record Outcome
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Demo Attendance / Feedback Modal */}
      <Modal
        isOpen={!!selectedDemo}
        onClose={() => setSelectedDemo(null)}
        title={`Demo Evaluation: ${selectedDemo?.student_name}`}
        subtitle={`Scheduled: ${selectedDemo?.scheduled_at}`}
        maxWidth="md"
      >
        {selectedDemo && (
          <form onSubmit={handleUpdateOutcome} className="space-y-4 text-left text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Attendance & Outcome</label>
              <select
                value={demoOutcome}
                onChange={(e) => setDemoOutcome(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="ATTENDED">Attended & Evaluated</option>
                <option value="CONVERTED">Attended & Ready to Enroll</option>
                <option value="NO_SHOW">Parent / Student Did Not Join (No Show)</option>
                <option value="CANCELLED">Session Cancelled / Rescheduled</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                Educator Qualitative Assessment & Recommendations
              </label>
              <textarea
                rows={3}
                value={teacherFeedback}
                onChange={(e) => setTeacherFeedback(e.target.value)}
                placeholder="Observed good enthusiasm. Hesitates when framing complex sentences. Recommend Junior Orators Batch B."
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedDemo(null)}
                className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white font-bold"
              >
                {updating ? 'Saving...' : 'Save Evaluation'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
