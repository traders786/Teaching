import React, { useState, useEffect } from 'react';
import { Video, Play, Lock, Clock, Calendar, X, ExternalLink, Sparkles, Youtube, CheckCircle2, User } from 'lucide-react';
import { api } from '../../lib/api';

function getEmbedUrl(url: string): { type: 'youtube' | 'drive' | 'direct'; embedUrl: string } {
  if (!url) return { type: 'direct', embedUrl: '' };

  // YouTube match: youtu.be/ID or youtube.com/watch?v=ID or youtube.com/embed/ID
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1&autoplay=1`,
    };
  }

  // Google Drive match: drive.google.com/file/d/ID/view
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveMatch && driveMatch[1]) {
    return {
      type: 'drive',
      embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
    };
  }

  return { type: 'direct', embedUrl: url };
}

export function StudentRecordingsView() {
  const [loading, setLoading] = useState(true);
  const [recordings, setRecordings] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState<any | null>(null);

  const loadRecordings = async () => {
    try {
      setLoading(true);
      const res = await api.getStudentRecordings();
      setRecordings(res.recordings || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecordings();
  }, []);

  const currentBatchName = recordings.length > 0 ? recordings[0].batch_name : 'Junior Orators (Class 4-7) — Batch J04';
  const currentTeacherName = recordings.length > 0 ? recordings[0].teacher_name : 'Mrs. Ananya Sharma';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#10182C] flex items-center gap-2">
              <Video className="w-6 h-6 text-[#F27C00]" />
              <span>Class Recordings & Replays</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Access protected session replays published by your coach for your enrolled cohort.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Batch Gated Access</span>
        </span>
      </div>

      {/* Cohort Alignment Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F27C00] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
            <Youtube className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded">
                Your Enrolled Batch
              </span>
              <span className="text-xs font-bold text-slate-900">{currentBatchName}</span>
            </div>
            <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Coach: <strong className="text-slate-800">{currentTeacherName}</strong>
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {recordings.length} Replays Available
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 bg-white/80 border border-amber-200 px-3 py-1.5 rounded-xl self-start sm:self-auto font-medium">
          🔒 Private to your batch
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          <div className="h-48 bg-slate-200/70 rounded-xl"></div>
          <div className="h-48 bg-slate-200/70 rounded-xl"></div>
        </div>
      ) : recordings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Recordings Available Yet</h3>
          <p className="text-xs text-slate-500 mt-1">Class recordings will appear here after completed sessions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recordings.map((rec, index) => (
            <div
              key={rec.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-[#F27C00] bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded">
                    Session {recordings.length - index}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                    rec.provider === 'GOOGLE_DRIVE' || rec.recording_url?.includes('drive.google')
                      ? 'text-blue-700 bg-blue-50 border border-blue-100'
                      : 'text-red-600 bg-red-50 border border-red-100'
                  }`}>
                    {rec.provider === 'GOOGLE_DRIVE' || rec.recording_url?.includes('drive.google') ? (
                      <>
                        <Video className="w-3 h-3 text-blue-500" /> Drive Replay
                      </>
                    ) : (
                      <>
                        <Youtube className="w-3 h-3 text-red-500" /> YouTube Replay
                      </>
                    )}
                  </span>
                </div>

                <h3 className="font-bold text-[#10182C] text-sm mt-3 leading-snug group-hover:text-[#F27C00] transition">
                  {rec.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{rec.topic}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{rec.recorded_date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{rec.duration_minutes || 45} mins</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setActiveVideo(rec)}
                  className="w-full text-center py-2.5 bg-[#10182C] text-white rounded-xl text-xs font-bold hover:bg-[#F27C00] transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-[#F27C00] group-hover:text-white transition" />
                  <span>WATCH CLASS REPLAY</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* EMBEDDED IN-APP VIDEO PLAYER MODAL */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#10182C] rounded-2xl max-w-3xl w-full p-5 text-white shadow-2xl border border-slate-700/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-[#F27C00] uppercase tracking-wider">
                  {activeVideo.batch_name} • Class Replay
                </span>
                <h3 className="font-bold text-base text-white mt-0.5">{activeVideo.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Container 16:9 */}
            <div className="mt-4 relative rounded-xl overflow-hidden bg-black aspect-video border border-slate-800">
              {(() => {
                const { type, embedUrl } = getEmbedUrl(activeVideo.recording_url);
                if (type === 'youtube' || type === 'drive') {
                  return (
                    <iframe
                      src={embedUrl}
                      title={activeVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  );
                }
                return (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
                    <Video className="w-12 h-12 text-[#F27C00]" />
                    <p className="text-xs text-slate-300">Click below to view the class replay:</p>
                    <a
                      href={activeVideo.recording_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F27C00] hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-md"
                    >
                      <span>Open Recording Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                );
              })()}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-4">
                <span>Mentor: <strong className="text-white">{activeVideo.teacher_name}</strong></span>
                <span>Date: <strong className="text-white">{activeVideo.recorded_date}</strong></span>
                <span>Duration: <strong className="text-white">{activeVideo.duration_minutes || 45} mins</strong></span>
              </div>

              <a
                href={activeVideo.recording_url}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#F27C00] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Open in separate tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

