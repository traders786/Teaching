import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../../lib/api';
import { Payment, BrandingConfig } from '../../types';
import { ShieldCheck, CheckCircle2, AlertCircle, CreditCard, Smartphone, Building, ArrowLeft, ArrowRight } from 'lucide-react';
import { Logo } from '../ui/Logo';

interface ParentPaymentPortalProps {
  paymentId: string;
  branding: BrandingConfig;
  onBackToHome: () => void;
  onSuccessToast: (msg: string) => void;
}

export const ParentPaymentPortal: React.FC<ParentPaymentPortalProps> = ({
  paymentId,
  branding,
  onBackToHome,
  onSuccessToast,
}) => {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Payment processing state
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [upiId, setUpiId] = useState('parent@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 8821 9012 3456');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [createdStudentId, setCreatedStudentId] = useState<string | null>(null);

  useEffect(() => {
    loadPayment();
  }, [paymentId]);

  const loadPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getPaymentById(paymentId);
      setPayment(res.payment);
      if (res.payment.status === 'PAID') {
        setPaymentSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Payment request not found or link has expired.');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      const txnRef = 'txn_' + selectedMethod.toLowerCase() + '_' + Date.now().toString(36);
      const res = await api.processPublicPayment(paymentId, {
        paymentMethod: selectedMethod,
        transactionRef: txnRef,
      });

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
      });

      setPayment(res.payment);
      setPaymentSuccess(true);
      if (res.studentId) setCreatedStudentId(res.studentId);
      onSuccessToast('Payment successfully verified! Enrollment activated.');
    } catch (err: any) {
      setError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center p-6 text-slate-600">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium">Securing enrollment invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900">Payment Link Unavailable</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{error || 'This payment link is invalid or expired.'}</p>
          <button
            onClick={onBackToHome}
            className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F6F2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="flex items-center gap-3">
            <Logo theme="light" size="md" />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-4 h-4" />
              <span>256-bit Bank-Grade Security</span>
            </div>
          </div>
        </div>

        {paymentSuccess ? (
          /* Payment Completed / Enrollment Activated Screen */
          <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl p-8 sm:p-12 text-center space-y-8">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block">
                Enrollment Confirmed & Active
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">Welcome to {branding.brandName}!</h2>
              <p className="text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
                Payment of <strong className="text-slate-900">₹{payment.amount_inr.toLocaleString('en-IN')}</strong> has
                been securely verified. <strong className="text-slate-900">{payment.student_name}</strong> is now
                officially enrolled in the {payment.course_name}.
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-lg mx-auto space-y-3 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900">{payment.student_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Course:</span>
                <span className="font-semibold text-slate-900">{payment.course_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Parent / Guardian:</span>
                <span className="font-semibold text-slate-900">{payment.parent_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Transaction Ref:</span>
                <span className="font-mono text-slate-900">{payment.gateway_payment_id || 'VERIFIED'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-700 uppercase">ACTIVE ENROLLMENT</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 text-left max-w-lg mx-auto space-y-1">
              <strong className="block font-bold">Onboarding & Next Steps:</strong>
              <p>
                Our lead coordinator has assigned your child's batch. You will receive the batch timetable, Google Meet
                access links, and orientation kit on WhatsApp ({payment.parent_phone}).
              </p>
            </div>

            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              <span>Back to Main Page</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Payment Form */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="p-8 sm:p-10 border-b border-slate-100 space-y-3 bg-stone-50/50 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded-md border border-amber-200">
                  Official Admission Invoice
                </span>
                <span className="text-xs text-slate-500 font-mono">Invoice #{payment.id}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{payment.course_name}</h2>
              <p className="text-xs text-slate-600">
                3-Month Live Cohort • 36 Interactive Classes • Intimate Small-Group Batches
              </p>
            </div>

            {/* Content Body */}
            <div className="p-8 sm:p-10 space-y-8 text-left">
              {/* Student Dossier */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-slate-700">
                <div>
                  <span className="text-slate-400 block mb-0.5">Student Name</span>
                  <strong className="text-slate-900 font-bold block">{payment.student_name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Parent / Guardian</span>
                  <strong className="text-slate-900 font-bold block">{payment.parent_name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Contact Phone</span>
                  <strong className="text-slate-900 font-bold block">{payment.parent_phone}</strong>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 border-b border-slate-100 pb-6 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>3-Month Live Communication Program (36 Classes)</span>
                  <span className="font-semibold text-slate-900">₹{payment.amount_inr.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-xs">
                  <span>Study materials & progress certification</span>
                  <span className="text-emerald-700 font-medium">Included (₹0)</span>
                </div>
                <div className="flex justify-between items-baseline pt-4 text-base font-extrabold text-slate-900 border-t border-slate-200">
                  <span>Total Payable Amount</span>
                  <span className="text-2xl text-amber-700">₹{payment.amount_inr.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <form onSubmit={handlePay} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                    Choose Indian Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('UPI')}
                      className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        selectedMethod === 'UPI'
                          ? 'border-amber-600 bg-amber-50/50 text-amber-900 ring-2 ring-amber-500/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Smartphone className="w-5 h-5" />
                      <span className="text-xs font-bold">UPI / QR</span>
                      <span className="text-[10px] text-slate-400">GPay, PhonePe</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('CARD')}
                      className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        selectedMethod === 'CARD'
                          ? 'border-amber-600 bg-amber-50/50 text-amber-900 ring-2 ring-amber-500/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span className="text-xs font-bold">Card</span>
                      <span className="text-[10px] text-slate-400">Debit / Credit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('NETBANKING')}
                      className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        selectedMethod === 'NETBANKING'
                          ? 'border-amber-600 bg-amber-50/50 text-amber-900 ring-2 ring-amber-500/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Building className="w-5 h-5" />
                      <span className="text-xs font-bold">NetBanking</span>
                      <span className="text-[10px] text-slate-400">All Major Banks</span>
                    </button>
                  </div>
                </div>

                {/* Method specifics */}
                {selectedMethod === 'UPI' && (
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">UPI Virtual Payment Address (VPA)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white"
                    />
                    <span className="text-[11px] text-slate-500 block">
                      A payment request prompt will be verified instantly upon confirmation.
                    </span>
                  </div>
                )}

                {selectedMethod === 'CARD' && (
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block">Expiry Date</label>
                        <input
                          type="text"
                          defaultValue="12/28"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block">CVV</label>
                        <input
                          type="password"
                          defaultValue="•••"
                          maxLength={4}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === 'NETBANKING' && (
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">Select Your Bank</label>
                    <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white">
                      <option>HDFC Bank</option>
                      <option>State Bank of India (SBI)</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                <button
                  id="btn_complete_payment"
                  type="submit"
                  disabled={processing}
                  className="w-full py-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {processing ? (
                    <span>Verifying with Payment Gateway...</span>
                  ) : (
                    <>
                      <span>Complete Payment of ₹{payment.amount_inr.toLocaleString('en-IN')}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  Backed by bank-grade security. 100% money-back guarantee if batch schedule is unsuitable.
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
