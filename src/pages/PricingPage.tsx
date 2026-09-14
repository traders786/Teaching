import React from 'react';
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
} from 'lucide-react';

interface PricingPageProps {
  branding: BrandingConfig;
  courses: Course[];
  onOpenDemoModal: () => void;
  onOpenPaymentPortal?: (courseId: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  branding,
  courses,
  onOpenDemoModal,
}) => {
  const starterCourse = courses.find((c) => c.slug === '1-month-starter' || c.id === 'crs_starter_monthly') || {
    id: 'crs_starter_monthly',
    name: '1-Month Communication & Fluency Starter',
    price_inr: 1999,
    duration_months: 1,
    total_classes: 12,
    target_batch_size: 8,
    description: 'Ideal starter program for Class 4-12 students seeking initial fluency and stage confidence.',
  };

  const flagshipCourse = courses.find((c) => c.is_flagship || c.id === 'crs_flagship_1') || {
    id: 'crs_flagship_1',
    name: '3-Month Flagship Communication & Confidence Cohort',
    price_inr: branding.flagshipPrice || 4999,
    duration_months: 3,
    total_classes: 36,
    target_batch_size: 8,
    description: 'Our most comprehensive masterclass. Covers public speaking, debate logic, body language, extempore, and graduation showcase.',
  };

  const individualCourse = courses.find((c) => c.slug === 'individual-1on1-classes' || c.id === 'crs_individual_1on1') || {
    id: 'crs_individual_1on1',
    name: '1-on-1 Individual Speech Mentorship (Private Classes)',
    price_inr: 5000,
    duration_months: 1,
    total_classes: 12,
    target_batch_size: 1,
    description: 'Exclusive 1-on-1 personalized speech coaching with a dedicated senior coach. Tailored curriculum, flexible scheduling, and custom goal focus.',
  };

  return (
    <div className="bg-[#FAF9F6] text-slate-900">
      {/* Page Header */}
      <section className="bg-slate-900 text-white py-16 lg:py-20 border-b border-slate-800 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Transparent, No-Surprises Pricing</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Simple, Accessible Investment in Your Child's Voice
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Choose the learning structure that suits your child best — from flexible monthly cohorts to our flagship 3-month debate masterclass and 1-on-1 private mentorship. All options start with a <strong>100% Free Demo Session</strong>.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% 7-Day Money-Back Guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                100% Free 45-Min Assessment Demo
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                Verified Certificate of Completion
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Card Program Comparison Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
            Compare Our Programs
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Find the Perfect Learning Pace
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Every program includes live interactive speaking, personal coach feedback, and zero risk.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* PLAN 1: 1-MONTH STARTER */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-8 flex flex-col justify-between relative hover:shadow-xl transition-all">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-3 py-1 rounded-full inline-block">
                  Flexible Monthly Option
                </span>
                <h3 className="text-xl font-bold text-slate-900">{starterCourse.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {starterCourse.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">
                    ₹{(starterCourse.price_inr || 1999).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">/ month</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                  12 Live Interactive Classes (3 classes/week)
                </span>
                <span className="text-[10px] text-slate-400 block">
                  ~₹166 per live session • Monthly renewal
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Inclusions:</h4>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>12 Live Speaking Sessions</strong> (60 mins each)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>8-Student Max Batch</strong> for guaranteed speaking time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Foundational vocabulary & speech structuring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Weekly WhatsApp speech progress feedback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>100% Free Demo Session</strong> before enrolling</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 space-y-3">
              <button
                onClick={onOpenDemoModal}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all active:scale-[0.98] cursor-pointer text-center"
              >
                BOOK FREE DEMO FOR STARTER
              </button>
              <span className="text-[10px] text-slate-400 text-center block">Try 45-min evaluation class first</span>
            </div>
          </div>

          {/* PLAN 2: 3-MONTH FLAGSHIP (HIGHLIGHTED / POPULAR) */}
          <div className="bg-white rounded-3xl border-2 border-amber-500 shadow-2xl p-8 flex flex-col justify-between relative transform lg:-translate-y-2">
            {/* Top Ribbon */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>Most Popular • Best Value</span>
            </div>

            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full inline-block">
                  Complete 12-Week Transformation
                </span>
                <h3 className="text-xl font-black text-slate-900">{flagshipCourse.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {flagshipCourse.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900">
                    ₹{(flagshipCourse.price_inr || 4999).toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-semibold text-slate-400 line-through">₹8,999</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 block mt-1">
                  Full 3-Month Program Fee (Save ₹998 vs Monthly)
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Just ~₹138 per live session • 36 Total Classes
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Everything in Starter, Plus:</h4>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>36 Live Interactive Sessions</strong> (3 classes/week)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Strict 8-Student Cap</strong> (15+ mins speaking per child)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Extempore, Debate & Parliamentary speech frameworks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Live Graduation Showcase</strong> where parents observe</span>
                  </li>
                  <li className="flex items-start gap-2 font-medium text-amber-950">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Official Certificate of Accomplishment</strong></span>
                  </li>
                  <li className="flex items-start gap-2 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>100% 7-Day Money-Back Guarantee</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 space-y-3">
              <button
                onClick={onOpenDemoModal}
                className="w-full py-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm shadow-lg hover:shadow-xl transition-all active:scale-[0.98] cursor-pointer text-center"
              >
                BOOK FREE DEMO FOR FLAGSHIP
              </button>
              <span className="text-[11px] text-amber-800 text-center block font-semibold">
                Free 45-min assessment • Pay only if satisfied
              </span>
            </div>
          </div>

          {/* PLAN 3: 1-ON-1 INDIVIDUAL CLASSES */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-8 flex flex-col justify-between relative hover:shadow-xl transition-all">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full inline-block">
                  Personalized 1-on-1 Mentorship
                </span>
                <h3 className="text-xl font-bold text-slate-900">{individualCourse.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {individualCourse.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">
                    ₹{(individualCourse.price_inr || 5000).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">/ month</span>
                </div>
                <span className="text-[11px] text-purple-700 font-semibold block mt-1">
                  12 Dedicated 1-on-1 Classes / Month
                </span>
                <span className="text-[10px] text-slate-400 block">
                  100% Attention on a single child • Flexible timings
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">1-on-1 Exclusive Features:</h4>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>12 Private 1-on-1 Sessions</strong> with Senior Speech Coach</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>100% Dedicated Mentor</strong> (Zero other students)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>Custom pace tailored to child's specific hesitation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>Focused coaching for school speeches & competitions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>Flexible timing & reschedule protection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>100% Free 1-on-1 Demo Session</strong> included</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 space-y-3">
              <button
                onClick={onOpenDemoModal}
                className="w-full py-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition-all active:scale-[0.98] cursor-pointer text-center"
              >
                BOOK FREE 1-ON-1 DEMO
              </button>
              <span className="text-[10px] text-slate-400 text-center block">Experience private coaching trial</span>
            </div>
          </div>

        </div>

        {/* Schedule & Batch Timings */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Flexible Batch & Session Timings</h3>
            <p className="text-xs text-slate-500">
              Classes are carefully scheduled in after-school evening and weekend slots to ensure regular studies are never disturbed:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                <Calendar className="w-4 h-4" />
                <span>Weekday Track (Mon - Wed - Fri)</span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-slate-700">
                <span className="px-2 py-1 bg-white border border-slate-200 rounded-md">5:00 PM - 6:00 PM</span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded-md">6:15 PM - 7:15 PM</span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded-md">7:30 PM - 8:30 PM</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                <Calendar className="w-4 h-4" />
                <span>Weekend Track (Sat & Sun)</span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-slate-700">
                <span className="px-2 py-1 bg-white border border-slate-200 rounded-md">10:00 AM - 11:00 AM</span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded-md">11:30 AM - 12:30 PM</span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded-md">4:00 PM - 5:00 PM</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-800">
                <UserCheck className="w-4 h-4" />
                <span>1-on-1 Private Flexible Track</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Customized slot timings coordinated directly with your assigned senior speech coach based on your child's weekly schedule.
              </p>
            </div>
          </div>
        </div>

        {/* 100% Guarantee Box */}
        <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-emerald-50/50 border border-emerald-200 flex flex-col sm:flex-row items-center gap-6 text-left">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-slate-900">Our 100% 7-Day Peace-of-Mind Guarantee</h4>
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

