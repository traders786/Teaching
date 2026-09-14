import React from 'react';
import { Volume2, Award, Users, Scale, ShieldCheck } from 'lucide-react';

export const WhatStudentsLearn: React.FC = () => {
  const modules = [
    {
      icon: <Volume2 className="w-6 h-6 text-amber-700" />,
      tag: 'Core Fluency',
      title: 'Spoken English & Pronunciation',
      description:
        'Building effortless English conversational ability. Eliminating fillers like "um" and "like", correcting pronunciation, expanding active everyday vocabulary, and practicing speaking in complete, grammatically sound thoughts.',
      outcomes: ['Vocabulary in daily contexts', 'Sentence flow & rhythm', 'Neutral, intelligible pronunciation'],
    },
    {
      icon: <Award className="w-6 h-6 text-amber-700" />,
      tag: 'Stage & Presentation',
      title: 'Public Speaking & Presentation',
      description:
        'Crafting speeches that keep listeners hooked. Students master audience eye contact, vocal modulation (pitch and pace variation), opening hooks, narrative storytelling, and formal presentation presence.',
      outcomes: ['3-minute prepared speeches', 'Vocal projection & pacing', 'Engaging opening & closing techniques'],
    },
    {
      icon: <Users className="w-6 h-6 text-amber-700" />,
      tag: 'Social Intelligence',
      title: 'Interpersonal Communication Skills',
      description:
        'Learning how to listen actively, ask insightful questions, give and receive constructive peer feedback, and hold meaningful conversations with teachers, elders, and peers with polite assertiveness.',
      outcomes: ['Active listening habits', 'Polite assertiveness', 'Collaborative group discussions'],
    },
    {
      icon: <Scale className="w-6 h-6 text-amber-700" />,
      tag: 'Logical Rigor',
      title: 'Debate, Reasoning & Rebuttal',
      description:
        'Teaching students how to think on their feet. Moving beyond emotional arguing into structured debate: Point, Explanation, Evidence, and Impact (PEEI) framework with respectful rebuttal of opposing viewpoints.',
      outcomes: ['Extempore speaking (instant topics)', 'Structured debate argumentation', 'Critical thinking under time limit'],
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-700" />,
      tag: 'Inner Strength',
      title: 'Unshakeable Confidence Building',
      description:
        'Overcoming the psychological dread of making mistakes in public. Creating an encouraging safe zone where every student speaks in every class, normalizing trial and celebrating courageous attempts.',
      outcomes: ['Overcoming fear of judgment', 'Poised posture and hand gestures', 'Self-assurance in unfamiliar settings'],
    },
  ];

  return (
    <section id="curriculum" className="py-20 bg-[#FBFBFA] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
            Curriculum Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            5 Essential Pillars of Confident Youth Communication
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            A carefully sequenced 3-month curriculum designed specifically for young minds from Class 4 to Class 12,
            balancing theoretical frameworks with 80% hands-on speaking exercises.
          </p>
        </div>

        {/* Modular Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {modules.slice(0, 3).map((mod, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200/90 p-7 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                    {mod.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-md">
                    {mod.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{mod.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{mod.description}</p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 block mb-2">Key Competencies:</span>
                <ul className="text-xs text-slate-500 space-y-1.5">
                  {mod.outcomes.map((item, oidx) => (
                    <li key={oidx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom 2 wider cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {modules.slice(3, 5).map((mod, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200/90 p-7 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                    {mod.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-md">
                    {mod.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{mod.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{mod.description}</p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 block mb-2">Key Competencies:</span>
                <ul className="text-xs text-slate-500 space-y-1.5">
                  {mod.outcomes.map((item, oidx) => (
                    <li key={oidx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
