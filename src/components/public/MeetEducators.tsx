import React from 'react';
import { Teacher } from '../../types';
import { Award, BookOpen, Clock, ShieldCheck, UserCheck } from 'lucide-react';

interface MeetEducatorsProps {
  teachers: Teacher[];
}

export const MeetEducators: React.FC<MeetEducatorsProps> = ({ teachers }) => {
  return (
    <section id="educators" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
            Faculty & Mentorship
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Learn From Compassionate, Experienced Communicators
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Our educators are not simply subject tutors. They are debate mentors, public speaking coaches, and youth
            development specialists trained to turn self-conscious students into confident speakers.
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="p-8 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-300 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-2xl shadow-xs shrink-0">
                    {teacher.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{teacher.name}</h3>
                    <p className="text-xs font-semibold text-amber-800 mt-0.5">
                      Senior Communication & Debate Educator
                    </p>
                    <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Certified Faculty (Sample Profile)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-slate-600 leading-relaxed">{teacher.biography}</p>

                  <div className="pt-3 border-t border-stone-200/80 space-y-2">
                    <div className="flex items-start gap-2 text-xs text-slate-700">
                      <BookOpen className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>
                        <strong>Focus Areas:</strong> {teacher.expertise}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-slate-700">
                      <Award className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>
                        <strong>Track Record:</strong> {teacher.achievements}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-slate-500">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Availability:</strong> {teacher.availability || 'Evening batch slots'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Small-Group Batch Assigned</span>
                </span>
                <span className="italic text-[11px]">Parent-observed sessions welcomed</span>
              </div>
            </div>
          ))}
        </div>

        {/* Note on credentials authenticity */}
        <div className="mt-8 p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
          <p>
            <strong>Note for parents:</strong> Full verified academic dossiers and teacher accreditation details are
            shared transparently during your child's free interactive demo session.
          </p>
        </div>
      </div>
    </section>
  );
};
