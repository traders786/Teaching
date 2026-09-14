import React, { useState, useEffect } from 'react';
import { Lead, Teacher, Course, Batch } from '../../types';
import { api } from '../../lib/api';
import { Badge } from '../ui/Badge';
import {
  Search,
  Filter,
  Plus,
  RefreshCw,
  Phone,
  MessageCircle,
  Calendar,
  CreditCard,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Modal } from '../ui/Modal';

interface LeadsViewProps {
  teachers: Teacher[];
  courses: Course[];
  batches: Batch[];
  onOpenLeadDetail: (lead: Lead) => void;
  onSuccessToast: (msg: string) => void;
  onErrorToast: (msg: string) => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  teachers,
  courses,
  batches,
  onOpenLeadDetail,
  onSuccessToast,
  onErrorToast,
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Manual Lead Creation
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('Class 6');
  const [newParentName, setNewParentName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadLeads();
  }, [statusFilter]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const res = await api.getLeads({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      setLeads(res.leads || []);
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatusChange = async (leadId: string, newStatus: string) => {
    try {
      await api.updateLeadStatus(leadId, newStatus);
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus as any } : l))
      );
      onSuccessToast(`Status changed to ${newStatus}`);
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to update status');
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.createLead({
        student_name: newStudentName.trim(),
        student_class: newStudentClass,
        parent_name: newParentName.trim(),
        mobile_number: newPhone.trim(),
        email: newEmail.trim() || undefined,
        city: newCity.trim() || undefined,
        notes: newNotes.trim() || undefined,
        lead_source: 'MANUAL_PHONE_INQUIRY',
      });
      setShowCreateModal(false);
      setNewStudentName('');
      setNewParentName('');
      setNewPhone('');
      setNewEmail('');
      setNewCity('');
      setNewNotes('');
      loadLeads();
      onSuccessToast('New lead recorded successfully');
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to record lead');
    } finally {
      setCreating(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      lead.student_name.toLowerCase().includes(q) ||
      lead.parent_name.toLowerCase().includes(q) ||
      lead.mobile_number.includes(q) ||
      (lead.city && lead.city.toLowerCase().includes(q)) ||
      (lead.email && lead.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-6 md:p-8 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Leads & Admissions Pipeline</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage inquiries, advance parents through evaluation demos, and issue fee invoices
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadLeads()}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            title="Refresh Leads"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Inbound Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by student name, parent phone, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Funnel Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            'ALL',
            'NEW',
            'CONTACTED',
            'DEMO_SCHEDULED',
            'DEMO_ATTENDED',
            'INTERESTED',
            'PAYMENT_REQUESTED',
            'PAID',
            'NOT_INTERESTED',
          ].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {status === 'ALL' ? 'All Leads' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Student & Grade</th>
                <th className="py-3 px-4">Parent & Contact</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Interest Area</th>
                <th className="py-3 px-4">Funnel Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    {loading ? 'Fetching pipeline...' : 'No leads found matching current criteria.'}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onOpenLeadDetail(lead)}
                        className="font-bold text-slate-900 hover:text-amber-700 block text-left"
                      >
                        {lead.student_name}
                      </button>
                      <span className="text-[11px] text-slate-500">
                        {lead.student_class} {lead.student_age ? `• ${lead.student_age} yrs` : ''}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{lead.parent_name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>{lead.mobile_number}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">{lead.city || '—'}</td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px]">
                        {lead.interest_area || 'Confidence'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleQuickStatusChange(lead.id, e.target.value)}
                        className="text-[11px] font-bold py-1 px-2 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="DEMO_SCHEDULED">DEMO_SCHEDULED</option>
                        <option value="DEMO_ATTENDED">DEMO_ATTENDED</option>
                        <option value="INTERESTED">INTERESTED</option>
                        <option value="PAYMENT_REQUESTED">PAYMENT_REQUESTED</option>
                        <option value="PAID">PAID</option>
                        <option value="NOT_INTERESTED">NOT_INTERESTED</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://wa.me/91${lead.mobile_number.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                          title="WhatsApp Parent"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => onOpenLeadDetail(lead)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 font-semibold text-[11px] transition-colors"
                        >
                          Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Add Lead Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Record New Inbound Inquiry"
        subtitle="Manually register an incoming phone or offline enquiry"
        maxWidth="md"
      >
        <form onSubmit={handleCreateLead} className="space-y-4 text-left text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Student Name *</label>
            <input
              type="text"
              required
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              placeholder="e.g. Vivaan Sharma"
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Grade / Class *</label>
              <select
                value={newStudentClass}
                onChange={(e) => setNewStudentClass(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="Class 4">Class 4</option>
                <option value="Class 5">Class 5</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Parent Name *</label>
              <input
                type="text"
                required
                value={newParentName}
                onChange={(e) => setNewParentName(e.target.value)}
                placeholder="e.g. Sunita Sharma"
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Mobile Number *</label>
              <input
                type="tel"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">City</label>
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="e.g. Pune"
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Parent Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="parent@example.com"
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Notes from Call</label>
            <textarea
              rows={2}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Parents want weekend evening slot..."
              className="w-full p-2.5 rounded-lg border border-slate-300 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 rounded-lg bg-amber-600 text-white font-bold"
            >
              {creating ? 'Saving...' : 'Add Inbound Lead'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
