import React from 'react';
import { MessageSquare, Trophy, BrainCircuit, HeartHandshake, Mic2, Compass } from 'lucide-react';

export const WhyCommunication: React.FC = () => {
  const points = [
    {
      icon: <Mic2 className="w-5 h-5 text-amber-700" />,
      title: 'Conquering Class Hesitation & Stage Fear',
      description:
        'Many bright students know the answers in school exams but freeze when the teacher calls their name or during school assembly speeches. We turn stage fear into natural confidence.',
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-amber-700" />,
      title: 'Spoken English Fluency Without Translation Lag',
      description:
        'Children often pause because they think in their mother tongue and translate mentally. Consistent live practice helps them form English sentences instinctively and smoothly.',
    },
    {
      icon: <BrainCircuit className="w-5 h-5 text-amber-700" />,
      title: 'Structured Thinking & Debate Reasoning',
      description:
        'Speaking well is not merely using grand vocabulary. It is organizing thoughts: stating a point clearly, backing it with an example, and addressing counter-arguments calmly.',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-amber-700" />,
      title: 'Healthy Self-Expression & Emotional Intelligence',
      description:
        'Children who communicate clearly build stronger friendships, resolve peer conflicts constructively, and share their concerns with parents without bottling up frustration.',
    },
    {
      icon: <Trophy className="w-5 h-5 text-amber-700" />,
      title: 'Competitive School & College Readiness',
      description:
        'From Model United Nations (MUNs) and inter-school debates to Olympiad presentations and entrance interviews, articulate children naturally command respect and opportunity.',
    },
    {
      icon: <Compass className="w-5 h-5 text-amber-700" />,
      title: 'Lifelong Leadership Persona',
      description:
        'Technical knowledge gets updated, but the power to present an idea convincingly and lead a group is an enduring superpower that stays with your child throughout life.',
    },
  ];

  return (
    <section id="why-it-matters" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
            A Message To Every Parent
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Marks Open Doors. Communication Carries Them Through.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            In today's competitive world, having knowledge in the notebook is only half the battle. If a child
            cannot express their thoughts with clarity, composure, and courage, their true potential stays hidden.
          </p>
        </div>

        {/* 6 Key Transformations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {points.map((point, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-stone-50/70 border border-stone-200/80 hover:border-amber-300 hover:bg-amber-50/30 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-2xs">
                  {point.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">{point.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
