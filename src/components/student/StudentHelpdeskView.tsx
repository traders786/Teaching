import React, { useState, useEffect } from 'react';
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  HelpCircle,
  Clock,
  ShieldCheck,
  Send,
  Sparkles,
  AlertCircle,
  FileText,
  Video,
  CheckCircle2,
  RefreshCw,
  Inbox,
} from 'lucide-react';
import { api } from '../../lib/api';

interface StudentHelpdeskViewProps {
  onSuccessToast?: (msg: string) => void;
  onErrorToast?: (msg: string) => void;
}

export function StudentHelpdeskView({
  onSuccessToast,
  onErrorToast,
}: StudentHelpdeskViewProps) {
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('General Query');
  const [customSubject, setCustomSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{ ticketNumber: string; message: string } | null>(null);
  const [pastInquiries, setPastInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  const SUPPORT_EMAIL = 'upspeaqofficial@gmail.com';

  const categories = [
    {
      id: 'General Query',
      label: 'General Inquiry / Guidance',
      icon: HelpCircle,
      defaultSubject: '[Upspeaq Support] General Inquiry',
      placeholder: 'Describe what you need help or guidance with...',
    },
    {
      id: 'Live Class Issue',
      label: 'Live Class / Meet / Zoom Link',
      icon: Video,
      defaultSubject: '[Upspeaq Support] Live Class / Meeting Link Query',
      placeholder: 'Describe any issue joining today’s live class or batch session...',
    },
    {
      id: 'Homework Help',
      label: 'Homework & Assignment Assistance',
      icon: FileText,
      defaultSubject: '[Upspeaq Support] Homework Submission Question',
      placeholder: 'Describe your question regarding speech homework, recordings, or mentor review...',
    },
    {
      id: 'Batch Schedule',
      label: 'Batch Timing / Rescheduling Request',
      icon: Clock,
      defaultSubject: '[Upspeaq Support] Batch Schedule & Rescheduling Request',
      placeholder: 'Let us know your batch details and preferred reschedule timings...',
    },
    {
      id: 'Technical Help',
      label: 'Portal / Video / Audio Technical Issue',
      icon: AlertCircle,
      defaultSubject: '[Upspeaq Support] Portal Technical Assistance',
      placeholder: 'Describe any technical trouble you are facing with audio, video, or portal access...',
    },
  ];

  const loadData = async () => {
    try {
      setLoadingInquiries(true);
      const [profRes, inqRes] = await Promise.all([
        api.getStudentProfile().catch(() => ({ student: null })),
        api.getStudentHelpdeskInquiries().catch(() => ({ inquiries: [] })),
      ]);
      if (profRes?.student) setStudentProfile(profRes.student);
      if (inqRes?.inquiries) setPastInquiries(inqRes.inquiries);
    } catch (e) {
      // quiet fallback
    } finally {
      setLoadingInquiries(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SUPPORT_EMAIL);
    setCopied(true);
    if (onSuccessToast) onSuccessToast('Email copied to clipboard: ' + SUPPORT_EMAIL);
    setTimeout(() => setCopied(false), 2500);
  };

  const currentCat = categories.find((c) => c.id === selectedCategory) || categories[0];
  const finalSubject = customSubject.trim() || currentCat.defaultSubject;
  
  const studentInfoFooter = `\n\n---\nStudent Name: ${studentProfile?.name || 'Kabir Verma'}\nBatch: ${studentProfile?.batch_name || 'Junior Orators Cohort'}\nParent Email: ${studentProfile?.parent_email || 'Verified Student'}\nPlatform: Upspeaq Student Portal`;

  const finalBody = customMessage.trim()
    ? `${customMessage.trim()}${studentInfoFooter}`
    : `Hello Upspeaq Support Team,\n\nI need assistance regarding: ${selectedCategory}.\n\nQuery details: \n${studentInfoFooter}`;

  // Direct Gmail web compose link with to, subject, and body prefilled
  const gmailWebComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SUPPORT_EMAIL)}&su=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(finalBody)}`;
  
  // Native mailto link for Outlook / Apple Mail / default apps
  const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(finalBody)}`;

  const handleDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim()) {
      if (onErrorToast) onErrorToast('Please describe your query or message before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.submitStudentHelpdeskInquiry({
        category: selectedCategory,
        subject: finalSubject,
        message: customMessage.trim(),
      });

      setSubmittedTicket({
        ticketNumber: res.ticketNumber,
        message: res.message,
      });

      if (onSuccessToast) {
        onSuccessToast(`Inquiry sent to ${SUPPORT_EMAIL}! Reference #${res.ticketNumber}`);
      }

      setCustomSubject('');
      setCustomMessage('');
      loadData();
    } catch (e: any) {
      if (onErrorToast) onErrorToast(e?.message || 'Failed to submit inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#10182C] flex items-center gap-2">
            <Mail className="w-6 h-6 text-[#F27C00]" />
            <span>Student Helpdesk & Official Support</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Need help with classes, meeting links, or assignments? Send inquiries directly to our official support team.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Official Support Desk</span>
        </div>
      </div>

      {/* Success Notification Banner after direct submit */}
      {submittedTicket && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-xs flex items-start justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-900">
                Inquiry Dispatched Successfully!
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                Ticket Reference: <strong className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-900">#{submittedTicket.ticketNumber}</strong>
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                Your message has been delivered to <strong>{SUPPORT_EMAIL}</strong>. Our counselors and mentors will get back to you shortly.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSubmittedTicket(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Primary Direct Email Quick Action Card */}
      <div className="bg-gradient-to-r from-[#10182C] via-slate-900 to-[#1e293b] text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <span className="text-[10px] font-bold text-[#F27C00] uppercase tracking-wider bg-orange-500/10 border border-orange-500/30 px-2.5 py-0.5 rounded">
              Direct Official Email Channel
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Official Academic Support Inbox
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every inquiry sent from this page is delivered directly to our primary academic inbox and tracked by our senior mentors.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-4 py-2.5 rounded-xl font-mono text-sm font-semibold text-amber-400">
                <Mail className="w-4 h-4 text-[#F27C00]" />
                <span>{SUPPORT_EMAIL}</span>
              </div>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Email'}</span>
              </button>
            </div>
          </div>

          {/* Direct Launch Actions */}
          <div className="shrink-0 flex flex-col gap-2.5 w-full sm:w-auto">
            {/* Primary Action 1: Open in Gmail Web */}
            <a
              href={gmailWebComposeUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>OPEN IN GMAIL (NEW DRAFT)</span>
            </a>

            {/* Action 2: Open in Default Mail Client */}
            <a
              href={mailtoUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#F27C00]" />
              <span>Open in Default Mail App</span>
            </a>

            <span className="text-[10px] text-center text-slate-400">Response turnaround: 2–4 Hours</span>
          </div>
        </div>
      </div>

      {/* Interactive Inquiry Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-[#10182C]">Submit Inquiry / Question</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select the topic and type your query below. Submitting will send the inquiry to <span className="font-semibold text-slate-800">{SUPPORT_EMAIL}</span>.
          </p>
        </div>

        {/* Category Pills */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Select Query Category</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'border-[#F27C00] bg-amber-50/50 shadow-xs ring-1 ring-[#F27C00]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#F27C00] text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#10182C]">{cat.label}</h4>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Pre-configured template</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Subject & Message Form */}
        <form onSubmit={handleDirectSubmit} className="space-y-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Subject Line</label>
            <input
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder={currentCat.defaultSubject}
              className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#F27C00] bg-slate-50/50 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Your Message / Details <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder={currentCat.placeholder}
              className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#F27C00] bg-slate-50/50 leading-relaxed"
            />
          </div>

          {/* Student metadata preview badge */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F27C00]" />
              <span>Sender: <strong>{studentProfile?.name || 'Kabir Verma'}</strong> ({studentProfile?.batch_name || 'Junior Orators Cohort'})</span>
            </span>
            <span className="text-slate-500">
              Recipient: <strong className="font-mono text-slate-800">{SUPPORT_EMAIL}</strong>
            </span>
          </div>

          {/* Buttons: Submit Direct OR Open in Gmail */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <a
              href={gmailWebComposeUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-red-600" />
              <span>Open Pre-filled in Gmail</span>
            </a>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-3 bg-[#F27C00] hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Sending to Official Email...' : `Send Inquiry to ${SUPPORT_EMAIL}`}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Past Sent Inquiries History */}
      {pastInquiries.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#10182C] flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#F27C00]" />
              <span>Your Recent Inquiries</span>
            </h3>
            <span className="text-xs text-slate-500">{pastInquiries.length} Inquiries Logged</span>
          </div>

          <div className="divide-y divide-slate-100">
            {pastInquiries.map((inq) => (
              <div key={inq.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      #{inq.ticket_number}
                    </span>
                    <span className="font-bold text-[#10182C]">{inq.subject}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Category: <strong>{inq.category}</strong> • Logged: {inq.created_at}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                    inq.status === 'RESOLVED' || inq.status === 'CLOSED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {inq.status || 'OPEN'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
