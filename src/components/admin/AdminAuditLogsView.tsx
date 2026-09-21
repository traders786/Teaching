import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Clock, User, Layers, ArrowUpDown } from 'lucide-react';

export function AdminAuditLogsView() {
  const [search, setSearch] = useState('');

  // Sample structured audit logs representing real DB activity
  const sampleLogs = [
    {
      id: 'log_1',
      actor_name: 'Head Administrator',
      actor_role: 'SUPER_ADMIN',
      action: 'DEMO_ASSIGNED',
      entity_type: 'DEMO_SESSION',
      entity_id: 'demo_session_1',
      details: 'Assigned Demo Slot A to Teacher Ananya Sharma for Student Diya Patel.',
      timestamp: '2026-09-18 10:30:00',
    },
    {
      id: 'log_2',
      actor_name: 'Ananya Sharma',
      actor_role: 'TEACHER',
      action: 'EVALUATION_SUBMITTED',
      entity_type: 'DEMO_EVALUATION',
      entity_id: 'eval_1',
      details: 'Submitted demo evaluation for Diya Patel (Outcome: Recommended).',
      timestamp: '2026-09-18 11:15:00',
    },
    {
      id: 'log_3',
      actor_name: 'Payment Gateway',
      actor_role: 'SYSTEM',
      action: 'PAYMENT_VERIFIED',
      entity_type: 'PAYMENT',
      entity_id: 'pay_103',
      details: 'Payment of ₹4,999 verified for Kabir Verma via Razorpay.',
      timestamp: '2026-09-17 18:20:00',
    },
    {
      id: 'log_4',
      actor_name: 'Head Administrator',
      actor_role: 'SUPER_ADMIN',
      action: 'STUDENT_ENROLLED',
      entity_type: 'STUDENT',
      entity_id: 'std_1',
      details: 'Enrolled Kabir Verma into Junior Orators Cohort Batch J04.',
      timestamp: '2026-09-17 18:25:00',
    },
    {
      id: 'log_5',
      actor_name: 'Ananya Sharma',
      actor_role: 'TEACHER',
      action: 'ATTENDANCE_MARKED',
      entity_type: 'CLASS_SESSION',
      entity_id: 'cs_1',
      details: 'Marked 5 students present for Session 1 (Speaking Without Hesitation).',
      timestamp: '2026-09-15 17:50:00',
    },
  ];

  const filtered = sampleLogs.filter(
    (l) =>
      l.actor_name.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#10182C] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#F27C00]" />
            <span>Platform Security & Audit Trail</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable audit records of all logins, demo assignments, evaluations, enrollments, and payments.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit actions..."
            className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27C00]"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {log.actor_name}
                    <span className="block text-[10px] text-slate-400 font-normal">{log.actor_role}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {log.entity_type}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-sm">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
