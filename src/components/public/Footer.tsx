import React from 'react';
import { BrandingConfig } from '../../types';
import { ArrowRight, Phone, Mail, MessageCircle, ShieldCheck } from 'lucide-react';
import { Logo } from '../ui/Logo';

interface FooterProps {
  branding: BrandingConfig;
  onOpenDemoModal: () => void;
  onNavigateToAdmin: () => void;
  onOpenLegalModal?: (type: 'PRIVACY' | 'TERMS') => void;
  onNavigatePage?: (page: 'home' | 'curriculum' | 'batches' | 'faculty' | 'pricing' | 'faq' | 'terms' | 'privacy') => void;
}

export const Footer: React.FC<FooterProps> = ({
  branding,
  onOpenDemoModal,
  onNavigateToAdmin,
  onOpenLegalModal,
  onNavigatePage,
}) => {
  const handlePageClick = (page: 'home' | 'about' | 'curriculum' | 'batches' | 'faculty' | 'pricing' | 'faq' | 'terms' | 'privacy') => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (onNavigatePage) {
      onNavigatePage(page as any);
    }
  };

  const rawWhatsapp = (branding?.supportWhatsapp || '7004132088').replace(/\D/g, '');
  const cleanWhatsapp = rawWhatsapp.startsWith('91') ? rawWhatsapp : (rawWhatsapp ? `91${rawWhatsapp}` : '917004132088');

  return (
    <div>
      {/* High-Conversion Final CTA */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden text-left border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
              Admissions Open For Upcoming Cohorts
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Give Your Child the Confidence to Speak in Any Room.
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Every child has thoughts worth sharing. Join our intimate small-group live
              batches and watch them transform into articulate, poised, and courageous communicators.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                id="footer_btn_book_demo"
                onClick={onOpenDemoModal}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-base shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>BOOK A FREE DEMO</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </button>

              <a
                href={`https://wa.me/${cleanWhatsapp}?text=Hi,%20I%20am%20interested%20in%20the%20communication%20classes%20for%20my%20child.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Free 45-minute demo • Intimate small-group batches • Qualified educators</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-[#121824] text-slate-400 py-16 text-xs leading-relaxed text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Column 1: Brand */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Logo theme="dark" size="md" />
              </div>
              <p className="text-slate-400 leading-normal">
                An Indian education and communication skills platform empowering school students from UKG to Class 10
                with live, small-group speaking and confidence mentorship.
              </p>
              <div className="text-[11px] text-slate-500 italic">
                "{branding.tagline}"
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Detailed Pages</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handlePageClick('about')}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    About Us & Story
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePageClick('curriculum')}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    Curriculum & Skills Breakdown
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePageClick('faculty')}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    Faculty & Mentors
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePageClick('pricing')}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    Program Details & Fee
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePageClick('faq')}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    Parent FAQs & Policies
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Support */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Admissions & Support</h4>
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <a href={`tel:${branding.contactPhone.replace(/\s+/g, '')}`} className="hover:text-white">
                    {branding.contactPhone}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <a href={`mailto:${branding.contactEmail}`} className="hover:text-white">
                    {branding.contactEmail}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp: {branding.supportWhatsapp}</span>
                </li>
              </ul>
              <div className="pt-2 text-slate-500">
                Operating Hours: Mon - Sat: 9:30 AM - 7:30 PM IST
              </div>
            </div>

            {/* Column 4: Trust & Admin Access */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Legal & Administration</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handlePageClick('privacy')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Privacy Policy & Minor Safety
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePageClick('terms')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li className="pt-2">
                  <button
                    onClick={onNavigateToAdmin}
                    className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Staff & Admin Portal Login</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} {branding.brandName}. All rights reserved. Built for student speech excellence in India.</p>
            <p>Brand name, faculty, and pricing are centrally configurable via Admin settings.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
