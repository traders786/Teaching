import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Search,
  Plus,
  Video,
  Copy,
  Check,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Calendar,
  Layers,
  Award,
  Edit2,
  RefreshCw,
  Clock,
  Sparkles,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Eye,
  BookOpen,
} from 'lucide-react';
import { api } from '../../lib/api';
import { Teacher } from '../../types';
import { Modal } from '../ui/Modal';

interface TeachersViewProps {
  onSuccessToast: (msg: string) => void;
  onErrorToast: (msg: string) => void;
}

export const TeachersView: React.FC<TeachersViewProps> = ({
  onSuccessToast,
  onErrorToast,
}) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacherDemos, setViewingTeacherDemos] = useState<Teacher | null>(null);
  const [teacherDemos, setTeacherDemos] = useState<any[]>([]);
  const [demosLoading, setDemosLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    googleMeetLink: '',
    payoutPerDemo: 150,
    qualification: '',
    experience: '',
    expertise: '',
    biography: '',
    status: 'ACTIVE',
  });
  const [submitting, setSubmitting] = useState(false);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const res = await api.getTeachers();
      setTeachers(res.teachers || []);
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleCopyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onSuccessToast('Google Meet link copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenAddModal = () => {
    setEditingTeacher(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      googleMeetLink: '',
      payoutPerDemo: 150,
      qualification: '',
      experience: '',
      expertise: '',
      biography: '',
      status: 'ACTIVE',
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (t: Teacher) => {
    setEditingTeacher(t);
    setFormData({
      name: t.name || '',
      email: t.email || '',
      phone: t.phone || '',
      googleMeetLink: t.google_meet_link || '',
      payoutPerDemo: t.payout_per_demo || 150,
      qualification: t.qualification || '',
      experience: t.experience || '',
      expertise: t.expertise || '',
      biography: t.biography || '',
      status: t.status || 'ACTIVE',
    });
    setShowAddModal(true);
  };

  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      onErrorToast('Name and Email are required.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingTeacher) {
        await api.updateTeacher(editingTeacher.id, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          googleMeetLink: formData.googleMeetLink.trim() || undefined,
          payout_per_demo: Number(formData.payoutPerDemo) || 150,
          qualification: formData.qualification.trim() || undefined,
          experience: formData.experience.trim() || undefined,
          expertise: formData.expertise.trim() || undefined,
          biography: formData.biography.trim() || undefined,
          status: formData.status as any,
        });
        onSuccessToast(`Updated profile for ${formData.name}`);
      } else {
        await api.createTeacher({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          googleMeetLink: formData.googleMeetLink.trim() || undefined,
          payout_per_demo: Number(formData.payoutPerDemo) || 150,
          qualification: formData.qualification.trim() || undefined,
          experience: formData.experience.trim() || undefined,
          expertise: formData.expertise.trim() || undefined,
          biography: formData.biography.trim() || undefined,
          status: formData.status as any,
        });
        onSuccessToast(`New teacher ${formData.name} added successfully`);
      }
      setShowAddModal(false);
      loadTeachers();
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to save teacher');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDemoHistory = async (t: Teacher) => {
    setViewingTeacherDemos(t);
    try {
      setDemosLoading(true);
      const res = await api.getTeacherDemoHistory(t.id);
      setTeacherDemos(res.demos || []);
    } catch (err: any) {
      onErrorToast('Failed to load demo history for teacher');
    } finally {
      setDemosLoading(false);
    }
  };

  // KPIs
  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter((t) => t.status === 'ACTIVE').length;
  const totalCompletedDemos = teachers.reduce((sum, t) => sum + (t.completed_demos || 0), 0);
  const totalPayoutEarned = teachers.reduce((sum, t) => sum + (t.total_earnings || 0), 0);
  const totalPendingDemos = teachers.reduce((sum, t) => sum + (t.pending_demos || 0), 0);

  // Filtered teachers
  const filteredTeachers = teachers.filter((t) => {
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      (t.phone && t.phone.includes(q)) ||
      (t.expertise && t.expertise.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#F27C00]" />
            <span>Faculty & Educator Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor teacher Google Meet links, demos completed, and automated payout earnings (₹150/demo).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadTeachers}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            title="Refresh Teachers"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F27C00] hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Teacher</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Educators</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{activeTeachers}</span>
            <span className="text-xs text-slate-400">/ {totalTeachers} registered</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Demos Completed</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">{totalCompletedDemos}</span>
            <span className="text-xs text-slate-400">sessions evaluated</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Faculty Payout Earned</span>
            <div className="p-2 rounded-xl bg-amber-50 text-[#F27C00]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              ₹{totalPayoutEarned.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              @ ₹150 / demo
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Upcoming / In-Progress</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-700">{totalPendingDemos}</span>
            <span className="text-xs text-slate-400">demos in pipeline</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by teacher name, email, phone, or expertise..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#F27C00] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['ALL', 'ACTIVE', 'INACTIVE', 'ON_LEAVE'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st === 'ALL' ? 'All Status' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Teacher & Contact</th>
                <th className="py-3.5 px-4">Permanent Google Meet</th>
                <th className="py-3.5 px-4 text-center">Demos Taken</th>
                <th className="py-3.5 px-4">Demo Payouts (@ ₹150)</th>
                <th className="py-3.5 px-4">Batches & Students</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    {loading ? 'Loading educators...' : 'No teachers found.'}
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((t) => {
                  const completed = t.completed_demos || 0;
                  const total = t.total_demos || 0;
                  const earnings = t.total_earnings || completed * 150;
                  const meetLink = t.google_meet_link;

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Teacher Profile Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              t.photo_url ||
                              'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
                            }
                            alt={t.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2">
                              <span>{t.email}</span>
                              {t.phone && <span>• {t.phone}</span>}
                            </div>
                            {t.expertise && (
                              <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700">
                                {t.expertise}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Google Meet Link Column */}
                      <td className="py-3.5 px-4">
                        {meetLink ? (
                          <div className="flex items-center gap-1.5 max-w-[200px]">
                            <a
                              href={meetLink.startsWith('http') ? meetLink : `https://${meetLink}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 truncate bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 shrink"
                              title={meetLink}
                            >
                              <Video className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="truncate">{meetLink.replace('https://', '')}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-60" />
                            </a>
                            <button
                              onClick={() => handleCopyLink(meetLink, t.id)}
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                              title="Copy Link"
                            >
                              {copiedId === t.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenEditModal(t)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-lg border border-amber-200 transition-colors cursor-pointer"
                          >
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            <span>Set Meet Link</span>
                          </button>
                        )}
                      </td>

                      {/* Demos Taken */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-bold text-slate-900 text-xs">
                            {completed} <span className="text-slate-400 font-normal">/ {total}</span>
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold">
                            {total > 0 ? `${Math.round((completed / total) * 100)}% done` : 'No demos'}
                          </span>
                        </div>
                      </td>

                      {/* Payout Earned (@ ₹150) */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-black text-emerald-700 text-sm">
                            ₹{earnings.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {completed} demos × ₹{t.payout_per_demo || 150}
                          </span>
                        </div>
                      </td>

                      {/* Batches & Students */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="text-xs font-semibold text-slate-800">
                          {t.assigned_batches_count || 0} Batches
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {t.active_students_count || 0} Students
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            t.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : t.status === 'ON_LEAVE'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDemoHistory(t)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-[11px] transition-colors cursor-pointer border border-blue-200"
                            title="View all demos and payout ledger for this teacher"
                          >
                            <Eye className="w-3 h-3 text-blue-600" />
                            <span>Demos & Payouts</span>
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(t)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Educator"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Teacher Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingTeacher ? `Edit ${editingTeacher.name}` : 'Add New Faculty Member'}
        subtitle="Configure educator details, permanent Google Meet link, and demo payout rate"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveTeacher} className="space-y-4 text-left text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Shweta Rao"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#F27C00] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. shweta@upspeaq.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#F27C00] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 block">Phone Number (10 Digits)</label>
                <span className="text-[10px] text-slate-400 font-medium">
                  {formData.phone.replace(/^\+91/, '').replace(/\D/g, '').length}/10 digits
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-slate-500 font-semibold">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.phone.replace(/^\+91/, '').replace(/\D/g, '').slice(0, 10)}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({ ...formData, phone: digits });
                  }}
                  placeholder="9876543210"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#F27C00] focus:outline-none font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-[#F27C00] focus:outline-none"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="ON_LEAVE">ON_LEAVE</option>
              </select>
            </div>
          </div>

          {/* Google Meet & Payout Highlight Box */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <Video className="w-4 h-4 text-[#F27C00]" />
              <span>Permanent Meeting Link & Demo Compensation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-slate-700 block text-[11px]">
                  Teacher's Permanent Google Meet Link
                </label>
                <input
                  type="text"
                  value={formData.googleMeetLink}
                  onChange={(e) => setFormData({ ...formData, googleMeetLink: e.target.value })}
                  placeholder="https://meet.google.com/xxx-yyyy-zzz"
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white focus:ring-2 focus:ring-[#F27C00] focus:outline-none text-xs"
                />
                <p className="text-[10px] text-slate-500">
                  When this teacher claims a demo, this exact link is attached and sent to the student automatically.
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block text-[11px]">
                  Payout / Demo (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.payoutPerDemo}
                  onChange={(e) => setFormData({ ...formData, payoutPerDemo: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-bold text-slate-900 focus:ring-2 focus:ring-[#F27C00] focus:outline-none text-xs"
                />
                <p className="text-[10px] text-slate-500">Default: ₹150 per completed demo</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Expertise / Subject Areas</label>
              <input
                type="text"
                value={formData.expertise}
                onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                placeholder="e.g. Public Speaking, Debate, Storytelling"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#F27C00] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Qualifications & Experience</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="e.g. M.A. English, 7+ Years Experience"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#F27C00] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Biography / Short Intro</label>
            <textarea
              rows={2}
              value={formData.biography}
              onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
              placeholder="Short description for student/parent view..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#F27C00] focus:outline-none resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-[#F27C00] hover:bg-orange-600 text-white font-bold shadow-xs transition-colors cursor-pointer"
            >
              {submitting ? 'Saving...' : editingTeacher ? 'Update Teacher' : 'Add Teacher'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Teacher Demos & Payouts Breakdown Drawer / Modal */}
      <Modal
        isOpen={!!viewingTeacherDemos}
        onClose={() => setViewingTeacherDemos(null)}
        title={viewingTeacherDemos ? `${viewingTeacherDemos.name}'s Demos & Payout Ledger` : 'Demo Ledger'}
        subtitle="Itemized breakdown of all evaluation demos taken and calculated payouts @ ₹150/demo"
        maxWidth="2xl"
      >
        <div className="space-y-4 text-left text-xs">
          {/* Header summary banner */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <span>{viewingTeacherDemos?.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  {viewingTeacherDemos?.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Permanent Room:{' '}
                <span className="text-slate-200">
                  {viewingTeacherDemos?.google_meet_link || 'Not set'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-semibold">Total Payout Calculated</div>
              <div className="text-2xl font-black text-emerald-400">
                ₹{((viewingTeacherDemos?.completed_demos || 0) * (viewingTeacherDemos?.payout_per_demo || 150)).toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-400">
                {viewingTeacherDemos?.completed_demos || 0} completed demos × ₹{viewingTeacherDemos?.payout_per_demo || 150}
              </div>
            </div>
          </div>

          {/* Demos Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Student & Class</th>
                    <th className="py-2.5 px-3">Date & Slot</th>
                    <th className="py-2.5 px-3">Evaluation Outcome</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Demo Payout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {demosLoading ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        Loading demo ledger...
                      </td>
                    </tr>
                  ) : teacherDemos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        No demo sessions assigned to this teacher yet.
                      </td>
                    </tr>
                  ) : (
                    teacherDemos.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{d.student_name}</div>
                          <div className="text-[10px] text-slate-500">{d.student_class || 'Class 6'}</div>
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-800">{d.date}</div>
                          <div className="text-[10px] text-slate-500">{d.start_time} - {d.end_time}</div>
                        </td>

                        <td className="py-2.5 px-3">
                          {d.evaluation_outcome ? (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {d.evaluation_outcome}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Evaluation pending</span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              d.is_completed
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {d.is_completed ? 'COMPLETED' : d.status}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          {d.is_completed ? (
                            <div className="font-black text-emerald-700 text-xs">
                              +₹{d.payout_amount}
                            </div>
                          ) : (
                            <div className="text-slate-400 text-[10px] font-semibold">
                              Pending (₹{viewingTeacherDemos?.payout_per_demo || 150})
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              onClick={() => setViewingTeacherDemos(null)}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Close Ledger
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
