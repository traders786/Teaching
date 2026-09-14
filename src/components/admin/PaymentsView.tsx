import React, { useState, useEffect } from 'react';
import { Payment } from '../../types';
import { api } from '../../lib/api';
import { Badge } from '../ui/Badge';
import {
  CreditCard,
  Search,
  RefreshCw,
  Copy,
  CheckCircle2,
  ExternalLink,
  IndianRupee,
  Clock,
  Sparkles,
} from 'lucide-react';

interface PaymentsViewProps {
  onSuccessToast: (msg: string) => void;
  onErrorToast: (msg: string) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({ onSuccessToast, onErrorToast }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadPayments();
  }, [filterStatus]);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const res = await api.getPayments({
        status: filterStatus !== 'ALL' ? filterStatus : undefined,
      });
      setPayments(res.payments || []);
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (paymentId: string) => {
    const url = `${window.location.origin}?pay=${paymentId}`;
    navigator.clipboard.writeText(url);
    onSuccessToast('Payment invoice link copied!');
  };

  const handleMarkPaid = async (paymentId: string) => {
    try {
      await api.updatePaymentStatus(paymentId, 'PAID', {
        paymentMethod: 'OFFLINE_BANK_TRANSFER',
        gatewayPaymentId: 'bank_neft_' + Date.now().toString(36),
      });
      loadPayments();
      onSuccessToast('Payment marked as PAID. Student enrollment activated!');
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to update payment');
    }
  };

  const filtered = payments.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.student_name.toLowerCase().includes(q) ||
      p.parent_name.toLowerCase().includes(q) ||
      p.parent_phone.includes(q) ||
      p.id.toLowerCase().includes(q)
    );
  });

  const totalPaid = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount_inr, 0);

  return (
    <div className="p-6 md:p-8 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Payments & Invoicing</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor transaction status, generate payment links, and verify enrollment completions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadPayments}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            title="Refresh Payments"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metric Callout */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Total Verified Fees Collected</span>
            <span className="text-2xl font-extrabold text-slate-900">
              ₹{totalPaid.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Every verified payment triggers auto-enrollment into an 8-student batch.</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by invoice ID, student or parent phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['ALL', 'PENDING', 'PAID', 'FAILED', 'REFUNDED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st === 'ALL' ? 'All Invoices' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Invoice Ref</th>
                <th className="py-3 px-4">Student & Parent</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method & Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    {loading ? 'Retrieving invoices...' : 'No payment records found.'}
                  </td>
                </tr>
              ) : (
                filtered.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      #{payment.id.slice(0, 8)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{payment.student_name}</div>
                      <div className="text-[11px] text-slate-500">
                        {payment.parent_name} • {payment.parent_phone}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {payment.course_name}
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      ₹{payment.amount_inr.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{payment.payment_method || 'Online Link'}</div>
                      <div className="text-[11px] text-slate-400">
                        {payment.created_at?.slice(0, 10)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant="payment" value={payment.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleCopyLink(payment.id)}
                          className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Copy Public Payment Link"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {payment.status === 'PENDING' && (
                          <button
                            onClick={() => handleMarkPaid(payment.id)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[11px] transition-colors cursor-pointer"
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
