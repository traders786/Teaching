import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Mic,
  Video,
  CheckCircle2,
  Clock,
  Play,
  Upload,
  Save,
  X,
  Award,
  AlertCircle,
  FileCheck,
  ImageIcon,
  Loader2,
  Trash2,
  ExternalLink,
  Link2,
} from 'lucide-react';
import { api } from '../../lib/api';

interface StudentHomeworkViewProps {
  initialHwToSubmit?: any | null;
  onSuccessToast?: (msg: string) => void;
  onErrorToast?: (msg: string) => void;
}

export function StudentHomeworkView({
  initialHwToSubmit,
  onSuccessToast,
  onErrorToast,
}: StudentHomeworkViewProps) {
  const [loading, setLoading] = useState(true);
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'SUBMITTED' | 'REVIEWED'>('ALL');

  // Submission Modal State
  const [submittingHw, setSubmittingHw] = useState<any | null>(null);
  const [submissionType, setSubmissionType] = useState('DOCUMENT');
  const [contentText, setContentText] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSizeStr, setFileSizeStr] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadHomework = async () => {
    try {
      setLoading(true);
      const res = await api.getStudentHomework();
      setHomeworkList(res.homeworkList || []);

      if (initialHwToSubmit) {
        openSubmitModal(initialHwToSubmit);
      }
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to load homework.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomework();
  }, [initialHwToSubmit]);

  const openSubmitModal = (hw: any) => {
    setSubmittingHw(hw);
    setSubmissionType(hw.submission_type || 'DOCUMENT');
    setContentText(hw.content_text || '');
    setMediaUrl(hw.media_url || '');
    setFileName(hw.file_name || '');
    setFileSizeStr('');
    setImagePreview(
      hw.media_url && hw.media_url.match(/\.(png|jpg|jpeg|webp)$/i) ? hw.media_url : null
    );
    setShowLinkInput(
      Boolean(hw.media_url && (hw.media_url.includes('drive.google') || hw.media_url.includes('youtube') || hw.media_url.includes('youtu.be')))
    );
  };

  const handleFileUpload = async (file: File) => {
    // 1. Enforce strict safe file types (no raw audio/video files)
    const isVideoOrAudio = file.type.startsWith('video/') || file.type.startsWith('audio/') || file.name.match(/\.(mp4|mov|avi|mkv|mp3|wav|m4a|aac)$/i);
    if (isVideoOrAudio) {
      if (onErrorToast) {
        onErrorToast('Video/Audio file uploads are not accepted here. Please upload speech outlines, scripts, worksheets (PDF/Word), or handwritten notes (PNG/JPG).');
      }
      return;
    }

    const isValidDocOrImage =
      file.type === 'application/pdf' ||
      file.type.startsWith('image/') ||
      file.type.includes('document') ||
      file.name.match(/\.(pdf|png|jpg|jpeg|webp|docx|doc|txt)$/i);

    if (!isValidDocOrImage) {
      if (onErrorToast) {
        onErrorToast('Unsupported file type. Please upload a PDF (.pdf), Image (.png, .jpg), or Word document (.docx).');
      }
      return;
    }

    // 2. Max 10MB size limit
    if (file.size > 10 * 1024 * 1024) {
      if (onErrorToast) onErrorToast('File exceeds 10MB limit. Please upload a document or image smaller than 10MB.');
      return;
    }

    // 3. Image local preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }

    // 4. Upload to Cloudinary via backend
    try {
      setIsUploadingFile(true);
      const res = await api.uploadStudentFile(file);
      if (res?.url) {
        setMediaUrl(res.url);
        setFileName(file.name);
        const sizeKB = Math.round(file.size / 1024);
        setFileSizeStr(sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`);
        if (onSuccessToast) onSuccessToast(`"${file.name}" uploaded safely to Cloud Storage!`);
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      if (onErrorToast) onErrorToast(err?.message || 'Failed to upload document to cloud storage.');
      setImagePreview(null);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setMediaUrl('');
    setFileName('');
    setFileSizeStr('');
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingHw) return;

    if (!contentText && !mediaUrl) {
      if (onErrorToast) onErrorToast('Please upload a speech note/PDF/image or write your speech draft points.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.submitStudentHomework(submittingHw.id, {
        submission_type: fileName.endsWith('.pdf') ? 'PDF' : imagePreview ? 'IMAGE' : 'DOCUMENT',
        content_text: contentText,
        media_url: mediaUrl,
        file_name: fileName || (contentText ? 'Speech_Notes.txt' : 'Homework_Submission'),
      });

      if (onSuccessToast) onSuccessToast('Homework submitted successfully! Your mentor will review it.');
      setSubmittingHw(null);
      loadHomework();
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to submit homework.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredList = homeworkList.filter((hw) => {
    if (filter === 'PENDING') return !hw.submission_status;
    if (filter === 'SUBMITTED') return hw.submission_status === 'SUBMITTED';
    if (filter === 'REVIEWED') return hw.submission_status === 'REVIEWED';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#10182C] flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#F27C00]" />
            <span>My Speech Homework & Feedback</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Submit speech outlines, handwritten scripts, worksheets (PDF/Images), or written speech drafts for mentor feedback.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {(['ALL', 'PENDING', 'SUBMITTED', 'REVIEWED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === tab ? 'bg-white text-[#10182C] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Homework Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          <div className="h-44 bg-slate-200/70 rounded-xl"></div>
          <div className="h-44 bg-slate-200/70 rounded-xl"></div>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Homework in this View</h3>
          <p className="text-xs text-slate-500 mt-1">You are all caught up on your speech tasks!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredList.map((hw) => {
            const isReviewed = hw.submission_status === 'REVIEWED';
            const isSubmitted = hw.submission_status === 'SUBMITTED';

            return (
              <div
                key={hw.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-amber-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-[#F27C00] bg-amber-50 px-2.5 py-0.5 rounded uppercase flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>Speech Task</span>
                      </span>
                      {hw.target_student_id && (
                        <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                          Personal 1-on-1 Task
                        </span>
                      )}
                    </div>

                    {isReviewed ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Reviewed
                      </span>
                    ) : isSubmitted ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                        Submitted &bull; In Review
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                        Pending Submission
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-[#10182C] text-base mt-3">{hw.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{hw.description}</p>

                  {hw.instructions && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-700">
                      <strong className="block text-slate-900 font-bold mb-0.5">Instructions:</strong>
                      <p className="whitespace-pre-line">{hw.instructions}</p>
                    </div>
                  )}

                  {/* Submission Attachment Preview if submitted */}
                  {hw.media_url && (
                    <div className="mt-3 p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/60 flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        {hw.media_url.match(/\.(png|jpg|jpeg|webp)$/i) ? (
                          <ImageIcon className="w-4 h-4 text-[#F27C00] shrink-0" />
                        ) : (
                          <FileCheck className="w-4 h-4 text-[#F27C00] shrink-0" />
                        )}
                        <span className="text-xs font-semibold text-slate-800 truncate">
                          {hw.file_name || 'Uploaded Document'}
                        </span>
                      </div>
                      <a
                        href={hw.media_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-[#F27C00] hover:underline flex items-center gap-1 shrink-0 ml-2"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {/* Mentor Feedback View */}
                  {isReviewed && hw.mentor_feedback && (
                    <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" /> Mentor Feedback
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          ★ {hw.score_rating || 'Strong'}
                        </span>
                      </div>
                      <p className="text-emerald-950 italic">"{hw.mentor_feedback}"</p>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Due: {hw.due_date}
                    </span>
                    <span>Mentor: <strong>{hw.teacher_name}</strong></span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => openSubmitModal(hw)}
                    className="w-full text-center py-2.5 bg-[#F27C00] text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isSubmitted || isReviewed ? 'Update Submission' : 'SUBMIT HOMEWORK'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* HOMEWORK SUBMISSION MODAL WITH CLOUDINARY FILE UPLOADER */}
      {submittingHw && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-base text-[#10182C]">{submittingHw.title}</h3>
                <p className="text-xs text-slate-500">Due: {submittingHw.due_date}</p>
              </div>
              <button onClick={() => setSubmittingHw(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              {/* PRIMARY UPLOADER: DIRECT PDF / IMAGE / NOTES DROPZONE */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Upload Speech Notes, PDF or Script Image <span className="text-red-500">*</span>
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.docx,.doc,.txt"
                  className="hidden"
                />

                {!mediaUrl && !isUploadingFile ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                      isDragOver
                        ? 'border-[#F27C00] bg-amber-50/80 scale-[1.01]'
                        : 'border-slate-300 hover:border-[#F27C00] hover:bg-slate-50/80 bg-slate-50/40'
                    }`}
                  >
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2.5 text-[#F27C00]">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-slate-800 text-xs">
                      Click to Browse or Drag & Drop File Here
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Supports: <strong>PDF (.pdf)</strong>, <strong>Images (.png, .jpg)</strong>, <strong>Word (.docx)</strong>
                    </p>
                    <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      ✓ Direct Cloud Storage • Max 10MB
                    </span>
                  </div>
                ) : isUploadingFile ? (
                  <div className="border border-amber-200 bg-amber-50/60 rounded-xl p-6 text-center space-y-2">
                    <Loader2 className="w-7 h-7 text-[#F27C00] animate-spin mx-auto" />
                    <p className="font-bold text-xs text-amber-900">Uploading safely to Cloud Storage...</p>
                    <p className="text-[10px] text-amber-700">Please wait while we secure your file</p>
                  </div>
                ) : (
                  /* Uploaded File Chip / Preview */
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                          {imagePreview ? <ImageIcon className="w-4 h-4" /> : <FileCheck className="w-4 h-4" />}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-xs text-slate-900 truncate">{fileName || 'Uploaded Document'}</p>
                          <p className="text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
                            <span>Ready to submit</span>
                            {fileSizeStr && <span>• {fileSizeStr}</span>}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <a
                          href={mediaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 text-[11px] font-bold text-emerald-800 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-100"
                        >
                          Preview
                        </a>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {imagePreview && (
                      <div className="mt-2 pt-2 border-t border-emerald-200/60">
                        <img
                          src={imagePreview}
                          alt="Homework Preview"
                          className="max-h-36 rounded-lg object-contain mx-auto border border-emerald-200 shadow-xs"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* WRITTEN SPEECH DRAFT NOTES */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Written Speech Draft / 3 Key Points (Optional)
                </label>
                <textarea
                  rows={3}
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  placeholder="Write your 3 speech points, hook idea, or summary notes here..."
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                />
              </div>

              {/* OPTIONAL EXTERNAL VIDEO LINK ACCORDION */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowLinkInput(!showLinkInput)}
                  className="text-[11px] font-semibold text-slate-500 hover:text-[#F27C00] flex items-center gap-1 transition"
                >
                  <Link2 className="w-3 h-3" />
                  <span>{showLinkInput ? '− Hide external video/audio link' : '+ Have a Google Drive / YouTube video link?'}</span>
                </button>

                {showLinkInput && (
                  <div className="mt-2">
                    <input
                      type="url"
                      value={mediaUrl && !mediaUrl.includes('cloudinary') ? mediaUrl : ''}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/... or https://youtu.be/..."
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-[#F27C00]"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Optional: Paste a shared link to your recorded speech presentation.
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSubmittingHw(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingFile}
                  className="px-5 py-2.5 bg-[#F27C00] text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit to Mentor</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

