import React from 'react';
import { BrandingConfig } from '../types';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Target,
  MessageCircle,
  BarChart3,
  HeartHandshake,
} from 'lucide-react';

interface BatchesPageProps {
  branding: BrandingConfig;
  onOpenDemoModal: () => void;
}

export const BatchesPage: React.FC<BatchesPageProps> = ({ branding, onOpenDemoModal }) => {
  return (
    <div className="bg-[#FAF9F6] text-slate-900">
      {/* Page Header */}
      <section className="bg-slate-900 text-white py-16 lg:py-20 border-b border-slate-800 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <Users className="w-3.5 h-3.5" />
              <span>Strict Batch Cap Policy</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Why We Strictly Cap Every Batch at 8 Students
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Public speaking is a motor skill, not a spectator sport. You cannot learn to swim by watching someone else,
              and you cannot conquer stage fear while sitting on mute with 35 other children.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-400" />
                Target Size: {branding.classBatchTargetSize} Learners
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Hard System Ceiling: {branding.classBatchMaxSize} Max
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                15+ Minutes Active Mic Time / Child
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-16">
        {/* Comparison Matrix */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              The Speaking Time Reality Check
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Here is the mathematical breakdown of a 60-minute online communication class:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Big Edtech Webinar Trap */}
            <div className="p-6 sm:p-8 rounded-2xl bg-rose-50/40 border border-rose-200/80 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Traditional Edtech</span>
                <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                  30–50 Students
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Under 90 seconds of speaking time:</strong> With 35 students in 60 minutes, your child only gets 1 or 2 quick sentences.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Passive spectator syndrome:</strong> Hesitant or shy children hide behind turned-off cameras and stay muted.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>No individualized corrections:</strong> The teacher lectures to the screen; subtle tone, pause, and breathing flaws go unnoticed.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Intimidating crowd pressure:</strong> Shy kids feel terrified of making a mistake in front of 40 strangers.
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-rose-200 text-center">
                <span className="text-xs text-rose-700 block font-medium">Average Mic Practice Time</span>
                <strong className="text-2xl font-black text-rose-900 block mt-1">&lt; 1.5 Minutes</strong>
              </div>
            </div>

            {/* The Speak India Model */}
            <div className="p-6 sm:p-8 rounded-2xl bg-amber-50/50 border-2 border-amber-500/70 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Speak India Model</span>
                <span className="px-2.5 py-1 rounded-full bg-amber-600 text-white text-xs font-bold">
                  Strictly 8 Students
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>15–20 minutes active speaking:</strong> Every single child speaks multiple times in extempore, debate, and reading rounds.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Safe intimate circle:</strong> 8 peers form a supportive, encouraging cohort where making a stumble is celebrated as progress.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Instant real-time coach feedback:</strong> The educator pauses and refines pitch, posture, and vocabulary on the spot.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Camera & Mic always active:</strong> High accountability, active listening, and interactive peer rebuttals.
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-amber-300 text-center shadow-2xs">
                <span className="text-xs text-amber-800 block font-medium">Average Mic Practice Time</span>
                <strong className="text-2xl font-black text-amber-900 block mt-1">15 to 20 Minutes</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars of the 8-Student Cohort */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              How the 8-Student Model Transforms Your Child
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Designed according to developmental speech psychology for children aged 9 to 18.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-500 flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Psychological Safety</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Children who freeze in front of a full classroom feel comfortable opening up in a small group.
                They hear peers stumble and recover, eliminating the fear of judgment.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-500 flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Continuous Assessment</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Because our teachers only manage 8 minds, they can accurately score each student on 6 speech
                rubrics every week and text detailed personalized observations to parents.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-500 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Grade-Matched Peer Circle</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We never mix junior school and high school students. Every batch is tightly grouped by academic
                class and baseline speech readiness for age-appropriate debates.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black">Test the Small Batch in a Free Demo</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Our free 45-minute demo is conducted with a maximum of 2 students per session so your child gets
              undivided mentor attention and an instant baseline confidence review.
            </p>
          </div>
          <button
            onClick={onOpenDemoModal}
            className="shrink-0 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            BOOK A FREE DEMO
          </button>
        </div>
      </section>
    </div>
  );
};
