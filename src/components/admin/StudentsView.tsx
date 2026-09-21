import React, { useState, useEffect } from 'react';
import { Student, Batch, Course } from '../../types';
import { api } from '../../lib/api';
import { Badge } from '../ui/Badge';
import {
  GraduationCap,
  Search,
  RefreshCw,
  Phone,
  Layers,
  Sparkles,
  ArrowRightLeft,
  UserPlus,
  X,
  CheckCircle2,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { Modal } from '../ui/Modal';

interface StudentsViewProps {
  batches: Batch[];
  courses: Course[];
  onSuccessToast: (msg: string) => void;
  onErrorToast: (msg: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  batches,
  courses,
  onSuccessToast,
  onErrorToast,
}) => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // 360 Detail Modal
  const [detailModal, setDetailModal] = useState<{ open: boolean; student: any | null; details: any | null }>({
    open: false,
    student: null,
    details: null,
  });
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Transfer Modal
  const [transferModal, setTransferModal] = useState<{ open: boolean; student: any | null }>({
    open: false,
    student: null,
  });
  const [targetBatchId, setTargetBatchId] = useState('');
  const [transferReason, setTransferReason] = useState('Schedule convenience requested by parent');
  const [transferring, setTransferring] = useState(false);

  // Manual Enrollment Modal
  const [manualEnrollModal, setManualEnrollModal] = useState<{ open: boolean; student: any | null }>({
    open: false,
    student: null,
  });
  const [selectedCourseId, setSelectedCourseId] = useState('crs_flagship_1');
  const [preferredDays, setPreferredDays] = useState('Monday, Wednesday, Friday');
  const [preferredTime, setPreferredTime] = useState('5:00 PM - 6:00 PM IST');
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    loadStudents();
  }, [statusFilter]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await api.getStudents({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: search.trim() || undefined,
      });
      setStudents(res.students || []);
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const openStudentDetail = async (student: any) => {
    setDetailModal({ open: true, student, details: null });
    setLoadingDetails(true);
    try {
      const res = await api.getStudentById(student.id);
      setDetailModal({ open: true, student, details: res });
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to load student 360 profile');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleExecuteTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferModal.student || !targetBatchId) return;
    setTransferring(true);
    try {
      const res = await api.transferStudent({
        studentId: transferModal.student.id,
        fromBatchId: transferModal.student.batch_id,
        toBatchId: targetBatchId,
        reason: transferReason,
      });

      onSuccessToast(res.message || 'Student transferred successfully!');
      setTransferModal({ open: false, student: null });
      setTargetBatchId('');
      loadStudents();
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to transfer student');
    } finally {
      setTransferring(false);
    }
  };

  const handleManualEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEnrollModal.student) return;
    setEnrolling(true);
    try {
      const res = await api.manualEnrollStudent({
        studentId: manualEnrollModal.student.id,
        courseId: selectedCourseId,
        preferredDays,
        preferredTime,
      });

      onSuccessToast(res.message || 'Manual enrollment activated and student placed in batch!');
      setManualEnrollModal({ open: false, student: null });
      loadStudents();
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to activate enrollment');
    } finally {
      setEnrolling(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (s.name || s.student_name || '').toLowerCase().includes(q) ||
      (s.parent_name || '').toLowerCase().includes(q) ||
      (s.parent_phone || '').includes(q) ||
      (s.batch_name || '').toLowerCase().includes(q) ||
      (s.city && s.city.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-6 md:p-8 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active Students Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
              {students.length} Learners Registered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Learner 360-degree profiles, automated cohort assignments, and batch transfers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadStudents}
            className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student, parent, phone, or batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          {['ALL', 'ACTIVE', 'ENROLLED', 'COMPLETED', 'INACTIVE'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st === 'ALL' ? 'All Students' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-500">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs">Loading learner profiles...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Students Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When parents pay or administrators enroll students, learners appear here with live cohort tracking.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-700">
                  <th className="py-3 px-4">Student & Grade</th>
                  <th className="py-3 px-4">Current Program</th>
                  <th className="py-3 px-4">Assigned Cohort</th>
                  <th className="py-3 px-4">Coach</th>
                  <th className="py-3 px-4">Attendance / HW</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((std) => {
                  const studentName = std.name || std.student_name;
                  const hasBatch = Boolean(std.batch_id);

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{studentName}</div>
                        <div className="text-[11px] text-slate-500">
                          {std.class_grade} • Parent: {std.parent_name} ({std.parent_phone})
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">
                          {std.course_name || 'Flagship Communication'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {hasBatch ? (
                          <div>
                            <div className="font-bold text-slate-900">{std.batch_name}</div>
                            <div className="text-[11px] text-slate-500">
                              {std.schedule_days} ({std.schedule_time})
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                              Unassigned (Needs Placement)
                            </span>
                            <button
                              onClick={() => setManualEnrollModal({ open: true, student: std })}
                              className="text-[11px] text-amber-700 font-bold hover:underline block"
                            >
                              + Auto-Place
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {std.teacher_name || (
                          <span className="text-rose-600 font-medium">Pending Coach</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-900 font-bold">
                          {std.attended_classes_count || 0} classes attended
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {std.reviewed_homework_count || 0} homeworks reviewed
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            std.payment_status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {std.payment_status || 'PAID'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openStudentDetail(std)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                          >
                            360 View
                          </button>
                          {hasBatch && (
                            <button
                              onClick={() => setTransferModal({ open: true, student: std })}
                              title="Transfer to another cohort"
                              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <ArrowRightLeft className="w-3 h-3" />
                              <span>Transfer</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Student 360 Detail View */}
      {detailModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-left">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {detailModal.student?.name || detailModal.student?.student_name}
                </h3>
                <p className="text-xs text-slate-500">
                  {detailModal.student?.class_grade} • Parent: {detailModal.student?.parent_name} ({detailModal.student?.parent_phone})
                </p>
              </div>
              <button
                onClick={() => setDetailModal({ open: false, student: null, details: null })}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {loadingDetails ? (
                <div className="p-8 text-center text-slate-400">Loading student 360 telemetry...</div>
              ) : (
                <>
                  {/* Active Program Card */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900 block text-xs">Active Program & Cohort</span>
                    {detailModal.details?.activeBatch ? (
                      <div className="grid grid-cols-2 gap-2 text-slate-700">
                        <div>Cohort: <strong>{detailModal.details.activeBatch.batch_name}</strong></div>
                        <div>Coach: <strong>{detailModal.details.activeBatch.teacher_name}</strong></div>
                        <div>Schedule: {detailModal.details.activeBatch.schedule_days}</div>
                        <div>Time: {detailModal.details.activeBatch.schedule_time}</div>
                      </div>
                    ) : (
                      <p className="text-amber-800">No active cohort assigned.</p>
                    )}
                  </div>

                  {/* Attendance Log */}
                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 block text-xs">Recent Attendance Records</span>
                    {(!detailModal.details?.attendanceRecords || detailModal.details.attendanceRecords.length === 0) ? (
                      <p className="text-slate-400">No class sessions conducted yet.</p>
                    ) : (
                      <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto">
                        {detailModal.details.attendanceRecords.map((a: any) => (
                          <div key={a.id} className="py-1.5 flex items-center justify-between">
                            <span>{a.date}: {a.topic}</span>
                            <span className="font-bold text-emerald-700">{a.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Homework Submissions */}
                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 block text-xs">Homework Submissions</span>
                    {(!detailModal.details?.homeworkSubmissions || detailModal.details.homeworkSubmissions.length === 0) ? (
                      <p className="text-slate-400">No homework submissions yet.</p>
                    ) : (
                      <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto">
                        {detailModal.details.homeworkSubmissions.map((hw: any) => (
                          <div key={hw.id} className="py-1.5 flex items-center justify-between">
                            <div>
                              <div className="font-bold text-slate-800">{hw.homework_title}</div>
                              {hw.mentor_feedback && (
                                <div className="text-[11px] text-slate-500 italic font-normal">Feedback: "{hw.mentor_feedback}"</div>
                              )}
                            </div>
                            <span className="font-bold text-amber-800">{hw.score_rating || hw.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end">
              <button
                onClick={() => setDetailModal({ open: false, student: null, details: null })}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Transfer Student Between Batches */}
      {transferModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Transfer Student Cohort</h3>
                <p className="text-xs text-slate-500">
                  {transferModal.student?.name || transferModal.student?.student_name} (Current: {transferModal.student?.batch_name})
                </p>
              </div>
              <button
                onClick={() => setTransferModal({ open: false, student: null })}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] space-y-1">
                <span className="font-bold">Historical Data Safe: </span>
                <span>Past attendance, feedback, and recordings remain preserved under the prior batch membership.</span>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Select Destination Cohort</label>
                <select
                  value={targetBatchId}
                  onChange={(e) => setTargetBatchId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">-- Select Destination Cohort --</option>
                  {batches
                    .filter((b) => b.id !== transferModal.student?.batch_id && (b.enrolled_count || 0) < (b.max_capacity || 8))
                    .map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batch_name} ({b.schedule_days} • {b.enrolled_count || 0}/8 students)
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Reason for Transfer</label>
                <input
                  type="text"
                  required
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTransferModal({ open: false, student: null })}
                  className="px-3.5 py-2 border border-slate-300 font-semibold rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={transferring || !targetBatchId}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold rounded-xl cursor-pointer"
                >
                  {transferring ? 'Transferring...' : 'Execute Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Manual / Complimentary Enrollment */}
      {manualEnrollModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Activate Course Enrollment</h3>
                <p className="text-xs text-slate-500">
                  {manualEnrollModal.student?.name || manualEnrollModal.student?.student_name}
                </p>
              </div>
              <button
                onClick={() => setManualEnrollModal({ open: false, student: null })}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualEnroll} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Course Program</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-amber-500"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Preferred Days</label>
                <select
                  value={preferredDays}
                  onChange={(e) => setPreferredDays(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Monday, Wednesday, Friday">Monday, Wednesday, Friday</option>
                  <option value="Tuesday, Thursday, Saturday">Tuesday, Thursday, Saturday</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Preferred Time Window</label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-amber-500"
                >
                  <option value="4:00 PM - 5:00 PM IST">4:00 PM - 5:00 PM IST</option>
                  <option value="5:00 PM - 6:00 PM IST">5:00 PM - 6:00 PM IST</option>
                  <option value="6:00 PM - 7:00 PM IST">6:00 PM - 7:00 PM IST</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setManualEnrollModal({ open: false, student: null })}
                  className="px-3.5 py-2 border border-slate-300 font-semibold rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={enrolling}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl cursor-pointer"
                >
                  {enrolling ? 'Enrolling & Placing...' : 'Activate & Auto-Place'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
