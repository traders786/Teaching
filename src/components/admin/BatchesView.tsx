import React, { useState, useEffect } from 'react';
import { Batch, Teacher, Course, Student } from '../../types';
import { api } from '../../lib/api';
import { Badge } from '../ui/Badge';
import {
  Layers,
  Plus,
  RefreshCw,
  Users2,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Modal } from '../ui/Modal';

interface BatchesViewProps {
  teachers: Teacher[];
  courses: Course[];
  onSuccessToast: (msg: string) => void;
  onErrorToast: (msg: string) => void;
}

export const BatchesView: React.FC<BatchesViewProps> = ({
  teachers,
  courses,
  onSuccessToast,
  onErrorToast,
}) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [teacherId, setTeacherId] = useState(teachers[0]?.id || '');
  const [classRange, setClassRange] = useState('Class 4 to Class 7');
  const [scheduleTime, setScheduleTime] = useState('Mon / Wed / Fri • 5:00 PM - 6:00 PM IST');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [meetingUrl, setMeetingUrl] = useState('https://meet.google.com/spi-batch-live');
  const [creating, setCreating] = useState(false);

  // Expanded batch state for viewing roster
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null);
  const [batchStudents, setBatchStudents] = useState<Record<string, Student[]>>({});
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    setLoading(true);
    try {
      const res = await api.getBatches();
      setBatches(res.batches || []);
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to fetch batches');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = async (batchId: string) => {
    if (expandedBatchId === batchId) {
      setExpandedBatchId(null);
      return;
    }

    setExpandedBatchId(batchId);
    if (!batchStudents[batchId]) {
      setLoadingStudents(true);
      try {
        const res = await api.getBatchById(batchId);
        setBatchStudents((prev) => ({ ...prev, [batchId]: res.students || [] }));
      } catch (err: any) {
        onErrorToast(err.message || 'Failed to fetch students for this batch');
      } finally {
        setLoadingStudents(false);
      }
    }
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.createBatch({
        batch_name: name.trim(),
        name: name.trim(),
        course_id: courseId,
        teacher_id: teacherId || undefined,
        class_range: classRange,
        schedule_time: scheduleTime,
        start_date: startDate,
        meeting_url: meetingUrl,
      });
      setShowAddModal(false);
      setName('');
      loadBatches();
      onSuccessToast('New 8-student cohort batch created!');
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to create batch');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Batches & Cohort Capacity</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict 8-student target limit (hard max 9) to preserve speech participation quality
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadBatches}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            title="Refresh Batches"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Cohort</span>
          </button>
        </div>
      </div>

      {/* Batches Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {batches.map((batch) => {
          const count = batch.enrolled_count || 0;
          const target = batch.target_size || 8;
          const max = batch.max_size || 9;
          const isFull = count >= max;
          const isAtTarget = count >= target && !isFull;
          const pct = Math.min(100, Math.round((count / max) * 100));

          return (
            <div
              key={batch.id}
              className={`bg-white rounded-2xl border transition-all shadow-2xs overflow-hidden ${
                isFull
                  ? 'border-rose-300 ring-1 ring-rose-300/50'
                  : isAtTarget
                  ? 'border-amber-300 ring-1 ring-amber-300/40'
                  : 'border-slate-200'
              }`}
            >
              {/* Batch Card Header */}
              <div className="p-5 border-b border-slate-100 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{batch.name}</h3>
                    <span className="text-xs font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {batch.class_range || 'Class 4-12'}
                    </span>
                  </div>
                  <Badge variant="batch" value={batch.status} />
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{batch.schedule_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Starts: {batch.start_date || 'Upcoming'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Faculty Coach: {batch.teacher_name || 'Assigned'}</span>
                  </div>
                </div>

                {/* Capacity Gauge */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                    <span className="text-slate-700">Enrollment Capacity</span>
                    <span
                      className={`font-bold ${
                        isFull ? 'text-rose-600' : isAtTarget ? 'text-amber-700' : 'text-emerald-700'
                      }`}
                    >
                      {count} / {target} students {isFull ? '(HARD CAPPED)' : isAtTarget ? '(TARGET FULL)' : ''}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFull ? 'bg-rose-500' : isAtTarget ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Roster Toggle Footer */}
              <div className="p-3 bg-slate-50 flex items-center justify-between text-xs">
                <span className="text-slate-500">{count} Active Learners</span>
                <button
                  onClick={() => toggleExpand(batch.id)}
                  className="text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>{expandedBatchId === batch.id ? 'Hide Roster' : 'View Roster'}</span>
                  {expandedBatchId === batch.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Expanded Roster List */}
              {expandedBatchId === batch.id && (
                <div className="p-4 bg-white border-t border-slate-100 divide-y divide-slate-100 text-xs text-slate-700">
                  {loadingStudents ? (
                    <p className="text-slate-400 py-2 text-center">Loading batch members...</p>
                  ) : !batchStudents[batch.id] || batchStudents[batch.id].length === 0 ? (
                    <p className="text-slate-400 py-2 text-center">No students currently enrolled in this batch.</p>
                  ) : (
                    batchStudents[batch.id].map((st, sidx) => (
                      <div key={st.id} className="py-2 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 block">{st.student_name}</span>
                          <span className="text-[11px] text-slate-500">
                            {st.class_grade} • Parent: {st.parent_name} ({st.parent_phone})
                          </span>
                        </div>
                        <Badge variant="student" value={st.status} />
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Cohort Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Launch New 8-Student Cohort Batch"
        subtitle="Schedule a new live class section with assigned coach and grade boundaries"
        maxWidth="md"
      >
        <form onSubmit={handleCreateBatch} className="space-y-4 text-left text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Batch Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Junior Orators - Batch Gamma"
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Grade Cohort *</label>
              <select
                value={classRange}
                onChange={(e) => setClassRange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Class 4 to Class 7">Junior: Class 4 to 7</option>
                <option value="Class 8 to Class 12">Senior: Class 8 to 12</option>
                <option value="Class 4 to Class 6">Primary: Class 4 to 6</option>
                <option value="Class 9 to Class 12">High School: Class 9 to 12</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Assigned Faculty Coach</label>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Days & Timetable *</label>
            <input
              type="text"
              required
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              placeholder="e.g. Tue / Thu / Sat • 6:30 PM - 7:30 PM IST"
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Cohort Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Live Meeting Room URL</label>
              <input
                type="url"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
            <strong>Automatic Capacity Safeguard:</strong> This batch will target 8 students and reject enrollments
            beyond 9 to protect active student speaking time.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 rounded-lg bg-amber-600 text-white font-bold"
            >
              {creating ? 'Creating Cohort...' : 'Launch Cohort'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
