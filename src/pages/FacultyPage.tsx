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
  Sparkles,
  Star,
  Clock,
  UserCheck,
} from 'lucide-react';

interface FacultyPageProps {
  teachers?: Teacher[];
  onOpenDemoModal: () => void;
}

export const FacultyPage: React.FC<FacultyPageProps> = ({ teachers = [], onOpenDemoModal }) => {
  const curatedFaculty = [
    {
      id: 'mentor-1',
      name: 'Ananya Sharma',
      role: 'Senior Communication & Debate Educator',
      biography:
        'Senior Communication & Debate Educator with 8+ years of experience mentoring school students for national parliamentary debate circuits. Passionate about helping introverted kids articulate bold thoughts.',
      expertise: 'Public Speaking, Extempore, Debate Structuring, Accent Neutrality, Thought Organization',
      achievements: 'Trained 450+ school speakers; Mentored 14 National Inter-School Debate finalists',
      availability: 'Monday, Wednesday, Friday 4:00 PM - 8:00 PM IST',
      avatar: 'AS',
      rating: '4.98',
    },
    {
      id: 'mentor-2',
      name: 'Afshan Parween',
      role: 'Elocution & Spoken English Specialist',
      biography:
        'National-Level Elocution Bronze Medallist and passionate communication trainer with a B.A. (Honours) in Economics and B.Ed practical training. Specializes in transforming school students (UKG to Grade 10) into confident speakers through interactive speech drills, storytelling, and extempore practice.',
      expertise: 'Spoken English Fluency, Elocution & Speech Clarity, Overcoming Hesitation, Storytelling, Critical Thinking',
      achievements: 'Bronze Medalist at National-Level Elocution Contest (competed against 83 universities); Trained 300+ students in live speech & personality development',
      availability: 'Tuesday, Thursday, Saturday 4:00 PM - 8:00 PM IST',
      avatar: 'AP',
      rating: '4.97',
    },
  ];

  return (
    <div className="bg-[#FAF9F6] text-slate-900">
      {/* Page Header */}
      <section className="bg-slate-900 text-white py-16 lg:py-20 border-b border-slate-800 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Certified Faculty & Mentors</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-heading">
              Trained by National Debaters & Child Speech Mentors
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-body">
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
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Meet Our Senior Lead Mentors
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Active mentors leading live cohorts and personal speech evaluations:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {curatedFaculty.map((teacher) => (
              <div
                key={teacher.id}
                className="p-8 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 font-heading">{teacher.name}</h3>
                      <span className="text-xs font-bold text-amber-700 block mt-0.5">
                        {teacher.role}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-base shrink-0 font-heading">
                      {teacher.avatar}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                    {teacher.biography}
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Areas of Expertise
                      </span>
                      <p className="text-xs font-semibold text-slate-800">{teacher.expertise}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                        Verified Credentials & Track Record
                      </span>
                      <p className="text-xs font-semibold text-slate-800">{teacher.achievements}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Active Cohort Mentor
                  </span>
                  <span className="text-[11px] font-bold text-slate-600">1:8 Batches & 1-on-1 Tracks</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Educators' Approach Section (Bhanzu-Style Visual Grid) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-50/60 via-amber-50/30 to-purple-50/40 p-8 sm:p-14 border border-indigo-100/80 shadow-sm text-center">
          
          {/* Subtle decorative accents */}
          <div className="absolute top-4 left-6 text-2xl opacity-60 pointer-events-none select-none">✈️</div>
          <div className="absolute bottom-6 right-8 text-2xl opacity-60 pointer-events-none select-none">✈️</div>

          <div className="max-w-3xl mx-auto space-y-3 mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading">
              Our Educators' <span className="text-[#F27C00]">Approach</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto">
              How our certified mentors transform quiet, hesitant students into confident, spontaneous communicators.
            </p>
          </div>

          {/* 4 Feature Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto text-center">
            
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xs border border-amber-100 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-100/80 flex items-center justify-center text-3xl shadow-xs">
                💡
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                Fun & Interactive Teaching
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body max-w-xs">
                Engaging online speech games, extempore drills, and fun live prompts that keep young students hooked and excited to speak.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xs border border-amber-100 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-orange-100/80 flex items-center justify-center text-3xl shadow-xs">
                🏰
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                Story-Narrative Curriculum
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body max-w-xs">
                Immersive storytelling frameworks and Oxford debate formats tailored to captivate kids across all ages from UKG to Grade 10.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xs border border-amber-100 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-100/80 flex items-center justify-center text-3xl shadow-xs">
                🔭
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                Personalised Attention
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body max-w-xs">
                Strictly 1:8 intimate batches and 1-on-1 private coaching tracks ensuring every child receives 15+ mins mic time and tailored feedback.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-xs border border-amber-100 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100/80 flex items-center justify-center text-3xl shadow-xs">
                🧱
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                Building Strong Foundations
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body max-w-xs">
                Our approach sharpens impromptu articulation and logical reasoning using the PEEI structure, permanently overcoming stage fear.
              </p>
            </div>

          </div>

          {/* Urgency Floating Pill Capsule */}
          <div className="mt-12 inline-flex flex-col sm:flex-row items-center gap-3 p-2.5 sm:pl-6 rounded-3xl sm:rounded-full bg-white border border-amber-200/90 shadow-lg">
            <span className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
              Hurry up!! Limited batch seats are available
            </span>
            <button
              onClick={onOpenDemoModal}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm font-heading shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Book A Free Demo Class
            </button>
          </div>

        </div>

        {/* 4-Stage Faculty Selection Rigor */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Our 4-Stage Educator Selection Rigor
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Only 2 out of every 100 educator applicants are accepted into upspeaq.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h4 className="text-sm font-bold text-slate-900 font-heading">Speech & Debate Audition</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-body">
                Candidate delivers impromptu speeches and undergoes debate cross-examination by our senior panel.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="text-sm font-bold text-slate-900 font-heading">Live Student Simulation</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-body">
                Applicant teaches a simulated classroom of introverted children to assess their patience, empathy, and coaching style.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h4 className="text-sm font-bold text-slate-900 font-heading">Child Safety & POSH Verification</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-body">
                Rigorous police background checks, identity confirmation, and child online interaction safety certification.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                4
              </span>
              <h4 className="text-sm font-bold text-slate-900 font-heading">Pedagogical Apprenticeship</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-body">
                40 hours of co-teaching with a master educator before ever leading an independent small-group cohort.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-amber-600 text-white rounded-3xl p-8 sm:p-12 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black font-heading">Meet A Mentor in a Free Demo</h3>
            <p className="text-amber-100 text-sm leading-relaxed font-body">
              Experience the mentorship firsthand. A lead educator will conduct a gentle, 1-on-2 speech assessment
              with your child and share detailed constructive feedback.
            </p>
          </div>
          <button
            onClick={onOpenDemoModal}
            className="shrink-0 px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer font-heading"
          >
            BOOK A FREE DEMO
          </button>
        </div>
      </section>
    </div>
  );
};
