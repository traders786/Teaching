import React from 'react';
import { ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';

interface BhanzuStylePedagogyProps {
  onOpenDemoModal: () => void;
}

export const BhanzuStylePedagogy: React.FC<BhanzuStylePedagogyProps> = ({ onOpenDemoModal }) => {
  const selectionPoints = [
    {
      num: '1',
      title: 'Speech & Debate Audition',
      desc: 'Impromptu speeches and debate cross-examination evaluated by senior adjudicators.',
    },
    {
      num: '2',
      title: 'Child Psychology Simulation',
      desc: 'Simulated teaching with introverted children to test patience, warmth, and coaching empathy.',
    },
    {
      num: '3',
      title: 'Strict Background & Safety Check',
      desc: 'Complete identity, police verification, and POSH child safety compliance.',
    },
    {
      num: '4',
      title: 'Pedagogical Apprenticeship',
      desc: '40 hours of co-teaching with master coaches before leading a live batch.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bhanzu-Style Teacher Selection Rigor (Top 2% Selection Rate) */}
        <div className="rounded-3xl bg-[#FEF3C7]/30 border-2 border-amber-200/80 p-6 sm:p-10 lg:p-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2 font-heading">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Mentorship Excellence</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                Our 4-Stage Speech Coach Selection Rigor
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                Only 2 out of every 100 educator applicants are certified to mentor an Upspeaq cohort.
              </p>
            </div>

            <div className="shrink-0 bg-white px-5 py-3 rounded-2xl border border-amber-200 shadow-2xs text-center">
              <div className="text-2xl font-black text-amber-700 font-heading">Top 2%</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase">Selection Acceptance Rate</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {selectionPoints.map((pt) => (
              <div key={pt.num} className="p-5 rounded-2xl bg-white border border-amber-200/70 space-y-2 shadow-2xs">
                <span className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center font-heading">
                  {pt.num}
                </span>
                <h4 className="text-sm font-black text-slate-900 font-heading">{pt.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-body font-medium">
                  {pt.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Callout */}
          <div className="mt-8 pt-6 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="text-xs text-slate-700 font-medium">
                <strong className="text-slate-900 font-bold">Zero-Shame Encouragement Protocol:</strong> Every session is designed to make quiet children feel valued, respected, and eager to speak.
              </div>
            </div>

            <div className="upspeaq-btn-3d-wrapper shrink-0">
              <div className="bottom-layer" />
              <button
                onClick={onOpenDemoModal}
                className="upspeaq-btn-3d px-5 py-2.5 text-xs sm:text-sm flex items-center gap-2 cursor-pointer font-heading"
              >
                <span>Experience in Free Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
