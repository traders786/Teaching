import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BrandingConfig } from '../../types';

export const FAQ: React.FC<{ branding: BrandingConfig }> = ({ branding }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Who can join the program?',
      a: 'The program is tailored for school students from Class 4 to Class 12. To ensure age-appropriate discussion and learning comfort, students are separated into distinct cohorts: Junior Orators (Class 4 to 7) and Senior Debaters (Class 8 to 12).',
    },
    {
      q: 'Are the classes live or pre-recorded videos?',
      a: 'All sessions are 100% live and interactive. Public speaking cannot be learned by passively watching pre-recorded videos. Every class involves live speaking drills, real-time feedback, debates, and vocal modulation coaching.',
    },
    {
      q: `How many students are in each batch?`,
      a: `Our batches strictly adhere to a target of ${branding.classBatchTargetSize} students (with an absolute cap of ${branding.classBatchMaxSize}). This ensures every single child receives 20+ minutes of direct microphone speaking time each week.`,
    },
    {
      q: 'How long is the course and what is the weekly schedule?',
      a: 'The flagship course runs for 3 months (12 weeks) with 3 classes per week, totaling 36 live interactive sessions. Classes are scheduled in after-school evening slots (e.g. 5:00 PM - 6:00 PM or 6:30 PM - 7:30 PM IST) and weekend slots to ensure zero conflict with regular school hours.',
    },
    {
      q: 'What specific skills will my child learn?',
      a: 'Your child will master spoken English fluency, overcoming stage anxiety, vocal modulation, impromptu extempore speaking, structured debate reasoning (PEEI framework), audience eye contact, and polite, persuasive self-expression.',
    },
    {
      q: 'Can we attend a demo before deciding to enroll?',
      a: 'Yes, absolutely! We encourage every parent and child to experience our free 45-minute live demo session first. The educator will evaluate your child’s baseline and provide actionable speaking guidance. You only pay if you decide to proceed with full enrollment.',
    },
    {
      q: 'Can parents observe the live classes?',
      a: 'Yes! Parents are welcome to quietly observe the sessions. We also conduct dedicated parent-teacher progress reviews every 4 weeks to share qualitative feedback and celebrate noticeable speaking milestones.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-[#FBFBFA] border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        {/* Header */}
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
            Clarity For Families
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600">
            Everything you need to know about our curriculum, live batches, and admissions process.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200/90 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-amber-800 transition-colors"
                >
                  <span className="text-base">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-amber-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
