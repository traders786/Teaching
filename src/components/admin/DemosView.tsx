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
  Copy,
  MessageCircle,
  ShieldCheck,
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

  // New Demo Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('Class 6');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [newDemoDate, setNewDemoDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [newTeacherId, setNewTeacherId] = useState(teachers[0]?.id || '');
  const [newMeetingLink, setNewMeetingLink] = useState('');
  const [creatingDemo, setCreatingDemo] = useState(false);

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

  const handleCreateMeetDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newParentPhone.trim()) {
      onErrorToast('Student name and parent phone are required.');
      return;
    }

    setCreatingDemo(true);
    try {
      const selectedTeacher = teachers.find((t) => t.id === newTeacherId);
      const res = await api.createMeetDemo({
        student_name: newStudentName.trim(),
        student_class: newStudentClass,
        parent_name: newParentName.trim() || undefined,
        parent_phone: newParentPhone.trim() || undefined,
        topic: `upspeaq Demo: ${newStudentName.trim()} (${newStudentClass})`,
        scheduled_at: newDemoDate,
        teacherId: newTeacherId || undefined,
        meetingLink: newMeetingLink.trim() || undefined,
        notes: `Trial booked directly by staff for ${newStudentName.trim()} (Parent: ${newParentName.trim() || 'Parent'}, ${newParentPhone.trim()})`,
      });

      setShowCreateModal(false);
      setNewStudentName('');
      setNewParentName('');
      setNewParentPhone('');
      setNewMeetingLink('');
      loadDemos();
      onSuccessToast(res.message || 'Google Meet Demo Session created successfully!');
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to create Google Meet demo session');
    } finally {
      setCreatingDemo(false);
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

  const copyWhatsAppInvite = (demo: DemoSession) => {
    const formattedDate = demo.date && demo.start_time
      ? `${demo.date} at ${demo.start_time}`
      : (demo.scheduled_at ? new Date(demo.scheduled_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Scheduled Time');

    const teacherName = demo.teacher_name || 'Senior Communication Coach';
    const link = demo.meeting_link || demo.google_meet_link || 'https://meet.google.com/upspeaq-demo';

    const text = `*upspeaq — Free 1-on-1 / Micro Demo Session Confirmation*\n\n` +
      `Dear ${demo.parent_name || 'Parent'},\n` +
      `We have reserved a live interactive trial class for *${demo.student_name || demo.title}* ${demo.student_class ? `(${demo.student_class})` : ''}!\n\n` +
      `📅 *Date & Time:* ${formattedDate}\n` +
      `👩‍🏫 *Educator:* ${teacherName}\n` +
      `🎯 *Focus:* Spoken English, Articulation & Stage Confidence\n\n` +
      `🔗 *Google Meet Join Link:* ${link}\n\n` +
      `📌 *Instructions:*\n` +
      `1. Please join 5 minutes early on a laptop/tablet with audio & video enabled.\n` +
      `2. Keep a notebook and pen handy.\n\n` +
      `For any questions, feel free to reply directly to this chat.\n` +
      `— Admissions Team, upspeaq`;

    navigator.clipboard.writeText(text);
    onSuccessToast('WhatsApp Demo Invitation copied to clipboard!');
  };

  const openWhatsAppForDemo = (demo: DemoSession) => {
    if (!demo.parent_phone) {
      onErrorToast('Parent phone number not available for this session.');
      return;
    }
    const cleanDigits = demo.parent_phone.replace(/\D/g, '');
    const phone = cleanDigits.startsWith('91') ? cleanDigits : (cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits);
    
    const formattedDate = demo.date && demo.start_time
      ? `${demo.date} at ${demo.start_time}`
      : (demo.scheduled_at ? new Date(demo.scheduled_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Scheduled Time');

    const teacherName = demo.teacher_name || 'Senior Communication Coach';
    const link = demo.meeting_link || demo.google_meet_link || 'https://meet.google.com/upspeaq-demo';

    const text = `*upspeaq — Free 1-on-1 / Micro Demo Session Confirmation*\n\n` +
      `Dear ${demo.parent_name || 'Parent'},\n` +
      `We have reserved a live interactive trial class for *${demo.student_name || demo.title}* ${demo.student_class ? `(${demo.student_class})` : ''}!\n\n` +
      `📅 *Date & Time:* ${formattedDate}\n` +
      `👩‍🏫 *Educator:* ${teacherName}\n` +
      `🎯 *Focus:* Spoken English, Articulation & Stage Confidence\n\n` +
      `🔗 *Google Meet Join Link:* ${link}\n\n` +
      `📌 *Instructions:*\n` +
      `1. Please join 5 minutes early on a laptop/tablet with audio & video enabled.\n` +
      `2. Keep a notebook and pen handy.\n\n` +
      `For any questions, feel free to reply directly to this chat.\n` +
      `— Admissions Team, upspeaq`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="p-6 md:p-8 space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Interactive Demo Sessions</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
              <Video className="w-3.5 h-3.5" />
              <span>Google Meet Integrated</span>
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage live 1-on-1 and micro trial evaluations, generate Google Meet rooms, track attendance, and log coach feedback
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Schedule Google Meet Demo</span>
          </button>

          <button
            onClick={() => loadDemos()}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
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
            <strong>The 2-Student Micro-Demo Standard:</strong> Trial sessions are strictly limited so
            the mentor can spend 20 minutes directly evaluating the child's tone, hesitation, and expression on live Google Meet video.
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
                <th className="py-3 px-4">Google Meet Details</th>
                <th className="py-3 px-4">Session Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
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
                demos.map((demo) => {
                  const displayDate = demo.date && demo.start_time
                    ? `${demo.date} • ${demo.start_time}`
                    : (demo.scheduled_at || 'Flexible');

                  return (
                    <tr key={demo.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{demo.student_name || demo.title}</div>
                        <div className="text-[11px] text-slate-500">
                          {demo.student_class || 'Class Evaluation'} {demo.parent_name ? `• Parent: ${demo.parent_name}` : ''} {demo.parent_phone ? `(${demo.parent_phone})` : ''}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{displayDate}</span>
                        </div>
                        <span className="text-[11px] text-slate-500">Duration: {demo.duration_minutes || 45} mins</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">{demo.teacher_name || 'Assigned Coach'}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        {demo.meeting_link ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <a
                                href={demo.meeting_link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] border border-emerald-200 transition-colors"
                                title="Enter Google Meet Room"
                              >
                                <Video className="w-3 h-3 text-emerald-600" />
                                <span>Join Google Meet</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge variant="demo" value={demo.status} />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => copyWhatsAppInvite(demo)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition-colors cursor-pointer"
                            title="Copy WhatsApp Invite"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {demo.parent_phone && (
                            <button
                              onClick={() => openWhatsAppForDemo(demo)}
                              className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs transition-colors cursor-pointer"
                              title="Send WhatsApp Invite"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedDemo(demo);
                              setDemoOutcome((demo.status as any) || 'ATTENDED');
                              setTeacherFeedback(demo.teacher_feedback || '');
                            }}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Record Outcome
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule New Google Meet Demo Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Schedule New Google Meet Demo Session"
        subtitle="Auto-provisions live Google Meet room link with educator assignment"
        maxWidth="md"
      >
        <form onSubmit={handleCreateMeetDemo} className="space-y-4 text-left text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                Student's Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aarav Sharma"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Student Grade/Class</label>
              <select
                value={newStudentClass}
                onChange={(e) => setNewStudentClass(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                {['Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(
                  (c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Parent Name</label>
              <input
                type="text"
                placeholder="e.g. Rajesh Sharma"
                value={newParentName}
                onChange={(e) => setNewParentName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                Parent WhatsApp / Mobile <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 98765 43210"
                value={newParentPhone}
                onChange={(e) => setNewParentPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Date & Start Time</label>
              <input
                type="datetime-local"
                required
                value={newDemoDate}
                onChange={(e) => setNewDemoDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Assigned Mentor</label>
              <select
                value={newTeacherId}
                onChange={(e) => setNewTeacherId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="">🔓 No Teacher (Teachers self-claim)</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}{t.expertise ? ` (${t.expertise.split(',')[0]})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 text-[11px] block">
                Google Meet Room Link (Real Meeting URL)
              </label>
              <button
                type="button"
                onClick={() => window.open('https://meet.google.com/new', '_blank')}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-white hover:bg-emerald-100 px-2 py-1 rounded-md border border-emerald-200 cursor-pointer transition-colors"
                title="Opens Google Meet in new tab to create an instant real meeting room"
              >
                <ExternalLink className="w-3 h-3" />
                <span>⚡ Create Real Google Meet (meet.google.com/new)</span>
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://meet.google.com/abc-defg-hij or paste real link"
                value={newMeetingLink}
                onChange={(e) => setNewMeetingLink(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-500 font-semibold">Quick Presets:</span>
              <button
                type="button"
                onClick={() => setNewMeetingLink('https://meet.google.com/upspeaq-demo')}
                className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[10px] font-mono cursor-pointer"
              >
                upspeaq-demo
              </button>
              <button
                type="button"
                onClick={() => setNewMeetingLink('https://meet.google.com/upspeaq-trial-1')}
                className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[10px] font-mono cursor-pointer"
              >
                upspeaq-trial-1
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Click <strong>"⚡ Create Real Google Meet"</strong> to generate a unique room code directly on Google, then paste the URL above.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingDemo}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>{creatingDemo ? 'Generating Google Meet...' : 'Create Google Meet Demo Session'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Record Demo Attendance / Feedback Modal */}
      <Modal
        isOpen={!!selectedDemo}
        onClose={() => setSelectedDemo(null)}
        title={`Demo Evaluation: ${selectedDemo?.student_name || selectedDemo?.title}`}
        subtitle={`Scheduled: ${selectedDemo?.date || selectedDemo?.scheduled_at || 'Session'}`}
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
                className="px-4 py-2 rounded-lg bg-amber-600 text-white font-bold cursor-pointer"
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
