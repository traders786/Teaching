import React, { useState } from 'react';
import {
  Mic,
  Volume2,
  Swords,
  Users2,
  UserCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  Award,
  Zap,
  Star,
  Flame,
} from 'lucide-react';

interface BhanzuStyleBentoProps {
  onOpenDemoModal: () => void;
}

export const BhanzuStyleBento: React.FC<BhanzuStyleBentoProps> = ({ onOpenDemoModal }) => {
  const [selectedFormat, setSelectedFormat] = useState<'batch' | 'oneOnOne'>('batch');

  return (
    <section className="py-14 sm:py-20 bg-slate-50/50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-950 text-xs font-black uppercase tracking-wider font-heading shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Speaking Pedagogy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading tracking-tight">
            How Children Learn English Speaking at Upspeaq
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium font-body max-w-2xl mx-auto">
            We replace boring grammar worksheets with <strong className="text-slate-900 font-bold">4 experiential speaking environments</strong> that turn hesitant kids into expressive, stage-confident communicators.
          </p>
        </div>

        {/* 4 Interactive Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Card 1: Soft Lilac (#EFEAFD) - Interactive Speaking Studio */}
          <div className="rounded-3xl sm:rounded-[2.25rem] bg-gradient-to-br from-[#F4EFFF] via-[#EFEAFD] to-[#E9E2FC] border-2 border-purple-200/90 p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group">
            {/* Top Accent Decoration */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-purple-300/20 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-purple-200/90 text-purple-950 text-xs font-black font-heading tracking-wide border border-purple-300/50">
                  STUDIO 01
                </span>
                <span className="text-3xl group-hover:scale-125 transition-transform duration-300">🎙️</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                Interactive Speaking Studio
              </h3>

              <p className="text-sm sm:text-base text-slate-700 mt-3 leading-relaxed font-body font-medium">
                High-energy 30-second extempore drills eliminate mother-tongue translation pauses. Real-time mentor guidance helps children speak fluently without freezing.
              </p>

              {/* In-Card Live Simulation Visual */}
              <div className="my-6 p-4.5 rounded-2xl bg-white/95 border border-purple-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
                      <Mic className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 font-heading">Extempore Rapid Fire</div>
                      <div className="text-[11px] text-purple-700 font-bold">Impromptu Thinking Drill</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span>00:30s</span>
                  </span>
                </div>

                {/* Prompt Speech Bubble */}
                <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-200/60 text-xs text-purple-950 font-semibold flex items-start gap-2">
                  <span className="text-sm">💬</span>
                  <span className="italic">"If you could invent one gadget to help school students, what would it do?"</span>
                </div>

                {/* Audio Waveform Simulator */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1">
                  <span className="text-purple-900 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Aarav (Grade 5) speaking
                  </span>
                  <div className="flex items-center gap-1 h-4 text-purple-600">
                    <span className="w-1 bg-purple-600 h-2.5 rounded-full animate-pulse" />
                    <span className="w-1 bg-purple-600 h-4 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
                    <span className="w-1 bg-purple-600 h-5 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                    <span className="w-1 bg-purple-600 h-3 rounded-full animate-pulse" style={{ animationDelay: '0.45s' }} />
                    <span className="w-1 bg-purple-600 h-2 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-purple-200/60">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                Spontaneous Fluency Drills
              </span>
              <button
                onClick={onOpenDemoModal}
                className="text-xs font-black text-purple-900 hover:text-purple-950 flex items-center gap-1.5 cursor-pointer bg-purple-200/80 hover:bg-purple-200 px-3 py-1.5 rounded-full transition-colors"
              >
                <span>Try in Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Soft Peach (#FDEEE8) - Storytelling & Voice Modulation Lab */}
          <div className="rounded-3xl sm:rounded-[2.25rem] bg-gradient-to-br from-[#FFF4F0] via-[#FDEEE8] to-[#FCDED4] border-2 border-orange-200/90 p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-36 h-36 bg-orange-300/20 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-orange-200/90 text-orange-950 text-xs font-black font-heading tracking-wide border border-orange-300/50">
                  STUDIO 02
                </span>
                <span className="text-3xl group-hover:scale-125 transition-transform duration-300">🎭</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                Storytelling & Voice Modulation Lab
              </h3>

              <p className="text-sm sm:text-base text-slate-700 mt-3 leading-relaxed font-body font-medium">
                Move beyond flat, monotone speaking. Children learn dramatic character voices, eye contact, and purposeful pauses that hold any audience spellbound.
              </p>

              {/* In-Card Dynamic Visual */}
              <div className="my-6 p-4.5 rounded-2xl bg-white/95 border border-orange-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-xs">
                      <Volume2 className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 font-heading">Pitch & Cadence Modulation</div>
                      <div className="text-[11px] text-orange-800 font-bold">Vocal Dynamic Training</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-black text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                    High Impact
                  </span>
                </div>

                {/* Modulation Progression Bar */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-orange-900 border border-orange-200/60">
                    🤫 Whisper (Tension)
                  </div>
                  <div className="p-1.5 rounded-lg bg-orange-100 text-orange-950 border border-orange-300/60 font-black">
                    📈 Build-up (Tempo)
                  </div>
                  <div className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-black shadow-2xs">
                    💥 Climax (Power)
                  </div>
                </div>

                {/* Mentor Feedback Snippet */}
                <div className="text-[11px] text-orange-950 font-semibold flex items-center gap-2 bg-orange-50/70 p-2 rounded-xl border border-orange-200/50">
                  <span className="text-xs">👩‍🏫</span>
                  <span><strong>Coach:</strong> "Mastered the 2-second suspense pause before the reveal!"</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-orange-200/60">
              <span className="text-xs font-bold text-orange-950 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
                Vocal Expression & Confidence
              </span>
              <button
                onClick={onOpenDemoModal}
                className="text-xs font-black text-orange-950 hover:text-black flex items-center gap-1.5 cursor-pointer bg-orange-200/80 hover:bg-orange-200 px-3 py-1.5 rounded-full transition-colors"
              >
                <span>Try in Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Soft Sky Blue (#EEF4FF) - Oxford Debate & PEEI Logic */}
          <div className="rounded-3xl sm:rounded-[2.25rem] bg-gradient-to-br from-[#F2F7FF] via-[#EEF4FF] to-[#E2ECFF] border-2 border-blue-200/90 p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-300/20 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-200/90 text-blue-950 text-xs font-black font-heading tracking-wide border border-blue-300/50">
                  STUDIO 03
                </span>
                <span className="text-3xl group-hover:scale-125 transition-transform duration-300">⚔️</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                Oxford Debate & PEEI Logic
              </h3>

              <p className="text-sm sm:text-base text-slate-700 mt-3 leading-relaxed font-body font-medium">
                Teach children how to win arguments with logic rather than shouting. Master the Point-Explanation-Example-Impact (PEEI) debate formula.
              </p>

              {/* In-Card PEEI Visual Breakdown */}
              <div className="my-6 p-4.5 rounded-2xl bg-white/95 border border-blue-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                      <Swords className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 font-heading">PEEI Debate Framework</div>
                      <div className="text-[11px] text-blue-700 font-bold">Structure Every Argument</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                    Rebuttal Drills
                  </span>
                </div>

                {/* 4 Step PEEI Pipeline */}
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-black">
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
                    <span className="block text-blue-600 font-extrabold text-xs">P</span> Point
                  </div>
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
                    <span className="block text-blue-600 font-extrabold text-xs">E</span> Explain
                  </div>
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
                    <span className="block text-blue-600 font-extrabold text-xs">E</span> Example
                  </div>
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-2xs">
                    <span className="block text-amber-300 font-extrabold text-xs">I</span> Impact
                  </div>
                </div>

                {/* Live Debate Motion */}
                <div className="text-[11px] text-blue-950 font-semibold bg-blue-50/70 p-2 rounded-xl border border-blue-200/50 flex items-center gap-2">
                  <span>🏛️</span>
                  <span><strong>Live Motion:</strong> "Should school homework be banned for primary students?"</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-blue-200/60">
              <span className="text-xs font-bold text-blue-950 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                Critical Thinking & Rhetoric
              </span>
              <button
                onClick={onOpenDemoModal}
                className="text-xs font-black text-blue-950 hover:text-black flex items-center gap-1.5 cursor-pointer bg-blue-200/80 hover:bg-blue-200 px-3 py-1.5 rounded-full transition-colors"
              >
                <span>Try in Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: Soft Mint/Emerald (#E8F8F0) - Small Batch & 1-on-1 Special Classes */}
          <div className="rounded-3xl sm:rounded-[2.25rem] bg-gradient-to-br from-[#EDFAF3] via-[#E8F8F0] to-[#DDF5E8] border-2 border-emerald-200/90 p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-300/20 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-200/90 text-emerald-950 text-xs font-black font-heading tracking-wide border border-emerald-300/50">
                  STUDIO 04
                </span>
                <span className="text-3xl group-hover:scale-125 transition-transform duration-300">👥</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                Strict 1:8 Small Batch Guarantee
              </h3>

              <p className="text-sm sm:text-base text-slate-700 mt-3 leading-relaxed font-body font-medium">
                In 30-student webinars, quiet children get lost in the crowd. Our intimate cohorts guarantee that your child gets 15+ minutes on the mic in every single class.
              </p>

              {/* In-Card Interactive Format Selector (Batch vs 1-on-1) */}
              <div className="my-6 p-4.5 rounded-2xl bg-white/95 border border-emerald-200/90 shadow-2xs space-y-3">
                {/* Format Toggle Pill */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
                  <button
                    onClick={() => setSelectedFormat('batch')}
                    className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      selectedFormat === 'batch'
                        ? 'bg-emerald-600 text-white shadow-2xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Users2 className="w-3.5 h-3.5" />
                    <span>Small Batch (1:8)</span>
                  </button>

                  <button
                    onClick={() => setSelectedFormat('oneOnOne')}
                    className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      selectedFormat === 'oneOnOne'
                        ? 'bg-amber-500 text-slate-950 shadow-2xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>1-on-1 Special Class ⭐</span>
                  </button>
                </div>

                {selectedFormat === 'batch' ? (
                  <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/60 flex items-center justify-between gap-3 animate-fadeIn">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        1:8
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Intimate Speaking Cohort</div>
                        <div className="text-[11px] text-emerald-800 font-semibold">Max 8 Students • High Peer Energy</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded-md whitespace-nowrap">
                      15+ Mins Mic
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-300 flex items-center justify-between gap-3 animate-fadeIn">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                        1:1
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">100% Dedicated Mentor</div>
                        <div className="text-[11px] text-amber-900 font-semibold">Custom Pace • Personal Attention</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-slate-950 bg-amber-300 px-2 py-0.5 rounded-md whitespace-nowrap">
                      Exclusive 1-on-1
                    </span>
                  </div>
                )}

                <div className="text-[11px] text-slate-600 flex items-center justify-between pt-0.5">
                  <span className="flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {selectedFormat === 'batch' ? 'Interactive peer debate & cheer' : 'Ideal for ultra-shy or advanced speakers'}
                  </span>
                  <span className="font-bold text-emerald-950">
                    {selectedFormat === 'batch' ? 'Group Energy' : 'Personal Coach'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-emerald-200/60">
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Individual Mentor Attention
              </span>
              <button
                onClick={onOpenDemoModal}
                className="text-xs font-black text-emerald-950 hover:text-black flex items-center gap-1.5 cursor-pointer bg-emerald-200/80 hover:bg-emerald-200 px-3 py-1.5 rounded-full transition-colors"
              >
                <span>Try in Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* 1-on-1 Private Mentorship Feature Highlight Bar */}
        <div className="mt-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 sm:p-7 text-white shadow-md border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5 text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
              <Star className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md mb-1">
                <span>Personalized Track</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-white font-heading">
                Need Private 1-on-1 Coaching For Your Child?
              </h4>
              <p className="text-xs text-slate-300 font-medium font-body mt-0.5">
                We also offer 100% dedicated 1-on-1 personal speech coaching for children needing bespoke guidance, school speech prep, or personalized pace.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenDemoModal}
            className="w-full sm:w-auto px-5 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs font-heading flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 shadow-xs shrink-0"
          >
            <span>Request 1-on-1 Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
