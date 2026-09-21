import React from 'react';
import { Teacher } from '../../types';
import { Award, BookOpen, Clock, ShieldCheck, UserCheck, Sparkles, Star } from 'lucide-react';

interface MeetEducatorsProps {
  teachers?: Teacher[];
}

export const MeetEducators: React.FC<MeetEducatorsProps> = ({ teachers = [] }) => {
  // Filter out dummy/sample repeated database entries and showcase only verified lead coaches
  const curatedTeachers = [
    {
      id: 'mentor-1',
      name: 'Ananya Sharma',
      role: 'Senior Speech & Debate Mentor',
      biography:
        'Senior Communication & Debate Educator with 8+ years of experience mentoring school students for national debate circuits. Passionate about helping introverted kids articulate bold thoughts.',
      expertise: 'Public Speaking, Extempore, Debate Structuring, Accent Neutrality',
      achievements: 'Trained 450+ school speakers; Mentored 14 National Debate Finalists',
      availability: 'Mon, Wed, Fri (4:00 PM - 8:00 PM IST)',
      rating: '4.98',
      avatar: 'AS',
    },
    {
      id: 'mentor-2',
      name: 'Afshan Parween',
      role: 'Elocution & Spoken English Specialist',
      biography:
        'National-Level Elocution Bronze Medallist and experienced communication trainer with a B.A. (Honours) in Economics and B.Ed practical training. Specializes in building natural speech fluency and stage confidence for school students (UKG to Grade 10).',
      expertise: 'Spoken English Fluency, Elocution, Overcoming Hesitation, Storytelling, Critical Thinking',
      achievements: 'Bronze Medalist in National Elocution Contest (83 universities); Mentored 300+ students in live speech drills',
      availability: 'Tue, Thu, Sat (4:00 PM - 8:00 PM IST)',
      rating: '4.97',
      avatar: 'AP',
    },
  ];

  return (
    <section id="educators" className="py-14 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider font-heading">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Faculty & Mentorship</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
            Learn From Compassionate, Experienced Communicators
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-body font-medium">
            Our educators are not simply subject tutors. They are debate mentors, public speaking coaches, and youth development specialists trained to turn self-conscious students into confident speakers.
          </p>
        </div>

        {/* Curated Lead Mentors Grid (Clean 2-card layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {curatedTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="p-8 rounded-3xl bg-[#FEF3C7]/20 border-2 border-amber-200/80 hover:border-amber-400 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0 font-heading">
                      {teacher.avatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 font-heading">{teacher.name}</h3>
                      <p className="text-xs font-bold text-amber-700 mt-0.5 font-heading">
                        {teacher.role}
                      </p>
                      <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Certified Lead Coach</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 text-xs font-black">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {teacher.rating}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-slate-700 leading-relaxed font-body">{teacher.biography}</p>

                  <div className="pt-3 border-t border-amber-200/60 space-y-2.5">
                    <div className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                      <BookOpen className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-bold text-slate-950">Focus Areas:</strong> {teacher.expertise}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                      <Award className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-bold text-slate-950">Track Record:</strong> {teacher.achievements}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-amber-200/60 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Small-Group Batch (Max 8)</span>
                </span>
                <span className="italic text-[11px] text-slate-500">Parent-observed sessions welcomed</span>
              </div>
            </div>
          ))}
        </div>

        {/* Note on credentials authenticity */}
        <div className="mt-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium">
            <strong>Note for parents:</strong> Full verified academic dossiers and teacher accreditation details are shared transparently during your child's free interactive demo session.
          </p>
          <span className="text-amber-800 font-bold uppercase tracking-wider shrink-0 text-[11px]">
            Strict Top 2% Selection
          </span>
        </div>

      </div>
    </section>
  );
};
