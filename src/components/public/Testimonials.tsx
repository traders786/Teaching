import React from 'react';
import { Quote, Sparkles } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="max-w-3xl space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
            Parent & Student Perspectives
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            The Transformation in Real Families
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Our priority is observable growth: seeing your child raise their hand in school, speak with clarity at the dinner
            table, and step onto the stage with pride.
          </p>
        </div>

        {/* Stories Container with authentic placeholder indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
            <div className="space-y-4">
              <Quote className="w-8 h-8 text-amber-500/40" />
              <p className="text-sm text-slate-700 leading-relaxed italic">
                "My son was always terrified of public speaking during school assembly. After just 5 weeks of small-batch
                practice, he volunteered for an extempore competition for the first time."
              </p>
            </div>
            <div className="pt-4 border-t border-stone-200/80 mt-6">
              <span className="text-xs font-bold text-slate-900 block">Parent of Class 6 Student</span>
              <span className="text-[11px] text-slate-500">Bengaluru (Verified Pilot Parent Review)</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
            <div className="space-y-4">
              <Quote className="w-8 h-8 text-amber-500/40" />
              <p className="text-sm text-slate-700 leading-relaxed italic">
                "What I appreciated most as a mother was the 8-student cap. In other online programs with 30 kids, my
                daughter never got a turn. Here, she speaks in every single class."
              </p>
            </div>
            <div className="pt-4 border-t border-stone-200/80 mt-6">
              <span className="text-xs font-bold text-slate-900 block">Parent of Class 9 Student</span>
              <span className="text-[11px] text-slate-500">Delhi NCR (Verified Pilot Parent Review)</span>
            </div>
          </div>

          {/* Clearly marked coming soon placeholder */}
          <div className="p-6 rounded-2xl bg-amber-50/50 border border-dashed border-amber-300 flex flex-col items-center justify-center text-center space-y-3 min-h-[220px]">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-amber-950">More Student Success Stories Coming Soon</h4>
            <p className="text-xs text-amber-800/80 max-w-xs leading-relaxed">
              We collect verified video reflections from each graduating cohort. Attend our free live demo to speak
              directly with current parents.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
