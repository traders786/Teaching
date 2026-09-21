import React from 'react';
import { BrandingConfig, Teacher } from '../types';
import { 
  Sparkles, 
  Target, 
  Compass, 
  Users, 
  Mic2, 
  CheckCircle2, 
  Award, 
  HeartHandshake, 
  TrendingUp, 
  ArrowRight, 
  MessageCircle, 
  ShieldCheck, 
  Flame, 
  BookOpen, 
  Star,
  Quote
} from 'lucide-react';

interface AboutUsPageProps {
  branding: BrandingConfig;
  onOpenDemoModal: () => void;
  onNavigateFaculty?: () => void;
  onNavigateCurriculum?: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  branding,
  onOpenDemoModal,
  onNavigateFaculty,
  onNavigateCurriculum,
}) => {
  const whatsappUrl = `https://wa.me/917004132088?text=${encodeURIComponent(
    "Hi Upspeaq! 👋 I read your story on the About Us page and would like to learn more about the live speaking program for my child."
  )}`;

  const milestones = [
    {
      year: '2021',
      title: 'The Genesis',
      tagline: 'Identifying the Root Cause of Speaking Anxiety',
      desc: 'We realized that millions of bright students score 95%+ in written school English exams, but freeze in fear when handed a microphone or asked for an impromptu opinion in front of peers.',
    },
    {
      year: '2022',
      title: 'The 1:8 Speaking Lab',
      tagline: 'Pioneering Micro-Cohorts & PEEI Speech Pedagogy',
      desc: 'Engineered a radically different experiential learning model: strictly capping batches at 8 students to guarantee 15+ minutes of active speaking practice per session.',
    },
    {
      year: '2023',
      title: 'Pan-India & Global Reach',
      tagline: '5,000+ Young Orators Empowered',
      desc: 'Expanded our live interactive curriculum across all 6 age cohorts (UKG to Grade 10), hosting our first National Junior Parliamentary Debate League with students across 20+ states.',
    },
    {
      year: '2024+',
      title: '10,000+ Strong Community',
      tagline: 'Building the Future of Confident Leadership',
      desc: 'Now trusted by 10,000+ students and over 1,200 verified 5-star parent reviews, integrating AI speech feedback alongside personalized 1-on-1 private coaching tracks.',
    },
  ];

  const coreValues = [
    {
      icon: <Mic2 className="w-6 h-6 text-amber-500" />,
      title: 'Voice Before Perfection',
      desc: 'We prioritize articulation, boldness, and expressive flow first. Nuanced grammar naturally solidifies once fear is permanently unlocked.',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-emerald-500" />,
      title: 'Structured Reasoning (PEEI)',
      desc: 'Children learn to structure impromptu thoughts with Point, Evidence, Explanation, and Impact — turning random rambling into persuasive eloquence.',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: 'Small Cohorts & 1-on-1 Tracks',
      desc: 'We refuse 40-student lecture halls. Strictly max 8 kids per live batch (or bespoke 1-on-1 private coaching) ensures every child is heard, mentored, and actively encouraged.',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-rose-500" />,
      title: 'Zero-Judgment Safe Space',
      desc: 'A psychologically safe speaking stage where stumbles are celebrated as courageous learning steps, completely eliminating stage phobia.',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
    },
  ];

  return (
    <div className="bg-[#FAF9F6] text-slate-900 min-h-screen text-left">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-16 pb-20 lg:pt-24 lg:pb-28">
        
        {/* Background glow accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Mission Narrative & CTA */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold font-heading">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>About Upspeaq • Spoken English & Debate Ecosystem</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight text-white font-heading leading-tight">
                We are on a Mission to <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">Eradicate the Fear</span> of Speaking in Every Child.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Most children are taught English through silent memorization and repetitive grammar worksheets. 
                <strong> Upspeaq was founded to change this completely.</strong> We build confident thinkers, extempore orators, 
                and Oxford debaters by giving children what they need most — <em>a live microphone, encouraging peers, and certified mentors.</em>
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={onOpenDemoModal}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm font-heading flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Book a Free Live Demo</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm font-heading flex items-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Chat with Founders</span>
                </a>
              </div>

              {/* Trust Badge Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>1:8 Micro-Batches & 1:1 Private Mentorship</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Trinity & Oxford Aligned Pedagogy</span>
                </div>
              </div>

            </div>

            {/* Right Column: Clean, Elegant Value Card & Parent Testimonial */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-xl">
                
                {/* Clean Feature List */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                      <Mic2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">15+ Mins Guaranteed Mic Time</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Every child speaks actively in every single live session.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">1:8 Micro-Batches & 1:1 Private Coaching</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Choose vibrant peer cohort labs (max 8) or bespoke 1-on-1 private mentoring tracks.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">Trinity & Oxford Pedagogy</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Structured speech frameworks (PEEI) for extempore, debate, and interview mastery.</p>
                    </div>
                  </div>
                </div>

                {/* Subtle Parent Quote Pill */}
                <div className="pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-1 text-amber-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    “My daughter went from shy whispering in class to anchoring her school debate in just 12 weeks.”
                  </p>
                  <p className="text-[11px] text-slate-400 font-semibold mt-2">
                    — Meera Sharma, Parent of Grade 5 Student
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Quick Stats Grid */}
          <div className="mt-14 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-heading">10,000+</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Young Orators Mentored (UKG–10)</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-heading">15+ Mins</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Guaranteed Mic Time Per Child</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-sky-400 font-heading">1:8 & 1-on-1</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Small Batches & 1-on-1 Coaching</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-amber-300 font-heading">4.9 / 5.0</div>
              <div className="text-xs text-slate-400 font-medium mt-1">1,200+ Verified Parent Reviews</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. VISION & MISSION SECTION (Bhanzu-Inspired Duo Cards) */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold font-heading">
            <Target className="w-3.5 h-3.5" />
            <span>Guiding Principles</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading">
            Our Purpose & Vision
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Shaping the next generation of confident Indian children who express their ideas fearlessly on any global stage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Vision Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-slate-700/60 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-heading text-white">
                Our Vision
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                To build a world where <strong>no child ever doubts their voice</strong>. We envision every young learner stepping onto stages, classroom podiums, interview panels, and international debate tournaments with absolute self-belief, articulation, and intellectual courage.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-700/80 flex items-center gap-3 text-xs text-amber-300 font-bold font-heading">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Transforming self-doubt into lifelong confidence</span>
            </div>
          </div>

          {/* Mission Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50/80 text-slate-900 border border-amber-200/80 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-400/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
                Our Mission
              </h3>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                To empower <strong>1 Million school students</strong> across Grades UKG to 10 with genuine conversational fluency, active listening, structured extempore thinking, and Oxford debate mastery through engaging 1:8 live practice cohorts and empathetic coaching.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-amber-200/80 flex items-center gap-3 text-xs text-amber-900 font-bold font-heading">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>Experiential speech learning by doing, not memorizing</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. THE UPSPEAQ PHILOSOPHY: WHY TRADITIONAL METHODS FAIL */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold font-heading">
              <Flame className="w-3.5 h-3.5" />
              <span>The Pedagogy Shift</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-heading">
              Why Traditional English Classes Don't Build Speaking Fluency
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Speaking is a real-time muscle, just like swimming or playing the piano. You cannot master it by reading a textbook in silence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Traditional Method */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/80 border border-red-500/20 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold font-heading">
                <span>❌ The Outdated Way (Rote School System)</span>
              </div>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-black">•</span>
                  <span><strong>40–50 students per classroom</strong> where only the loudest 2–3 kids ever get to speak.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-black">•</span>
                  <span><strong>Passive grammar fill-in-the-blanks</strong> that test memorization rather than real conversational spontaneous thinking.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-black">•</span>
                  <span><strong>Fear of making mistakes</strong> leading to stage fright, stuttering, and self-censorship.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-black">•</span>
                  <span><strong>Zero extempore practice</strong> leaving kids unprepared for debates, interviews, and presentations.</span>
                </li>
              </ul>
            </div>

            {/* The Upspeaq Method */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/60 to-slate-800 border border-emerald-500/30 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-heading">
                <span>✨ The Upspeaq Experiential Way</span>
              </div>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Max 8 Kids per cohort or 1-on-1 Coaching</strong> guaranteeing 15+ minutes of mic practice (100% mentor mic time in 1-on-1) every session.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Live Extempore Drills & Oxford Debates</strong> where students construct original arguments on the spot.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Proprietary PEEI Framework</strong> (Point, Evidence, Explanation, Impact) for clear structured articulation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Psychologically Safe Stage</strong> where teachers act as supportive speech directors rather than strict examiners.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 4. OUR CORE VALUES & PILLARS */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold font-heading">
            <Award className="w-3.5 h-3.5" />
            <span>Pillars of Excellence</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading">
            What Drives Everything We Do
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Four foundational values embedded in every single session, curriculum module, and coach interaction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((val, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl bg-white border ${val.border} shadow-sm hover:shadow-md transition-all space-y-4`}
            >
              <div className={`w-12 h-12 rounded-2xl ${val.bg} flex items-center justify-center`}>
                {val.icon}
              </div>
              <h3 className="text-lg font-black text-slate-900 font-heading">
                {val.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>

      </section>

      {/* 5. OUR JOURNEY / MILESTONES (Bhanzu Timeline Inspiration) */}
      <section className="py-16 lg:py-24 bg-amber-50/50 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/70 text-amber-900 text-xs font-bold font-heading">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Growth & Impact</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading">
              The Journey of Upspeaq
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              From a small pilot speaking circle to India's most loved spoken English and public speaking academy for school kids.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-amber-200/80 shadow-xs space-y-3 relative hover:-translate-y-1 transition-all"
              >
                <div className="text-3xl font-black text-amber-600 font-heading">
                  {m.year}
                </div>
                <div className="text-base font-black text-slate-900 font-heading">
                  {m.title}
                </div>
                <div className="text-xs font-bold text-amber-800 bg-amber-50 py-1 px-2.5 rounded-lg inline-block">
                  {m.tagline}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. FOUNDER'S NOTE / PHILOSOPHY SPOTLIGHT */}
      <section className="py-16 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl relative overflow-hidden border border-slate-700">
          
          <Quote className="w-16 h-16 text-amber-400/20 absolute -top-2 -left-2 pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold font-heading">
              <span>A Note From The Upspeaq Academic Team</span>
            </div>

            <p className="text-base sm:text-xl text-slate-200 leading-relaxed font-serif italic">
              "We built Upspeaq because we saw a heartbreaking paradox: students who could write poetic essays in school exams, yet would break into a nervous sweat when asked to introduce themselves or defend an idea in public. 
              Communication is not about memorizing complex vocabulary — it is about the courage to let your voice be heard. When you empower a child to speak without fear, you don't just improve their English grades; you change the entire trajectory of their confidence for life."
            </p>

            <div className="pt-4 border-t border-slate-700/80">
              <h4 className="font-heading font-black text-white text-base">The Academic & Pedagogy Board</h4>
              <p className="text-xs text-amber-400">Upspeaq Child Speech & Oratory Academy</p>
            </div>

          </div>
        </div>
      </section>

      {/* 7. HIGH-CONVERTING BOTTOM CALL TO ACTION */}
      <section className="py-16 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-950 text-amber-300 text-xs font-black uppercase tracking-wider font-heading">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Join 10,000+ Young Orators</span>
          </span>

          <h2 className="text-3xl sm:text-5xl font-black font-heading text-slate-950 tracking-tight">
            Ready to Hear Your Child Speak with Unstoppable Confidence?
          </h2>

          <p className="text-sm sm:text-base text-slate-900 font-medium max-w-2xl mx-auto leading-relaxed">
            Experience our interactive 1:8 live classroom firsthand. Book a free 45-minute live speaking evaluation with a certified speech coach today.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenDemoModal}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-950 hover:bg-slate-900 text-white font-black text-sm font-heading shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Book a Free Live Demo Class</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/90 hover:bg-white text-slate-950 font-bold text-sm font-heading shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Us: +91 7004132088</span>
            </a>
          </div>

          <div className="pt-4 flex items-center justify-center gap-4 text-xs font-semibold text-slate-900">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              100% Free Demo
            </span>
            <span>•</span>
            <span>No Credit Card Required</span>
            <span>•</span>
            <span>For UKG to Class 10</span>
          </div>

        </div>
      </section>

    </div>
  );
};
