import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Sparkles, Star } from 'lucide-react';

interface BhanzuStyleCurriculumProps {
  onOpenDemoModal: () => void;
  onNavigateCurriculum: () => void;
}

export const BhanzuStyleCurriculum: React.FC<BhanzuStyleCurriculumProps> = ({
  onOpenDemoModal,
  onNavigateCurriculum,
}) => {
  const [activeTier, setActiveTier] = useState(0);

  const tiers = [
    {
      title: 'Early Explorers',
      grades: 'Grade UKG',
      tagline: 'Phonetics, Vocabulary Songs & Cheerful Expression',
      bgGrad: 'bg-[#FFFBEB] border-amber-300',
      badgeBg: 'bg-amber-100 text-amber-950',
      skills: [
        'Clear English letter-sound phonics and joyful rhyming chants',
        'Polite daily greetings, basic etiquette, and expressing feelings aloud',
        'Picture talk: Naming familiar animals, family members, and colors',
        'Overcoming initial shyness through gentle interactive speaking games',
      ],
      deliverable: 'Speaks simple, cheerful English sentences with clear phonetic pronunciation.',
    },
    {
      title: 'Little Orators',
      grades: 'Grades 1–2',
      tagline: 'Building Conversational Courage & Clear Pronunciation',
      bgGrad: 'bg-[#FEF3C7]/60 border-amber-300',
      badgeBg: 'bg-amber-200 text-amber-950',
      skills: [
        'Overcoming hesitation with friendly conversation drills',
        'Phonics, clear articulation, and sentence cadence training',
        'Show & Tell: Presenting favorite toys and storybooks aloud',
        'Polite social etiquette and answering in complete sentences',
      ],
      deliverable: 'Voluntarily speaks in full sentences and interacts joyfully with peers.',
    },
    {
      title: 'Young Storytellers',
      grades: 'Grades 3–4',
      tagline: 'Dramatic Modulation, Story Arcs & Impromptu Fluency',
      bgGrad: 'bg-[#FDEEE8] border-orange-300',
      badgeBg: 'bg-orange-100 text-orange-950',
      skills: [
        'Eliminating mother-tongue translation pauses',
        'Vocal pitch modulation and dramatic character voices',
        '30-second extempore speaking on surprise topics',
        'Expressive body language and camera eye contact',
      ],
      deliverable: 'Delivers 2-minute animated stories without freezing or script dependence.',
    },
    {
      title: 'Junior Presenters',
      grades: 'Grades 5–6',
      tagline: 'PEEI Logic, Structured Presentations & Polite Disagreement',
      bgGrad: 'bg-[#EEF4FF] border-blue-300',
      badgeBg: 'bg-blue-100 text-blue-950',
      skills: [
        'PEEI framework (Point • Explain • Example • Impact)',
        'Structuring visual slide presentations for school projects',
        'Group discussions and polite counter-argumentation',
        'Handling spontaneous audience questions with poise',
      ],
      deliverable: 'Leads classroom presentations and articulates opinions with logical clarity.',
    },
    {
      title: 'Youth Debaters',
      grades: 'Grades 7–8',
      tagline: 'Oxford Parliamentary Debate, Rhetoric & Stage Presence',
      bgGrad: 'bg-[#E8F8F0] border-emerald-300',
      badgeBg: 'bg-emerald-100 text-emerald-950',
      skills: [
        'Formal parliamentary debate rules and rapid rebuttals',
        'Persuasive hooks and emotional connection techniques',
        'Stage projection and elimination of filler words ("um", "like")',
        'School council speech delivery and panel discussions',
      ],
      deliverable: 'Commands inter-school debate podiums and assembly stages with authority.',
    },
    {
      title: 'Senior Orators',
      grades: 'Grades 9–10',
      tagline: 'Model UN (MUN), Critical Rhetoric & Leadership Discourse',
      bgGrad: 'bg-[#F5EEFD] border-purple-300',
      badgeBg: 'bg-purple-100 text-purple-950',
      skills: [
        'Model UN (MUN) diplomacy, position papers, and caucus debates',
        'High-stakes group discussions (GDs) and interview readiness',
        'Advanced critical reasoning, fallacies, and rebuttal mastery',
        'Keynote speech delivery and executive communication poise',
      ],
      deliverable: 'Delivers compelling keynote speeches and excels in competitive GDs and Model UN.',
    },
  ];

  const current = tiers[activeTier];

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-black uppercase tracking-wider font-heading shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Age-Tailored Learning Path</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading tracking-tight">
            Grade-Wise Spoken English Curriculum
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium font-body max-w-2xl mx-auto">
            Children learn best among cognitive peers. Our progressive curriculum is tailored across 6 stages from <strong className="text-slate-900 font-bold">UKG to Class 10</strong>.
          </p>
        </div>

        {/* 6 Grade Tabs (UKG, 1-2, 3-4, 5-6, 7-8, 9-10) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {tiers.map((t, idx) => {
            const isSelected = activeTier === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveTier(idx)}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50 shadow-md scale-[1.02]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="text-[11px] sm:text-xs font-black text-amber-700 uppercase tracking-wider font-heading">
                  {t.grades}
                </div>
                <div className="text-xs sm:text-sm font-black text-slate-900 font-heading mt-0.5 leading-tight">
                  {t.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Curriculum Showcase Card */}
        <div className={`rounded-3xl p-6 sm:p-10 border-2 ${current.bgGrad} shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center`}>
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${current.badgeBg} font-heading`}>
                {current.grades} • {current.title}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              {current.tagline}
            </h3>

            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-black text-slate-700 uppercase tracking-wider font-heading">
                What Your Child Will Master:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {current.skills.map((skill, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tangible Outcome */}
            <div className="mt-4 p-4 rounded-2xl bg-white/90 border border-slate-200/80 flex items-center gap-3">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Visible Milestone:
                </div>
                <div className="text-sm font-bold text-slate-900">{current.deliverable}</div>
              </div>
            </div>
          </div>

          {/* Right Action Card */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border-2 border-slate-200 text-center space-y-3 shadow-xs">
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider font-heading">
              Interactive Live Cohort
            </div>
            <div className="text-lg font-black text-slate-900 font-heading">
              Experience the {current.grades} Live Batch
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Join a 45-minute live diagnostic session to assess your child's spoken fluency baseline.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenDemoModal}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm font-heading flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Book Free Class</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
