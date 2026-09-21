import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  GraduationCap,
  Building,
  MapPin,
  Calendar,
  Sparkles,
  Users,
  Award,
  CheckCircle2,
  Camera,
  Upload,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { api } from '../../lib/api';

interface StudentProfileViewProps {
  onSuccessToast?: (msg: string) => void;
  onErrorToast?: (msg: string) => void;
}

export function StudentProfileView({ onSuccessToast, onErrorToast }: StudentProfileViewProps) {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.getStudentProfile();
      setStudent(res.student);
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to load profile information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handlePhotoUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (onErrorToast) onErrorToast('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      if (onErrorToast) onErrorToast('Image size exceeds 5MB limit.');
      return;
    }

    try {
      setUploadingPhoto(true);
      const res = await api.uploadStudentPhoto(file);
      if (res.photo_url) {
        setStudent((prev: any) => ({ ...prev, photo_url: res.photo_url }));
        if (onSuccessToast) onSuccessToast('Profile picture updated successfully!');
      }
    } catch (err: any) {
      if (onErrorToast) onErrorToast(err?.message || 'Failed to upload photo.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-36 bg-slate-200/70 rounded-2xl"></div>
        <div className="h-64 bg-slate-200/70 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={onFileInputChange}
      />

      {/* Header Profile Card with Direct Photo Upload Space */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        {/* Interactive Avatar Upload Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer w-24 h-24 rounded-2xl flex items-center justify-center transition overflow-hidden shrink-0 border-2 ${
            isDragOver
              ? 'border-[#F27C00] ring-4 ring-orange-500/20 scale-105'
              : 'border-slate-200 hover:border-[#F27C00]'
          } shadow-sm`}
          title="Click to change profile picture or drag and drop image here"
        >
          {uploadingPhoto ? (
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20">
              <Loader2 className="w-6 h-6 animate-spin text-[#F27C00]" />
              <span className="text-[9px] font-bold mt-1">Uploading...</span>
            </div>
          ) : null}

          {student?.photo_url ? (
            <img
              src={student.photo_url}
              alt={student.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold text-3xl">
              {student?.name ? student.name[0] : 'S'}
            </div>
          )}

          {/* Hover Camera Overlay */}
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1 text-center">
            <Camera className="w-5 h-5 text-amber-400 mb-0.5" />
            <span className="text-[10px] font-bold leading-tight">Change Photo</span>
          </div>

          {/* Small camera badge icon on bottom right */}
          <div className="absolute bottom-1 right-1 bg-[#10182C] text-white p-1 rounded-lg border border-white shadow-xs group-hover:bg-[#F27C00] transition">
            <Camera className="w-3 h-3" />
          </div>
        </div>

        {/* Student Info & Upload Button */}
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-bold text-[#10182C]">{student?.name}</h1>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Active Cohort Student
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {student?.class_grade} &bull; {student?.school || 'School Student'} &bull; {student?.city || 'India'}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              disabled={uploadingPhoto}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-slate-100 hover:bg-[#F27C00] hover:text-white text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{student?.photo_url ? 'Change Photo' : 'Upload Profile Picture'}</span>
            </button>
            <span className="text-[11px] text-slate-400">JPG, PNG, WEBP (Max 5MB)</span>
          </div>
        </div>
      </div>

      {/* Academic & Cohort Enrollment Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#10182C] flex items-center gap-2 pb-3 border-b border-slate-100">
            <GraduationCap className="w-4 h-4 text-[#F27C00]" />
            <span>Enrolled Speech Program</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Course Cohort</span>
              <strong className="text-slate-900 text-sm mt-0.5 block">{student?.course_name || '3-Month Flagship Cohort'}</strong>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Assigned Batch</span>
              <div className="font-semibold text-slate-800 mt-0.5">{student?.batch_name}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 block font-medium">Class Days</span>
                <div className="font-medium text-slate-700 mt-0.5">{student?.schedule_days}</div>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Class Time</span>
                <div className="font-medium text-slate-700 mt-0.5">{student?.schedule_time}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#10182C] flex items-center gap-2 pb-3 border-b border-slate-100">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Assigned Faculty Coach</span>
          </h3>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">
            <img
              src={
                student?.teacher_photo ||
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
              }
              alt={student?.teacher_name}
              className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-xs"
            />
            <div>
              <h4 className="font-bold text-sm text-[#10182C]">{student?.teacher_name || 'Mrs. Ananya Sharma'}</h4>
              <p className="text-xs text-slate-500">Senior Faculty Speech Coach</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 mt-1">
                <CheckCircle2 className="w-3 h-3" /> Live Feedback Mentor
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-1 pt-1">
            <p><strong>Expertise:</strong> {student?.teacher_expertise || 'Public Speaking, Extempore, Debate Structuring'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

