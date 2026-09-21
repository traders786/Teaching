import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Star } from 'lucide-react';

interface BhanzuStyleCTAProps {
  onOpenDemoModal: () => void;
}

export const BhanzuStyleCTA: React.FC<BhanzuStyleCTAProps> = ({ onOpenDemoModal }) => {
  return (
    <section className="py-14 sm:py-20 bg-white text-center">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Large Rounded CTA Container */}
        <div className="rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-tr from-amber-600 via-amber-500 to-orange-500 p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
          
          {/* Background Ambient Glows */}
          <div className="absolute top-0 right-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-amber-950/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-black uppercase tracking-wider font-heading">
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Zero-Cost 45-Minute Live Diagnostic</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-heading">
              Ready to Hear Your Child Speak With Unstoppable Confidence?
            </h2>

            <p className="text-base sm:text-lg text-amber-100 font-medium font-body max-w-xl mx-auto">
              Join thousands of school children across India who conquered hesitation, public speaking fear, and stage anxiety with Upspeaq.
            </p>

            {/* High-Converting CTA Button */}
            <div className="pt-2 flex justify-center">
              <button
                onClick={onOpenDemoModal}
                className="px-10 py-4.5 rounded-full bg-slate-950 text-white hover:bg-slate-900 text-base sm:text-lg font-black font-heading border-2 border-slate-950 hover:border-slate-800 flex items-center justify-center gap-3 cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Book a FREE Demo Class</span>
                <ArrowRight className="w-5 h-5 text-amber-400" />
              </button>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-bold text-amber-100">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-200" />
                <span>Strictly 1:8 Small Batch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-200" />
                <span>Free Speech Diagnostic Report</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-200" />
                <span>No Credit Card Required</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
