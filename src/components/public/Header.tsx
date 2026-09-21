import React, { useState } from 'react';
import { BrandingConfig } from '../../types';
import { Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Logo } from '../ui/Logo';

export type PublicPage = 'home' | 'about' | 'curriculum' | 'batches' | 'faculty' | 'pricing' | 'faq' | 'terms' | 'privacy';

interface HeaderProps {
  branding: BrandingConfig;
  activePage: PublicPage;
  onNavigatePage: (page: PublicPage) => void;
  onOpenDemoModal: () => void;
  onNavigateToAdmin: () => void;
  onNavigateToLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  branding,
  activePage,
  onNavigatePage,
  onOpenDemoModal,
  onNavigateToAdmin,
  onNavigateToLogin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: PublicPage) => {
    setMobileMenuOpen(false);
    onNavigatePage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const navItems: { id: PublicPage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'pricing', label: 'Program & Fees' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo - Preserving 100% of Upspeaq Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center text-left group cursor-pointer"
              aria-label="upspeaq Home"
            >
              <Logo theme="light" size="md" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold font-heading">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`py-2 transition-all cursor-pointer relative whitespace-nowrap ${
                    isActive
                      ? 'text-amber-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 font-medium'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Action Area: Login + Bhanzu-Style 3D Demo Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              id="header_btn_login"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                onNavigateToLogin();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer"
              title="Student & Staff Login"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Login / Portal</span>
            </button>

            {/* Book Free Demo Button */}
            <button
              id="header_cta_book_demo"
              onClick={onOpenDemoModal}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 font-heading"
            >
              <span>Book Free Demo</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>

          {/* Mobile Menu Trigger & Demo CTA */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                onNavigateToLogin();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold"
            >
              Login
            </button>
            
            <button
              onClick={onOpenDemoModal}
              className="px-3 py-1.5 rounded-full bg-amber-600 text-white text-xs font-bold shadow-xs"
            >
              Free Demo
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-4 pb-6 space-y-4 text-left shadow-lg font-heading">
          <div className="flex flex-col space-y-1 text-base font-semibold text-slate-800">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                  activePage === item.id ? 'bg-amber-50 text-amber-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'instant' });
                onNavigateToAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-amber-400 font-bold text-xs shadow-xs cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Staff & Admin Operations Portal</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemoModal();
              }}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs text-center shadow-xs cursor-pointer"
            >
              Book a Free Demo (45 Mins)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
