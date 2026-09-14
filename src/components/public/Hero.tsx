import React from 'react';
import { BrandingConfig } from '../../types';
import { ArrowRight, CheckCircle2, Users2, Video, Calendar, Sparkles } from 'lucide-react';

interface HeroProps {
  branding: BrandingConfig;
  onOpenDemoModal: () => void;
  onExploreProgram: () => void;
}

export const Hero: React.FC<HeroProps> = ({ branding, onOpenDemoModal, onExploreProgram }) => {
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
                    Max {branding.classBatchMaxSize} Students
                  </strong>
                  <span className="text-slate-500">Intimate Small Batches</span>
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

          {/* Right Column: Authentic Classroom Experience Frame */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 space-y-6">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Live Batch Snapshot
                  </span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                  Target: 8 Learners
                </span>
              </div>

              {/* Classroom Illustration / Representation */}
              <div className="space-y-4">
                <div className="bg-slate-900 text-white rounded-xl p-4 text-left space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Mentor Speech Prompt</span>
                    <span className="text-amber-400 font-mono font-medium">Session 14: Extempore</span>
                  </div>
                  <p className="text-sm font-medium text-slate-200">
                    "If you had the power to change one school rule tomorrow morning, what would you defend?"
                  </p>
                </div>

                {/* Simulated Student Participation Cards */}
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">Aarav (Class 6)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">
                        Speaking Now
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      Structured opening statement using the 3-point debate framework.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">Diya (Class 8)</span>
                      <span className="text-[10px] text-slate-500 font-medium">Next in turn</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      Preparing rebuttal counter-argument on student autonomy.
                    </p>
                  </div>
                </div>

                {/* Measurable Progress Callout */}
                <div className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200 text-left space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">
                    The Transformation After 12 Weeks:
                  </span>
                  <ul className="text-xs text-slate-600 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>Speaks in front of class without clutching a sheet or trembling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>Organizes arguments logically instead of hesitating for words</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>Natural eye contact, clear articulation & polite assertiveness</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action in Card */}
              <button
                onClick={onOpenDemoModal}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Reserve Free Assessment Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
