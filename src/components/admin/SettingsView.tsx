import React, { useState, useEffect } from 'react';
import { BrandingConfig, Teacher } from '../../types';
import { api } from '../../lib/api';
import { Save, UserCheck, Shield, BookOpen, Award, CheckCircle2, RotateCcw, Video, Key, Sparkles, ExternalLink } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface SettingsViewProps {
  branding: BrandingConfig;
  teachers: Teacher[];
  onUpdateBranding: (newBranding: BrandingConfig) => void;
  onRefreshTeachers: () => void;
  onSuccessToast: (msg: string) => void;
  onErrorToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  branding,
  teachers,
  onUpdateBranding,
  onRefreshTeachers,
  onSuccessToast,
  onErrorToast,
}) => {
  // Brand settings state
  const [brandName, setBrandName] = useState(branding.brandName);
  const [tagline, setTagline] = useState(branding.tagline);
  const [contactPhone, setContactPhone] = useState(branding.contactPhone);
  const [supportWhatsapp, setSupportWhatsapp] = useState(branding.supportWhatsapp);
  const [contactEmail, setContactEmail] = useState(branding.contactEmail);
  const [targetBatchSize, setTargetBatchSize] = useState(branding.classBatchTargetSize || 8);
  const [maxBatchSize, setMaxBatchSize] = useState(branding.classBatchMaxSize || 9);
  const [flagshipPrice, setFlagshipPrice] = useState(branding.flagshipPrice || 4999);
  const [savingBranding, setSavingBranding] = useState(false);

  // Google Meet Integration settings state
  const [meetDefaultUrl, setMeetDefaultUrl] = useState('');
  const [meetWorkspaceDomain, setMeetWorkspaceDomain] = useState('meet.google.com');
  const [meetRoomPrefix, setMeetRoomPrefix] = useState('upspeaq-demo');
  const [meetConfigured, setMeetConfigured] = useState(true);
  const [savingMeet, setSavingMeet] = useState(false);

  useEffect(() => {
    loadMeetSettings();
  }, []);

  const loadMeetSettings = async () => {
    try {
      const res = await api.getMeetSettings();
      if (res) {
        setMeetDefaultUrl(res.defaultMeetingUrl || '');
        setMeetWorkspaceDomain(res.workspaceDomain || 'meet.google.com');
        setMeetRoomPrefix(res.defaultRoomPrefix || 'upspeaq-demo');
        setMeetConfigured(true);
      }
    } catch (e) {
      // Ignore
    }
  };

  const handleSaveMeet = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMeet(true);
    try {
      await api.saveMeetSettings({
        defaultMeetingUrl: meetDefaultUrl,
        workspaceDomain: meetWorkspaceDomain,
        defaultRoomPrefix: meetRoomPrefix,
      });
      setMeetConfigured(true);
      onSuccessToast('Google Meet configuration updated successfully!');
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to update Google Meet settings');
    } finally {
      setSavingMeet(false);
    }
  };


  // Edit Teacher Modal
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [tName, setTName] = useState('');
  const [tBio, setTBio] = useState('');
  const [tExpertise, setTExpertise] = useState('');
  const [tAchievements, setTAchievements] = useState('');
  const [savingTeacher, setSavingTeacher] = useState(false);

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBranding(true);
    try {
      const updated = {
        brandName: brandName.trim(),
        tagline: tagline.trim(),
        contactPhone: contactPhone.trim(),
        supportWhatsapp: supportWhatsapp.trim(),
        contactEmail: contactEmail.trim(),
        classBatchTargetSize: targetBatchSize,
        classBatchMaxSize: maxBatchSize,
        flagshipPrice: flagshipPrice,
      };
      await api.updateSettings(updated);
      onUpdateBranding(updated);
      onSuccessToast('Brand configuration updated across website and invoices!');
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to update settings');
    } finally {
      setSavingBranding(false);
    }
  };

  const openTeacherEdit = (t: Teacher) => {
    setSelectedTeacher(t);
    setTName(t.name);
    setTBio(t.biography || '');
    setTExpertise(t.expertise || '');
    setTAchievements(t.achievements || '');
  };

  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;
    setSavingTeacher(true);
    try {
      await api.updateTeacher(selectedTeacher.id, {
        name: tName.trim(),
        biography: tBio.trim(),
        expertise: tExpertise.trim(),
        achievements: tAchievements.trim(),
      });
      setSelectedTeacher(null);
      onRefreshTeachers();
      onSuccessToast('Educator dossier updated successfully');
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to update teacher');
    } finally {
      setSavingTeacher(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 text-left max-w-5xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform Configuration & Faculty</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Customize brand name, operational batch constraints, parent communication channels, and educator biographies
        </p>
      </div>

      {/* Brand & Operational Rules Form */}
      <form
        onSubmit={handleSaveBranding}
        className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Brand Identity & Admissions Parameters</h2>
            <p className="text-[11px] text-slate-500">Live configuration reflected across the public website</p>
          </div>
          <button
            type="submit"
            disabled={savingBranding}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingBranding ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Organization / Brand Name</label>
            <input
              type="text"
              required
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
            />
            <span className="text-[10px] text-slate-400">Default: "upspeaq"</span>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Mission Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Admissions Phone</label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">WhatsApp Helpline</label>
            <input
              type="text"
              value={supportWhatsapp}
              onChange={(e) => setSupportWhatsapp(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Admissions Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Flagship 3-Month Course Fee (₹)</label>
            <input
              type="number"
              value={flagshipPrice}
              onChange={(e) => setFlagshipPrice(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-bold"
            />
          </div>
        </div>

        {/* Small Batch Constraints */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 mb-2">Classroom Integrity Constraints</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <label className="font-bold text-slate-700 block">Target Students Per Batch</label>
              <input
                type="number"
                min={4}
                max={15}
                value={targetBatchSize}
                onChange={(e) => setTargetBatchSize(parseInt(e.target.value, 10))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
              />
              <span className="text-[10px] text-slate-500">
                Recommended: 8 learners for optimal micro-debates
              </span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <label className="font-bold text-slate-700 block">Absolute Maximum Batch Cap</label>
              <input
                type="number"
                min={4}
                max={20}
                value={maxBatchSize}
                onChange={(e) => setMaxBatchSize(parseInt(e.target.value, 10))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
              />
              <span className="text-[10px] text-slate-500">
                Hard ceiling: enrollment blocks further registrations at this number
              </span>
            </div>
          </div>
        </div>
      </form>

      {/* Google Meet Video Classes & Live Demo Integration */}
      <form
        onSubmit={handleSaveMeet}
        className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-emerald-600" />
                <span>Google Meet Live Class & Demo Integration</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                ACTIVE • GOOGLE MEET READY
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Automated Google Meet room link generation for live 1-on-1 / micro trial sessions and student cohort classes
            </p>
          </div>

          <button
            type="submit"
            disabled={savingMeet}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{savingMeet ? 'Saving...' : 'Save Google Meet Settings'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Workspace Domain / Service</label>
            <input
              type="text"
              placeholder="meet.google.com"
              value={meetWorkspaceDomain}
              onChange={(e) => setMeetWorkspaceDomain(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-slate-900 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Default Room Code Prefix</label>
            <input
              type="text"
              placeholder="e.g. upspeaq-demo"
              value={meetRoomPrefix}
              onChange={(e) => setMeetRoomPrefix(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-slate-900 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Default Fallback Room URL (Optional)</label>
            <input
              type="url"
              placeholder="https://meet.google.com/..."
              value={meetDefaultUrl}
              onChange={(e) => setMeetDefaultUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-slate-900 bg-white"
            />
          </div>
        </div>

        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>How It Works:</strong> When staff click "Schedule Google Meet Demo", a direct Google Meet room link is provisioned instantly with assigned speech coach and student details, formatted and ready to send to parents via WhatsApp in 1-click!
          </div>
        </div>
      </form>

      {/* Educator Profiles Management */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">

        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Educator Profiles & Bios</h2>
            <p className="text-[11px] text-slate-500">
              Update biographies, speech tournament track records, and coaching specialties
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between text-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">{teacher.name}</h3>
                  <button
                    onClick={() => openTeacherEdit(teacher)}
                    className="text-amber-700 font-bold hover:underline cursor-pointer"
                  >
                    Edit Profile
                  </button>
                </div>
                <p className="text-slate-600 line-clamp-2 leading-relaxed">{teacher.biography}</p>
                <div className="pt-2 text-slate-500 space-y-1">
                  <div>
                    <strong>Focus:</strong> {teacher.expertise}
                  </div>
                  <div>
                    <strong>Accomplishments:</strong> {teacher.achievements}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Educator Modal */}
      <Modal
        isOpen={!!selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
        title={`Faculty Profile: ${selectedTeacher?.name}`}
        subtitle="Update educator accreditation and public presentation"
        maxWidth="md"
      >
        {selectedTeacher && (
          <form onSubmit={handleSaveTeacher} className="space-y-4 text-left text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Full Name</label>
              <input
                type="text"
                required
                value={tName}
                onChange={(e) => setTName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Professional Biography</label>
              <textarea
                rows={3}
                required
                value={tBio}
                onChange={(e) => setTBio(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Core Expertise</label>
              <input
                type="text"
                required
                value={tExpertise}
                onChange={(e) => setTExpertise(e.target.value)}
                placeholder="Debate Argumentation, Impromptu Speaking..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Achievements & Background</label>
              <input
                type="text"
                required
                value={tAchievements}
                onChange={(e) => setTAchievements(e.target.value)}
                placeholder="10+ years mentoring national debate winners..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTeacher(null)}
                className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingTeacher}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white font-bold"
              >
                {savingTeacher ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
