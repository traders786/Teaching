import React from 'react';
import { BrandingConfig } from '../../types';
import { CheckCircle2, XCircle, Clock, MessageSquareQuote, Users, Target } from 'lucide-react';

export const SmallBatchAdvantage: React.FC<{ branding: BrandingConfig }> = ({ branding }) => {
  return (
    <section id="batch-advantage" className="py-20 bg-[#F7F7F4] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="max-w-3xl space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
            The Scientific Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why We Cap Batches at Strictly {branding.classBatchTargetSize} Students
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Public speaking cannot be learned by sitting passively in a crowd of 30 or 40 children watching a teacher
            talk. It requires microphone time, immediate feedback, and personal encouragement.
          </p>
        </div>

        {/* Comparison Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Crowded Tuition / Typical School Class */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Typical 30-40 Student Class</h3>
                <p className="text-xs text-slate-500">School or mass coaching webinars</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200">
                Passive Attendance
              </span>
            </div>

            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Under 2 minutes speaking time:</strong> The outspoken students dominate, while shy children
                  hide behind muted microphones.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero personalized feedback:</strong> Teacher is lecturing slides and cannot observe subtle eye
                  contact or vocal hesitations.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Intimidation factor:</strong> Speaking in front of 35 peers raises self-consciousness rather
                  than dissolving stage fright.
                </span>
              </li>
            </ul>
          </div>

          {/* Speak India 8-Student Micro Batch */}
          <div className="p-8 rounded-2xl bg-slate-900 text-white shadow-xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-amber-400">
                  {branding.brandName} Micro-Batch ({branding.classBatchTargetSize} Learners)
                </h3>
                <p className="text-xs text-slate-400">Target 8 students (Absolute cap: {branding.classBatchMaxSize})</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                High-Engagement
              </span>
            </div>

            <ul className="space-y-4 text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>20+ minutes of active speaking per week:</strong> Every child participates in every single
                  session without exception.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Direct mentor guidance:</strong> The educator corrects posture, pace, tone, and sentence
                  structure on the spot with warm encouragement.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Supportive peer circle:</strong> An intimate cohort builds confidence fast, normalizing trial
                  and cheering each other's progress.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4 Quantitative Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="p-4 rounded-xl bg-white border border-stone-200">
            <Users className="w-5 h-5 text-amber-700 mb-2" />
            <div className="text-xl font-extrabold text-slate-900">8 Students</div>
            <div className="text-xs text-slate-500">Target batch capacity</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-stone-200">
            <Clock className="w-5 h-5 text-amber-700 mb-2" />
            <div className="text-xl font-extrabold text-slate-900">3x / Week</div>
            <div className="text-xs text-slate-500">Weekly consistent practice</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-stone-200">
            <MessageSquareQuote className="w-5 h-5 text-amber-700 mb-2" />
            <div className="text-xl font-extrabold text-slate-900">100% Live</div>
            <div className="text-xs text-slate-500">Zero pre-recorded filler</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-stone-200">
            <Target className="w-5 h-5 text-amber-700 mb-2" />
            <div className="text-xl font-extrabold text-slate-900">2 per Demo</div>
            <div className="text-xs text-slate-500">Intimate evaluation sessions</div>
          </div>
        </div>
      </div>
    </section>
  );
};
