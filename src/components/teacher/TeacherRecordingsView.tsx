import React, { useState, useEffect } from 'react';
import { Video, Plus, Play, Lock, Clock, Calendar, X, Youtube, Info, ExternalLink, Trash2, Eye } from 'lucide-react';
import { api } from '../../lib/api';

interface TeacherRecordingsViewProps {
  onSuccessToast?: (msg: string) => void;
  onErrorToast?: (msg: string) => void;
}

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

  // Google Drive match: drive.google.com/file/d/ID/view or preview
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveMatch && driveMatch[1]) {
    return {
      type: 'drive',
      embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
    };
  }

  return { type: 'direct', embedUrl: url };
}

export function TeacherRecordingsView({
  onSuccessToast,
  onErrorToast,
}: TeacherRecordingsViewProps) {
  const [loading, setLoading] = useState(true);
  const [recordings, setRecordings] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState<any | null>(null);

  // Add Recording Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [batchId, setBatchId] = useState('');
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(45);
  const [recordingUrl, setRecordingUrl] = useState('');
  const [provider, setProvider] = useState('YOUTUBE_UNLISTED');
  const [recordedDate, setRecordedDate] = useState(new Date().toISOString().split('T')[0]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rRes, bRes] = await Promise.all([
        api.getTeacherRecordings(),
        api.getTeacherBatches(),
      ]);
      setRecordings(rRes.recordings || []);
      setBatches(bRes.batches || []);
      if (bRes.batches && bRes.batches.length > 0) {
        setBatchId(bRes.batches[0].id);
      }
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to load recordings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUrlChange = (val: string) => {
    setRecordingUrl(val);
    if (val.includes('youtube.com') || val.includes('youtu.be')) {
      setProvider('YOUTUBE_UNLISTED');
    } else if (val.includes('drive.google.com')) {
      setProvider('GOOGLE_DRIVE');
    }
  };

  const handleAddRecording = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId || !title || !recordingUrl) {
      if (onErrorToast) onErrorToast('Please fill all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      await api.createTeacherRecording({
        batch_id: batchId,
        title,
        topic,
        duration_minutes: Number(duration) || 45,
        recording_url: recordingUrl,
        recorded_date: recordedDate,
      });

      if (onSuccessToast) onSuccessToast('Recording published successfully for all enrolled students!');
      setIsAddModalOpen(false);
      setTitle('');
      setTopic('');
      setRecordingUrl('');
      loadData();
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to save recording.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRecording = async (recId: string) => {
    if (!window.confirm('Are you sure you want to remove this recording? Students will no longer see it.')) return;
    try {
      await api.deleteTeacherRecording(recId);
      if (onSuccessToast) onSuccessToast('Recording removed successfully.');
      loadData();
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to remove recording.');
    }
  };

  const previewInfo = getEmbedUrl(recordingUrl);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#10182C] flex items-center gap-2">
            <Video className="w-6 h-6 text-[#F27C00]" />
            <span>Class Recordings Repository</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish YouTube Unlisted or Google Drive recordings. Accessible strictly to students enrolled in the selected batch.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-[#F27C00] text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>PASTE CLASS RECORDING LINK</span>
        </button>
      </div>

      {/* Instructional Banner */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
        <Youtube className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <p className="font-bold text-slate-900 mb-0.5">Quick & Free Recording Publishing:</p>
          <ol className="list-decimal list-inside space-y-0.5 text-slate-600">
            <li><strong>YouTube Unlisted:</strong> Upload your Zoom/Meet recording to YouTube as <em>Unlisted</em> $\to$ Paste link $\to$ Instant in-app playback for students.</li>
            <li><strong>Google Drive:</strong> Set file sharing to <em>"Anyone with link can view"</em> $\to$ Paste link $\to$ Clean embedded video player.</li>
          </ol>
        </div>
      </div>

      {/* Recordings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          <div className="h-44 bg-slate-200/70 rounded-xl"></div>
          <div className="h-44 bg-slate-200/70 rounded-xl"></div>
        </div>
      ) : recordings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Recordings Added Yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Click "Paste Class Recording Link" above to share a YouTube Unlisted or Google Drive recording with your batch.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recordings.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-amber-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">
                    {rec.batch_name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-500" />
                      <span>{rec.provider === 'GOOGLE_DRIVE' ? 'Google Drive' : 'YouTube Unlisted'}</span>
                    </span>
                    <button
                      onClick={() => handleDeleteRecording(rec.id)}
                      title="Delete recording"
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-[#10182C] text-base mt-3">{rec.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{rec.topic}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
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

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setActiveVideo(rec)}
                  className="flex-1 text-center py-2.5 bg-[#10182C] text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-[#F27C00]" />
                  <span>WATCH PREVIEW</span>
                </button>
                <a
                  href={rec.recording_url}
                  target="_blank"
                  rel="noreferrer"
                  title="Open source link in new tab"
                  className="p-2.5 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition flex items-center justify-center"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PREVIEW VIDEO MODAL */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#10182C] rounded-2xl max-w-3xl w-full p-5 text-white shadow-2xl border border-slate-700/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-[#F27C00] uppercase tracking-wider">
                  {activeVideo.batch_name} • Video Replay Preview
                </span>
                <h3 className="font-bold text-base text-white mt-0.5">{activeVideo.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800">
              {(() => {
                const parsed = getEmbedUrl(activeVideo.recording_url);
                if (parsed.type === 'youtube' || parsed.type === 'drive') {
                  return (
                    <iframe
                      src={parsed.embedUrl}
                      title={activeVideo.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                }
                return (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <Video className="w-12 h-12 text-slate-500 mb-3" />
                    <p className="text-sm font-semibold text-slate-300">Custom Recording Link</p>
                    <a
                      href={activeVideo.recording_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 px-4 py-2 bg-[#F27C00] text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open Recording in New Tab</span>
                    </a>
                  </div>
                );
              })()}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>Topic: {activeVideo.topic || 'Class Session'}</span>
              <span className="text-emerald-400 font-semibold">Protected Student Gated Stream</span>
            </div>
          </div>
        </div>
      )}

      {/* ADD RECORDING MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-[#10182C] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#F27C00]" />
                <span>Paste Recorded Video Link</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRecording} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Batch</label>
                <select
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 bg-white text-xs focus:outline-none focus:border-[#F27C00]"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batch_name} ({b.grade_group})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">Only students enrolled in this batch will be able to watch this replay.</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Session Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Session 4: Hook, Story Body & Strong Conclusion"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Topic / Skills Covered</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. 3-step speech formula, eliminating filler sounds, live debates"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Recorded Date</label>
                  <input
                    type="date"
                    value={recordedDate}
                    onChange={(e) => setRecordedDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  YouTube Unlisted or Google Drive Link
                </label>
                <input
                  type="url"
                  value={recordingUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://youtu.be/... or https://drive.google.com/file/d/.../view"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                  required
                />
                {previewInfo.type !== 'direct' && (
                  <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
                    ✓ Valid {previewInfo.type === 'youtube' ? 'YouTube Unlisted' : 'Google Drive'} player detected!
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#F27C00] text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Publishing...' : 'Publish to Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

