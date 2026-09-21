import React from 'react';
import { TrendingUp, Users, Video, Star, Award } from 'lucide-react';

export const BhanzuStyleImpact: React.FC = () => {
  const stats = [
    {
      value: '4x Faster',
      label: 'Spoken English Fluency',
      sub: 'Through extempore drills',
      icon: TrendingUp,
      color: 'bg-amber-100 text-amber-800',
    },
    {
      value: '10,000+',
      label: 'Young Orators Mentored',
      sub: 'Across Grades 1 to 10',
      icon: Users,
      color: 'bg-purple-100 text-purple-800',
    },
    {
      value: '1:1 & Batches',
      label: 'Small Groups & 1-on-1',
      sub: 'Personal & cohort speech tracks',
      icon: Video,
      color: 'bg-emerald-100 text-emerald-800',
    },
    {
      value: '4.9 / 5',
      label: 'Parent Rating',
      sub: 'From 1,200+ verified families',
      icon: Star,
      color: 'bg-rose-100 text-rose-800',
    },
  ];

  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bhanzu Pill Credibility Container */}
        <div className="rounded-3xl bg-[#FEF3C7]/40 border-2 border-amber-200/80 p-6 sm:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={i} className="flex flex-col items-center justify-center p-2">
                  <div className={`w-12 h-12 rounded-2xl ${st.color} flex items-center justify-center mb-3 shadow-2xs`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">
                    {st.value}
                  </div>
                  <div className="text-sm font-bold text-slate-800 mt-1 font-heading">
                    {st.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 font-medium">
                    {st.sub}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
