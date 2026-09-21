import React, { useState } from 'react';
import { Lead, Teacher, Course, Batch } from '../../types';
import { Modal } from '../ui/Modal';
import { api } from '../../lib/api';
import { Badge } from '../ui/Badge';
import {
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  CreditCard,
  CheckCircle,
  Save,
  Link,
  Copy,
  ExternalLink,
  PlusCircle,
  Video,
  Sparkles,
  Share2,
} from 'lucide-react';


interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
  courses: Course[];
  batches: Batch[];
  onLeadUpdated: () => void;
  onSuccessToast: (msg: string) => void;
  onErrorToast: (msg: string) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  teachers,
  courses,
  batches,
  onLeadUpdated,
  onSuccessToast,
  onErrorToast,
}) => {
  if (!lead) return null;

  const [status, setStatus] = useState(lead.status);
  const [internalNotes, setInternalNotes] = useState(lead.notes || '');
  const [savingNotes, setSavingNotes] = useState(false);

  // Demo scheduling state
  const [showScheduleDemo, setShowScheduleDemo] = useState(false);
  const [demoDate, setDemoDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [demoTeacherId, setDemoTeacherId] = useState(teachers[0]?.id || '');
  const [useAutoMeet, setUseAutoMeet] = useState(true);
  const [meetingLink, setMeetingLink] = useState('');
  const [schedulingDemo, setSchedulingDemo] = useState(false);
  const [scheduledMeetResult, setScheduledMeetResult] = useState<{
    joinUrl: string;
    meetingCode?: string;
    teacherName?: string;
    scheduledAt?: string;
  } | null>(null);

  // Payment Link generation state
  const [showCreatePayment, setShowCreatePayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(4999);
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [creatingPayment, setCreatingPayment] = useState(false);
  const [generatedPaymentUrl, setGeneratedPaymentUrl] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await api.updateLeadStatus(lead.id, newStatus);
      setStatus(newStatus as any);
      onLeadUpdated();
      onSuccessToast(`Lead status updated to ${newStatus}`);
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to update lead status');
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await api.updateLead(lead.id, { notes: internalNotes });
      onLeadUpdated();
      onSuccessToast('Notes saved successfully');
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleScheduleDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSchedulingDemo(true);
    try {
      const selectedTeacher = teachers.find((t) => t.id === demoTeacherId);
      const teacherName = selectedTeacher?.name || 'Assigned Coach';

      const res = await api.createMeetDemo({
        lead_id: lead.id,
        scheduled_at: demoDate,
        teacherId: demoTeacherId || undefined,
        meetingLink: meetingLink.trim() || undefined,
        notes: `Demo for ${lead.student_name} (${lead.student_class})`,
      });

      setScheduledMeetResult({
        joinUrl: res.meet?.joinUrl || res.demo?.meeting_link,
        meetingCode: res.meet?.meetingCode || undefined,
        teacherName,
        scheduledAt: demoDate,
      });

      onSuccessToast('Google Meet Demo Session scheduled successfully!');
      setShowScheduleDemo(false);
      onLeadUpdated();
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to schedule Google Meet demo');
    } finally {
      setSchedulingDemo(false);
    }
  };

  const getWhatsAppInviteMessage = () => {
    const formattedDate = new Date(demoDate).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    const selectedTeacher = teachers.find((t) => t.id === demoTeacherId);
    const teacherName = scheduledMeetResult?.teacherName || selectedTeacher?.name || 'Senior Communication Coach';
    const link = scheduledMeetResult?.joinUrl || meetingLink || 'https://meet.google.com/upspeaq-demo';

    return `*upspeaq — Free 1-on-1 / Micro Demo Session Confirmation*\n\n` +
      `Dear ${lead.parent_name},\n` +
      `We have reserved a live interactive trial class for *${lead.student_name}* (${lead.student_class})!\n\n` +
      `📅 *Date & Time:* ${formattedDate}\n` +
      `👩‍🏫 *Educator:* ${teacherName}\n` +
      `🎯 *Focus:* Spoken English, Articulation & Stage Confidence\n\n` +
      `🔗 *Google Meet Join Link:* ${link}\n\n` +
      `📌 *Instructions:*\n` +
      `1. Please join 5 minutes early on a laptop/tablet with audio & video enabled.\n` +
      `2. Keep a notebook and pen handy.\n\n` +
      `For any questions, feel free to reply directly to this chat.\n` +
      `— Admissions Team, upspeaq`;
  };

  const copyWhatsAppInvite = () => {
    const text = getWhatsAppInviteMessage();
    navigator.clipboard.writeText(text);
    onSuccessToast('WhatsApp Demo Invitation copied to clipboard!');
  };

  const openWhatsAppDirect = () => {
    const cleanDigits = lead.mobile_number.replace(/\D/g, '');
    const phone = cleanDigits.startsWith('91') ? cleanDigits : (cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits);
    const text = encodeURIComponent(getWhatsAppInviteMessage());
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingPayment(true);
    try {
      const res = await api.createPayment({
        lead_id: lead.id,
        course_id: selectedCourseId || undefined,
        amount_inr: paymentAmount,
      });
      setGeneratedPaymentUrl(res.paymentUrl || res.paymentLink);
      onLeadUpdated();
      onSuccessToast('Payment link created and lead marked PAYMENT_REQUESTED!');
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to create payment link');
    } finally {
      setCreatingPayment(false);
    }
  };

  const copyPaymentUrl = () => {
    if (!generatedPaymentUrl) return;
    navigator.clipboard.writeText(generatedPaymentUrl);
    onSuccessToast('Payment link copied to clipboard!');
  };

  const cleanPhone = lead.mobile_number.replace(/\D/g, '');


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${lead.student_name} (${lead.student_class})`}
      subtitle={`Parent: ${lead.parent_name} • Phone: ${lead.mobile_number}`}
      maxWidth="2xl"
    >
      <div className="space-y-6 text-left">
        {/* Top Quick Actions Bar */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Funnel Status:</span>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-xs font-bold py-1.5 px-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500"
            >
              <option value="NEW">NEW</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="DEMO_SCHEDULED">DEMO_SCHEDULED</option>
              <option value="DEMO_ATTENDED">DEMO_ATTENDED</option>
              <option value="INTERESTED">INTERESTED</option>
              <option value="PAYMENT_REQUESTED">PAYMENT_REQUESTED</option>
              <option value="PAID">PAID (Converted)</option>
              <option value="NOT_INTERESTED">NOT_INTERESTED</option>
              <option value="JUNK">JUNK</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(
                lead.parent_name
              )},%20this%20is%20regarding%20${encodeURIComponent(
                lead.student_name
              )}'s%20communication%20demo%20class.`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${lead.mobile_number}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
          </div>
        </div>

        {/* Lead Dossier Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-0.5">Student Age & Grade</span>
            <strong className="text-slate-800 font-bold block">
              {lead.student_class} {lead.student_age ? `(${lead.student_age} yrs)` : ''}
            </strong>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-0.5">Focus Skill</span>
            <strong className="text-slate-800 font-bold block">{lead.interest_area || 'Confidence'}</strong>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-0.5">Preferred Demo Slot</span>
            <strong className="text-slate-800 font-bold block">
              {lead.preferred_time || 'Flexible'}
            </strong>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-0.5">City & Region</span>
            <strong className="text-slate-800 font-bold block">{lead.city || 'Not specified'}</strong>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-0.5">Parent Email</span>
            <strong className="text-slate-800 font-bold block truncate">
              {lead.email || 'No email provided'}
            </strong>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-0.5">Source & Marketing</span>
            <strong className="text-slate-800 font-bold block">
              {lead.lead_source || 'DIRECT'} {lead.utm_source ? `(${lead.utm_source})` : ''}
            </strong>
          </div>
        </div>

        {/* Operations Workflow Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setShowScheduleDemo(!showScheduleDemo);
              setShowCreatePayment(false);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>Schedule Google Meet Demo</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
          </button>

          <button
            type="button"
            onClick={() => {
              setShowCreatePayment(!showCreatePayment);
              setShowScheduleDemo(false);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Generate Payment Link</span>
          </button>
        </div>

        {/* Scheduled Google Meet Result / Active Demo Invite Card */}
        {scheduledMeetResult && (
          <div className="p-4 bg-emerald-50/90 border border-emerald-300 rounded-2xl space-y-3 text-xs animate-in fade-in">
            <div className="flex items-center justify-between gap-2 border-b border-emerald-200 pb-2">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                <Video className="w-4 h-4 text-emerald-700" />
                <span>Google Meet Demo Session Scheduled Successfully!</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                GOOGLE MEET LIVE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
              <div className="p-2.5 bg-white/80 rounded-xl border border-emerald-100">
                <span className="text-[11px] text-slate-500 block">Student & Grade:</span>
                <strong className="text-slate-900">{lead.student_name} ({lead.student_class})</strong>
              </div>
              <div className="p-2.5 bg-white/80 rounded-xl border border-emerald-100">
                <span className="text-[11px] text-slate-500 block">Educator:</span>
                <strong className="text-slate-900">{scheduledMeetResult.teacherName}</strong>
              </div>
              {scheduledMeetResult.meetingCode && (
                <div className="p-2.5 bg-white/80 rounded-xl border border-emerald-100 col-span-1 sm:col-span-2">
                  <span className="text-[11px] text-slate-500 block">Meeting Room Link:</span>
                  <span className="font-mono font-bold text-emerald-800">{scheduledMeetResult.joinUrl}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={scheduledMeetResult.joinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Enter Google Meet Room</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={copyWhatsAppInvite}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy WhatsApp Invite</span>
              </button>

              <button
                type="button"
                onClick={openWhatsAppDirect}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Send to Parent via WhatsApp</span>
              </button>
            </div>
          </div>
        )}

        {/* Inline Schedule Demo Form */}
        {showScheduleDemo && (
          <form
            onSubmit={handleScheduleDemo}
            className="p-5 bg-gradient-to-br from-emerald-50/90 to-emerald-100/40 border border-emerald-200 rounded-2xl space-y-4 text-xs animate-in fade-in"
          >
            <div className="border-b border-emerald-200/80 pb-2.5">
              <h4 className="font-black text-emerald-950 text-sm flex items-center gap-1.5">
                <Video className="w-4 h-4 text-emerald-700" />
                <span>Schedule Google Meet Demo Evaluation</span>
              </h4>
              <p className="text-[11px] text-emerald-800/80 mt-0.5">
                Parent preferred time: <strong>{lead.preferred_time || 'Flexible'}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Date & Start Time</label>
                <input
                  type="datetime-local"
                  required
                  value={demoDate}
                  onChange={(e) => setDemoDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Assigned Communication Coach</label>
                <select
                  value={demoTeacherId}
                  onChange={(e) => setDemoTeacherId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.expertise.split(',')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2 p-3 bg-white/90 border border-emerald-200 rounded-xl">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 text-[11px] block">
                  Google Meet Room Link (Real Meeting URL)
                </label>
                <button
                  type="button"
                  onClick={() => window.open('https://meet.google.com/new', '_blank')}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-md border border-emerald-200 cursor-pointer transition-colors"
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
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500 font-semibold">Quick Presets:</span>
                <button
                  type="button"
                  onClick={() => setMeetingLink('https://meet.google.com/upspeaq-demo')}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono cursor-pointer"
                >
                  upspeaq-demo
                </button>
                <button
                  type="button"
                  onClick={() => setMeetingLink('https://meet.google.com/upspeaq-trial-1')}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono cursor-pointer"
                >
                  upspeaq-trial-1
                </button>
                <button
                  type="button"
                  onClick={() => setMeetingLink('https://meet.google.com/upspeaq-trial-2')}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono cursor-pointer"
                >
                  upspeaq-trial-2
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                Tip: Click <strong>"⚡ Create Real Google Meet"</strong> to generate a unique room code directly on Google, then paste the URL above.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-emerald-200/80">
              <button
                type="button"
                onClick={() => setShowScheduleDemo(false)}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={schedulingDemo}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>{schedulingDemo ? 'Provisioning Google Meet Room...' : 'Confirm & Schedule Google Meet Demo'}</span>
              </button>
            </div>
          </form>
        )}


        {/* Inline Create Payment Link Form */}
        {showCreatePayment && (
          <form
            onSubmit={handleCreatePayment}
            className="p-4 bg-slate-900 text-white rounded-2xl space-y-4 text-xs animate-in fade-in"
          >
            <h4 className="font-bold text-amber-400 text-sm">Generate Enrollment Payment Link</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-300 block">Fee Amount (INR)</label>
                <input
                  type="number"
                  required
                  min={100}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 block">Program / Course</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (₹{c.price_inr})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreatePayment(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creatingPayment}
                className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold"
              >
                {creatingPayment ? 'Generating...' : 'Create & Copy Invoice'}
              </button>
            </div>
          </form>
        )}

        {/* Display Generated Payment URL */}
        {generatedPaymentUrl && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 space-y-2">
            <div className="flex items-center justify-between">
              <strong className="font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Active Payment Link Generated</span>
              </strong>
              <button
                type="button"
                onClick={copyPaymentUrl}
                className="text-emerald-700 font-bold flex items-center gap-1 hover:underline"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </button>
            </div>
            <div className="p-2 bg-white rounded border border-emerald-200 font-mono text-[11px] break-all">
              {generatedPaymentUrl}
            </div>
            <p className="text-[11px] text-emerald-800">
              When the parent pays through this link, the system will automatically convert this lead into an active
              enrolled student and assign them to an available batch.
            </p>
          </div>
        )}

        {/* Operational Notes */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">Internal Admissions Notes</label>
            <button
              type="button"
              onClick={handleSaveNotes}
              disabled={savingNotes}
              className="inline-flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 font-bold cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingNotes ? 'Saving...' : 'Save Notes'}</span>
            </button>
          </div>
          <textarea
            rows={3}
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            placeholder="Document parent preferences, school name, demo feedback, student hesitation triggers..."
            className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 bg-white"
          />
        </div>
      </div>
    </Modal>
  );
};
