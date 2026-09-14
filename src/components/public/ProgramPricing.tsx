import React, { useState } from 'react';
import { BrandingConfig, Course } from '../../types';
import { CheckCircle2, ArrowRight, ShieldCheck, Sparkles, UserCheck, Zap } from 'lucide-react';

interface ProgramPricingProps {
  branding: BrandingConfig;
  courses: Course[];
  onOpenDemoModal: () => void;
}

export const ProgramPricing: React.FC<ProgramPricingProps> = ({ branding, courses, onOpenDemoModal }) => {
  const [activePlan, setActivePlan] = useState<'FLAGSHIP' | 'STARTER' | 'INDIVIDUAL'>('FLAGSHIP');

  const starter = courses.find((c) => c.slug === '1-month-starter' || c.id === 'crs_starter_monthly') || {
    name: '1-Month Communication & Fluency Starter',
    duration_months: 1,
    classes_per_week: 3,
    total_classes: 12,
    price_inr: 1999,
    target_batch_size: 8,
    max_batch_size: 9,
    description: 'Foundational monthly speaking cohort. Builds vocabulary, overcomes stage shyness, and gives 12 live interactive speaking sessions.',
  };

  const flagship = courses.find((c) => c.is_flagship || c.id === 'crs_flagship_1') || {
    name: '3-Month Flagship Communication & Debate Cohort',
    duration_months: 3,
    classes_per_week: 3,
    total_classes: 36,
    price_inr: branding.flagshipPrice || 4999,
    target_batch_size: 8,
    max_batch_size: 9,
    description: 'Comprehensive 12-week transformation covering impromptu speech, debate arguments, body language, live graduation showcase, and verified certificate.',
  };

  const individual = courses.find((c) => c.slug === 'individual-1on1-classes' || c.id === 'crs_individual_1on1') || {
    name: '1-on-1 Individual Mentorship (Private Classes)',
    duration_months: 1,
    classes_per_week: 3,
    total_classes: 12,
    price_inr: 5000,
    target_batch_size: 1,
    max_batch_size: 1,
    description: 'Exclusive 1-on-1 private coaching with a senior speech coach. 100% individual focus, custom pace, and flexible scheduling.',
  };

  return (
    <section id="pricing" className="py-20 bg-[#FBFBFA] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
            Transparent Investment • Free Demo Included
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Programs Designed for Real Confidence
          </h2>
          <p className="text-base text-slate-600">
            High-caliber speech mentorship priced affordably for every Indian family. Start with a 100% Free Demo Session today.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Card 1: 1-Month Starter */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition-all p-7 flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-3 py-1 rounded-full inline-block">
                  Monthly Starter
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{starter.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{starter.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">
                    ₹{(starter.price_inr || 1999).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">/ month</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                  12 Live Interactive Classes (3 classes/week)
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 pt-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>12 Live Speaking Classes</strong> in 8-student batches</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Vocal clarity & foundational speech structuring</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Weekly WhatsApp feedback reports for parents</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>100% Free Demo Session</strong> before enrolling</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                onClick={onOpenDemoModal}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                BOOK FREE STARTER DEMO
              </button>
            </div>
          </div>

          {/* Card 2: 3-Month Flagship (Featured) */}
          <div className="bg-white rounded-3xl border-2 border-amber-500 shadow-xl p-7 flex flex-col justify-between relative transform lg:-translate-y-2">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white px-3.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1 whitespace-nowrap">
              <Sparkles className="w-3 h-3 fill-white" />
              <span>Most Popular • Best Value</span>
            </div>

            <div className="space-y-5 pt-1">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full inline-block">
                  Full 12-Week Term
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">{flagship.name}</h3>
                <p className="text-xs text-slate-600 mt-1">{flagship.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900">
                    ₹{(flagship.price_inr || 4999).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 line-through">₹8,999</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 block mt-0.5">
                  Complete 3-Month Fee (Save ₹998 vs Monthly)
                </span>
                <span className="text-[11px] text-slate-500 block">
                  ~₹138 per live session • 36 Total Classes
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 pt-1">
                <li className="flex items-start gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>36 Live Interactive Classes</strong> (3 classes/week)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Strict 8-Student Cap</strong> (15+ min speaking/class)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Extempore, Debate & Parliamentary speech logic</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Live Parent Showcase</strong> & Verified Certificate</span>
                </li>
                <li className="flex items-start gap-2 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>100% 7-Day Money-Back Guarantee</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                onClick={onOpenDemoModal}
                className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>BOOK FREE DEMO FOR FLAGSHIP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: 1-on-1 Individual Classes */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition-all p-7 flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full inline-block">
                  Private Mentorship
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{individual.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{individual.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">
                    ₹{(individual.price_inr || 5000).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">/ month</span>
                </div>
                <span className="text-[11px] text-purple-700 font-semibold block mt-0.5">
                  12 Dedicated 1-on-1 Classes / Month
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 pt-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>12 Dedicated 1-on-1 Private Sessions</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>Single Student Focus</strong> (100% mentor attention)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Personalized pace for school competitions & debate</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Flexible timings & custom scheduling</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>100% Free 1-on-1 Demo Session</strong> included</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                onClick={onOpenDemoModal}
                className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                BOOK FREE 1-ON-1 DEMO
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

