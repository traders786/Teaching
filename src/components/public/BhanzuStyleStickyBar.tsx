import React from 'react';
import { ArrowRight, Star, Sparkles } from 'lucide-react';

interface BhanzuStyleStickyBarProps {
  onOpenDemoModal: () => void;
}

export const BhanzuStyleStickyBar: React.FC<BhanzuStyleStickyBarProps> = ({ onOpenDemoModal }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-amber-200 shadow-2xl sm:hidden flex items-center justify-between gap-3">
      <div className="text-left pl-1">
        <div className="flex items-center gap-1 text-[11px] font-black text-amber-700 font-heading">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>4.9/5 Rating (1,200+ Reviews)</span>
        </div>
        <div className="text-xs font-bold text-slate-900 font-body">1:8 Small Batch Spoken English</div>
      </div>

      <button
        onClick={onOpenDemoModal}
        className="shrink-0 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs font-heading flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
      >
        <span>Free Demo</span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
      </button>
    </div>
  );
};
