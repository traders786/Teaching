import React from 'react';
import { Teacher } from '../types';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  ShieldCheck,
  HeartHandshake,
  BookOpen,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface FacultyPageProps {
  teachers: Teacher[];
  onOpenDemoModal: () => void;
}

export const FacultyPage: React.FC<FacultyPageProps> = ({ teachers, onOpenDemoModal }) => {
  return (
    <div className="bg-[#FAF9F6] text-slate-900">
      {/* Page Header */}
      <section className="bg-slate-900 text-white py-16 lg:py-20 border-b border-slate-800 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Certified Faculty & Mentors</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Trained by National Debaters & Child Speech Mentors
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              We do not hire generic tutors. Our mentors are accomplished public speakers, collegiate debate adjudicators,
              and educators trained specifically in child speech psychology and gentle positive reinforcement.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Top 2% Selection Rate
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Comprehensive Background Verification
              </span>
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-amber-400" />
                Zero-Shame Encouragement Protocol
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-16">
        {/* Faculty Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Meet Our Senior Lead Mentors
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Active mentors leading live cohorts and personal speech evaluations:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{teacher.name}</h3>
                      <span className="text-xs font-semibold text-amber-700 block mt-0.5">
                        Senior Communication Educator
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-base shrink-0">
                      {teacher.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {teacher.biography}
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Areas of Expertise
                      </span>
                      <p className="text-xs font-medium text-slate-800">{teacher.expertise}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                        Verified Credentials
                      </span>
                      <p className="text-xs font-medium text-slate-800">{teacher.achievements}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Active Cohort Mentor
                  </span>
                  <span>{teacher.availability || 'Evening & Weekend Slots'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Stage Faculty Selection Rigor */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              Our 4-Stage Educator Selection Rigor
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Only 2 out of every 100 educator applicants are accepted into Speak India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h4 className="text-sm font-bold text-slate-900">Speech & Debate Audition</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Candidate delivers impromptu speeches and undergoes debate cross-examination by our senior panel.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="text-sm font-bold text-slate-900">Live Student Simulation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applicant teaches a simulated classroom of introverted children to assess their patience, empathy, and coaching style.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h4 className="text-sm font-bold text-slate-900">Child Safety & POSH Verification</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rigorous police background checks, identity confirmation, and child online interaction safety certification.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                4
              </span>
              <h4 className="text-sm font-bold text-slate-900">Pedagogical Apprenticeship</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                40 hours of co-teaching with a master educator before ever leading an independent 8-student cohort.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-amber-600 text-white rounded-3xl p-8 sm:p-12 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black">Meet A Mentor in a Free Demo</h3>
            <p className="text-amber-100 text-sm leading-relaxed">
              Experience the mentorship firsthand. A lead educator will conduct a gentle, 1-on-2 speech assessment
              with your child and share detailed constructive feedback.
            </p>
          </div>
          <button
            onClick={onOpenDemoModal}
            className="shrink-0 px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            BOOK A FREE DEMO
          </button>
        </div>
      </section>
    </div>
  );
};
