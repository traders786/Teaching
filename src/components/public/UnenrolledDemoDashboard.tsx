import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Download,
  FileText,
  Sparkles,
  Award,
  Video,
  CheckCircle2,
  Phone,
  MessageSquare,
  HelpCircle,
  ChevronRight,
  Users,
  ShieldCheck,
  Zap,
  Volume2,
  BookOpen,
  Check,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../lib/api';
import { getCurriculumPdfUrl } from './BookingFunnelModal';
import { Modal } from '../ui/Modal';

interface UnenrolledDemoDashboardProps {
  leadId?: string;
  email?: string;
  phone?: string;
  onNavigateHome?: () => void;
  onBookNewDemo?: () => void;
  onSuccessToast?: (msg: string) => void;
  onErrorToast?: (msg: string) => void;
}

const TONGUE_TWISTERS = [
  {
    title: 'Speed & Clarity',
    text: 'Red lorry, yellow lorry, red lorry, yellow lorry.',
    tip: 'Say this 5 times slowly, then speed up!',
  },
  {
    title: 'Articulation Booster',
    text: 'She sells seashells by the seashore.',
    tip: 'Focus on crisp "S" and "Sh" sounds.',
  },
  {
    title: 'Breath Control',
    text: 'Peter Piper picked a peck of pickled peppers.',
    tip: 'Take a deep belly breath before starting.',
  },
  {
    title: 'Jaw Relaxation',
    text: 'How can a clam cram in a clean cream can?',
    tip: 'Open your mouth wide while speaking.',
  },
];

const COURSE_PLANS = [
  {
    id: 'foundation',
    name: 'Foundation Speech & Fear Removal',
    gradeRange: 'UKG to Class 3',
    duration: '3 Months (36 Live Classes)',
    highlights: [
      'Eliminates hesitation and stage fright',
      'Daily 2-minute show-and-tell practice',
      'Storytelling with facial expressions',
      'Pronunciation & voice modulation basics',
    ],
    batchSize: 'Max 8 Students per Cohort',
    price: '₹4,999',
    badge: 'Popular for Beginners',
  },
  {
    id: 'intermediate',
    name: 'Articulate Communicator & Fluency',
    gradeRange: 'Class 4 to Class 7',
    duration: '3 Months (36 Live Classes)',
    highlights: [
      'Impromptu speaking (JAM - Just a Minute)',
      'Rich vocabulary & sentence structuring',
      'School presentation & assembly speaking',
      'Overcoming pauses and filler words (um, ah)',
    ],
    batchSize: 'Max 8 Students per Cohort',
    price: '₹5,499',
    badge: 'Most Enrolled',
  },
  {
    id: 'advanced',
    name: 'Debate, Leadership & Master Orator',
    gradeRange: 'Class 8 to Class 10',
    duration: '3 Months (36 Live Classes)',
    highlights: [
      'Parliamentary debating & counter-arguments',
      'TED-style speech crafting & delivery',
      'Critical thinking & persuasive body language',
      'Interview & group discussion readiness',
    ],
    batchSize: 'Max 8 Students per Cohort',
    price: '₹5,999',
    badge: 'Flagship Program',
  },
];

export const UnenrolledDemoDashboard: React.FC<UnenrolledDemoDashboardProps> = ({
  leadId: initialLeadId,
  email: initialEmail,
  phone: initialPhone,
  onNavigateHome,
  onBookNewDemo,
  onSuccessToast,
  onErrorToast,
}) => {
  const [loading, setLoading] = useState(true);
  const [demoData, setDemoData] = useState<any | null>(null);
  const [activeTwister, setActiveTwister] = useState(0);

  // Inquiry Modal State
  const [selectedPlanForInquiry, setSelectedPlanForInquiry] = useState<any | null>(null);
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  // Search/Lookup fallback
  const [lookupEmail, setLookupEmail] = useState(initialEmail || '');

  const fetchDemoStatus = async (leadIdParam?: string, emailParam?: string, phoneParam?: string) => {
    try {
      setLoading(true);

      // Check local storage if no params passed
      let storedLead: any = null;
      try {
        const raw = localStorage.getItem('upspeaq_demo_lead');
        if (raw) storedLead = JSON.parse(raw);
      } catch (e) {}

      const lId = leadIdParam || storedLead?.leadId || initialLeadId;
      const em = emailParam || storedLead?.email || initialEmail || lookupEmail;
      const ph = phoneParam || storedLead?.mobileNumber || initialPhone;

      if (!lId && !em && !ph) {
        // Mock default for friendly preview if completely cold
        setDemoData({
          studentName: storedLead?.studentName || 'Young Speaker',
          studentClass: storedLead?.studentClass || 'Class 5',
          parentName: storedLead?.parentName || 'Parent',
          email: em || 'parent@example.com',
          mobileNumber: ph || '+91 98765 43210',
          date: storedLead?.date || new Date(Date.now() + 86400000).toISOString().slice(0, 10),
          timeSlot: storedLead?.timeSlot || '5:30 PM',
          status: 'SCHEDULED',
          meetingLink: storedLead?.meetingLink || null,
          teacher: storedLead?.teacher || null,
        });
        setLoading(false);
        return;
      }

      const res = await api.getMyDemo({ leadId: lId, email: em, phone: ph });
      if (res.success && res.demo) {
        setDemoData(res.demo);
      }
    } catch (err: any) {
      console.warn('Could not fetch remote demo, using cached/stored state', err);
      // Fallback from localStorage
      try {
        const raw = localStorage.getItem('upspeaq_demo_lead');
        if (raw) {
          const lead = JSON.parse(raw);
          setDemoData({
            studentName: lead.studentName || 'Young Speaker',
            studentClass: lead.studentClass || 'Class 5',
            parentName: lead.parentName || 'Parent',
            email: lead.email || '',
            mobileNumber: lead.mobileNumber || '',
            date: lead.date || '',
            timeSlot: lead.timeSlot || '5:30 PM',
            status: 'SCHEDULED',
            meetingLink: lead.meetingLink || null,
            teacher: lead.teacher || null,
          });
        }
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemoStatus(initialLeadId, initialEmail, initialPhone);
  }, [initialLeadId, initialEmail, initialPhone]);

  const studentClass = demoData?.studentClass || 'Class 5';
  const pdfUrl = getCurriculumPdfUrl(studentClass);

  const handleAdvisorWhatsApp = (planName?: string) => {
    const text = encodeURIComponent(
      `Hi upspeaq Team! I have booked a demo for my child ${demoData?.studentName || 'Student'} (${studentClass}). I would like to get more details regarding the ${planName ? `"${planName}"` : 'English & Public Speaking'} course plans and fees.`
    );
    window.open(`https://wa.me/917004132088?text=${text}`, '_blank');
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForInquiry) return;

    try {
      setSubmittingInquiry(true);
      // Submit note / lead update
      if (demoData?.leadId) {
        await api.addLeadActivity(
          demoData.leadId,
          `Parent requested detailed info for plan: ${selectedPlanForInquiry.name}. Notes: ${inquiryNotes || 'None'}`
        );
      }
      if (onSuccessToast) {
        onSuccessToast(`Thank you! Our senior academic advisor will call you within 15 minutes regarding ${selectedPlanForInquiry.name}.`);
      }
      setSelectedPlanForInquiry(null);
      setInquiryNotes('');
    } catch (err: any) {
      if (onErrorToast) onErrorToast('Request submitted. You can also message us directly on WhatsApp.');
      setSelectedPlanForInquiry(null);
    } finally {
      setSubmittingInquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8 animate-pulse">
        <div className="h-32 bg-slate-200/80 rounded-3xl" />
        <div className="h-64 bg-slate-200/80 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-80 bg-slate-200/80 rounded-2xl" />
          <div className="h-80 bg-slate-200/80 rounded-2xl" />
          <div className="h-80 bg-slate-200/80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const isTeacherAssigned = Boolean(demoData?.teacher?.name);
  const teacher = demoData?.teacher;

  return (
    <div className="min-w-0 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* TOP WELCOME HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 p-6 sm:p-8 text-white shadow-2xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Demo Class Confirmed & Active
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-white tracking-tight">
              Welcome, {demoData?.studentName || 'Future Orator'}! 🌟
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Your 1-on-1 personalized English Assessment & Public Speaking Demo is scheduled. Download your complimentary worksheets below and warm up before class!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleAdvisorWhatsApp()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Support
            </button>
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all cursor-pointer"
              >
                Back to Website
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 1: LIVE DEMO CLASS STATUS & SPEECH COACH CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Slot Details Card */}
        <div className="lg:col-span-1 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scheduled Slot</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Clock className="w-3 h-3" />
                45 Mins Session
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-800 font-semibold">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Date</div>
                  <div className="text-base">{demoData?.date ? new Date(demoData.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Upcoming Date'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-800 font-semibold">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Time Slot</div>
                  <div className="text-base">{demoData?.timeSlot || '5:30 PM IST'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-800 font-semibold">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Registered Grade</div>
                  <div className="text-base text-indigo-600 font-bold">{studentClass}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Parent: <strong className="text-slate-700">{demoData?.parentName || 'Parent'}</strong></span>
            <span>Phone: <strong className="text-slate-700">{demoData?.mobileNumber || ''}</strong></span>
          </div>
        </div>

        {/* Coach Assignment Status */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Certified Speech Coach</span>
              {isTeacherAssigned ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Assigned
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Matching Mentor
                </span>
              )}
            </div>

            {isTeacherAssigned ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <img
                  src={teacher?.photoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'}
                  alt={teacher?.name || 'Teacher'}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-200 shadow-sm"
                />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">{teacher?.name}</h3>
                  <p className="text-xs font-semibold text-indigo-600">{teacher?.qualification || 'Senior Child Speech & Debate Mentor'}</p>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {teacher?.bio || 'Certified communication coach with 5+ years of experience helping school students overcome stage fear and develop expressive fluency.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-amber-50/60 border border-amber-200/80 p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Coach Allocation in Progress</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Our academic team is handpicking a certified speech mentor suited for <strong>{studentClass}</strong>. You will receive an automated email with the mentor's profile and your dedicated Google Meet link before the session.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Interactive 2-Student Assessment Session
            </div>

            {demoData?.meetingLink && isTeacherAssigned ? (
              <a
                href={demoData.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md transition-all flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                Join Google Meet Demo
              </a>
            ) : (
              <button
                onClick={() => handleAdvisorWhatsApp()}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                Need to Reschedule?
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: COMPLIMENTARY WORKSHEETS DOWNLOAD BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Free Starter Material
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
            Download {studentClass} Official Worksheets & Starter Kit
          </h2>
          <p className="text-amber-100 text-sm leading-relaxed">
            Includes speech activities, picture description worksheets, and debate prompts designed specifically for {studentClass} students.
          </p>
        </div>

        <a
          href={pdfUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-4 rounded-2xl bg-white hover:bg-amber-50 text-slate-900 font-extrabold text-sm sm:text-base shadow-2xl transition-all flex items-center justify-center gap-3 shrink-0 group cursor-pointer"
        >
          <FileText className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
          <span>Download PDF Worksheets</span>
          <Download className="w-4 h-4 text-slate-500 group-hover:translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* SECTION 3: INTERACTIVE TONGUE TWISTERS & WARMUP PRACTICE */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <Volume2 className="w-4 h-4" />
              Pre-Demo Vocal Warmups
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
              Interactive Tongue Twister Challenge 🎤
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs">
            Practicing these for 2 minutes before the demo loosens speech muscles and boosts clarity!
          </p>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {TONGUE_TWISTERS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTwister(idx)}
              className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                activeTwister === idx
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div className={`text-xs font-semibold ${activeTwister === idx ? 'text-indigo-200' : 'text-slate-500'}`}>
                Warmup #{idx + 1}
              </div>
              <div className="text-sm font-bold mt-0.5 line-clamp-1">{item.title}</div>
            </button>
          ))}
        </div>

        {/* Active Twister Display */}
        <div className="rounded-2xl bg-indigo-50/70 border border-indigo-100 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              {TONGUE_TWISTERS[activeTwister].title}
            </div>
            <p className="text-lg sm:text-2xl font-extrabold text-slate-900 font-heading leading-snug">
              "{TONGUE_TWISTERS[activeTwister].text}"
            </p>
            <p className="text-xs font-medium text-slate-600 flex items-center justify-center sm:justify-start gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <strong>Coach Tip:</strong> {TONGUE_TWISTERS[activeTwister].tip}
            </p>
          </div>

          <button
            onClick={() => setActiveTwister((prev) => (prev + 1) % TONGUE_TWISTERS.length)}
            className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 font-bold text-sm shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Next Twister</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SECTION 4: FULL CURRICULUM ROADMAP & COURSE PLANS (WITH ADVISOR BUTTONS) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              upspeaq Growth Journey
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
              Explore Our Live Course Programs & Cohorts
            </h3>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Every course is taught by certified mentors in small 8-student batches with weekly debate & stage practice.
            </p>
          </div>

          <button
            onClick={() => handleAdvisorWhatsApp()}
            className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-sm font-bold transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Phone className="w-4 h-4" />
            Talk to Academic Counselor
          </button>
        </div>

        {/* 3 Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COURSE_PLANS.map((plan) => (
            <div
              key={plan.id}
              className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {plan.badge}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{plan.gradeRange}</span>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {plan.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">{plan.duration}</p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  {plan.highlights.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer with Details & Advisor Button */}
              <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Tuition Fee</span>
                    <span className="text-xl font-black text-slate-900">{plan.price}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-500">{plan.batchSize}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedPlanForInquiry(plan)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Get Details</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  <button
                    onClick={() => handleAdvisorWhatsApp(plan.name)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: WHAT TO EXPECT DURING THE DEMO CLASS */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            Quick Guidelines
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-heading">
            3 Tips to Make the Most of Your Child's Demo Class
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-base">
              1
            </div>
            <h4 className="font-bold text-white text-base">Use a Laptop / Tablet with Earphones</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Clear audio helps the coach observe your child's articulation, pitch, and voice projection accurately.
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-base">
              2
            </div>
            <h4 className="font-bold text-white text-base">Let Your Child Speak Freely</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              The mentor will conduct fun icebreakers. Even if the child makes grammatical errors, the mentor is trained to encourage them.
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base">
              3
            </div>
            <h4 className="font-bold text-white text-base">Get a 9-Point Speech Assessment Report</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              After the 45-minute demo, you will receive a detailed diagnosis of your child's confidence, vocabulary, and debate readiness.
            </p>
          </div>
        </div>
      </div>

      {/* PLAN DETAILS / CALLBACK INQUIRY MODAL */}
      <Modal
        isOpen={Boolean(selectedPlanForInquiry)}
        onClose={() => setSelectedPlanForInquiry(null)}
        title={`Inquire About ${selectedPlanForInquiry?.name || 'Program'}`}
      >
        <form onSubmit={handleInquirySubmit} className="space-y-4">
          <div className="rounded-xl bg-indigo-50 p-4 border border-indigo-100 space-y-1">
            <div className="text-xs font-bold text-indigo-800">{selectedPlanForInquiry?.name}</div>
            <div className="text-xs text-indigo-600">
              Grade: {selectedPlanForInquiry?.gradeRange} • Tuition: {selectedPlanForInquiry?.price}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Student / Parent Details</label>
            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div><strong>Child:</strong> {demoData?.studentName || 'Student'} ({studentClass})</div>
              <div><strong>Parent:</strong> {demoData?.parentName || 'Parent'}</div>
              <div><strong>Phone:</strong> {demoData?.mobileNumber || ''}</div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Any specific question or timing preference?</label>
            <textarea
              value={inquiryNotes}
              onChange={(e) => setInquiryNotes(e.target.value)}
              placeholder="e.g. Can we do weekday classes after 6 PM? What is the syllabus for storytelling?"
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSelectedPlanForInquiry(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingInquiry}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {submittingInquiry ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
              <span>Request Advisor Call</span>
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
