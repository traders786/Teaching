import React, { useState } from 'react';
import { BrandingConfig } from '../../types';
import {
  ArrowRight,
  CheckCircle2,
  Users2,
  Video,
  Calendar,
  Sparkles,
  TrendingUp,
  Award,
  Mic,
  ShieldCheck,
} from 'lucide-react';

interface HeroProps {
  branding: BrandingConfig;
  onOpenDemoModal: () => void;
  onExploreProgram: () => void;
}

export const Hero: React.FC<HeroProps> = ({ branding, onOpenDemoModal, onExploreProgram }) => {
  const [activeStage, setActiveStage] = useState<'baseline' | 'midway' | 'mastery'>('mastery');

  const stageData = {
    baseline: {
      badge: 'Day 1: Starting Baseline',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      title: 'Hesitant & Script-Dependent',
      quote: '"I feel nervous when teacher calls my name in front of the whole class..."',
      stats: [
        { label: 'Fluency & Flow', value: 35, color: 'bg-rose-500' },
        { label: 'Eye Contact & Poise', value: 30, color: 'bg-rose-500' },
        { label: 'Logical Argumentation', value: 40, color: 'bg-rose-500' },
      ],
      tag: 'Overcoming Initial Hesitation',
      statusIcon: <Mic className="w-4 h-4 text-rose-600" />,
      highlight: 'Avoids raising hand, relies on memorization rather than natural thoughts.',
    },
    midway: {
      badge: 'Week 6: Active Momentum',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      title: 'Structured & Expressive',
      quote: '"I can structure my 3 points and give a 90-second speech without notes."',
      stats: [
        { label: 'Fluency & Flow', value: 72, color: 'bg-amber-500' },
        { label: 'Eye Contact & Poise', value: 68, color: 'bg-amber-500' },
        { label: 'Logical Argumentation', value: 78, color: 'bg-amber-500' },
      ],
      tag: 'Mastering Extempore Drills',
      statusIcon: <TrendingUp className="w-4 h-4 text-amber-600" />,
      highlight: 'Comfortable speaking with peers, structuring ideas using debate frameworks.',
    },
    mastery: {
      badge: 'Week 12: Graduation Mastery',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      title: 'Fearless & Articulate Leader',
      quote: '"I voluntarily took the mic in our school assembly and loved every moment!"',
      stats: [
        { label: 'Fluency & Flow', value: 95, color: 'bg-emerald-500' },
        { label: 'Eye Contact & Poise', value: 92, color: 'bg-emerald-500' },
        { label: 'Logical Argumentation', value: 96, color: 'bg-emerald-500' },
      ],
      tag: 'Stage & Classroom Confident',
      statusIcon: <Award className="w-4 h-4 text-emerald-600" />,
      highlight: 'Speaks spontaneously, debates with polite persuasion, projects voice naturally.',
    },
  };

  const current = stageData[activeStage];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-[#FAFAF8] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Context Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/70 border border-amber-300/60 text-amber-900 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>For School Students: Class 4 to Class 12</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Help Your Child Speak With{' '}
                <span className="text-amber-700">
                  Confidence
                </span>
                .
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
                Live online classes designed to help school students conquer hesitation, master spoken
                English fluency, debate with logic, and speak up without fear in any classroom or stage.
              </p>
            </div>

            {/* Key Micro-Commitments */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Users2 className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="block font-bold text-slate-900">
                    Intimate Small Batches
                  </strong>
                  <span className="text-slate-500">Guaranteed Speaking Time</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                  <Video className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="block font-bold text-slate-900">100% Live Practice</strong>
                  <span className="text-slate-500">No Pre-recorded Lectures</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="block font-bold text-slate-900">Free 45-Min Demo</strong>
                  <span className="text-slate-500">Live Skill Assessment</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                id="hero_btn_book_demo"
                onClick={onOpenDemoModal}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>BOOK A FREE DEMO</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="hero_btn_explore_program"
                onClick={onExploreProgram}
                className="inline-flex items-center justify-center px-7 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-300 shadow-2xs hover:border-slate-400 transition-colors cursor-pointer"
              >
                Explore The Program
              </button>
            </div>

            {/* Reassurance text for Indian parents */}
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No payment details needed for demo. Parents can observe the entire session.</span>
            </p>
          </div>

          {/* Right Column: Student Transformation & Speaking Milestones Showcase */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-7 space-y-5 text-left">
              {/* Header with Live Growth Indicator */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                      12-Week Transformation Tracker
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Real speaking progression observed across our students
                  </p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  94% Success Rate
                </span>
              </div>

              {/* Milestone Stage Switcher Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100/90 rounded-2xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => setActiveStage('baseline')}
                  className={`py-2 px-2 text-xs font-bold rounded-xl transition-all ${
                    activeStage === 'baseline'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Day 1: Baseline
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStage('midway')}
                  className={`py-2 px-2 text-xs font-bold rounded-xl transition-all ${
                    activeStage === 'midway'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Week 6: Momentum
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStage('mastery')}
                  className={`py-2 px-2 text-xs font-bold rounded-xl transition-all ${
                    activeStage === 'mastery'
                      ? 'bg-white text-amber-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Week 12: Mastery
                </button>
              </div>

              {/* Dynamic Milestone Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F6] border border-stone-200/90 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-white border border-stone-200 shadow-2xs">
                      {current.statusIcon}
                    </span>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{current.title}</h4>
                      <span className="text-[11px] text-slate-500">{current.tag}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${current.badgeColor}`}>
                    {current.badge}
                  </span>
                </div>

                {/* Simulated Student Quote / Experience */}
                <p className="text-xs text-slate-700 italic bg-white p-3 rounded-xl border border-stone-200/70 leading-relaxed">
                  {current.quote}
                </p>

                {/* Progress Indicators */}
                <div className="space-y-2.5 pt-1">
                  {current.stats.map((st, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                        <span>{st.label}</span>
                        <span className="font-bold text-slate-900">{st.value}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${st.color} rounded-full transition-all duration-500`}
                          style={{ width: `${st.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-slate-600 flex items-start gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{current.highlight}</span>
                </div>
              </div>

              {/* Quick Results Summary Row */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/70">
                  <span className="text-base font-extrabold text-amber-900 block leading-tight">+88%</span>
                  <span className="text-[10px] text-amber-800 font-medium">Fluency Boost</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
                  <span className="text-base font-extrabold text-emerald-900 block leading-tight">100%</span>
                  <span className="text-[10px] text-emerald-800 font-medium">Live Practice</span>
                </div>
                <div className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-200/70">
                  <span className="text-base font-extrabold text-sky-900 block leading-tight">Zero</span>
                  <span className="text-[10px] text-sky-800 font-medium">Stage Fear</span>
                </div>
              </div>

              {/* Action in Card */}
              <button
                id="hero_card_btn_demo"
                type="button"
                onClick={onOpenDemoModal}
                className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>Evaluate Your Child’s Baseline (Free Demo)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

