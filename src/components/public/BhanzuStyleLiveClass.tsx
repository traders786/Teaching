import React, { useState } from 'react';
import { Video, Mic, MicOff, Sparkles, MessageCircle, Heart, Flame, ThumbsUp, ShieldCheck } from 'lucide-react';

interface BhanzuStyleLiveClassProps {
  onOpenDemoModal: () => void;
}

export const BhanzuStyleLiveClass: React.FC<BhanzuStyleLiveClassProps> = ({ onOpenDemoModal }) => {
  const [activeCheer, setActiveCheer] = useState<string | null>('🔥');

  const students = [
    { name: 'Aarav M.', grade: 'Grade 5', city: 'Bengaluru', isSpeaking: true, avatar: '👦', micActive: true },
    { name: 'Ananya S.', grade: 'Grade 5', city: 'Mumbai', isSpeaking: false, avatar: '👧', micActive: false },
    { name: 'Reyansh K.', grade: 'Grade 6', city: 'Delhi NCR', isSpeaking: false, avatar: '👦', micActive: false },
    { name: 'Diya P.', grade: 'Grade 5', city: 'Hyderabad', isSpeaking: false, avatar: '👧', micActive: false },
    { name: 'Kabir V.', grade: 'Grade 6', city: 'Pune', isSpeaking: false, avatar: '👦', micActive: false },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Video className="w-3.5 h-3.5" />
            <span>Virtual Speaking Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading tracking-tight">
            Inside a Live Upspeaq Speaking Class
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium font-body max-w-2xl mx-auto">
            Experience our high-energy classroom where students cheer their peers, practice impromptu drills, and receive warm, real-time mentor feedback.
          </p>
        </div>

        {/* Live Studio Mock Container */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-slate-950 p-5 sm:p-7 shadow-2xl border-4 border-amber-500/30 text-white relative overflow-hidden text-left">
          
          {/* Studio Header */}
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600 font-black tracking-wider uppercase text-[11px] text-slate-950">
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                LIVE BATCH • SPEAKING DRILL
              </span>
              <span className="hidden sm:inline-block font-bold text-slate-300">
                Junior Orators (Grades 4–6)
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-amber-300 font-bold bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
              ⏱️ 00:30s Extempore
            </div>
          </div>

          {/* Active Speaking Drill Prompt */}
          <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎙️</span>
              <div>
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Live Impromptu Question:
                </div>
                <div className="text-sm sm:text-base font-black text-white font-heading">
                  "If you could invent one gadget to help school students, what would it do?"
                </div>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold shrink-0">
              🎤 Aarav is presenting
            </span>
          </div>

          {/* Classroom Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Teacher Tile */}
            <div className="md:col-span-4 rounded-2xl bg-gradient-to-br from-amber-950/90 via-slate-900 to-slate-950 border-2 border-amber-500/50 p-4 flex flex-col justify-between min-h-[220px]">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                  Speech Mentor
                </span>
                <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5" /> Live
                </span>
              </div>

              <div className="text-center my-auto py-2">
                <div className="w-18 h-18 rounded-full bg-amber-400/20 border-2 border-amber-400 p-1 mx-auto shadow-md">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl">
                    👩‍🏫
                  </div>
                </div>
                <div className="text-base font-black text-white mt-2 font-heading">
                  Coach Sneha
                </div>
                <div className="text-[11px] text-amber-200">Head Speech Mentor</div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-500/30 text-[11px] text-amber-100">
                <span className="font-bold text-amber-400">Coach Feedback: </span>
                "Fabulous hand gestures, Aarav! Now explain the impact of your invention."
              </div>
            </div>

            {/* Students Grid */}
            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {students.map((st, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-3 flex flex-col justify-between min-h-[110px] border-2 transition-all relative ${
                    st.isSpeaking
                      ? 'bg-amber-950/60 border-amber-400 shadow-md shadow-amber-400/10'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-bold">{st.city}</span>
                    {st.micActive ? (
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Mic className="w-3 h-3" /> Speaking
                      </span>
                    ) : (
                      <MicOff className="w-3 h-3 text-slate-500" />
                    )}
                  </div>

                  <div className="text-center my-1">
                    <div className="text-2xl">{st.avatar}</div>
                    <div className="text-xs font-bold text-white font-heading mt-1">{st.name}</div>
                    <div className="text-[10px] text-slate-400">{st.grade}</div>
                  </div>

                  {st.isSpeaking ? (
                    <div className="flex items-center justify-center gap-1 h-3 text-amber-400">
                      <span className="w-1 bg-amber-400 h-2 animate-pulse" />
                      <span className="w-1 bg-amber-400 h-3 animate-pulse" style={{ animationDelay: '0.1s' }} />
                      <span className="w-1 bg-amber-400 h-1.5 animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <span className="w-1 bg-amber-400 h-3 animate-pulse" style={{ animationDelay: '0.3s' }} />
                    </div>
                  ) : (
                    <div className="text-center text-[10px] text-slate-500">Listening</div>
                  )}
                </div>
              ))}

              {/* Peer Cheer Box */}
              <div className="rounded-2xl p-3 bg-slate-900/60 border border-slate-800 flex flex-col justify-between items-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Peer Cheering
                </span>
                <div className="flex items-center gap-1.5 text-lg">
                  <button onClick={() => setActiveCheer('🔥')} className="hover:scale-125 transition-transform cursor-pointer">🔥</button>
                  <button onClick={() => setActiveCheer('👏')} className="hover:scale-125 transition-transform cursor-pointer">👏</button>
                  <button onClick={() => setActiveCheer('💡')} className="hover:scale-125 transition-transform cursor-pointer">💡</button>
                  <button onClick={() => setActiveCheer('❤️')} className="hover:scale-125 transition-transform cursor-pointer">❤️</button>
                </div>
                <span className="text-[9px] font-bold text-amber-300">Live Reaction</span>
              </div>
            </div>

          </div>

          {/* Bottom Callout */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>100% active microphone speaking time in every session.</span>
            </div>
            <button
              onClick={onOpenDemoModal}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md cursor-pointer transition-transform active:scale-95"
            >
              Book a Free Trial Seat
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
