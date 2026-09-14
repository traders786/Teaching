import React from 'react';
import { CalendarCheck, Video, Users2, Sparkles, TrendingUp } from 'lucide-react';

export const HowItWorks: React.FC<{ onOpenDemoModal: () => void }> = ({ onOpenDemoModal }) => {
  const steps = [
    {
      num: '1',
      icon: <CalendarCheck className="w-5 h-5 text-amber-700" />,
      title: 'Book a Free Demo',
      description: 'Fill out the 60-second request with student and parent details. No upfront payment required.',
    },
    {
      num: '2',
      icon: <Video className="w-5 h-5 text-amber-700" />,
      title: 'Attend Live Evaluation Demo',
      description:
        'A certified educator interacts directly with your child in a 2-student micro session to evaluate speaking baseline.',
    },
    {
      num: '3',
      icon: <Users2 className="w-5 h-5 text-amber-700" />,
      title: 'Join an 8-Student Batch',
      description:
        'Placed with peers of matching grade (Junior: Class 4-7 or Senior: Class 8-12) for healthy engagement.',
    },
    {
      num: '4',
      icon: <Sparkles className="w-5 h-5 text-amber-700" />,
      title: 'Practice 3x Live Weekly',
      description:
        'Active speaking in every single class: extempore, speech delivery, structured debates, and feedback.',
    },
    {
      num: '5',
      icon: <TrendingUp className="w-5 h-5 text-amber-700" />,
      title: 'Notice Visible Transformation',
      description:
        'Your child steps up on stage, participates in school discussions, and communicates with poised self-assurance.',
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
            Step-by-Step Pathway
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How The Journey Unfolds For Your Child
          </h2>
          <p className="text-base text-slate-600">
            A transparent, supportive process designed so both parents and students feel completely comfortable.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col items-start space-y-3"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-2xs">
                  {step.icon}
                </div>
                <span className="text-xl font-black text-amber-600/40">0{step.num}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">{step.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenDemoModal}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-semibold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>Start Step 1: Book Free Demo Session</span>
          </button>
        </div>
      </div>
    </section>
  );
};
