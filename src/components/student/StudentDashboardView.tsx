import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Play,
  FileText,
  Award,
  Video,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Phone,
  BookOpen,
  Users,
  ShieldCheck,
  ExternalLink,
  Zap,
  X,
  ChevronRight,
  Send,
  HelpCircle,
} from 'lucide-react';
import { api } from '../../lib/api';
import { StudentTab } from './StudentLayout';
import { Modal } from '../ui/Modal';

interface StudentDashboardViewProps {
  onNavigateTab: (tab: StudentTab) => void;
  onOpenSubmitHomework: (hw: any) => void;
  onSuccessToast?: (msg: string) => void;
  onErrorToast?: (msg: string) => void;
}

export function StudentDashboardView({
  onNavigateTab,
  onOpenSubmitHomework,
  onSuccessToast,
  onErrorToast,
}: StudentDashboardViewProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    student: any;
    nextClass: any;
    upcomingDemo?: any;
    availableCourses?: any[];
    branding?: any;
    homework?: any[];
    pendingHomework?: any[];
    latestFeedback?: any;
    progress: {
      completedClasses: number;
      totalClasses: number;
      attendedClasses: number;
      totalHomeworkSubmitted?: number;
      submittedHomeworkCount?: number;
      progressPercentage?: number;
      attendancePercentage?: number;
    };
    recentRecordings: any[];
  } | null>(null);

  // Enrollment / Admin Contact Modal
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState<any | null>(null);
  const [requestNotes, setRequestNotes] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [directEnrolling, setDirectEnrolling] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getStudentDashboard();
      setData(res);
    } catch (e) {
      if (onErrorToast) onErrorToast('Unable to load student dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleSendEnrollRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForEnroll) return;
    try {
      setSendingRequest(true);
      const res = await api.submitEnrollmentRequest({
        courseId: selectedCourseForEnroll.id,
        courseName: selectedCourseForEnroll.name,
        notes: requestNotes,
        studentName: data?.student?.name,
        parentPhone: data?.student?.parent_phone,
      });
      if (onSuccessToast) {
        onSuccessToast(res.message || 'Enrollment request sent to admissions team!');
      }
      setSelectedCourseForEnroll(null);
      setRequestNotes('');
    } catch (err: any) {
      if (onErrorToast) onErrorToast(err.message || 'Failed to submit enrollment request.');
    } finally {
      setSendingRequest(false);
    }
  };

  const handleDirectEnroll = async (courseId: string) => {
    try {
      setDirectEnrolling(true);
      const res = await api.directStudentEnroll(courseId);
      if (onSuccessToast) {
        onSuccessToast(res.message || 'Course activated! Your cohort and class schedule are now ready.');
      }
      setSelectedCourseForEnroll(null);
      await loadDashboard();
    } catch (err: any) {
      if (onErrorToast) onErrorToast(err.message || 'Failed to complete direct enrollment.');
    } finally {
      setDirectEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-slate-200/70 rounded-2xl"></div>
        <div className="h-56 bg-slate-200/70 rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-slate-200/70 rounded-xl"></div>
          <div className="h-48 bg-slate-200/70 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const student = data?.student;
  const studentName = student?.name || 'Speech Champion';
  const studentGrade = student?.class_grade || 'Junior Level';
  const isEnrolledInBatch = !!student?.batch_id;
  const nextClass = data?.nextClass;
  const upcomingDemo = data?.upcomingDemo;
  const availableCourses = data?.availableCourses || [];
  const branding = data?.branding || {
    contactPhone: '+91 7004132088',
    supportWhatsapp: '+91 7004132088',
    brandName: 'upspeaq',
  };

  const progress = data?.progress || {
    completedClasses: 0,
    totalClasses: 36,
    attendedClasses: 0,
    totalHomeworkSubmitted: 0,
    submittedHomeworkCount: 0,
  };
  const pendingHw = (data?.pendingHomework || data?.homework || []).filter(
    (h: any) => !h.submission_status || h.submission_status === 'RESUBMIT'
  );

  // Clean WhatsApp number (remove non-digits, add country code if needed)
  const cleanWhatsappNumber = (branding.supportWhatsapp || '+917004132088').replace(/\D/g, '');

  return (
    <div className="space-y-8 text-left">
      {/* Friendly Greeting Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[#10182C] tracking-tight">
              Hi, {studentName} 👋
            </h1>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                isEnrolledInBatch
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              {isEnrolledInBatch ? 'Active Cohort Student' : 'Demo & Admissions Portal'}
            </span>
          </div>
          <p className="text-slate-600 text-xs mt-1">
            {isEnrolledInBatch
              ? `Enrolled in ${student?.course_name || 'Speech Mastery'} • Grade: ${studentGrade}`
              : `Welcome to ${branding.brandName || 'upspeaq'}! Track your live demo session and choose your cohort program.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Assigned Program</span>
            <strong className="text-xs text-[#10182C]">
              {student?.batch_name || student?.course_name || 'Awaiting Cohort Placement'}
            </strong>
          </div>
        </div>
      </div>

      {/* SECTION 1: UPCOMING LIVE DEMO (If Student has a Demo scheduled) */}
      {upcomingDemo && (
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-2 border-amber-400/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  Live 1-on-2 Demo Session
                </span>
                <span className="text-xs font-bold text-amber-800">
                  Status: {upcomingDemo.status}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {upcomingDemo.title || 'Interactive Speech & Confidence Evaluation'}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700 pt-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-4 h-4 text-[#F27C00]" />
                  {upcomingDemo.date}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-4 h-4 text-[#F27C00]" />
                  {upcomingDemo.start_time} – {upcomingDemo.end_time} IST
                </span>
                <span>
                  Educator: <strong>{upcomingDemo.teacher_name || 'Senior Speech Faculty'}</strong>
                </span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
              {upcomingDemo.effective_meeting_link ? (
                <a
                  href={upcomingDemo.effective_meeting_link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#F27C00] hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>JOIN LIVE DEMO (GOOGLE MEET)</span>
                </a>
              ) : (
                <div className="px-4 py-2.5 bg-white border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold text-center">
                  Teacher is preparing your Google Meet link.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: NEXT REGULAR CLASS (If Student is enrolled in an active batch) */}
      {nextClass ? (
        <div className="bg-gradient-to-br from-[#10182C] to-[#1C2640] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F27C00]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#F27C00] bg-[#F27C00]/20 px-2.5 py-0.5 rounded">
                <Sparkles className="w-3.5 h-3.5" /> Next Live Cohort Session
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {nextClass.topic}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#F27C00]" />
                  {nextClass.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#F27C00]" />
                  {nextClass.start_time} – {nextClass.end_time} IST
                </span>
                <span>
                  Mentor: <strong>{nextClass.teacher_name}</strong>
                </span>
              </div>
            </div>

            <div className="shrink-0">
              {nextClass.meeting_link && nextClass.meeting_link.trim() !== '' ? (
                <a
                  href={nextClass.meeting_link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#F27C00] hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>JOIN CLASS NOW</span>
                </a>
              ) : (
                <div className="px-4 py-3 bg-white/10 backdrop-blur-xs border border-white/20 text-amber-200 rounded-xl text-xs font-semibold text-center">
                  Your teacher will publish the classroom link before start.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : isEnrolledInBatch ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-500 shadow-2xs">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-xs text-[#10182C]">No Live Class Scheduled Today</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Check your weekly timetable in My Classes.</p>
        </div>
      ) : null}

      {/* SECTION 3: AVAILABLE COURSES CATALOG & DIRECT ADMIN ENROLLMENT */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 className="font-bold text-base text-[#10182C] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#F27C00]" />
              <span>Available Speaking & Communication Courses</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select your child's grade level and contact our admissions team directly for instant cohort enrollment.
            </p>
          </div>

          <a
            href={`https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
              `Hi Upspeaq Admissions, I am interested in enrolling my child ${studentName} (Grade: ${studentGrade}). Please guide me.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {availableCourses.map((course: any) => {
            const isCurrentCourse = student?.course_id === course.id;
            return (
              <div
                key={course.id}
                className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-2xs ${
                  isCurrentCourse
                    ? 'border-emerald-400 ring-2 ring-emerald-400/20'
                    : 'border-slate-200/80 hover:border-amber-400 hover:shadow-md'
                }`}
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-[#F27C00] border border-amber-200">
                      {course.grade_range || 'Grades 4 - 8'}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      ₹{course.price_inr?.toLocaleString('en-IN') || '4,999'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[#10182C] leading-snug">{course.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {course.description ||
                        'Master public speaking, extempore thinking, voice modulation, and stage presence in small cohorts.'}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 text-[11px] text-slate-600 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Total Live Sessions:</span>
                      <strong className="text-slate-800">{course.total_classes || 24} Classes</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Batch Max Size:</span>
                      <strong className="text-slate-800">8 Students Max</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Target Age Group:</span>
                      <strong className="text-slate-800">{course.target_age_group || 'School Students'}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/70 border-t border-slate-100">
                  {isCurrentCourse && isEnrolledInBatch ? (
                    <div className="w-full py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Currently Enrolled</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedCourseForEnroll(course)}
                      className="w-full py-2.5 bg-[#10182C] hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#F27C00]" />
                      <span>Contact Admin for Enrollment</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: TWO-COLUMN LEARNING GRID (Homework & Mentor Feedback) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TODAY'S HOMEWORK CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#10182C] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#F27C00]" />
                <span>Active Speech Tasks & Homework</span>
              </h3>
              <button
                onClick={() => onNavigateTab('homework')}
                className="text-xs font-semibold text-[#F27C00] hover:underline"
              >
                View All &rarr;
              </button>
            </div>

            {pendingHw.length > 0 ? (
              <div className="mt-4 space-y-3">
                {pendingHw.map((hw: any) => (
                  <div key={hw.id} className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs text-slate-900">{hw.title}</h4>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded uppercase">
                        Due {hw.due_date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{hw.description}</p>
                    <div className="pt-2">
                      <button
                        onClick={() => onOpenSubmitHomework(hw)}
                        className="px-4 py-2 bg-[#F27C00] text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition shadow-2xs cursor-pointer"
                      >
                        SUBMIT SPEECH TASK
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">You're all caught up!</p>
                <p className="text-[11px] text-slate-400 mt-0.5">No pending speech tasks for today.</p>
              </div>
            )}
          </div>
        </div>

        {/* LATEST MENTOR FEEDBACK CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#10182C] flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Latest Mentor Evaluation</span>
              </h3>
              <span className="text-[10px] font-semibold text-slate-400">Speech Performance</span>
            </div>

            {data?.latestFeedback ? (
              <div className="mt-4 p-4 bg-emerald-50/60 border border-emerald-200/60 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{data.latestFeedback.homework_title}</span>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    ★ Rating: {data.latestFeedback.score_rating || 'Strong'}
                  </span>
                </div>
                <p className="text-xs text-slate-700 italic mt-1 leading-relaxed">
                  "{data.latestFeedback.mentor_feedback}"
                </p>
                <div className="pt-2 text-[10px] text-slate-500">
                  Reviewed by Faculty Coach <strong>{data.latestFeedback.teacher_name || 'Senior Mentor'}</strong>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500">
                <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">No feedback entries yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Submit your speech assignments to receive mentor feedback and confidence ratings.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 5: LEARNING JOURNEY & ATTENDANCE */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-[#10182C] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Cohort Learning Journey & Attendance</span>
            </h3>
            <p className="text-xs text-slate-500">Track speech sessions, consistency, and completed milestones.</p>
          </div>
          <button
            onClick={() => onNavigateTab('curriculum')}
            className="text-xs font-semibold text-[#F27C00] hover:underline"
          >
            Curriculum Tracker &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-center">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-2xl font-bold text-[#10182C]">{progress.completedClasses || 0}</span>
            <span className="block text-xs text-slate-500 mt-1">Sessions Completed</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-2xl font-bold text-emerald-600">{progress.attendedClasses || 0}</span>
            <span className="block text-xs text-slate-500 mt-1">Classes Attended</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-2xl font-bold text-[#F27C00]">
              {progress.totalHomeworkSubmitted || progress.submittedHomeworkCount || 0}
            </span>
            <span className="block text-xs text-slate-500 mt-1">Speech Submissions</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-2xl font-bold text-indigo-600">
              {progress.attendancePercentage ? `${progress.attendancePercentage}%` : '100%'}
            </span>
            <span className="block text-xs text-slate-500 mt-1">Cohort Attendance</span>
          </div>
        </div>
      </div>

      {/* SECTION 6: RECENT RECORDINGS SECTION */}
      {data?.recentRecordings && data.recentRecordings.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#10182C] flex items-center gap-2">
              <Video className="w-4 h-4 text-[#F27C00]" />
              <span>Recent Class Replays & Recordings</span>
            </h3>
            <button
              onClick={() => onNavigateTab('recordings')}
              className="text-xs font-semibold text-[#F27C00] hover:underline"
            >
              All Recordings &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.recentRecordings.map((rec: any) => (
              <div
                key={rec.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {rec.recorded_date}
                  </span>
                  <h4 className="font-bold text-xs text-[#10182C] mt-2">{rec.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{rec.topic}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <a
                    href={rec.recording_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F27C00] hover:underline"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Watch Replay</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DIRECT ADMIN CONTACT & ENROLLMENT MODAL */}
      {selectedCourseForEnroll && (
        <Modal
          isOpen={!!selectedCourseForEnroll}
          onClose={() => setSelectedCourseForEnroll(null)}
          title="Direct Course Enrollment & Admissions Contact"
        >
          <div className="space-y-5 text-left text-slate-900">
            {/* Selected Course Header */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  {selectedCourseForEnroll.grade_range}
                </span>
                <span className="text-sm font-black text-slate-900">
                  ₹{selectedCourseForEnroll.price_inr?.toLocaleString('en-IN') || '4,999'}
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#10182C]">{selectedCourseForEnroll.name}</h3>
              <p className="text-xs text-slate-500">
                {selectedCourseForEnroll.total_classes || 24} live interactive cohort sessions (8 students max).
              </p>
            </div>

            {/* Direct Connect Options */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Connect Directly with Admissions:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. WhatsApp Direct Link */}
                <a
                  href={`https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
                    `Hi Upspeaq Admissions, I want to enroll ${studentName} (Grade: ${studentGrade}, Phone: ${student?.parent_phone || ''}) in "${selectedCourseForEnroll.name}". Please confirm admission.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-2 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Admissions</span>
                </a>

                {/* 2. Direct Call */}
                <a
                  href={`tel:${branding.contactPhone || '+917004132088'}`}
                  className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#F27C00]" />
                  <span>Call {branding.contactPhone || '+91 7004132088'}</span>
                </a>
              </div>
            </div>

            {/* In-App Direct Request Form */}
            <form onSubmit={handleSendEnrollRequest} className="space-y-3 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">
                Send Direct Enrollment Request to Admin:
              </label>
              <textarea
                rows={2}
                value={requestNotes}
                onChange={(e) => setRequestNotes(e.target.value)}
                placeholder="E.g., Preferred days (Mon/Wed/Fri 5 PM), student goals, or any questions..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#F27C00]"
              />

              <button
                type="submit"
                disabled={sendingRequest}
                className="w-full py-2.5 bg-[#F27C00] hover:bg-orange-600 disabled:opacity-60 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{sendingRequest ? 'Sending Request...' : 'Send Request to Admissions Director'}</span>
              </button>
            </form>

            {/* Instant Direct Cohort Activation (One-Click Instant Confirmation) */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Instant Cohort Activation</span>
                <span className="text-emerald-700 font-semibold">Immediate Live Class Access</span>
              </div>
              <button
                type="button"
                onClick={() => handleDirectEnroll(selectedCourseForEnroll.id)}
                disabled={directEnrolling}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{directEnrolling ? 'Activating Cohort...' : 'Confirm & Activate Course Schedule Now'}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
