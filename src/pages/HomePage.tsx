import React from 'react';
import { BrandingConfig, Course, Teacher } from '../types';

// Bhanzu-Style Playful Public Components for Upspeaq Spoken English
import { BhanzuStyleHero } from '../components/public/BhanzuStyleHero';
import { BhanzuStyleImpact } from '../components/public/BhanzuStyleImpact';
import { HeroBookingForm } from '../components/public/HeroBookingForm';
import { ChildNeedsHelpSigns } from '../components/public/ChildNeedsHelpSigns';
import { BhanzuStyleBento } from '../components/public/BhanzuStyleBento';
import { BhanzuStyleRoadmap } from '../components/public/BhanzuStyleRoadmap';
import { BhanzuStyleCurriculum } from '../components/public/BhanzuStyleCurriculum';
import { ProgramPricing } from '../components/public/ProgramPricing';
import { Testimonials } from '../components/public/Testimonials';
import { FAQ } from '../components/public/FAQ';
import { BhanzuStyleCTA } from '../components/public/BhanzuStyleCTA';
import { BhanzuStyleStickyBar } from '../components/public/BhanzuStyleStickyBar';

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
    <div className="space-y-0 text-slate-900 bg-white">
      
      {/* 1. Large Hero Card with Speaking Lab */}
      <BhanzuStyleHero
        branding={branding}
        onOpenDemoModal={onOpenDemoModal}
        onExploreProgram={() => onNavigatePage('curriculum')}
      />

      {/* 2. Numbers & Impact Credibility Strip */}
      <BhanzuStyleImpact />

      {/* 3. Hero Booking Form */}
      <HeroBookingForm onOpenDemoModal={onOpenDemoModal} />

      {/* 4. Signs That Your Child Needs Help With English (Placed just below the form) */}
      <ChildNeedsHelpSigns onOpenDemoModal={onOpenDemoModal} />

      {/* 5. 4 Soft Pastel Bento Cards (Studio, Storytelling, Debate, Small Batch) */}
      <BhanzuStyleBento onOpenDemoModal={onOpenDemoModal} />

      {/* 6. Step-by-Step Learning Roadmap */}
      <BhanzuStyleRoadmap onOpenDemoModal={onOpenDemoModal} />

      {/* 7. Grade 1–10 Interactive Curriculum Tabs */}
      <BhanzuStyleCurriculum
        onOpenDemoModal={onOpenDemoModal}
        onNavigateCurriculum={() => onNavigatePage('curriculum')}
      />

      {/* 7. Course Pricing & Flagship Program Details */}
      <ProgramPricing
        branding={branding}
        courses={courses}
        onOpenDemoModal={onOpenDemoModal}
      />

      {/* 10. Verified Parent Testimonials */}
      <Testimonials />

      {/* 11. Frequently Asked Questions */}
      <FAQ branding={branding} />

      {/* 12. Final High-Converting 3D Demo Booking Banner */}
      <BhanzuStyleCTA onOpenDemoModal={onOpenDemoModal} />

      {/* 13. Mobile Sticky 3D Demo Button */}
      <BhanzuStyleStickyBar onOpenDemoModal={onOpenDemoModal} />

    </div>
  );
};
