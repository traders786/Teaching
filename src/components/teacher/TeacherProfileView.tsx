import React, { useState, useEffect, useRef } from 'react';
import {
  UserCheck,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Award,
  Clock,
  Save,
  Lock,
  Calendar,
  Users,
  CheckCircle2,
  Camera,
  Upload,
  Loader2,
  Video,
  DollarSign,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../lib/api';
import { Teacher, Batch } from '../../types';

interface TeacherProfileViewProps {
  onSuccessToast?: (msg: string) => void;
  onErrorToast?: (msg: string) => void;
}

export function TeacherProfileView({ onSuccessToast, onErrorToast }: TeacherProfileViewProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [assignedBatches, setAssignedBatches] = useState<Batch[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Editable form state
  const [phone, setPhone] = useState('');
  const [googleMeetLink, setGoogleMeetLink] = useState('');
  const [biography, setBiography] = useState('');
  const [expertise, setExpertise] = useState('');
  const [achievements, setAchievements] = useState('');
  const [availability, setAvailability] = useState('');

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.getTeacherProfile();
      setTeacher(res.teacher);
      setAssignedBatches(res.assignedBatches || []);

      setPhone(res.teacher?.phone || '');
      setGoogleMeetLink(res.teacher?.google_meet_link || '');
      setBiography(res.teacher?.biography || '');
      setExpertise(res.teacher?.expertise || '');
      setAchievements(res.teacher?.achievements || '');
      setAvailability(res.teacher?.availability || '');
    } catch (error) {
      if (onErrorToast) onErrorToast('Unable to load teacher profile.');
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
      if (onErrorToast) onErrorToast('Please select an image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      if (onErrorToast) onErrorToast('Image size exceeds 5MB limit.');
      return;
    }

    try {
      setUploadingPhoto(true);
      const res = await api.uploadTeacherPhoto(file);
      if (res.photo_url) {
        setTeacher((prev: any) => ({ ...prev, photo_url: res.photo_url }));
        if (onSuccessToast) onSuccessToast('Profile picture uploaded & updated successfully!');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.updateTeacherProfile({
        phone,
        google_meet_link: googleMeetLink.trim() || undefined,
        biography,
        expertise,
        achievements,
        availability,
      });
      setTeacher(res.teacher);
      if (onSuccessToast) onSuccessToast('Profile & Google Meet room updated successfully.');
    } catch (error: any) {
      if (onErrorToast) onErrorToast(error?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-slate-200/70 rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-200/70 rounded-xl"></div>
          <div className="md:col-span-2 h-96 bg-slate-200/70 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={onFileInputChange}
      />

      {/* Top Banner Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        {/* Interactive Avatar Upload Area */}
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
              : 'border-[#F27C00] hover:border-amber-600'
          } shadow-sm`}
          title="Click or drag & drop to update your faculty profile picture"
        >
          {uploadingPhoto ? (
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20">
              <Loader2 className="w-6 h-6 animate-spin text-[#F27C00]" />
              <span className="text-[9px] font-bold mt-1">Uploading...</span>
            </div>
          ) : null}

          <img
            src={
              teacher?.photo_url ||
              'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
            }
            alt={teacher?.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />

          {/* Hover Camera Overlay */}
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1 text-center">
            <Camera className="w-5 h-5 text-amber-400 mb-0.5" />
            <span className="text-[10px] font-bold leading-tight">Change Photo</span>
          </div>

          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white" title="Verified Active Educator">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-bold text-[#10182C]">{teacher?.name}</h1>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Verified Speech Educator
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{teacher?.qualification || 'Master of Arts & Certified Speech Coach'}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600 mt-2">
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {teacher?.email}</span>
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {teacher?.phone || '+91 98111 22334'}</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              disabled={uploadingPhoto}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-slate-100 hover:bg-[#F27C00] hover:text-white text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New Photo</span>
            </button>
            <span className="text-[11px] text-slate-400">Direct image upload (JPG, PNG, WEBP)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Admin-Controlled & System Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-[#10182C] flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Admin-Controlled Fields</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">Read Only</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block font-medium">Role & Level</label>
                <div className="font-semibold text-slate-800 mt-0.5">Senior Faculty Speech Coach</div>
              </div>
              <div>
                <label className="text-slate-400 block font-medium">Account Status</label>
                <div className="font-semibold text-emerald-600 mt-0.5">{teacher?.status || 'ACTIVE'}</div>
              </div>
              <div>
                <label className="text-slate-400 block font-medium">Registered Email</label>
                <div className="font-mono text-slate-700 mt-0.5">{teacher?.email}</div>
              </div>
              <div>
                <label className="text-slate-400 block font-medium">Experience Credential</label>
                <div className="font-medium text-slate-700 mt-0.5">{teacher?.experience || '8+ Years'}</div>
              </div>
            </div>
          </div>

          {/* Demo Earnings Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-[#10182C] flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Demo Compensation</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Rate per Demo:</span>
                <span className="font-bold text-slate-900">₹{teacher?.payout_per_demo || 150}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Completed Demos:</span>
                <span className="font-bold text-slate-900">{teacher?.completed_demos || 0}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-800">Total Earned:</span>
                <span className="text-base font-black text-emerald-600">
                  ₹{(teacher?.total_earnings || (teacher?.completed_demos || 0) * 150).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Batches Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-[#10182C] flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
              <Users className="w-4 h-4 text-[#F27C00]" />
              <span>Assigned Batches ({assignedBatches.length})</span>
            </h3>

            {assignedBatches.length > 0 ? (
              <div className="space-y-2.5">
                {assignedBatches.map((b) => (
                  <div key={b.id} className="p-2.5 bg-slate-50 rounded-lg text-xs">
                    <div className="font-semibold text-slate-900">{b.batch_name}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      {b.schedule_days} &bull; {b.schedule_time}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No active cohorts assigned yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Editable Professional Information Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#10182C]">Professional Information & Availability</h2>
              <p className="text-xs text-slate-500 mt-0.5">Update your contact details, permanent Google Meet link, and speech specializations.</p>
            </div>

            {/* Permanent Google Meet Link Highlight */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-[#F27C00]" />
                  <span>Your Permanent Google Meet Link</span>
                </label>
                {googleMeetLink && (
                  <a
                    href={googleMeetLink.startsWith('http') ? googleMeetLink : `https://${googleMeetLink}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>Test Room</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="text"
                value={googleMeetLink}
                onChange={(e) => setGoogleMeetLink(e.target.value)}
                placeholder="e.g. https://meet.google.com/abc-defg-hij"
                className="w-full px-3.5 py-2 text-sm border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#F27C00]"
              />
              <p className="text-[11px] text-slate-500">
                Paste your Google Meet room link once. When you claim any student demo or live session, this link will be automatically attached and emailed to the parent & student.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Direct Contact Phone (10 Digits)</label>
                <span className="text-[11px] text-slate-400 font-medium">
                  {phone.replace(/^\+91/, '').replace(/\D/g, '').length}/10 digits
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-semibold">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone.replace(/^\+91/, '').replace(/\D/g, '').slice(0, 10)}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhone(digits);
                  }}
                  placeholder="9876543210"
                  className="w-full pl-11 pr-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#F27C00] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Teaching Specializations / Skills</label>
              <input
                type="text"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                placeholder="e.g. Public Speaking, Extempore, Debate Structuring, Accent Neutrality"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#F27C00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Weekly Availability</label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="e.g. Mon-Fri 4:00 PM - 8:30 PM IST"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#F27C00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Biography & Teaching Approach</label>
              <textarea
                rows={4}
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                placeholder="Share your teaching philosophy and how you help shy students overcome stage hesitation..."
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#F27C00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Key Achievements & Mentorship Highlights</label>
              <textarea
                rows={3}
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                placeholder="Notable student competition wins, awards, or confidence milestones achieved..."
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#F27C00]"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#F27C00] text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
