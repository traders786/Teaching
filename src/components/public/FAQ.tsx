import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { BrandingConfig } from '../../types';

export const FAQ: React.FC<{ branding: BrandingConfig }> = ({ branding }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Who can join the program?',
      a: 'The program is tailored for school students across Grades 1 to 10. To ensure age-appropriate discussion and learning comfort, students are separated into distinct peer cohorts: Little Orators (Grades 1–2), Young Storytellers (Grades 3–4), Junior Presenters (Grades 5–6), and Youth Debaters (Grades 7–10).',
    },
    {
      q: 'Do you offer 1-on-1 private coaching classes?',
      a: 'Yes, absolutely! Alongside our interactive small-group cohorts, we offer a dedicated 1-on-1 Private Mentorship Track. In 1-on-1 classes, 100% of the session time is dedicated solely to your child with a certified senior speech coach. It is ideal for children preparing for school speech competitions, Model UN, or introverted students needing a gentle, personalized pace.',
    },
    {
      q: 'What is the difference between Small-Group Batches and 1-on-1 Special Classes?',
      a: 'In Small-Group Batches, students benefit from peer energy, group debates, and extempore cheer with guaranteed active mic practice. In 1-on-1 Private Coaching, your child gets 100% mentor attention, bespoke curriculum pacing, custom debate/interview prep, and fully flexible scheduling.',
    },
    {
      q: 'Are the classes live or pre-recorded videos?',
      a: 'All sessions are 100% live and interactive. Public speaking cannot be learned by passively watching pre-recorded videos. Every class involves live microphone speaking drills, real-time feedback, debates, and vocal modulation coaching.',
    },
    {
      q: 'What is the structure of the live batches?',
      a: 'Our group cohorts strictly maintain an intimate small-group environment. This ensures every single child receives ample direct microphone speaking time, personalized attention, and real-time mentor coaching in every single session.',
    },
    {
      q: 'How long is the course and what is the weekly schedule?',
      a: 'The flagship program runs for 12 weeks (3 months) with 3 classes per week (36 total interactive sessions). Classes are scheduled in convenient evening after-school slots (e.g. 4:30 PM, 5:45 PM, 7:00 PM IST) and weekend morning/evening slots with zero conflict with regular school hours.',
    },
    {
      q: 'What specific skills will my child learn?',
      a: 'Your child will master spoken English fluency, overcoming stage & mic anxiety, voice modulation, impromptu 30-second extempore speaking, structured Oxford debate reasoning (PEEI formula), dramatic storytelling, body language, and leadership communication.',
    },
    {
      q: 'Can we attend a free demo before deciding to enroll?',
      a: 'Yes! We encourage every parent and child to experience our free 45-minute live diagnostic session first. You can select either a group cohort demo or a private 1-on-1 assessment. You only enroll if you love the experience.',
    },
    {
      q: 'Can parents observe the live classes?',
      a: 'Yes! Parents are warmly welcomed to quietly observe all live sessions. We also provide weekly WhatsApp performance reports and conduct parent-mentor reviews to share observable speaking milestones.',
    },
  ];

  return (
    <section id="faq" className="py-14 sm:py-20 bg-[#FBFBFA] border-b border-slate-200 text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-black uppercase tracking-wider font-heading shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Clarity For Families</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium font-body max-w-2xl mx-auto">
            Everything you need to know about our curriculum, live batches, 1-on-1 coaching, and admissions process.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:border-slate-300 transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-black font-heading text-slate-900 hover:text-amber-800 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-amber-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 font-medium font-body leading-relaxed border-t border-slate-100 pt-3.5 animate-fadeIn">
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
