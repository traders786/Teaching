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
  Video,
  UserPlus,
  X,
  BookOpen,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
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

  // Manual Batch Creation State
  const [name, setName] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || 'crs_flagship_1');
  const [teacherId, setTeacherId] = useState('');
  const [gradeGroup, setGradeGroup] = useState('Class 4-7');
  const [scheduleDays, setScheduleDays] = useState('Monday, Wednesday, Friday');
  const [scheduleTime, setScheduleTime] = useState('5:00 PM - 6:00 PM IST');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [meetingUrl, setMeetingUrl] = useState('');
  const [creating, setCreating] = useState(false);

  // Detailed Batch Modal State
  const [detailModal, setDetailModal] = useState<{ open: boolean; batchId: string | null; batchData: any | null }>({
    open: false,
    batchId: null,
    batchData: null,
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'schedule' | 'homework'>('overview');
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Quick Action Modals
  const [assignModal, setAssignModal] = useState<{ open: boolean; batch: Batch | null }>({ open: false, batch: null });
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [meetModal, setMeetModal] = useState<{ open: boolean; batch: Batch | null }>({ open: false, batch: null });
  const [newMeetUrl, setNewMeetUrl] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

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

  const openBatchDetail = async (batchId: string) => {
    setDetailModal({ open: true, batchId, batchData: null });
    setActiveTab('overview');
    setLoadingDetail(true);
    try {
      const res = await api.getBatchById(batchId);
      setDetailModal({ open: true, batchId, batchData: res.batch });
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to load batch details');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.createBatch({
        batch_name: name.trim(),
        course_id: courseId,
        teacher_id: teacherId || null,
        grade_group: gradeGroup,
        schedule_days: scheduleDays,
        schedule_time: scheduleTime,
        start_date: startDate,
        meeting_link: meetingUrl || null,
        target_capacity: 8,
        max_capacity: 8,
      });

      onSuccessToast(`Batch "${name}" created manually with scheduled sessions.`);
      setShowAddModal(false);
      setName('');
      setMeetingUrl('');
      loadBatches();
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to create batch');
    } finally {
      setCreating(false);
    }
  };

  const handleAssignTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModal.batch || !selectedTeacherId) return;
    setActionLoading(true);
    try {
      await api.assignBatchTeacher(assignModal.batch.id, selectedTeacherId);
      onSuccessToast('Teacher assigned successfully!');
      setAssignModal({ open: false, batch: null });
      setSelectedTeacherId('');
      loadBatches();
      if (detailModal.open && detailModal.batchId === assignModal.batch.id) {
        openBatchDetail(assignModal.batch.id);
      }
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to assign teacher');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveMeetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetModal.batch || !newMeetUrl) return;
    setActionLoading(true);
    try {
      await api.updateBatchMeetingLink(meetModal.batch.id, newMeetUrl);
      onSuccessToast('Google Meet link published successfully!');
      setMeetModal({ open: false, batch: null });
      setNewMeetUrl('');
      loadBatches();
      if (detailModal.open && detailModal.batchId === meetModal.batch.id) {
        openBatchDetail(meetModal.batch.id);
      }
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to update meeting link');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active Academic Cohorts</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
              Target: 8 Students / Batch
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Batches are created demand-driven by the automated placement engine. Manual creation is reserved for exceptional cohorts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadBatches}
            className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Batch Manually</span>
          </button>
        </div>
      </div>

      {/* Batches Table List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs">Loading active cohorts...</p>
        </div>
      ) : batches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Layers className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Batches Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            New batches are created automatically when enrolled students complete payment. You can also create a manual batch above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((batch) => {
            const enrolled = batch.enrolled_count || 0;
            const maxCap = batch.max_capacity || 8;
            const isFull = enrolled >= maxCap;
            const needsTeacher = batch.status === 'NEEDS_TEACHER' || !batch.teacher_id;
            const hasMeet = Boolean(batch.meeting_link && batch.meeting_link.trim() !== '');

            return (
              <div
                key={batch.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-400 transition-all p-5 space-y-4 text-left flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar: Code & Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {batch.code || 'BATCH'}
                      </span>
                      <span className="text-xs text-slate-500">• {batch.grade_group || 'Junior'}</span>
                    </div>
                    <Badge variant="batch" value={batch.status} />
                  </div>

                  {/* Batch Title */}
                  <div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">{batch.batch_name}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{batch.course_name}</p>
                  </div>

                  {/* Teacher & Schedule */}
                  <div className="space-y-2 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Coach:</span>
                      {needsTeacher ? (
                        <button
                          onClick={() => setAssignModal({ open: true, batch })}
                          className="text-rose-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Assign Coach</span>
                        </button>
                      ) : (
                        <span className="font-bold text-slate-900">{batch.teacher_name}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Schedule:</span>
                      <span className="font-semibold text-slate-800">{batch.schedule_days}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Time:</span>
                      <span className="font-semibold text-slate-800">{batch.schedule_time}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500">Google Meet:</span>
                      {hasMeet ? (
                        <a
                          href={batch.meeting_link!}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Configured</span>
                        </a>
                      ) : (
                        <button
                          onClick={() => setMeetModal({ open: true, batch })}
                          className="text-amber-700 font-bold hover:underline cursor-pointer"
                        >
                          + Set Meet Link
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700">Capacity Occupancy</span>
                      <span className={`font-black ${isFull ? 'text-rose-600' : 'text-slate-900'}`}>
                        {enrolled} / {maxCap} Students {isFull && '(FULL)'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isFull ? 'bg-rose-500' : enrolled >= 6 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, (enrolled / maxCap) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => openBatchDetail(batch.id)}
                    className="w-full px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>View Roster & Schedule</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Full Batch Detail View */}
      {detailModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-left">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                    {detailModal.batchData?.code || 'BATCH'}
                  </span>
                  <h3 className="text-base font-black text-slate-900">
                    {detailModal.batchData?.batch_name || 'Loading Cohort...'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {detailModal.batchData?.course_name} • {detailModal.batchData?.schedule_days} at {detailModal.batchData?.schedule_time}
                </p>
              </div>
              <button
                onClick={() => setDetailModal({ open: false, batchId: null, batchData: null })}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs Header */}
            <div className="flex items-center gap-4 px-5 border-b border-slate-200 text-xs font-bold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'overview' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`py-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'students' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Enrolled Students ({detailModal.batchData?.students?.length || 0}/8)
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`py-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'schedule' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Class Sessions ({detailModal.batchData?.sessions?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('homework')}
                className={`py-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'homework' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Homework ({detailModal.batchData?.homework?.length || 0})
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {loadingDetail ? (
                <div className="p-8 text-center text-slate-400 text-xs">Loading batch telemetry...</div>
              ) : !detailModal.batchData ? (
                <div className="p-8 text-center text-rose-500 text-xs">Failed to load batch records.</div>
              ) : activeTab === 'overview' ? (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-900 block">Assigned Lead Teacher</span>
                      {detailModal.batchData.teacher_id ? (
                        <div>
                          <div className="text-sm font-bold text-slate-900">{detailModal.batchData.teacher_name}</div>
                          <div className="text-slate-500">{detailModal.batchData.teacher_email}</div>
                          <div className="text-slate-500">{detailModal.batchData.teacher_phone}</div>
                        </div>
                      ) : (
                        <div className="text-rose-600 font-bold">No teacher assigned yet (NEEDS_TEACHER)</div>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-900 block">Classroom Link</span>
                      {detailModal.batchData.meeting_link ? (
                        <a
                          href={detailModal.batchData.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-700 font-bold hover:underline break-all block"
                        >
                          {detailModal.batchData.meeting_link}
                        </a>
                      ) : (
                        <div className="text-amber-700">Classroom link not published yet.</div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 block">Duration & Timing</span>
                    <p className="text-slate-600">
                      Starts on <strong>{detailModal.batchData.start_date}</strong> • Running {detailModal.batchData.schedule_days} from {detailModal.batchData.schedule_time} ({detailModal.batchData.timezone || 'Asia/Kolkata'}).
                    </p>
                    {detailModal.batchData.notes && (
                      <p className="text-slate-500 italic pt-1">{detailModal.batchData.notes}</p>
                    )}
                  </div>
                </div>
              ) : activeTab === 'students' ? (
                <div className="space-y-3">
                  {(!detailModal.batchData.students || detailModal.batchData.students.length === 0) ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No students placed in this cohort yet.</p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {detailModal.batchData.students.map((std: any) => (
                        <div key={std.id} className="py-2.5 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-slate-900">{std.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {std.class_grade} • Parent: {std.parent_name} ({std.parent_phone})
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Active Member
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : activeTab === 'schedule' ? (
                <div className="space-y-2">
                  {(!detailModal.batchData.sessions || detailModal.batchData.sessions.length === 0) ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No sessions generated for this batch.</p>
                  ) : (
                    <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto">
                      {detailModal.batchData.sessions.map((sess: any) => (
                        <div key={sess.id} className="py-2 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-slate-900">
                              Session {sess.session_number}: {sess.topic}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {sess.date} • {sess.start_time} - {sess.end_time}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {sess.marked_count > 0 && (
                              <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                                {sess.present_count} Present
                              </span>
                            )}
                            <Badge variant="session" value={sess.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {(!detailModal.batchData.homework || detailModal.batchData.homework.length === 0) ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No homework assigned to this batch yet.</p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {detailModal.batchData.homework.map((hw: any) => (
                        <div key={hw.id} className="py-2.5 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-slate-900">{hw.title}</div>
                            <div className="text-[11px] text-slate-500">Due: {hw.due_date}</div>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            {hw.submission_count || 0} Submissions
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end">
              <button
                onClick={() => setDetailModal({ open: false, batchId: null, batchData: null })}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Manual Batch Creation */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create Cohort Manually (Administrative Use)"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateBatch} className="space-y-4 text-left">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
            <span className="font-bold">Demand-driven notice: </span>
            <span>Normal student batches are demand-created automatically upon enrollment. Use this only for special cohorts.</span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Cohort Title / Number</label>
            <input
              type="text"
              required
              placeholder="e.g. Junior Communication — Batch 003"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Course</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-amber-500"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Grade Group</label>
              <select
                value={gradeGroup}
                onChange={(e) => setGradeGroup(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-amber-500"
              >
                <option value="Class 4-7">Class 4–7 (Junior)</option>
                <option value="Class 8-12">Class 8–12 (Senior)</option>
                <option value="1-on-1 Custom">1-on-1 Custom</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Schedule Days</label>
              <select
                value={scheduleDays}
                onChange={(e) => setScheduleDays(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-amber-500"
              >
                <option value="Monday, Wednesday, Friday">Monday, Wednesday, Friday</option>
                <option value="Tuesday, Thursday, Saturday">Tuesday, Thursday, Saturday</option>
                <option value="Saturday, Sunday">Saturday, Sunday (Weekend)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Time Window</label>
              <select
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-amber-500"
              >
                <option value="4:00 PM - 5:00 PM IST">4:00 PM - 5:00 PM IST</option>
                <option value="5:00 PM - 6:00 PM IST">5:00 PM - 6:00 PM IST</option>
                <option value="6:00 PM - 7:00 PM IST">6:00 PM - 7:00 PM IST</option>
                <option value="7:00 PM - 8:00 PM IST">7:00 PM - 8:00 PM IST</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Coach (Optional)</label>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-amber-500"
              >
                <option value="">-- Assign Later --</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Google Meet URL (Optional)</label>
            <input
              type="url"
              placeholder="https://meet.google.com/xxx-yyyy-zzz"
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || !name}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-2xs cursor-pointer"
            >
              {creating ? 'Creating...' : 'Create Batch & Sessions'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Assign Teacher */}
      {assignModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Assign Teacher to Batch</h3>
                <p className="text-xs text-slate-500">{assignModal.batch?.batch_name}</p>
              </div>
              <button
                onClick={() => setAssignModal({ open: false, batch: null })}
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
                  onClick={() => setAssignModal({ open: false, batch: null })}
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
      {meetModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Publish Google Meet Link</h3>
                <p className="text-xs text-slate-500">{meetModal.batch?.batch_name}</p>
              </div>
              <button
                onClick={() => setMeetModal({ open: false, batch: null })}
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
                  This link will automatically be available to all students enrolled in this cohort.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMeetModal({ open: false, batch: null })}
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
