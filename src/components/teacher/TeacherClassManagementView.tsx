import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  FileText,
  Video,
  ClipboardList,
  Eye,
  X,
  Save,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { api } from '../../lib/api';

interface TeacherClassManagementViewProps {
  onSuccessToast?: (msg: string) => void;
  onErrorToast?: (msg: string) => void;
}

export function TeacherClassManagementView({
  onSuccessToast,
  onErrorToast,
}: TeacherClassManagementViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'batches' | 'students' | 'sessions'>('batches');
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  // Selected Batch Detail State
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [batchDetail, setBatchDetail] = useState<any | null>(null);
  const [loadingBatchDetail, setLoadingBatchDetail] = useState(false);

  // Selected Student Detail State
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [studentDetail, setStudentDetail] = useState<any | null>(null);
  const [loadingStudentDetail, setLoadingStudentDetail] = useState(false);

  // Attendance Marking Modal State
  const [attendanceSession, setAttendanceSession] = useState<any | null>(null);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: 'PRESENT' | 'ABSENT' | 'LATE'; notes: string }>>({});
  const [savingAttendance, setSavingAttendance] = useState(false);

  // Edit Meeting Link Modal State
  const [editingMeetingLinkBatch, setEditingMeetingLinkBatch] = useState<any | null>(null);
  const [newMeetingLink, setNewMeetingLink] = useState('');
  const [updatingMeetingLink, setUpdatingMeetingLink] = useState(false);

  const handleUpdateMeetingLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMeetingLinkBatch || !newMeetingLink.trim()) return;

    try {
      setUpdatingMeetingLink(true);
      await api.updateBatchMeetingLink(editingMeetingLinkBatch.id, newMeetingLink.trim());
      if (onSuccessToast) onSuccessToast("Live class meeting link updated! Students' Join Class button is now live.");
      setEditingMeetingLinkBatch(null);
      setNewMeetingLink('');
      loadBatchesAndSessions();
      if (selectedBatchId) {
        openBatchDetail(selectedBatchId);
      }
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to update live class meeting link.');
    } finally {
      setUpdatingMeetingLink(false);
    }
  };

  const openMeetingLinkModal = (batch: any) => {
    setEditingMeetingLinkBatch(batch);
    setNewMeetingLink(batch.meeting_link || '');
  };

  const loadBatchesAndSessions = async () => {
    try {
      setLoading(true);
      const [bRes, sRes] = await Promise.all([
        api.getTeacherBatches(),
        api.getTeacherSessions(),
      ]);
      setBatches(bRes.batches || []);
      setSessions(sRes.sessions || []);
    } catch (error) {
      if (onErrorToast) onErrorToast('Failed to load classes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatchesAndSessions();
  }, []);

  const openBatchDetail = async (batchId: string) => {
    setSelectedBatchId(batchId);
    try {
      setLoadingBatchDetail(true);
      const res = await api.getTeacherBatchById(batchId);
      setBatchDetail(res);
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to load batch details.');
    } finally {
      setLoadingBatchDetail(false);
    }
  };

  const openStudentDetail = async (studentId: string) => {
    setSelectedStudentId(studentId);
    try {
      setLoadingStudentDetail(true);
      const res = await api.getTeacherStudentDetail(studentId);
      setStudentDetail(res);
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to load student details.');
    } finally {
      setLoadingStudentDetail(false);
    }
  };

  const openAttendanceModal = (session: any, studentsList: any[]) => {
    setAttendanceSession(session);
    const initialMap: Record<string, { status: 'PRESENT' | 'ABSENT' | 'LATE'; notes: string }> = {};
    studentsList.forEach((s) => {
      initialMap[s.id] = { status: 'PRESENT', notes: '' };
    });
    setAttendanceMap(initialMap);
  };

  const handleSaveAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendanceSession) return;

    try {
      setSavingAttendance(true);
      const list = Object.entries(attendanceMap).map(([student_id, itemData]) => {
        const d = itemData as { status: 'PRESENT' | 'ABSENT' | 'LATE'; notes: string };
        return {
          student_id,
          status: d.status,
          notes: d.notes,
        };
      });

      await api.markTeacherAttendance(attendanceSession.id, attendanceSession.batch_id, list);
      if (onSuccessToast) onSuccessToast('Attendance recorded and session marked completed.');
      setAttendanceSession(null);
      if (selectedBatchId) {
        openBatchDetail(selectedBatchId);
      }
      loadBatchesAndSessions();
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to record attendance.');
    } finally {
      setSavingAttendance(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#10182C] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#F27C00]" />
            <span>Class & Cohort Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your assigned cohorts, student rosters, session attendance, and speech notes.
          </p>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('batches')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeSubTab === 'batches' ? 'bg-white text-[#10182C] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Batches ({batches.length})
          </button>
          <button
            onClick={() => setActiveSubTab('sessions')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeSubTab === 'sessions' ? 'bg-white text-[#10182C] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Sessions ({sessions.length})
          </button>
        </div>
      </div>

      {/* SUBTAB 1: MY BATCHES */}
      {activeSubTab === 'batches' && (
        <div className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-pulse">
              <div className="h-48 bg-slate-200/70 rounded-xl"></div>
              <div className="h-48 bg-slate-200/70 rounded-xl"></div>
            </div>
          ) : batches.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Batches Assigned</h3>
              <p className="text-xs text-slate-500 mt-1">Admin will assign small-group cohorts (max 8-9 students) to your schedule.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-amber-300 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">
                        {batch.grade_group || 'Class 4-7'}
                      </span>
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {batch.enrolled_count || 5} / {batch.target_capacity || 8} Students
                      </span>
                    </div>

                    <h3 className="font-bold text-[#10182C] text-lg mt-3">{batch.batch_name}</h3>
                    <p className="text-xs text-slate-500">{batch.course_name}</p>

                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Days</span>
                        <strong>{batch.schedule_days}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Time</span>
                        <strong className="text-slate-900">{batch.schedule_time}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <a
                      href={batch.meeting_link || 'https://meet.google.com'}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center py-2.5 bg-[#F27C00] text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>JOIN CLASS</span>
                    </a>
                    <button
                      onClick={() => openMeetingLinkModal(batch)}
                      title="Update Live Class Link"
                      className="px-3 py-2.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold hover:bg-amber-100 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5 text-[#F27C00]" />
                      <span>SET LINK</span>
                    </button>
                    <button
                      onClick={() => openBatchDetail(batch.id)}
                      className="px-3.5 py-2.5 bg-[#10182C] text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                    >
                      VIEW BATCH
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: ALL SESSIONS */}
      {activeSubTab === 'sessions' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 font-bold text-sm text-[#10182C]">
            Scheduled Class Sessions
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4">Topic</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sessions.map((sess) => (
                  <tr key={sess.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-medium">
                      {sess.date}
                      <span className="block text-[11px] text-slate-500 font-normal">{sess.start_time} - {sess.end_time}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{sess.batch_name}</div>
                      <div className="text-[11px] text-slate-500">{sess.grade_group}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">{sess.topic}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          sess.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {sess.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={sess.meeting_link || 'https://meet.google.com'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#F27C00] font-semibold hover:underline"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Join</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BATCH DETAIL DRAWER / MODAL */}
      {selectedBatchId && batchDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
              <div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {batchDetail.batch?.grade_group}
                </span>
                <h2 className="text-xl font-bold text-[#10182C] mt-1">{batchDetail.batch?.batch_name}</h2>
                <p className="text-xs text-slate-500">{batchDetail.batch?.course_name}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedBatchId(null);
                  setBatchDetail(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Batch Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Schedule Days</span>
                  <span className="font-bold text-slate-800">{batchDetail.batch?.schedule_days}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Session Time</span>
                  <span className="font-bold text-slate-800">{batchDetail.batch?.schedule_time}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Enrolled Capacity</span>
                  <span className="font-bold text-emerald-700">{batchDetail.students?.length || 0} / {batchDetail.batch?.target_capacity || 8}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Total Classes</span>
                  <span className="font-bold text-slate-800">{batchDetail.batch?.total_classes || 36} Sessions</span>
                </div>
              </div>

              {/* Student Roster Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#10182C] flex items-center justify-between">
                  <span>Enrolled Student Roster ({batchDetail.students?.length || 0})</span>
                  <span className="text-xs font-normal text-slate-500">Click student to view speech notes</span>
                </h3>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Student</th>
                        <th className="py-2.5 px-3">School / City</th>
                        <th className="py-2.5 px-3">Attendance</th>
                        <th className="py-2.5 px-3">Homework</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {batchDetail.students?.map((s: any) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-semibold text-[#10182C]">
                            {s.name}
                            <span className="block text-[11px] text-slate-500 font-normal">{s.class_grade}</span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {s.school || 'School'} &bull; {s.city || 'India'}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              {s.attended_count || 2} / {s.total_held_sessions || 2} Present
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-medium">
                            {s.homework_submitted_count || 1} Submitted
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => openStudentDetail(s.id)}
                              className="text-xs font-bold text-[#F27C00] hover:underline"
                            >
                              View Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Class Sessions & Attendance Marking */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#10182C]">Cohort Sessions & Attendance</h3>
                <div className="space-y-3">
                  {batchDetail.sessions?.map((sess: any) => (
                    <div
                      key={sess.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{sess.topic}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              sess.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {sess.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {sess.date} &bull; {sess.start_time} - {sess.end_time} IST
                        </p>
                        {sess.teacher_notes && (
                          <p className="text-xs text-slate-600 mt-1 italic">
                            Notes: "{sess.teacher_notes}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openAttendanceModal(sess, batchDetail.students || [])}
                          className="px-3 py-1.5 bg-[#10182C] text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-1"
                        >
                          <ClipboardList className="w-3.5 h-3.5" />
                          <span>Mark Attendance</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ATTENDANCE MARKING MODAL */}
      {attendanceSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-base text-[#10182C]">Mark Attendance</h3>
                <p className="text-xs text-slate-500">{attendanceSession.topic} ({attendanceSession.date})</p>
              </div>
              <button onClick={() => setAttendanceSession(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAttendance} className="mt-4 space-y-4">
              <div className="space-y-3">
                {Object.entries(attendanceMap).map(([studentId, itemData]) => {
                  const d = itemData as { status: 'PRESENT' | 'ABSENT' | 'LATE'; notes: string };
                  const studentObj = batchDetail?.students?.find((s: any) => s.id === studentId);
                  return (
                    <div key={studentId} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-xs text-slate-900">{studentObj?.name || 'Student'}</div>
                        <div className="text-[11px] text-slate-500">{studentObj?.class_grade}</div>
                      </div>

                      <div className="flex items-center gap-1">
                        {(['PRESENT', 'LATE', 'ABSENT'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() =>
                              setAttendanceMap((prev) => ({
                                ...prev,
                                [studentId]: { ...prev[studentId], status: st },
                              }))
                            }
                            className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                              d.status === st
                                ? st === 'PRESENT'
                                  ? 'bg-emerald-600 text-white'
                                  : st === 'LATE'
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-red-600 text-white'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAttendanceSession(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAttendance}
                  className="px-4 py-2 bg-[#F27C00] text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition disabled:opacity-50"
                >
                  {savingAttendance ? 'Saving...' : 'Save Attendance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STUDENT DETAIL FOR TEACHER MODAL (Strictly No Fees) */}
      {selectedStudentId && studentDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-[#10182C]">{studentDetail.student?.name}</h3>
                <p className="text-xs text-slate-500">
                  {studentDetail.student?.class_grade} &bull; {studentDetail.student?.school} &bull; {studentDetail.student?.city}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedStudentId(null);
                  setStudentDetail(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-6 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block font-medium">Enrolled Cohort</span>
                  <strong className="text-slate-900 text-sm">{studentDetail.student?.batch_name}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block font-medium">Speech Level</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Active Learner</span>
                </div>
              </div>

              {/* Attendance Records */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Class Attendance Records</h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {studentDetail.attendanceRecords?.map((att: any) => (
                    <div key={att.id} className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-800">{att.topic}</span>
                        <span className="block text-[10px] text-slate-500">{att.date} at {att.start_time}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          att.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {att.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Homework Submissions */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Homework & Speech Feedback</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {studentDetail.homeworkSubmissions?.map((sub: any) => (
                    <div key={sub.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{sub.homework_title}</span>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          Rating: {sub.score_rating || 'Good'}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">{sub.content_text}</p>
                      {sub.mentor_feedback && (
                        <div className="mt-2 p-2 bg-amber-50/70 border border-amber-200/50 rounded-lg text-amber-900 text-[11px]">
                          <strong>Mentor Feedback:</strong> "{sub.mentor_feedback}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE LIVE MEETING LINK MODAL */}
      {editingMeetingLinkBatch && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-[#10182C] flex items-center gap-2">
                <Video className="w-5 h-5 text-[#F27C00]" />
                <span>Update Today's Live Class Link</span>
              </h3>
              <button
                onClick={() => setEditingMeetingLinkBatch(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateMeetingLink} className="mt-4 space-y-4 text-xs">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-amber-900">
                <span className="text-[10px] font-bold uppercase tracking-wider block text-amber-800">Target Batch</span>
                <strong className="text-sm text-slate-900">{editingMeetingLinkBatch.batch_name}</strong>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Google Meet / Zoom Live Class Link
                </label>
                <input
                  type="url"
                  value={newMeetingLink}
                  onChange={(e) => setNewMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/... or https://zoom.us/j/..."
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Students enrolled in this cohort will immediately get this live link on their dashboard and "Join Class" button.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMeetingLinkBatch(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingMeetingLink}
                  className="px-4 py-2 bg-[#F27C00] text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition disabled:opacity-50 cursor-pointer"
                >
                  {updatingMeetingLink ? 'Saving...' : 'Save & Publish Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
