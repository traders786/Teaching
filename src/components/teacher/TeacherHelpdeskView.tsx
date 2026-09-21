import React, { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  Send,
  HelpCircle,
  Clock,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Users,
  Video,
  FileText,
} from 'lucide-react';

interface TeacherHelpdeskViewProps {
  onSuccessToast?: (msg: string) => void;
  onErrorToast?: (msg: string) => void;
}

export function TeacherHelpdeskView({
  onSuccessToast,
  onErrorToast,
}: TeacherHelpdeskViewProps) {
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Curriculum Support');
  const [customSubject, setCustomSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  const SUPPORT_EMAIL = 'upspeaqofficial@gmail.com';

  const categories = [
    {
      id: 'Curriculum Support',
      label: 'Curriculum & Activity Prompts',
      icon: FileText,
      defaultSubject: '[Teacher Support] Curriculum & Lesson Plan Guidance',
      placeholder: 'Describe any custom speaking prompt or curriculum module request...',
    },
    {
      id: 'Batch Logistics',
      label: 'Batch Student Roster / Live Links',
      icon: Users,
      defaultSubject: '[Teacher Support] Batch Roster & Class Link Support',
      placeholder: 'Let us know if you need student adjustments or live class link updates...',
    },
    {
      id: 'Demos & Evaluations',
      label: 'Demo Slot & Evaluation Assistance',
      icon: Video,
      defaultSubject: '[Teacher Support] Demo Session Evaluation Query',
      placeholder: 'Describe questions regarding demo leads, rubrics, or evaluations...',
    },
    {
      id: 'Technical Assistance',
      label: 'Audio/Video/Recording Technical Help',
      icon: AlertCircle,
      defaultSubject: '[Teacher Support] Portal & Recording Technical Assistance',
      placeholder: 'Describe any portal or recording replay upload questions...',
    },
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SUPPORT_EMAIL);
    setCopied(true);
    if (onSuccessToast) onSuccessToast('Email address copied to clipboard: ' + SUPPORT_EMAIL);
    setTimeout(() => setCopied(false), 2500);
  };

  const currentCat = categories.find((c) => c.id === selectedCategory) || categories[0];
  const finalSubject = customSubject.trim() || currentCat.defaultSubject;
  const finalBody = customMessage.trim()
    ? `${customMessage}\n\n---\nSent from Upspeaq Teacher Portal`
    : `Hello Upspeaq Academic Administration,\n\nI need teacher support regarding ${selectedCategory}.\n\nTeacher Name: \nBatch / Cohort: \nDetails: \n\nThank you!`;

  const gmailWebComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SUPPORT_EMAIL)}&su=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(finalBody)}`;
  const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(finalBody)}`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#10182C] flex items-center gap-2">
            <Mail className="w-6 h-6 text-[#F27C00]" />
            <span>Faculty & Academic Helpdesk</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Direct communication channel for teachers with the central Upspeaq academic administration.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-800 bg-indigo-50 border border-indigo-200 px-3.5 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Faculty Administration</span>
        </div>
      </div>

      {/* Primary Direct Email Card */}
      <div className="bg-gradient-to-r from-[#10182C] via-slate-900 to-[#1e293b] text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <span className="text-[10px] font-bold text-[#F27C00] uppercase tracking-wider bg-orange-500/10 border border-orange-500/30 px-2.5 py-0.5 rounded">
              Direct Faculty Channel
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Official Administration Contact Email
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Reach out directly to central operations for student queries, batch reschedule requests, or custom curriculum prompts.
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
                <span>{copied ? 'Copied!' : 'Copy Address'}</span>
              </button>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-2 w-full sm:w-auto">
            <a
              href={gmailWebComposeUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>OPEN IN GMAIL (NEW DRAFT)</span>
            </a>
            <a
              href={mailtoUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#F27C00]" />
              <span>Open in Default Mail App</span>
            </a>
            <span className="text-[10px] text-center text-slate-400">Admin Response: 2–4 Hours</span>
          </div>
        </div>
      </div>

      {/* Category Selection & Custom Pre-filler */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-[#10182C]">Faculty Inquiry Categories</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a topic to auto-format your email subject and template.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <span className="text-[10px] text-slate-500 block mt-0.5">Quick email template</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Subject & Details */}
        <div className="space-y-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Subject Line</label>
            <input
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder={currentCat.defaultSubject}
              className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#F27C00] bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Notes / Specific Details</label>
            <textarea
              rows={4}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder={currentCat.placeholder}
              className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#F27C00] bg-slate-50/50"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-[#F27C00]" />
              <span>Launches email app with formatted subject & recipient.</span>
            </div>

            <a
              href={mailtoUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-[#10182C] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#F27C00]" />
              <span>SEND EMAIL TO {SUPPORT_EMAIL}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
