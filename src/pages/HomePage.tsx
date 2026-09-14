import React from 'react';
import { BrandingConfig, Course, Teacher } from '../types';
import { Hero } from '../components/public/Hero';
import { WhyCommunication } from '../components/public/WhyCommunication';
import { WhatStudentsLearn } from '../components/public/WhatStudentsLearn';
import { HowItWorks } from '../components/public/HowItWorks';
import { SmallBatchAdvantage } from '../components/public/SmallBatchAdvantage';
import { MeetEducators } from '../components/public/MeetEducators';
import { ProgramPricing } from '../components/public/ProgramPricing';
import { Testimonials } from '../components/public/Testimonials';
import { FAQ } from '../components/public/FAQ';
import { ArrowRight, BookOpen, Users, Award, CheckCircle } from 'lucide-react';

interface HomePageProps {
  branding: BrandingConfig;
  courses: Course[];
  teachers: Teacher[];
  onOpenDemoModal: () => void;
  onNavigatePage: (page: 'home' | 'curriculum' | 'batches' | 'faculty' | 'pricing' | 'faq') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  branding,
  courses,
  teachers,
  onOpenDemoModal,
  onNavigatePage,
}) => {
  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <Hero
        branding={branding}
        onOpenDemoModal={onOpenDemoModal}
        onExploreProgram={() => onNavigatePage('curriculum')}
      />

      {/* 2. Quick Navigation Bento / Program Cards */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Explore Our Comprehensive Learning Model
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Every detail is engineered so school students from Class 4 to 12 develop authentic voice and courage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => onNavigatePage('curriculum')}
              className="group p-6 rounded-2xl bg-amber-50/50 hover:bg-amber-50 border border-amber-200/80 hover:border-amber-300 transition-all cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-4 shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                Class 4–12 Curriculum
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                From overcoming stage shyness in junior school to parliamentary debating & interview poise in high school.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
                <span>View Full 12-Week Syllabus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={() => onNavigatePage('batches')}
              className="group p-6 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4 shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                Strict 8-Student Batches
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Why 30-student webinars fail: here every child speaks for 15+ minutes per session with individual teacher guidance.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-800 group-hover:translate-x-1 transition-transform">
                <span>Understand The 8-Student Model</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={() => onNavigatePage('pricing')}
              className="group p-6 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200/80 hover:border-emerald-300 transition-all cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center mb-4 shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                ₹4,999 Flagship Program
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                36 live sessions over 3 months with speech recordings, certification, and 100% money-back guarantee.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                <span>See Pricing & Schedules</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Communication Matters */}
      <WhyCommunication />

      {/* 4. What Students Learn */}
      <WhatStudentsLearn />

      {/* 5. How It Works */}
      <HowItWorks onOpenDemoModal={onOpenDemoModal} />

      {/* 6. Small Batch Advantage */}
      <SmallBatchAdvantage branding={branding} />

      {/* 7. Faculty Teaser */}
      <MeetEducators teachers={teachers} />

      {/* 8. Pricing & Plans */}
      <ProgramPricing
        branding={branding}
        courses={courses}
        onOpenDemoModal={onOpenDemoModal}
      />

      {/* 9. Parent Testimonials */}
      <Testimonials />

      {/* 10. FAQs */}
      <FAQ branding={branding} />
    </div>
  );
};
