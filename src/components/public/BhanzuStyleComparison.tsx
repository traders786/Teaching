import React from 'react';
import { XCircle, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

interface BhanzuStyleComparisonProps {
  onOpenDemoModal: () => void;
}

export const BhanzuStyleComparison: React.FC<BhanzuStyleComparisonProps> = ({
  onOpenDemoModal,
}) => {
  const points = [
    {
      feature: 'Core Learning Focus',
      traditional: 'Grammar worksheets, spelling tests, and memorizing essay templates.',
      upspeaq: '100% active microphone speaking, extempore talks, and live debates.',
    },
    {
      feature: 'Handling Mistakes',
      traditional: 'Fear of red marks and mockery stops children from speaking up.',
      upspeaq: 'Safe, non-judgmental environment where mistakes are stepping stones to eloquence.',
    },
    {
      feature: 'Classroom Dynamic',
      traditional: '30+ students listening passively to one teacher writing on a board.',
      upspeaq: 'Strictly 1:8 small batch with 15+ minutes of direct mic time per student.',
    },
    {
      feature: 'Speaking Reflex',
      traditional: 'Translating word-by-word from mother tongue causing long awkward pauses.',
      upspeaq: 'Rapid-fire extempore drills build instant sentence framing reflexes.',
    },
    {
      feature: 'Real-World Outcome',
      traditional: 'Scores well in written exams but freezes when holding a microphone.',
      upspeaq: 'Fearless stage poise, camera confidence, and leadership communication.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#FEF3C7]/20 border-y border-amber-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Pedagogical Shift</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading tracking-tight">
            Why Traditional School English Fails Spoken Fluency
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium font-body max-w-2xl mx-auto">
            You cannot learn swimming by reading a textbook. You cannot learn speaking without a microphone.
          </p>
        </div>

        {/* Comparison Table / Cards */}
        <div className="rounded-3xl bg-white border-2 border-slate-200/80 shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            
            {/* Left Header: Traditional */}
            <div className="md:col-span-6 p-6 sm:p-8 bg-rose-50/40">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <h3 className="text-xl font-black text-rose-950 font-heading">
                  Traditional School English
                </h3>
              </div>

              <div className="space-y-6">
                {points.map((p, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                        {p.feature}
                      </div>
                      <div className="text-sm text-slate-700 mt-0.5 font-medium leading-relaxed">
                        {p.traditional}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Header: Upspeaq */}
            <div className="md:col-span-6 p-6 sm:p-8 bg-amber-50/40">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                  <h3 className="text-xl font-black text-slate-900 font-heading">
                    The Upspeaq Speaking Method
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black">
                  PROVEN METHOD
                </span>
              </div>

              <div className="space-y-6">
                {points.map((p, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                        {p.feature}
                      </div>
                      <div className="text-sm text-slate-900 mt-0.5 font-bold leading-relaxed">
                        {p.upspeaq}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-10 text-center">
          <div className="upspeaq-btn-3d-wrapper">
            <div className="bottom-layer" />
            <button
              onClick={onOpenDemoModal}
              className="upspeaq-btn-3d px-8 py-4 text-base sm:text-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <div className="shine-effect" />
              <span>Experience The Difference in a Free Demo</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
