import React from 'react';
import {
  Mic,
  TrendingDown,
  BookOpen,
  AlertTriangle,
  MessageSquareOff,
  Sparkles,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

interface ChildNeedsHelpSignsProps {
  onOpenDemoModal: () => void;
}

export const ChildNeedsHelpSigns: React.FC<ChildNeedsHelpSignsProps> = ({ onOpenDemoModal }) => {
  const signs = [
    {
      id: 1,
      question: 'Does Your Child Fear Speaking In Public?',
      reason: 'It could be their inability to speak English.',
      icon: Mic,
      tag: 'Public Speaking Fear',
      bg: 'bg-[#FEF3C7]/40 border-amber-200 hover:border-amber-300',
      badgeBg: 'bg-amber-100 text-amber-900',
      iconColor: 'bg-amber-500 text-slate-950',
    },
    {
      id: 2,
      question: 'Is your Child’s Academic Performance Declining?',
      reason: 'It could be because of poor writing ability in English.',
      icon: TrendingDown,
      tag: 'Academic Struggles',
      bg: 'bg-[#FDEEE8]/60 border-orange-200 hover:border-orange-300',
      badgeBg: 'bg-orange-100 text-orange-950',
      iconColor: 'bg-orange-500 text-white',
    },
    {
      id: 3,
      question: 'Is Your Child Unable To Understand School Lessons?',
      reason: 'English comprehension is crucial to get the best out of lessons.',
      icon: BookOpen,
      tag: 'Comprehension Gap',
      bg: 'bg-[#EEF4FF]/60 border-blue-200 hover:border-blue-300',
      badgeBg: 'bg-blue-100 text-blue-950',
      iconColor: 'bg-blue-600 text-white',
    },
    {
      id: 4,
      question: 'Does Your Child Stress Before The English Exam?',
      reason: 'They are not confident and school is failing to help.',
      icon: AlertTriangle,
      tag: 'Exam Anxiety',
      bg: 'bg-[#FDF2F8]/60 border-pink-200 hover:border-pink-300',
      badgeBg: 'bg-pink-100 text-pink-950',
      iconColor: 'bg-pink-500 text-white',
    },
    {
      id: 5,
      question: 'Does Your Child Stay Silent In Group Discussions?',
      reason: 'It might be that they lack confidence in their English language proficiency.',
      icon: MessageSquareOff,
      tag: 'Group Hesitation',
      bg: 'bg-[#E8F8F0]/60 border-emerald-200 hover:border-emerald-300',
      badgeBg: 'bg-emerald-100 text-emerald-950',
      iconColor: 'bg-emerald-600 text-white',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider font-heading">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Parental Observations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading tracking-tight">
            Signs That Your Child Needs Help With English
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium font-body max-w-2xl mx-auto">
            Recognizing these common classroom struggles early is the first step toward building lasting speaking confidence.
          </p>
        </div>

        {/* 5 Signs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signs.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-6 sm:p-7 rounded-3xl border-2 ${item.bg} shadow-xs hover:shadow-md transition-all flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-2xl ${item.iconColor} flex items-center justify-center font-bold shadow-2xs group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${item.badgeBg}`}>
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading leading-snug">
                    {item.question}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 mt-3 leading-relaxed font-body font-medium">
                    {item.reason}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-900/10 flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Upspeaq Solves This in 12 Weeks</span>
                </div>
              </div>
            );
          })}

          {/* 6th Card: Quick Diagnosis Callout */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-md flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                Expert Diagnosis
              </span>
              <h3 className="text-xl font-black text-white font-heading mt-3 leading-snug">
                Unsure where your child stands?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed font-body">
                Our speech educators evaluate your child's spoken fluency, vocabulary, and body language during a gentle 45-minute live diagnostic session.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={onOpenDemoModal}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs font-heading flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 shadow-xs"
              >
                <span>Book Free Speech Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Banner Callout: "It's Time For a Change. And We Can Help!" */}
        <div className="mt-10 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-2xl shrink-0 shadow-inner">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h4 className="text-xl sm:text-2xl font-black text-white font-heading">
                It's Time For a Change. And We Can Help!
              </h4>
              <p className="text-xs sm:text-sm text-amber-100 font-medium mt-1 font-body">
                Give your child the confidence to speak clearly, participate boldly, and express ideas without fear.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={onOpenDemoModal}
              className="px-7 py-3.5 rounded-full bg-slate-950 hover:bg-slate-900 text-white text-xs sm:text-sm font-black font-heading border-2 border-slate-950 hover:border-slate-800 flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Book a FREE Demo Class</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
