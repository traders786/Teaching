import React, { useState } from 'react';
import { BrandingConfig, Course } from '../types';
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Users,
  Award,
  UserCheck,
  Zap,
  Check,
  Star
} from 'lucide-react';

interface PricingPageProps {
  branding: BrandingConfig;
  courses?: Course[];
  onOpenDemoModal: () => void;
  onOpenPaymentPortal?: (courseId: string) => void;
}

type GradeKey = 'UKG' | 'GRADES_1_2' | 'GRADES_3_4' | 'GRADES_5_6' | 'GRADES_7_8' | 'GRADES_9_10';

interface GradeTab {
  id: GradeKey;
  label: string;
  name: string;
}

interface GradeCurriculum {
  heading: string;
  subtitle: string;
  skills: string[];
  milestone: string;
  cohortTitle: string;
  cohortDesc: string;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  branding,
  onOpenDemoModal,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeKey>('UKG');

  const gradeTabs: GradeTab[] = [
    { id: 'UKG', label: 'GRADE UKG', name: 'Early Explorers' },
    { id: 'GRADES_1_2', label: 'GRADES 1–2', name: 'Little Orators' },
    { id: 'GRADES_3_4', label: 'GRADES 3–4', name: 'Young Storytellers' },
    { id: 'GRADES_5_6', label: 'GRADES 5–6', name: 'Junior Presenters' },
    { id: 'GRADES_7_8', label: 'GRADES 7–8', name: 'Youth Debaters' },
    { id: 'GRADES_9_10', label: 'GRADES 9–10', name: 'Senior Orators' },
  ];

  const gradeData: Record<GradeKey, GradeCurriculum> = {
    UKG: {
      heading: 'Grade UKG • Early Explorers',
      subtitle: 'Phonetics, Vocabulary, Songs & Cheerful Expression',
      skills: [
        'Clear English letter-sound phonics and joyful rhyming chants',
        'Polite daily greetings, basic etiquette and expressing feelings aloud',
        'Picture talk: naming familiar animals, family members, objects and colours',
        'Simple everyday vocabulary through games, stories and visual activities',
        'Overcoming initial shyness through gentle interactive speaking games',
        'Answering simple questions using complete English phrases',
        'Show-and-tell using familiar objects and pictures',
      ],
      milestone: 'Speaks simple, cheerful English sentences with clearer pronunciation and greater confidence.',
      cohortTitle: 'Experience the Grade UKG Live Batch',
      cohortDesc: "Join a 45-minute live diagnostic session to assess your child's spoken-English baseline and understand their learning needs.",
    },
    GRADES_1_2: {
      heading: 'Grades 1–2 • Little Orators',
      subtitle: 'Everyday English, Vocabulary & Confident Conversation',
      skills: [
        'Everyday English vocabulary for school, home and social situations',
        'Building grammatically simple but complete spoken sentences',
        'Asking and answering questions confidently',
        'Describing people, places, objects and pictures',
        'Storytelling using pictures and simple story sequences',
        'Reading aloud with better pronunciation and expression',
        'Expressing likes, dislikes, feelings and opinions',
        'Participating in fun role-play and conversation activities',
        'Speaking in front of a small group without hesitation',
      ],
      milestone: 'Speaks in complete everyday English sentences and confidently participates in short conversations.',
      cohortTitle: 'Experience the Grades 1–2 Live Batch',
      cohortDesc: "Join a 45-minute live diagnostic session to assess your child's current speaking ability and identify the right starting point.",
    },
    GRADES_3_4: {
      heading: 'Grades 3–4 • Young Storytellers',
      subtitle: 'Fluency, Storytelling, Vocabulary & Expression',
      skills: [
        'Expanding practical vocabulary and using new words naturally',
        'Speaking in longer, connected sentences',
        'Storytelling with a clear beginning, middle and ending',
        'Describing experiences, pictures and everyday situations',
        'Reading aloud with expression, pace and pronunciation',
        'Asking meaningful questions and responding naturally',
        'Expressing opinions using simple reasons',
        'Role-play conversations and real-life communication',
        'Building confidence during classroom presentations',
      ],
      milestone: 'Tells stories, describes ideas and participates in conversations with greater fluency and expression.',
      cohortTitle: 'Experience the Grades 3–4 Live Batch',
      cohortDesc: "Join a 45-minute live diagnostic session to understand your child's fluency, vocabulary and speaking confidence.",
    },
    GRADES_5_6: {
      heading: 'Grades 5–6 • Junior Presenters',
      subtitle: 'Fluency, Presentation Skills & Confident Expression',
      skills: [
        'Speaking naturally without translating every sentence mentally',
        'Stronger vocabulary and sentence construction',
        'Structured storytelling and descriptive speaking',
        'Preparing and delivering short presentations',
        'Expressing opinions with supporting reasons',
        'Group discussions and collaborative speaking',
        'Impromptu speaking through age-appropriate activities',
        'Voice modulation, pace and audience awareness',
        'Speaking confidently in front of classmates and teachers',
      ],
      milestone: 'Delivers a structured 2–3 minute presentation with clear ideas, confident delivery and improved fluency.',
      cohortTitle: 'Experience the Grades 5–6 Live Batch',
      cohortDesc: "Join a 45-minute live diagnostic session to assess fluency, vocabulary, pronunciation and presentation confidence.",
    },
    GRADES_7_8: {
      heading: 'Grades 7–8 • Youth Debaters',
      subtitle: 'Public Speaking, Debate, Reasoning & Persuasion',
      skills: [
        'Advanced conversational fluency',
        'Structuring and presenting ideas clearly',
        'Debate fundamentals and argument building',
        'Supporting opinions with examples and reasoning',
        'Extempore speaking and thinking on the spot',
        'Presentation structure and audience engagement',
        'Voice modulation, emphasis and confident body language',
        'Group discussions and respectful disagreement',
        'Persuasive communication',
        'Handling questions confidently',
      ],
      milestone: 'Presents a structured argument, participates in discussions and speaks confidently without relying on memorized answers.',
      cohortTitle: 'Experience the Grades 7–8 Live Batch',
      cohortDesc: "Join a 45-minute live diagnostic session to assess your child's fluency, confidence, presentation and spontaneous speaking ability.",
    },
    GRADES_9_10: {
      heading: 'Grades 9–10 • Senior Orators',
      subtitle: 'Advanced Communication, Debate, Presentation & Leadership',
      skills: [
        'Advanced spoken-English fluency',
        'Formal and informal communication',
        'Persuasive speaking and argumentation',
        'Debate frameworks and rebuttal techniques',
        'Extempore and impromptu speaking',
        'Structured presentations for school and competitions',
        'Group discussions and collaborative communication',
        'Interview and introduction skills',
        'Professional vocabulary and confident articulation',
        'Leadership communication and audience awareness',
      ],
      milestone: 'Communicates ideas clearly, presents persuasively and handles debates, discussions and presentations with confidence.',
      cohortTitle: 'Experience the Grades 9–10 Live Batch',
      cohortDesc: "Join a 45-minute live diagnostic session to assess your child's communication, fluency, presentation and public-speaking skills.",
    },
  };

  const currentGrade = gradeData[selectedGrade];

  return (
    <div className="bg-[#FAF9F6] text-slate-900 text-left">
      
      {/* ======================================================== */}
      {/* 1. HERO HEADER                                          */}
      {/* ======================================================== */}
      <section className="bg-slate-900 text-white py-16 lg:py-20 border-b border-slate-800 text-left relative overflow-hidden">
        
        {/* Glow Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold font-heading">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Transparent Investment • All Grades Included</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight font-heading">
              Simple, Accessible Investment in Your Child's Voice
            </h1>
            
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              Every child deserves the confidence to express themselves. Start for a month or commit to a longer transformation with guaranteed mic time, intimate small batches, and certified mentor coaching.
            </p>
            
            <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% 7-Day Money-Back Guarantee
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-4 h-4 text-amber-400" />
                Free 45-Min Diagnostic Demo
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Award className="w-4 h-4 text-sky-400" />
                Verified Certificate of Completion
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. PRICING CARDS: CHOOSE YOUR LEARNING JOURNEY          */}
      {/*    (JUST BELOW THE HERO SECTION)                        */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
          
          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] block font-heading">
              Transparent Investment • All Grades Included
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-heading">
              Choose Your Learning Journey
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Start for a month or commit to a longer transformation. Every program includes live interactive speaking practice and personalised feedback.
            </p>
          </div>

          {/* 3 Main Group Plans Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            
            {/* ---------------------------------------------------- */}
            {/* CARD 1: 1 MONTH (START SPEAKING)                     */}
            {/* ---------------------------------------------------- */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-7 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-3 py-1 rounded-full inline-block">
                    Flexible Monthly Plan
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 font-heading mt-2.5">
                    Start Speaking
                  </h3>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    1 Month Program
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900 font-heading">
                      ₹2,499
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">/ month</span>
                  </div>
                  <div className="text-xs font-bold text-emerald-700">
                    12 Live Classes
                  </div>
                  <div className="text-[11px] text-slate-500">
                    3 classes/week • 60 minutes/class
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Live interactive speaking sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Small-group learning (Max 8 students)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Vocabulary & sentence building</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Speaking confidence activities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Storytelling & expression practice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Weekly progress feedback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Free diagnostic/demo session included</span>
                  </li>
                </ul>

              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={onOpenDemoModal}
                  className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs font-heading shadow-xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Book Free Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* CARD 2: 6 MONTHS (BUILD CONFIDENCE - MOST POPULAR)   */}
            {/* ---------------------------------------------------- */}
            <div className="bg-[#FFFDFB] rounded-3xl border-2 border-[#FF6B00] shadow-xl p-7 sm:p-8 flex flex-col justify-between space-y-6 relative transform lg:-translate-y-2">
              
              {/* Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF6B00] text-white px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-md flex items-center gap-1 whitespace-nowrap font-heading">
                <Sparkles className="w-3 h-3 fill-white" />
                <span>MOST POPULAR</span>
              </div>

              <div className="space-y-5 pt-1">
                
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B00] bg-orange-50 px-3 py-1 rounded-full inline-block">
                    6 Months Commitment
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 font-heading mt-2.5">
                    Build Confidence
                  </h3>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    Complete 6-Month Speaking Roadmap
                  </div>
                </div>

                <div className="pt-3 border-t border-orange-100 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900 font-heading">
                      ₹12,999
                    </span>
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      ₹14,994
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700">
                      72 Live Classes
                    </span>
                    <span className="text-[10px] font-bold text-[#FF6B00] bg-orange-100 px-2 py-0.5 rounded">
                      Save ₹1,995
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    3 classes/week • 60 minutes/class
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-orange-100">
                  <li className="flex items-start gap-2 font-bold text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                    <span>Everything in Start Speaking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                    <span>Structured 6-month communication roadmap</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                    <span>Public speaking & extempore speaking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                    <span>Storytelling & presentation skills</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                    <span>Group discussions & debate fundamentals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                    <span>Progress assessments & milestone tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                    <span>Official Certificate of Completion</span>
                  </li>
                </ul>

              </div>

              <div className="pt-4 border-t border-orange-100 space-y-2 text-center">
                <button
                  onClick={onOpenDemoModal}
                  className="w-full py-3.5 rounded-2xl bg-[#FF6B00] hover:bg-[#E55F00] text-white font-black text-xs font-heading shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Book Free Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-slate-500 font-medium">
                  Best balance of commitment, progress & value
                </p>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* CARD 3: 12 MONTHS (SPEAK & LEAD)                     */}
            {/* ---------------------------------------------------- */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-7 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-3 py-1 rounded-full inline-block">
                    Full Year Leadership
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 font-heading mt-2.5">
                    Speak & Lead
                  </h3>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    12 Months Mastery Program
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900 font-heading">
                      ₹23,999
                    </span>
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      ₹29,988
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700">
                      144 Live Classes
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Save ₹5,989
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    3 classes/week • 60 minutes/class
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <li className="flex items-start gap-2 font-bold text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Everything in Build Confidence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Complete 12-month communication roadmap</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Advanced public speaking & presentation mastery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Debate & persuasive speaking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Leadership communication & articulation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Regular progress assessments & certificate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>End-of-program showcase opportunity</span>
                  </li>
                </ul>

              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2 text-center">
                <button
                  onClick={onOpenDemoModal}
                  className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs font-heading shadow-xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Book Free Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <p className="text-[11px] text-slate-500 font-medium">
                  Our complete year-long communication journey
                </p>
              </div>
            </div>

          </div>

          {/* ---------------------------------------------------- */}
          {/* 1-ON-1 PRIVATE COACHING SECTION                      */}
          {/* ---------------------------------------------------- */}
          <div className="max-w-4xl mx-auto pt-6">
            <div className="rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617] text-white p-7 sm:p-10 shadow-xl border border-slate-700/80 relative overflow-hidden">
              
              {/* Ambient subtle glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

              <div className="relative z-10 space-y-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/80">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-purple-300 bg-purple-500/20 border border-purple-400/30 px-3.5 py-1 rounded-full inline-block font-heading">
                      PRIVATE COACHING
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black font-heading text-white mt-2.5">
                      Speak 1-on-1
                    </h3>
                    <p className="text-sm text-purple-200 font-semibold mt-0.5">
                      Personalised Speech Coaching
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <div className="text-3xl sm:text-4xl font-black text-white font-heading">
                      ₹5,999 <span className="text-xs font-normal text-slate-400">/ month</span>
                    </div>
                    <div className="text-xs text-purple-300 font-bold mt-0.5">
                      12 Private Classes / Month
                    </div>
                    <div className="text-[11px] text-slate-400">
                      3 classes/week • 60 minutes/class
                    </div>
                  </div>
                </div>

                {/* 2-Column Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <UserCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Dedicated 1-on-1 mentor with 100% individual focus</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Personalised curriculum tailored to your child's pace</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Individual speaking feedback after every session</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Custom learning pace & school speech preparation</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Debate, competition & presentation coaching</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Flexible scheduling & continuous progress tracking</span>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="pt-6 border-t border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-xs text-slate-300 max-w-md">
                    For children who need focused individual attention or targeted communication coaching.
                  </p>
                  <button
                    onClick={onOpenDemoModal}
                    className="px-7 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs font-heading shadow-lg shadow-purple-900/30 transition-all active:scale-95 cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    <span>Book Free 1-on-1 Demo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. GRADE-WISE PATHWAY SELECTOR & CURRICULUM             */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-bold font-heading">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curriculum & Learning Outcomes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
            Choose the Right Program for Your Child
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Age-appropriate English communication programs designed to help children speak clearly, express ideas confidently, and communicate naturally.
          </p>
        </div>

        {/* 6 Selectable Grade Cards */}
        <div className="w-full">
          <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
            {gradeTabs.map((tab) => {
              const isSelected = selectedGrade === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedGrade(tab.id)}
                  type="button"
                  aria-pressed={isSelected}
                  className={`shrink-0 w-44 sm:w-auto p-4 sm:p-4.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer snap-start ${
                    isSelected
                      ? 'border-[#FF6B00] bg-[#FFF8F3] shadow-md shadow-orange-500/10 ring-1 ring-[#FF6B00]'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 shadow-xs'
                  }`}
                >
                  <div
                    className={`text-[11px] sm:text-xs font-black tracking-wider uppercase ${
                      isSelected ? 'text-[#FF6B00]' : 'text-slate-500'
                    }`}
                  >
                    {tab.label}
                  </div>
                  <div
                    className={`text-sm sm:text-base font-bold font-heading mt-1 leading-snug ${
                      isSelected ? 'text-slate-950' : 'text-slate-800'
                    }`}
                  >
                    {tab.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Curriculum Display Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 transition-all duration-300 space-y-8">
          
          {/* Header */}
          <div className="space-y-1.5 pb-6 border-b border-slate-100">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              {currentGrade.heading}
            </h3>
            <p className="text-sm sm:text-base font-semibold text-[#FF6B00]">
              {currentGrade.subtitle}
            </p>
          </div>

          {/* What Your Child Will Master */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-heading">
              What Your Child Will Master
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
              {currentGrade.skills.map((skill, index) => (
                <div key={index} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Milestone + Live Cohort Diagnostic Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 items-stretch">
            
            {/* Milestone Card */}
            <div className="lg:col-span-6 rounded-2xl bg-amber-50/60 border border-amber-200/70 p-5 sm:p-6 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold uppercase tracking-wider">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Visible Milestone</span>
                </div>
                <p className="text-sm sm:text-base text-slate-800 font-bold italic leading-relaxed">
                  “{currentGrade.milestone}”
                </p>
              </div>
              <div className="text-[11px] text-amber-900/80 font-medium">
                Assessed through live speaking performance benchmarks.
              </div>
            </div>

            {/* Interactive Live Cohort Card */}
            <div className="lg:col-span-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-md">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-bold tracking-wider uppercase text-emerald-300">
                    Interactive Live Cohort
                  </span>
                </div>
                <h5 className="text-base sm:text-lg font-bold font-heading text-white">
                  {currentGrade.cohortTitle}
                </h5>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentGrade.cohortDesc}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>45-min diagnostic session • 100% Free</span>
                </div>
                <button
                  onClick={onOpenDemoModal}
                  className="px-5 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#E55F00] text-white font-bold text-xs font-heading shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Book Free Class</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ======================================================== */}
      {/* 4. SCHEDULE & BATCH TIMINGS                             */}
      {/* ======================================================== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 space-y-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 font-heading">Flexible Batch & Session Timings</h3>
            <p className="text-xs text-slate-500">
              Classes are carefully scheduled in after-school evening and weekend slots to ensure regular studies are never disturbed:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl border border-amber-200/80 bg-amber-50/40 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 font-heading">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>Weekday Track (Mon – Fri, All Days Available)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Convenient after-school and evening batches available across all weekdays (Monday to Friday) so school homework, sports, and family routines are never disturbed.
                </p>
              </div>
              <div className="pt-2 border-t border-amber-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-amber-800">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Available Mon–Fri • Multiple evening slots</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-sky-200/80 bg-sky-50/40 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-800 font-heading">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <span>Weekend Track (Sat & Sun)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Relaxed morning and afternoon sessions designed for interactive, high-energy weekend speaking practice without weekday rush.
                </p>
              </div>
              <div className="pt-2 border-t border-sky-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-sky-800">
                <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Morning & afternoon slots available</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-purple-200/80 bg-purple-50/40 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-800 font-heading">
                  <UserCheck className="w-4 h-4 text-purple-600" />
                  <span>1-on-1 Private Flexible Track</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fully customized slot timings coordinated directly with your assigned senior speech coach based on your child's weekly schedule.
                </p>
              </div>
              <div className="pt-2 border-t border-purple-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-purple-800">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>100% flexible & adaptable timings</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-xs text-slate-600">
            <Sparkles className="w-4 h-4 text-[#FF6B00] shrink-0" />
            <span>
              <strong className="text-slate-800">Complete Flexibility:</strong> Need to change your batch timing or switch tracks during exams? We adjust timings to match your child's routine at any time.
            </span>
          </div>
        </div>

        {/* 100% Guarantee Box */}
        <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-center gap-6 text-left shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-slate-900 font-heading">Our 100% 7-Day Peace-of-Mind Guarantee</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Attend the first week of live classes. If you or your child do not feel a noticeable positive shift in comfort
              and teacher attention, simply text us on WhatsApp for a prompt 100% refund — no awkward questions asked.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
