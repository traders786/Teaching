import React, { useState } from 'react';
import { BrandingConfig } from '../types';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Mic,
  MessageSquare,
  Award,
  Clock,
  Layers,
  FileText,
  Volume2,
  Flame,
} from 'lucide-react';

interface CurriculumPageProps {
  branding: BrandingConfig;
  onOpenDemoModal: () => void;
}

export const CurriculumPage: React.FC<CurriculumPageProps> = ({ branding, onOpenDemoModal }) => {
  const [activeStage, setActiveStage] = useState<'junior' | 'middle' | 'senior'>('junior');

  const stageData = {
    junior: {
      tag: 'Class 4 to Class 6 (Ages 9–11)',
      title: 'Foundation: Expression & Fear Eradication',
      description:
        'Focuses on unlocking childhood hesitation, teaching breathing mechanics, dynamic vocal variety, and storytelling so children eagerly raise their hand in school.',
      outcomes: [
        'Overcoming freeze response when called upon in class',
        'Vocal projection without shouting (diaphragmatic breathing)',
        '3-part personal storytelling (Hook, Journey, Climax)',
        'Poise and confident posture during show-and-tell',
        'Eliminating fillers like "umm", "aaa", and looking away',
      ],
      topics: [
        { week: 'Weeks 1–2', title: 'Body Language & The Brave Stance', desc: 'Eye contact drills, smiling, hand gestures, and conquering camera/podium fright.' },
        { week: 'Weeks 3–4', title: 'Voice & Modulation Studio', desc: 'Pitch variations, avoiding monotone speech, pacing, and clear English phonetics.' },
        { week: 'Weeks 5–8', title: 'Storytelling & Imagination', desc: 'Narrative structure, descriptive vocabulary, and engaging a live audience.' },
        { week: 'Weeks 9–12', title: 'Mini-Speeches & Junior Showcase', desc: 'Speaking for 2 minutes on favorite subjects, handling applause, and certificate speech.' },
      ],
      exercises: [
        { name: 'The 60-Second Emotion Pivot', detail: 'Student tells a simple story switching emotion from curious to excited on educator cue.' },
        { name: 'Object Extempore', detail: 'Child picks a household object and speaks on its imaginary secret superpower for 90 seconds.' },
      ],
    },
    middle: {
      tag: 'Class 7 to Class 9 (Ages 12–14)',
      title: 'Intermediate: Logic, Extempore & Persuasion',
      description:
        'Teaches students how to structure raw thoughts under pressure using the PEEL framework, think on their feet, and present arguments with intellectual poise.',
      outcomes: [
        'Impromptu speaking with just 30 seconds of prep time',
        'Structuring ideas into Point, Explanation, Example, and Link',
        'Debating opposing views without anger or interruption',
        'Active listening and extracting rebuttal counter-points',
        'Commanding attention in school elocution competitions',
      ],
      topics: [
        { week: 'Weeks 1–2', title: 'The PEEL Thought Architecture', desc: 'How to structure opinions logically so listeners understand without getting confused.' },
        { week: 'Weeks 3–4', title: 'Extempore (Impromptu Speaking)', desc: 'Frameworks to speak for 3 minutes on any surprise topic without pausing or blanking out.' },
        { week: 'Weeks 5–8', title: 'Oxford Debate Fundamentals', desc: 'Constructing arguments, formulating counter-arguments, and respectful refutation.' },
        { week: 'Weeks 9–12', title: 'Persuasive Speech & Debates', desc: 'Simulated debates on real-world school topics and student leadership elections.' },
      ],
      exercises: [
        { name: 'Devil’s Advocate Round', detail: 'Students must defend an unpopular opinion for 2 minutes using factual reasoning.' },
        { name: 'Speed Extempore', detail: '30 seconds prep on topics like "Should homework be banned?" with clear PEEL delivery.' },
      ],
    },
    senior: {
      tag: 'Class 10 to Class 12 (Ages 15–18)',
      title: 'Advanced: Leadership, Parliamentary Debate & Viva Poise',
      description:
        'Prepares young adults for university admissions, college vivas, Model United Nations, and senior leadership roles with high-caliber rhetoric.',
      outcomes: [
        'Parliamentary & Asian Parliamentary debating techniques',
        'Handling difficult cross-examinations and spontaneous Q&A',
        'Interview and viva presentation poise under pressure',
        'Diplomatic diplomacy, negotiation, and formal oratory',
        'Gravitas, nuanced tone control, and storytelling for impact',
      ],
      topics: [
        { week: 'Weeks 1–2', title: 'Senior Rhetoric & World Debates', desc: 'Aristotelian appeals (Ethos, Pathos, Logos) and parliamentary debating formats.' },
        { week: 'Weeks 3–4', title: 'Crisis Speech & Diplomacy', desc: 'Model UN delegate preparation, point of order protocols, and impromptu diplomacy.' },
        { week: 'Weeks 5–8', title: 'College Viva & Interview Prep', desc: 'Answering high-stakes questions calmly, framing personal strengths, and executive presence.' },
        { week: 'Weeks 9–12', title: 'Senior Capstone & Keynote', desc: 'Writing and delivering a 5-minute TED-style keynote speech assessed by senior debate judges.' },
      ],
      exercises: [
        { name: 'Press Conference Simulation', detail: 'Student acts as a spokesperson facing rapid-fire tough questions from peer journalists.' },
        { name: 'The 3-Minute Keynote', detail: 'TED-style presentation on a student passion project with slides and professional posture.' },
      ],
    },
  };

  const active = stageData[activeStage];

  return (
    <div className="bg-[#FAF9F6] text-slate-900">
      {/* Page Header */}
      <section className="bg-slate-900 text-white py-16 lg:py-20 border-b border-slate-800 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Full Curriculum & Pedagogical Roadmap</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Class 4 to Class 12 Speech & Confidence Syllabus
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Carefully calibrated by national debaters and child speech educators to take school students
              from anxious hesitation to articulate, confident leaders.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                36 Live Practical Sessions
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                Max 8 Students Per Cohort
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                Weekly Progress Reports
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Grade Selector Tabs */}
      <section className="py-8 bg-white border-b border-slate-200 sticky top-20 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={() => setActiveStage('junior')}
              className={`px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeStage === 'junior'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Class 4 – 6 (Foundation)
            </button>
            <button
              onClick={() => setActiveStage('middle')}
              className={`px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeStage === 'middle'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Class 7 – 9 (Intermediate)
            </button>
            <button
              onClick={() => setActiveStage('senior')}
              className={`px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeStage === 'senior'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Class 10 – 12 (Advanced)
            </button>
          </div>
        </div>
      </section>

      {/* Active Stage Deep Dive */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-6 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
              {active.tag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{active.title}</h2>
            <p className="text-slate-600 text-base leading-relaxed max-w-3xl">{active.description}</p>
          </div>

          {/* Outcomes */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Key Transformative Outcomes</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {active.outcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/40 border border-amber-100">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-medium text-slate-800">{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Week by Week Schedule */}
          <div className="space-y-6 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-700" />
              <span>12-Week Syllabus Breakdown</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {active.topics.map((t, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800">
                    {t.week}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">{t.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Class Exercises */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-600" />
              <span>Signature Classroom Drills</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {active.exercises.map((ex, i) => (
                <div key={i} className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <strong className="text-sm font-bold text-slate-900 block">{ex.name}</strong>
                  <p className="text-xs text-slate-600">{ex.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The 4 Core Pedagogical Pillars */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black">The 4 Pillars of Speech Mastery</h3>
            <p className="text-slate-300 text-xs sm:text-sm">
              Our holistic methodology ensures speaking skills become second nature, lasting a lifetime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="text-base font-bold text-white">Vocal Mechanics</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Diaphragmatic breath control, projection without straining, pausing for dramatic impact, and pronunciation clarity.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="text-base font-bold text-white">Thought Architecture</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Organizing complex thoughts in seconds using PEEL frameworks, opening hooks, and memorable call-to-action conclusions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="text-base font-bold text-white">Non-Verbal Presence</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Eye contact mastery on screen and stage, eliminating restless fidgeting, and natural open hand gesturing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                4
              </div>
              <h4 className="text-base font-bold text-white">Psychological Poise</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Reframing performance anxiety into positive energy, recovering smoothly from mistakes, and welcoming audience questions.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Assessment Call to Action Banner */}
        <div className="bg-amber-600 text-white rounded-3xl p-8 sm:p-12 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black">Experience The Curriculum in Action</h3>
            <p className="text-amber-100 text-sm leading-relaxed">
              Book a free 45-minute live demo session. Our certified speech mentor will evaluate your child's baseline
              and provide an instant tailored speech roadmap.
            </p>
          </div>
          <button
            onClick={onOpenDemoModal}
            className="shrink-0 px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            BOOK FREE 45-MIN DEMO
          </button>
        </div>
      </section>
    </div>
  );
};
