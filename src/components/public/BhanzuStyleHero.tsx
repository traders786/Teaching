import React from 'react';
import { BrandingConfig } from '../../types';
import { Sparkles, ArrowRight, CheckCircle2, Star, Mic, MessageSquare, Award } from 'lucide-react';

interface BhanzuStyleHeroProps {
  branding: BrandingConfig;
  onOpenDemoModal: () => void;
  onExploreProgram: () => void;
}

export const BhanzuStyleHero: React.FC<BhanzuStyleHeroProps> = ({
  branding,
  onOpenDemoModal,
  onExploreProgram,
}) => {
  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bhanzu-Style Large Rounded Organic Container */}
        <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7]/40 to-[#F8FAFC] border-2 border-amber-200/80 p-6 sm:p-10 lg:p-14 overflow-hidden text-left shadow-sm">
          
          {/* Ambient Background Doodles */}
          <div className="absolute top-4 right-10 text-amber-400 hidden lg:block animate-float-subtle">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="absolute bottom-8 left-8 text-amber-500 hidden lg:block animate-float-delayed">
            <Star className="w-6 h-6 fill-amber-300 text-amber-400" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Context Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/80 text-xs sm:text-sm font-bold shadow-2xs font-heading">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
                <span>FOR GRADES UKG TO 10 • LIVE SMALL BATCHES & 1-ON-1</span>
              </div>

              {/* Bhanzu-Style Oversized Playful Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] font-heading">
                Turn English Speaking Fear Into{' '}
                <span className="text-amber-600 underline decoration-amber-400 decoration-wavy decoration-2">
                  Unstoppable Confidence
                </span>
                .
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-body max-w-xl font-medium">
                Live interactive spoken English, public speaking, and debate classes where your child learns by{' '}
                <strong className="text-slate-950 font-bold">actually speaking</strong> — not by memorizing boring grammar worksheets.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                
                {/* Primary Button */}
                <button
                  id="bhanzu_hero_btn_demo"
                  onClick={onOpenDemoModal}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-base sm:text-lg flex items-center justify-center gap-3 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 font-heading"
                >
                  <span>Book a FREE Demo Class</span>
                  <ArrowRight className="w-5 h-5 text-slate-950" />
                </button>

                {/* Secondary Button */}
                <button
                  onClick={onExploreProgram}
                  className="px-7 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border-2 border-slate-200 hover:border-slate-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 font-heading"
                >
                  <span>Explore Curriculum</span>
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                </button>

              </div>

              {/* Quick Trust Checks */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs sm:text-sm font-semibold text-slate-700">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Live Practice</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Max 8 Kids & 1-on-1 Coaching</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Certified Speech Coaches</span>
                </div>
              </div>

            </div>

            {/* Right Visual Column (Bhanzu-Style Playful Scene) */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              
              <div className="relative w-full max-w-[440px] aspect-[4/4] rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 p-6 text-white shadow-xl overflow-hidden border-4 border-white flex flex-col justify-between">
                
                {/* Top Badge */}
                <div className="flex items-center justify-between z-20">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider">
                    🎙️ Live Speaking Lab
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-950/40 text-amber-200 text-xs font-bold font-mono">
                    UKG – Grade 10
                  </span>
                </div>

                {/* Floating Speech Bubbles */}
                <div className="absolute top-16 right-4 z-20 animate-float-subtle bg-white text-slate-900 px-3.5 py-1.5 rounded-2xl rounded-bl-xs font-extrabold text-xs shadow-lg border border-amber-200">
                  <span>💡 "I have an idea!"</span>
                </div>

                <div className="absolute top-32 left-4 z-20 animate-float-delayed bg-amber-100 text-amber-900 px-3 py-1 rounded-2xl rounded-br-xs font-black text-xs shadow-md">
                  <span>✨ "Let me explain!"</span>
                </div>

                {/* Center SVG Child Speaker */}
                <div className="relative z-10 w-full flex flex-col items-center justify-center my-auto">
                  <svg viewBox="0 0 240 200" className="w-full max-h-[170px]" fill="none">
                    {/* Stage base */}
                    <ellipse cx="120" cy="180" rx="90" ry="16" fill="#78350F" fillOpacity="0.3" />
                    <ellipse cx="120" cy="175" rx="75" ry="12" fill="#FEF3C7" />
                    {/* Child Head */}
                    <circle cx="120" cy="70" r="30" fill="#FBBF24" />
                    <path d="M98 55C104 42 136 42 142 55" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
                    <circle cx="110" cy="68" r="3.5" fill="#1E293B" />
                    <circle cx="130" cy="68" r="3.5" fill="#1E293B" />
                    {/* Big Smile */}
                    <path d="M110 82C110 94 130 94 130 82H110Z" fill="#FFFFFF" stroke="#991B1B" strokeWidth="2.5" />
                    {/* Body */}
                    <path d="M95 105C95 105 105 98 120 98C135 98 145 105 145 105V155H95V105Z" fill="#1E293B" />
                    {/* Mic holding hand */}
                    <path d="M145 115L160 130" stroke="#FBBF24" strokeWidth="8" strokeLinecap="round" />
                    <rect x="156" y="112" width="10" height="22" rx="5" fill="#CBD5E1" stroke="#0F172A" strokeWidth="2" />
                    <circle cx="161" cy="115" r="4.5" fill="#64748B" />
                    {/* Podium / Mic Stand */}
                    <path d="M161 134V170" stroke="#475569" strokeWidth="3" />
                    <path d="M150 170H172" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Bottom Trust Badge */}
                <div className="z-20 bg-amber-950/40 backdrop-blur-md rounded-2xl p-3 border border-amber-400/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white">Active Speaking Session</span>
                  </div>
                  <span className="text-xs font-extrabold text-amber-300">1:8 Batch & 1:1</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
