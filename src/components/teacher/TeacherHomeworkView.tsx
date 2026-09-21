import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Calendar,
  Clock,
  Mic,
  Video,
  FileCode,
  Link2,
  CheckCircle2,
  Play,
  Save,
  X,
  MessageSquare,
  Award,
  Users,
} from 'lucide-react';
import { api } from '../../lib/api';

interface TeacherHomeworkViewProps {
  onSuccessToast?: (msg: string) => void;
  onErrorToast?: (msg: string) => void;
}

export function TeacherHomeworkView({
  onSuccessToast,
  onErrorToast,
}: TeacherHomeworkViewProps) {
  const [loading, setLoading] = useState(true);
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);

  // Create Homework Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [assignmentScope, setAssignmentScope] = useState<'BATCH' | 'INDIVIDUAL'>('BATCH');
  const [targetStudentId, setTargetStudentId] = useState('');
  const [batchStudents, setBatchStudents] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submissionType, setSubmissionType] = useState('AUDIO');

  // Submissions Review Panel State
  const [selectedHwForReview, setSelectedHwForReview] = useState<any | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Active Feedback Modal
  const [reviewingSubmission, setReviewingSubmission] = useState<any | null>(null);
  const [mentorRating, setMentorRating] = useState('Strong');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [hwRes, bRes] = await Promise.all([
        api.getTeacherHomework(),
        api.getTeacherBatches(),
      ]);
      setHomeworkList(hwRes.homework || []);
      setBatches(bRes.batches || []);
      if (bRes.batches && bRes.batches.length > 0) {
        const initialBatchId = bRes.batches[0].id;
        setSelectedBatchId(initialBatchId);
        loadStudentsForBatch(initialBatchId);
      }
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to load homework.');
    } finally {
      setLoading(false);
    }
  };

  const loadStudentsForBatch = async (batchId: string) => {
    try {
      const res = await api.getTeacherBatchById(batchId);
      setBatchStudents(res.students || []);
      if (res.students && res.students.length > 0) {
        setTargetStudentId(res.students[0].id);
      } else {
        setTargetStudentId('');
      }
    } catch (e) {
      setBatchStudents([]);
    }
  };

  const handleBatchChange = (batchId: string) => {
    setSelectedBatchId(batchId);
    loadStudentsForBatch(batchId);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchId || !title || !dueDate) {
      if (onErrorToast) onErrorToast('Please fill all required fields.');
      return;
    }

    if (assignmentScope === 'INDIVIDUAL' && !targetStudentId) {
      if (onErrorToast) onErrorToast('Please select an individual student.');
      return;
    }

    try {
      setCreating(true);
      await api.createTeacherHomework({
        batch_id: selectedBatchId,
        target_student_id: assignmentScope === 'INDIVIDUAL' ? targetStudentId : null,
        title,
        description,
        instructions,
        due_date: dueDate,
        submission_type: submissionType,
      });

      if (onSuccessToast) {
        onSuccessToast(
          assignmentScope === 'INDIVIDUAL'
            ? 'Individual homework assigned and student notified!'
            : 'Homework assigned to all students in batch!'
        );
      }
      setIsCreateModalOpen(false);
      setTitle('');
      setDescription('');
      setInstructions('');
      setDueDate('');
      setAssignmentScope('BATCH');
      loadData();
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to create homework.');
    } finally {
      setCreating(false);
    }
  };

  const openSubmissions = async (hw: any) => {
    setSelectedHwForReview(hw);
    try {
      setLoadingSubmissions(true);
      const res = await api.getHomeworkSubmissions(hw.id);
      setSubmissions(res.submissions || []);
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to load submissions.');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleOpenFeedbackModal = (sub: any) => {
    setReviewingSubmission(sub);
    setMentorRating(sub.score_rating || 'Strong');
    setFeedbackNotes(sub.mentor_feedback || 'Excellent articulation and energy! Keep practicing the natural 2-second pause.');
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingSubmission) return;

    try {
      setSubmittingFeedback(true);
      await api.submitHomeworkFeedback(reviewingSubmission.id, {
        score_rating: mentorRating,
        mentor_feedback: feedbackNotes,
        status: 'REVIEWED',
      });

      if (onSuccessToast) onSuccessToast('Feedback recorded and student notified.');
      setReviewingSubmission(null);
      if (selectedHwForReview) {
        openSubmissions(selectedHwForReview);
      }
      loadData();
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to save mentor feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#10182C] flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#F27C00]" />
            <span>Homework & Speech Assignments</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Assign audio, video, or speech tasks and deliver structured mentor assessments.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-[#F27C00] text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>ASSIGN NEW HOMEWORK</span>
        </button>
      </div>

      {/* Homework Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          <div className="h-44 bg-slate-200/70 rounded-xl"></div>
          <div className="h-44 bg-slate-200/70 rounded-xl"></div>
        </div>
      ) : homeworkList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Homework Created Yet</h3>
          <p className="text-xs text-slate-500 mt-1">Assign an audio or video speech prompt after your live classes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {homeworkList.map((hw) => (
            <div
              key={hw.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-amber-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">
                      {hw.batch_name}
                    </span>
                    {hw.target_student_id ? (
                      <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>Individual: {hw.target_student_name || '1-on-1 Student'}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-500" />
                        <span>All Batch</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-[#F27C00] bg-amber-50 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                    {hw.submission_type === 'AUDIO' && <Mic className="w-3 h-3" />}
                    {hw.submission_type === 'VIDEO' && <Video className="w-3 h-3" />}
                    {hw.submission_type === 'TEXT' && <FileText className="w-3 h-3" />}
                    <span>{hw.submission_type} Submission</span>
                  </span>
                </div>

                <h3 className="font-bold text-[#10182C] text-base mt-3">{hw.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{hw.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Due: {hw.due_date}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">{hw.total_submissions || 0}</span>
                    <span className="text-slate-500"> / {hw.target_student_id ? '1' : (hw.enrolled_students || 5)} Submissions</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {hw.pending_reviews > 0 ? (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {hw.pending_reviews} Pending Review
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      All Reviewed ✓
                    </span>
                  )}
                </div>

                <button
                  onClick={() => openSubmissions(hw)}
                  className="px-4 py-2 bg-[#10182C] text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                >
                  Review Submissions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE HOMEWORK MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-[#10182C] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#F27C00]" />
                <span>Assign New Homework</span>
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHomework} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Batch</label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => handleBatchChange(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 bg-white text-xs focus:outline-none focus:border-[#F27C00]"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batch_name} ({b.grade_group})
                    </option>
                  ))}
                </select>
              </div>

              {/* Scope Selector: Batch vs Individual */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Assign Target</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAssignmentScope('BATCH')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      assignmentScope === 'BATCH'
                        ? 'bg-white text-[#10182C] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Entire Batch</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssignmentScope('INDIVIDUAL')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      assignmentScope === 'INDIVIDUAL'
                        ? 'bg-white text-[#10182C] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-purple-600" />
                    <span>Individual Student</span>
                  </button>
                </div>
              </div>

              {assignmentScope === 'INDIVIDUAL' && (
                <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-3 space-y-1.5">
                  <label className="block font-bold text-purple-900">Select Individual Student</label>
                  {batchStudents.length === 0 ? (
                    <p className="text-[11px] text-purple-700">No students enrolled in this batch.</p>
                  ) : (
                    <select
                      value={targetStudentId}
                      onChange={(e) => setTargetStudentId(e.target.value)}
                      className="w-full border border-purple-200 rounded-lg p-2 bg-white text-xs text-slate-900 focus:outline-none focus:border-purple-500"
                    >
                      {batchStudents.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.class_grade || 'Student'})
                        </option>
                      ))}
                    </select>
                  )}
                  <p className="text-[10px] text-purple-600">This homework will only appear on this student's dashboard.</p>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Homework Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 2-Minute Extempore Speech on My Favorite Hobby"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Submission Format</label>
                  <select
                    value={submissionType}
                    onChange={(e) => setSubmissionType(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-white text-xs focus:outline-none focus:border-[#F27C00]"
                  >
                    <option value="AUDIO">Audio Voice Recording (Preferred)</option>
                    <option value="VIDEO">Video Speech Recording</option>
                    <option value="TEXT">Written Speech Draft</option>
                    <option value="FILE">File / Slide Upload</option>
                    <option value="LINK">Drive / Web Link</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Prompt & Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is the topic and context for this speaking exercise?"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Instructions</label>
                <textarea
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="1. Stand straight.\n2. State your 3 core points clearly.\n3. Keep pauses natural."
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-[#F27C00] text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition disabled:opacity-50"
                >
                  {creating ? 'Assigning...' : 'Assign to Students'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMISSIONS REVIEW MODAL */}
      {selectedHwForReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-base text-[#10182C]">{selectedHwForReview.title}</h3>
                <p className="text-xs text-slate-500">Submissions from {selectedHwForReview.batch_name}</p>
              </div>
              <button
                onClick={() => setSelectedHwForReview(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {loadingSubmissions ? (
                <div className="p-8 text-center text-xs text-slate-500">Loading student speech submissions...</div>
              ) : submissions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No submissions received yet for this assignment.
                </div>
              ) : (
                submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs text-slate-900">{sub.student_name}</strong>
                        <span className="text-[10px] text-slate-500">{sub.class_grade}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            sub.status === 'REVIEWED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>

                      {sub.content_text && (
                        <p className="text-xs text-slate-700 italic">"{sub.content_text}"</p>
                      )}

                      {sub.media_url && (
                        <div className="mt-2.5 flex items-center gap-2">
                          {sub.media_url.match(/\.(png|jpg|jpeg|webp)$/i) ? (
                            <a
                              href={sub.media_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#F27C00] rounded-lg text-xs font-bold transition border border-amber-200"
                            >
                              <span>🖼️ View Uploaded Image ({sub.file_name || 'notes.png'})</span>
                            </a>
                          ) : sub.media_url.endsWith('.pdf') ? (
                            <a
                              href={sub.media_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition border border-blue-200"
                            >
                              <span>📄 View Submitted PDF ({sub.file_name || 'speech_outline.pdf'})</span>
                            </a>
                          ) : (
                            <a
                              href={sub.media_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition border border-emerald-200"
                            >
                              <Play className="w-3 h-3 text-emerald-600" />
                              <span>Open Shared Link ({sub.file_name || 'view submission'})</span>
                            </a>
                          )}
                        </div>
                      )}

                      {sub.mentor_feedback && (
                        <div className="mt-2 text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200/60">
                          <strong>Your Feedback:</strong> "{sub.mentor_feedback}" ({sub.score_rating})
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenFeedbackModal(sub)}
                      className="px-3.5 py-2 bg-[#F27C00] text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition shrink-0"
                    >
                      {sub.status === 'REVIEWED' ? 'Edit Feedback' : 'Give Feedback'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK INPUT MODAL */}
      {reviewingSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-[#10182C]">
                Mentor Feedback: {reviewingSubmission.student_name}
              </h3>
              <button onClick={() => setReviewingSubmission(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mentor Speech Rating</label>
                <select
                  value={mentorRating}
                  onChange={(e) => setMentorRating(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 bg-white text-xs focus:outline-none focus:border-[#F27C00]"
                >
                  <option value="Strong">Strong (Exceptional articulation & confidence)</option>
                  <option value="Good">Good (Clear ideas, minor hesitation)</option>
                  <option value="Developing">Developing (Good attempt, needs structured practice)</option>
                  <option value="Needs Practice">Needs Practice (Requires one-on-one guidance)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mentor Feedback & Suggestions</label>
                <textarea
                  rows={4}
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  placeholder="Share constructive points of praise and 1 actionable technique for their next speech..."
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewingSubmission(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="px-4 py-2 bg-[#F27C00] text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition disabled:opacity-50"
                >
                  {submittingFeedback ? 'Saving...' : 'Save Feedback & Mark Reviewed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
