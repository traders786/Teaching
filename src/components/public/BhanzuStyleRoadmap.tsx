import React from 'react';
import { Play, Sparkles, Trophy, ArrowRight } from 'lucide-react';

interface BhanzuStyleRoadmapProps {
  onOpenDemoModal: () => void;
}

export const BhanzuStyleRoadmap: React.FC<BhanzuStyleRoadmapProps> = ({ onOpenDemoModal }) => {
  const milestones = [
    {
      step: 1,
      title: 'Reading comprehension',
      desc: 'Active listening & phonetic clarity',
      position: 'bottom',
      color: 'bg-blue-600 border-blue-200 text-white',
      pinColor: 'text-blue-600',
      badgeBg: 'bg-blue-50 text-blue-900 border-blue-200',
      xPercent: 18,
    },
    {
      step: 2,
      title: 'Oral storytelling',
      desc: 'Visual ideation & voice modulation',
      position: 'top',
      color: 'bg-orange-500 border-orange-200 text-white',
      pinColor: 'text-orange-500',
      badgeBg: 'bg-orange-50 text-orange-950 border-orange-200',
      xPercent: 34,
    },
    {
      step: 3,
      title: 'Public speaking',
      desc: 'Extempore drills & microphone confidence',
      position: 'bottom',
      color: 'bg-amber-500 border-amber-200 text-slate-950',
      pinColor: 'text-amber-500',
      badgeBg: 'bg-amber-50 text-amber-950 border-amber-200',
      xPercent: 50,
    },
    {
      step: 4,
      title: 'Learn grammar',
      desc: 'Natural sentence framing & articulation',
      position: 'top',
      color: 'bg-blue-500 border-blue-200 text-white',
      pinColor: 'text-blue-500',
      badgeBg: 'bg-blue-50 text-blue-950 border-blue-200',
      xPercent: 66,
    },
    {
      step: 5,
      title: 'Explore writing',
      desc: 'Structured thought & PEEI logic',
      position: 'bottom',
      color: 'bg-orange-600 border-orange-200 text-white',
      pinColor: 'text-orange-600',
      badgeBg: 'bg-orange-50 text-orange-950 border-orange-200',
      xPercent: 82,
    },
    {
      step: 6,
      title: 'Create story plots',
      desc: 'Debate rhetoric & leadership stage poise',
      position: 'top',
      color: 'bg-amber-500 border-amber-200 text-slate-950',
      pinColor: 'text-amber-500',
      badgeBg: 'bg-amber-50 text-amber-950 border-amber-200',
      xPercent: 94,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Road Map Card Container */}
        <div className="rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-b from-[#F0F6FF] via-[#F6F9FE] to-[#EEF5FF] border-2 border-blue-100/80 p-6 sm:p-10 lg:p-12 shadow-xs relative overflow-hidden text-center">
          
          {/* Subtle Background Clouds & Hills SVG */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <svg className="w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none" fill="none">
              {/* Soft Hills */}
              <path d="M0 450 Q300 380 600 440 T1200 420 L1200 600 L0 600 Z" fill="#E2EDFF" />
              <path d="M0 500 Q400 450 800 490 T1200 470 L1200 600 L0 600 Z" fill="#D6E6FF" />
              {/* Soft Clouds */}
              <circle cx="150" cy="120" r="45" fill="white" opacity="0.8" />
              <circle cx="180" cy="110" r="55" fill="white" opacity="0.9" />
              <circle cx="220" cy="125" r="40" fill="white" opacity="0.8" />
              <circle cx="1020" cy="90" r="50" fill="white" opacity="0.8" />
              <circle cx="1060" cy="80" r="60" fill="white" opacity="0.9" />
              <circle cx="1100" cy="95" r="45" fill="white" opacity="0.8" />
            </svg>
          </div>

          {/* Section Header */}
          <div className="relative z-10 max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading tracking-tight">
              Step-by-Step <span className="text-orange-500">Learning Roadmap</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-medium font-body max-w-2xl mx-auto">
              Build English confidence in 4 months, achieve mastery in 8 months, and apply English in diverse fields over 18 months.
            </p>
          </div>

          {/* Desktop/Tablet Horizontal Winding Road View (Hidden on mobile) */}
          <div className="relative z-10 hidden md:block my-8 max-w-6xl mx-auto min-h-[340px]">
            
            {/* Left Mascot Character (Girl) */}
            <div className="absolute -left-2 sm:left-2 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
              <div className="w-18 h-26 sm:w-22 sm:h-32 flex items-center justify-center">
                <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-md">
                  {/* Hair back */}
                  <ellipse cx="50" cy="38" rx="26" ry="28" fill="#1E293B" />
                  {/* Face */}
                  <circle cx="50" cy="42" r="20" fill="#FCD34D" />
                  {/* Cheeks */}
                  <circle cx="42" cy="47" r="3" fill="#F87171" opacity="0.6" />
                  <circle cx="58" cy="47" r="3" fill="#F87171" opacity="0.6" />
                  {/* Eyes */}
                  <circle cx="44" cy="40" r="2.5" fill="#0F172A" />
                  <circle cx="56" cy="40" r="2.5" fill="#0F172A" />
                  {/* Smile */}
                  <path d="M44 48 Q50 54 56 48" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  {/* Hair Front */}
                  <path d="M30 35 Q50 20 70 35 Q50 28 30 35 Z" fill="#1E293B" />
                  {/* Shirt */}
                  <path d="M34 62 L66 62 L70 95 L30 95 Z" fill="#2563EB" />
                  {/* Arms */}
                  <path d="M30 65 L22 80 L28 85 L36 70 Z" fill="#FCD34D" />
                  <path d="M70 65 L78 80 L72 85 L64 70 Z" fill="#FCD34D" />
                  {/* Pants */}
                  <rect x="36" y="95" width="12" height="35" rx="3" fill="#0F172A" />
                  <rect x="52" y="95" width="12" height="35" rx="3" fill="#0F172A" />
                  {/* Shoes */}
                  <ellipse cx="42" cy="132" rx="7" ry="4" fill="#E2E8F0" />
                  <ellipse cx="58" cy="132" rx="7" ry="4" fill="#E2E8F0" />
                </svg>
              </div>
              <span className="text-[10px] font-black text-blue-900 bg-blue-100/90 px-2 py-0.5 rounded-full mt-1">
                Start: Day 1
              </span>
            </div>

            {/* Right Mascot Character (Boy) */}
            <div className="absolute -right-2 sm:right-2 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
              <div className="w-18 h-26 sm:w-22 sm:h-32 flex items-center justify-center">
                <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-md">
                  {/* Hair */}
                  <path d="M30 36 Q32 18 50 18 Q68 18 70 36 Q50 24 30 36 Z" fill="#1E293B" />
                  <path d="M26 30 Q28 15 45 20 Q65 12 74 30" fill="#1E293B" />
                  {/* Face */}
                  <circle cx="50" cy="42" r="20" fill="#FED7AA" />
                  {/* Cheeks */}
                  <circle cx="42" cy="47" r="3" fill="#FB923C" opacity="0.6" />
                  <circle cx="58" cy="47" r="3" fill="#FB923C" opacity="0.6" />
                  {/* Eyes (Happy) */}
                  <circle cx="44" cy="40" r="2.5" fill="#0F172A" />
                  <circle cx="56" cy="40" r="2.5" fill="#0F172A" />
                  {/* Smile */}
                  <path d="M43 47 Q50 56 57 47" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" fill="#EA580C" />
                  {/* T-Shirt */}
                  <path d="M32 62 L68 62 L70 95 L30 95 Z" fill="#EA580C" />
                  {/* Dungarees */}
                  <rect x="36" y="75" width="28" height="20" fill="#2563EB" rx="2" />
                  <rect x="38" y="62" width="5" height="15" fill="#2563EB" />
                  <rect x="57" y="62" width="5" height="15" fill="#2563EB" />
                  {/* Waving Arm */}
                  <path d="M70 65 L88 48 L93 54 L76 72 Z" fill="#FED7AA" />
                  <path d="M30 65 L22 80 L28 85 L36 70 Z" fill="#FED7AA" />
                  {/* Pants */}
                  <rect x="36" y="95" width="12" height="35" rx="3" fill="#2563EB" />
                  <rect x="52" y="95" width="12" height="35" rx="3" fill="#2563EB" />
                  {/* Shoes */}
                  <ellipse cx="42" cy="132" rx="7" ry="4" fill="#0F172A" />
                  <ellipse cx="58" cy="132" rx="7" ry="4" fill="#0F172A" />
                </svg>
              </div>
              <span className="text-[10px] font-black text-orange-950 bg-orange-100/90 px-2 py-0.5 rounded-full mt-1">
                Young Orator 🏆
              </span>
            </div>

            {/* Winding Road SVG */}
            <div className="w-[82%] mx-auto h-[320px] relative">
              <svg viewBox="0 0 900 320" className="w-full h-full overflow-visible" fill="none">
                
                {/* Road Border/Shadow */}
                <path
                  d="M 50 160 C 130 160, 160 260, 240 260 C 320 260, 360 60, 440 60 C 520 60, 560 260, 640 260 C 720 260, 750 160, 850 160"
                  stroke="#0F172A"
                  strokeWidth="60"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Asphalt Body */}
                <path
                  d="M 50 160 C 130 160, 160 260, 240 260 C 320 260, 360 60, 440 60 C 520 60, 560 260, 640 260 C 720 260, 750 160, 850 160"
                  stroke="#1E293B"
                  strokeWidth="50"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Dashed White Center Line */}
                <path
                  d="M 50 160 C 130 160, 160 260, 240 260 C 320 260, 360 60, 440 60 C 520 60, 560 260, 640 260 C 720 260, 750 160, 850 160"
                  stroke="white"
                  strokeWidth="4"
                  strokeDasharray="14 12"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Start Node: Big Blue Play Circle */}
                <g transform="translate(50, 160)">
                  <circle cx="0" cy="0" r="24" fill="#3B82F6" stroke="white" strokeWidth="4" className="drop-shadow-md" />
                  <polygon points="-6,-10 12,0 -6,10" fill="white" />
                </g>

                {/* End Node: Big Orange Cup/Target Circle */}
                <g transform="translate(850, 160)">
                  <circle cx="0" cy="0" r="24" fill="#EA580C" stroke="white" strokeWidth="4" className="drop-shadow-md" />
                  <circle cx="0" cy="0" r="14" fill="#FB923C" />
                  <circle cx="0" cy="0" r="6" fill="white" />
                </g>

                {/* Pin 1: (Bottom) at X=165, Y=225 */}
                <g transform="translate(170, 225)">
                  <line x1="0" y1="0" x2="0" y2="45" stroke="#2563EB" strokeWidth="2.5" strokeDasharray="3 3" />
                  <circle cx="0" cy="45" r="14" fill="#2563EB" stroke="white" strokeWidth="3" className="drop-shadow-sm" />
                  <text x="0" y="49" textAnchor="middle" fill="white" fontSize="12" fontWeight="900" fontFamily="sans-serif">1</text>
                </g>

                {/* Pin 2: (Top) at X=305, Y=175 */}
                <g transform="translate(305, 175)">
                  <line x1="0" y1="0" x2="0" y2="-45" stroke="#EA580C" strokeWidth="2.5" strokeDasharray="3 3" />
                  <circle cx="0" cy="-45" r="14" fill="#EA580C" stroke="white" strokeWidth="3" className="drop-shadow-sm" />
                  <text x="0" y="-41" textAnchor="middle" fill="white" fontSize="12" fontWeight="900" fontFamily="sans-serif">2</text>
                </g>

                {/* Pin 3: (Bottom) at X=440, Y=60 -> road is high, so pin points down to bottom */}
                <g transform="translate(440, 60)">
                  <line x1="0" y1="0" x2="0" y2="185" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="3 3" />
                  <circle cx="0" cy="185" r="14" fill="#F59E0B" stroke="white" strokeWidth="3" className="drop-shadow-sm" />
                  <text x="0" y="189" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="900" fontFamily="sans-serif">3</text>
                </g>

                {/* Pin 4: (Top) at X=510, Y=140 */}
                <g transform="translate(510, 140)">
                  <line x1="0" y1="0" x2="0" y2="-75" stroke="#3B82F6" strokeWidth="2.5" strokeDasharray="3 3" />
                  <circle cx="0" cy="-75" r="14" fill="#3B82F6" stroke="white" strokeWidth="3" className="drop-shadow-sm" />
                  <text x="0" y="-71" textAnchor="middle" fill="white" fontSize="12" fontWeight="900" fontFamily="sans-serif">4</text>
                </g>

                {/* Pin 5: (Bottom) at X=640, Y=260 */}
                <g transform="translate(640, 260)">
                  <line x1="0" y1="0" x2="0" y2="25" stroke="#EA580C" strokeWidth="2.5" strokeDasharray="3 3" />
                  <circle cx="0" cy="25" r="14" fill="#EA580C" stroke="white" strokeWidth="3" className="drop-shadow-sm" />
                  <text x="0" y="29" textAnchor="middle" fill="white" fontSize="12" fontWeight="900" fontFamily="sans-serif">5</text>
                </g>

                {/* Pin 6: (Top) at X=750, Y=190 */}
                <g transform="translate(750, 190)">
                  <line x1="0" y1="0" x2="0" y2="-75" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="3 3" />
                  <circle cx="0" cy="-75" r="14" fill="#F59E0B" stroke="white" strokeWidth="3" className="drop-shadow-sm" />
                  <text x="0" y="-71" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="900" fontFamily="sans-serif">6</text>
                </g>
              </svg>

              {/* Text Label Badges Overlay positioned accurately matching pins */}
              
              {/* Label 1: Reading comprehension (Bottom-Left) */}
              <div className="absolute left-[13%] bottom-0 -translate-x-1/2 text-center w-36">
                <span className="inline-block text-xs font-black text-slate-900 font-heading bg-white/95 px-2.5 py-1 rounded-xl shadow-2xs border border-blue-200">
                  Reading<br />comprehension
                </span>
              </div>

              {/* Label 2: Oral storytelling (Top-Left) */}
              <div className="absolute left-[31%] top-1 -translate-x-1/2 text-center w-36">
                <span className="inline-block text-xs font-black text-slate-900 font-heading bg-white/95 px-2.5 py-1 rounded-xl shadow-2xs border border-orange-200">
                  Oral<br />storytelling
                </span>
              </div>

              {/* Label 3: Public speaking (Bottom-Center) */}
              <div className="absolute left-[49%] bottom-0 -translate-x-1/2 text-center w-36">
                <span className="inline-block text-xs font-black text-slate-900 font-heading bg-white/95 px-2.5 py-1 rounded-xl shadow-2xs border border-amber-300">
                  Public<br />speaking
                </span>
              </div>

              {/* Label 4: Learn grammar (Top-Center) */}
              <div className="absolute left-[60%] top-1 -translate-x-1/2 text-center w-36">
                <span className="inline-block text-xs font-black text-slate-900 font-heading bg-white/95 px-2.5 py-1 rounded-xl shadow-2xs border border-blue-200">
                  Learn<br />grammar
                </span>
              </div>

              {/* Label 5: Explore writing (Bottom-Right) */}
              <div className="absolute left-[74%] bottom-0 -translate-x-1/2 text-center w-36">
                <span className="inline-block text-xs font-black text-slate-900 font-heading bg-white/95 px-2.5 py-1 rounded-xl shadow-2xs border border-orange-200">
                  Explore<br />writing
                </span>
              </div>

              {/* Label 6: Create story plots (Top-Right) */}
              <div className="absolute left-[88%] top-1 -translate-x-1/2 text-center w-36">
                <span className="inline-block text-xs font-black text-slate-900 font-heading bg-white/95 px-2.5 py-1 rounded-xl shadow-2xs border border-amber-300">
                  Create<br />story plots
                </span>
              </div>

            </div>
          </div>

          {/* Mobile Vertical Stepper View (Shown only on small screens) */}
          <div className="md:hidden relative z-10 my-6 space-y-4 max-w-sm mx-auto text-left">
            <div className="relative pl-6 border-l-4 border-slate-900 space-y-4 ml-3">
              {milestones.map((m) => (
                <div key={m.step} className="relative p-4 rounded-2xl bg-white/95 border border-slate-200 shadow-2xs">
                  <div className={`absolute -left-[35px] top-4 w-7 h-7 rounded-full ${m.color} flex items-center justify-center font-black text-xs font-heading shadow-xs border-2 border-white`}>
                    {m.step}
                  </div>
                  <h4 className="text-sm font-black text-slate-900 font-heading">{m.title}</h4>
                  <p className="text-xs text-slate-600 font-medium font-body mt-0.5">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Floating Pill Bar: "Hurry up!! Limited seats are available" */}
          <div className="relative z-10 mt-8 sm:mt-12 inline-flex flex-col sm:flex-row items-center justify-between gap-4 p-2 sm:p-2.5 rounded-full bg-[#FFEFEA] border border-orange-200/90 shadow-sm max-w-xl mx-auto">
            <div className="px-5 py-1 text-xs sm:text-sm font-black text-slate-800 font-heading text-center sm:text-left">
              Hurry up!! <span className="font-bold text-slate-600">Limited seats are available</span>
            </div>

            <button
              onClick={onOpenDemoModal}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm font-heading shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Book A Free English Class</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
