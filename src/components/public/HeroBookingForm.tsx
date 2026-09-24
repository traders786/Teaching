import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Smile, Loader2, MessageSquare, Laptop, Check } from 'lucide-react';
import { BookingFunnelModal, BookingLeadData } from './BookingFunnelModal';

interface HeroBookingFormProps {
  onOpenDemoModal?: () => void;
}

export const HeroBookingForm: React.FC<HeroBookingFormProps> = ({ onOpenDemoModal }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [childName, setChildName] = useState('');
  const [grade, setGrade] = useState('Grade 4');
  const [hasLaptop, setHasLaptop] = useState<boolean>(true);
  const [understandsEnglish, setUnderstandsEnglish] = useState<boolean>(true);
  const [whatsappUpdates, setWhatsappUpdates] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Funnel Modal State
  const [isFunnelOpen, setIsFunnelOpen] = useState(false);
  const [funnelInitialData, setFunnelInitialData] = useState<BookingLeadData | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (!childName.trim()) {
      setError('Please enter your child’s name');
      return;
    }

    // Pass data into the interactive multi-step funnel modal
    setFunnelInitialData({
      studentName: childName.trim(),
      studentClass: grade,
      parentName: `Parent of ${childName.trim()}`,
      mobileNumber: cleanMobile,
      email: email.trim(),
      hasLaptop,
      understandsEnglish,
      whatsappUpdates,
    });

    setIsFunnelOpen(true);
  };

  return (
    <section className="py-6 sm:py-8 bg-white" id="bookslot">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Banner Container */}
        <div className="rounded-3xl sm:rounded-[2.5rem] bg-white border-2 border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 text-left">
          
          {/* ================= LEFT COLUMN: ORANGE BANNER ================= */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#EA580C] via-[#F97316] to-[#C2410C] p-8 sm:p-12 lg:p-14 text-white flex flex-col justify-between relative overflow-hidden">
            
            {/* Background Circular Stamp Watermark */}
            <div className="absolute top-6 left-6 w-32 h-32 rounded-full border-2 border-white/20 flex items-center justify-center pointer-events-none opacity-40">
              <div className="w-24 h-24 rounded-full border border-dashed border-white/40 flex items-center justify-center text-[10px] font-black tracking-widest uppercase text-center p-2 font-heading">
                upspeaq english
              </div>
            </div>

            {/* Ambient Lighting */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-300/20 rounded-full blur-2xl pointer-events-none" />

            {/* Top Badge */}
            <div className="relative z-10 pt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider font-heading">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                Live Spoken English
              </span>
            </div>

            {/* Large Bold Quote */}
            <div className="relative z-10 my-10 sm:my-14">
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight leading-[1.2] text-white font-heading">
                “Learning English is Fun with us”
              </h2>
              <p className="text-sm sm:text-base text-orange-100 font-medium font-body mt-4 leading-relaxed">
                Live interactive classes designed to turn hesitant learners into fluent, expressive communicators.
              </p>
            </div>

            {/* Bottom Guarantee */}
            <div className="relative z-10 text-xs font-bold text-orange-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>100% Free 45-Minute Diagnostic Session</span>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: FORM AREA ================= */}
          <div className="lg:col-span-7 bg-[#FDFBF7] p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Form Header matching Bhanzu */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight leading-tight">
                  Book a <span className="text-[#EA580C]">FREE Class</span> for your child!
                </h3>
                <div className="text-lg sm:text-xl font-black text-[#EA580C] font-heading mt-0.5">
                  For Grade UKG to 10th
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold mt-2">
                  <span>😊</span>
                  <span>Enter your details below</span>
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                  {error}
                </div>
              )}

              {/* Mobile Number with Country Code */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-heading">
                  Parent's Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm font-bold shrink-0 shadow-2xs font-heading">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Parent's Mobile Number"
                    maxLength={10}
                    required
                    className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 outline-hidden text-sm text-slate-900 font-medium placeholder-slate-400 shadow-2xs font-body"
                  />
                </div>
              </div>

              {/* Parent Email */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-heading">
                  Parent's Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Parent's Email Address"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 outline-hidden text-sm text-slate-900 font-medium placeholder-slate-400 shadow-2xs font-body"
                />
              </div>

              {/* Child's Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-heading">
                  Child's Name
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Child's Name"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 outline-hidden text-sm text-slate-900 font-medium placeholder-slate-400 shadow-2xs font-body"
                />
              </div>

              {/* Grade Dropdown (UKG to 10th) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-heading">
                  Grade
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 outline-hidden text-sm text-slate-800 font-medium shadow-2xs cursor-pointer font-body"
                >
                  <option value="UKG">UKG</option>
                  <option value="Grade 1">1</option>
                  <option value="Grade 2">2</option>
                  <option value="Grade 3">3</option>
                  <option value="Grade 4">4</option>
                  <option value="Grade 5">5</option>
                  <option value="Grade 6">6</option>
                  <option value="Grade 7">7</option>
                  <option value="Grade 8">8</option>
                  <option value="Grade 9">9</option>
                  <option value="Grade 10">10</option>
                </select>
              </div>

              {/* Qualifying Question: Laptop/PC/Tab */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-heading">
                  Do you own a Laptop/PC/Tab?
                </label>
                <select
                  value={hasLaptop ? 'Yes' : 'No'}
                  onChange={(e) => setHasLaptop(e.target.value === 'Yes')}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 outline-hidden text-sm text-slate-800 font-medium shadow-2xs cursor-pointer font-body"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Qualifying Question: Does your child understand English? */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-heading">
                  Does your child understand English?
                </label>
                <select
                  value={understandsEnglish ? 'Yes' : 'No'}
                  onChange={(e) => setUnderstandsEnglish(e.target.value === 'Yes')}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 outline-hidden text-sm text-slate-800 font-medium shadow-2xs cursor-pointer font-body"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Informational WhatsApp Notice (No Toggle) */}
              <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs font-semibold text-emerald-800">
                <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Class communication and meeting updates will be shared on WhatsApp</span>
              </div>

              {/* Book Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#EA580C] hover:from-[#C2410C] hover:to-[#EA580C] text-white text-base sm:text-lg font-black font-heading shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  <span>Book A Free English Class</span>
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </button>
              </div>

            </form>

          </div>

        </div>

      </div>

      {/* Interactive Multi-Step Funnel Modal */}
      <BookingFunnelModal
        isOpen={isFunnelOpen}
        onClose={() => setIsFunnelOpen(false)}
        initialData={funnelInitialData}
      />
    </section>
  );
};
