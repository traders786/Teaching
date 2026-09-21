import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { BrandingConfig } from '../../types';

interface FloatingWhatsAppProps {
  branding: BrandingConfig;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ branding }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);

  // Raw digits for WhatsApp wa.me link
  const rawNumber = (branding.supportWhatsapp || '+91 7004132088').replace(/\D/g, '');
  const formattedNumber = rawNumber.startsWith('91') ? rawNumber : `91${rawNumber}`;

  const defaultMessage = encodeURIComponent(
    "Hi Upspeaq! 👋 I would like to inquire about the Live Spoken English & Public Speaking classes for my child."
  );

  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${defaultMessage}`;

  // Keep card closed on load; opens only when user clicks the WhatsApp button

  const handleOpenDirect = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside aria-label="Customer Support WhatsApp" className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      
      {/* Floating Card Popup */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-lg text-white border border-white/30">
                  🎙️
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-300 border-2 border-emerald-700 rounded-full"></span>
              </div>
              <div className="text-left">
                <h4 className="font-heading font-black text-sm text-white">Upspeaq Admissions</h4>
                <p className="text-[11px] text-emerald-100 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  Online • Typical reply in 2 mins
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close WhatsApp chat preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body Bubble */}
          <div className="p-4 bg-emerald-50/40 text-left space-y-3">
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-xs shadow-xs border border-emerald-100 text-xs text-slate-700 leading-relaxed space-y-1.5">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <span>👋 Namaste & Welcome to Upspeaq!</span>
              </p>
              <p>
                Have questions about our <span className="font-semibold text-emerald-800">1:8 live speaking batches</span>, syllabus for UKG–Grade 10, or 1-on-1 coaching?
              </p>
              <p className="text-slate-500 text-[11px] pt-1">
                Chat directly with our Senior Admissions Counselor on WhatsApp.
              </p>
            </div>

            {/* Quick Action Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setShowNotificationBadge(false);
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer group"
            >
              <MessageCircle className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" />
              <span>Start Chat on WhatsApp</span>
              <Send className="w-3.5 h-3.5 opacity-80" />
            </a>

            <div className="text-center">
              <span className="text-[10px] text-slate-600 font-medium">
                Official Number: +91 7004132088
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Main Action Button Bubble */}
      <div className="relative group">
        
        {/* Pulse ring animation */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/40 animate-ping pointer-events-none"></span>

        <button
          onClick={() => {
            if (isOpen) {
              handleOpenDirect();
            } else {
              setIsOpen(true);
            }
          }}
          className="relative flex items-center gap-2.5 px-4 py-3.5 sm:px-5 sm:py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:via-emerald-800 hover:to-teal-900 text-white rounded-full shadow-2xl hover:shadow-emerald-600/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-emerald-400/40"
          aria-label="Chat with Upspeaq on WhatsApp"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-white fill-white/20" />
            {showNotificationBadge && (
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center border-2 border-emerald-800 animate-bounce">
                1
              </span>
            )}
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider leading-none">
              Questions?
            </span>
            <span className="text-xs font-black tracking-tight text-white leading-tight font-heading">
              Chat on WhatsApp
            </span>
          </div>
        </button>

      </div>

    </aside>
  );
};
