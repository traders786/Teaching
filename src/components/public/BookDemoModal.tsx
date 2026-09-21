import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Modal } from '../ui/Modal';
import { api, setStoredToken } from '../../lib/api';
import { BrandingConfig } from '../../types';
import { ArrowRight, CheckCircle2, AlertCircle, Sparkles, User, ShieldCheck, Zap } from 'lucide-react';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: BrandingConfig;
  onSuccessToast: (msg: string) => void;
  onDemoBookedSuccess?: (user: any, token: string) => void;
}

export const BookDemoModal: React.FC<BookDemoModalProps> = ({
  isOpen,
  onClose,
  branding,
  onSuccessToast,
  onDemoBookedSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<{
    reference: string;
    studentName: string;
  } | null>(null);
  const [authPayload, setAuthPayload] = useState<{ user: any; token: string } | null>(null);

  // Form Fields
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('Class 6');
  const [studentAge, setStudentAge] = useState('11');

  const [parentName, setParentName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');

  const [interestArea, setInterestArea] = useState('Confidence Building');
  const [preferredTime, setPreferredTime] = useState('Weekday Evening (5:00 PM - 7:00 PM)');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(true);

  const resetForm = () => {
    setStep(1);
    setLoading(false);
    setError(null);
    setBookingResult(null);
    setAuthPayload(null);
    setStudentName('');
    setStudentClass('Class 6');
    setStudentAge('11');
    setParentName('');
    setMobileNumber('');
    setEmail('');
    setCity('');
    setInterestArea('Confidence Building');
    setPreferredTime('Weekday Evening (5:00 PM - 7:00 PM)');
    setNotes('');
    setConsent(true);
  };

  useEffect(() => {
    if (bookingResult && authPayload && onDemoBookedSuccess) {
      const timer = setTimeout(() => {
        onDemoBookedSuccess(authPayload.user, authPayload.token);
        resetForm();
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [bookingResult, authPayload]);

  const handleNextStep = () => {
    setError(null);
    if (step === 1) {
      if (!studentName.trim()) {
        setError("Please provide the student's name.");
        return;
      }
      if (!studentClass) {
        setError('Please select a grade/class.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!parentName.trim()) {
        setError("Please provide the parent or guardian's name.");
        return;
      }
      const cleanDigits = mobileNumber.replace(/\D/g, '');
      if (cleanDigits.length < 10) {
        setError('Please enter a valid 10-digit mobile number for demo coordination.');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!consent) {
      setError('Please accept consent to be contacted regarding the demo session.');
      return;
    }

    setLoading(true);

    try {
      // Parse UTM parameters from URL if present
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source') || undefined;
      const utmMedium = urlParams.get('utm_medium') || undefined;
      const utmCampaign = urlParams.get('utm_campaign') || undefined;
      const referralCode = urlParams.get('ref') || undefined;

      let leadSource = 'ORGANIC';
      if (utmSource) {
        const lower = utmSource.toLowerCase();
        if (lower.includes('meta') || lower.includes('fb') || lower.includes('facebook')) leadSource = 'META_ADS';
        else if (lower.includes('insta')) leadSource = 'INSTAGRAM';
        else if (lower.includes('google')) leadSource = 'GOOGLE';
        else if (lower.includes('partner')) leadSource = 'EDUCATION_PARTNER';
        else leadSource = 'OTHER';
      }

      const res = await api.bookDemo({
        studentName: studentName.trim(),
        studentClass,
        studentAge: studentAge ? parseInt(studentAge, 10) : undefined,
        parentName: parentName.trim(),
        mobileNumber: mobileNumber.trim(),
        email: email ? email.trim() : undefined,
        city: city ? city.trim() : undefined,
        interestArea,
        preferredTime,
        notes: notes.trim() || undefined,
        leadSource,
        utmSource,
        utmMedium,
        utmCampaign,
        consent,
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      if (res.token && res.user) {
        setStoredToken(res.token);
        setAuthPayload({ user: res.user, token: res.token });
      }

      setBookingResult({
        reference: res.bookingReference,
        studentName: res.studentName,
      });

      onSuccessToast('Demo session booked successfully! Redirecting to student dashboard...');
    } catch (err: any) {
      setError(err.message || 'Unable to book demo. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title={bookingResult ? 'Demo Scheduled!' : 'Book a Free Interactive Demo'}
      subtitle={
        bookingResult
          ? 'Instant student access generated • Redirecting in 3s'
          : `Step ${step} of 3 • 45-min live micro-session with expert coach`
      }
      maxWidth="lg"
    >
      {bookingResult ? (
        /* Success Screen */
        <div className="text-center py-6 space-y-6 text-left">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-bold text-slate-900">Thank You, {parentName}!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              We have scheduled the live demo session for{' '}
              <strong className="text-slate-900">{bookingResult.studentName}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-slate-600 space-y-2 text-left">
            <div className="flex justify-between items-center py-1 border-b border-stone-200">
              <span className="text-slate-500">Booking Reference:</span>
              <span className="font-mono font-bold text-slate-900">{bookingResult.reference}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-stone-200">
              <span className="text-slate-500">Student Grade:</span>
              <span className="font-semibold text-slate-900">{studentClass}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Contact Number:</span>
              <span className="font-semibold text-slate-900">{mobileNumber}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 text-left space-y-1">
            <strong className="block font-bold">What's ready in your portal?</strong>
            <p>
              Your demo schedule, assigned coach, Google Meet classroom link, and full course catalog are now ready in your Student Portal.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              id="btn_demo_enter_dashboard"
              type="button"
              onClick={() => {
                if (authPayload && onDemoBookedSuccess) {
                  onDemoBookedSuccess(authPayload.user, authPayload.token);
                }
                resetForm();
                onClose();
              }}
              className="w-full py-3.5 rounded-xl bg-[#F27C00] hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🚀 ENTER STUDENT DASHBOARD (VIEW DEMO & COURSES)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn_demo_success_done"
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Back to Website
            </button>
          </div>
        </div>
      ) : (
        /* Multi-Step Form */
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Stepper Indicator */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className={`flex-1 text-center text-xs pb-1 border-b-2 font-semibold ${step >= 1 ? 'border-amber-600 text-amber-900' : 'border-slate-200 text-slate-400'}`}>
              1. Student
            </div>
            <div className={`flex-1 text-center text-xs pb-1 border-b-2 font-semibold ${step >= 2 ? 'border-amber-600 text-amber-900' : 'border-slate-200 text-slate-400'}`}>
              2. Parent Details
            </div>
            <div className={`flex-1 text-center text-xs pb-1 border-b-2 font-semibold ${step === 3 ? 'border-amber-600 text-amber-900' : 'border-slate-200 text-slate-400'}`}>
              3. Timing & Goals
            </div>
          </div>

          {/* STEP 1: STUDENT DETAILS */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Student's Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input_student_name"
                  type="text"
                  required
                  placeholder="e.g. Aarav Mehta"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Current Class / Grade <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="select_student_class"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-slate-900 bg-white"
                  >
                    <option value="Class 4">Class 4 (Junior)</option>
                    <option value="Class 5">Class 5 (Junior)</option>
                    <option value="Class 6">Class 6 (Junior)</option>
                    <option value="Class 7">Class 7 (Junior)</option>
                    <option value="Class 8">Class 8 (Senior)</option>
                    <option value="Class 9">Class 9 (Senior)</option>
                    <option value="Class 10">Class 10 (Senior)</option>
                    <option value="Class 11">Class 11 (Senior)</option>
                    <option value="Class 12">Class 12 (Senior)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Student Age</label>
                  <input
                    id="input_student_age"
                    type="number"
                    min={8}
                    max={19}
                    placeholder="e.g. 11"
                    value={studentAge}
                    onChange={(e) => setStudentAge(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="btn_step1_next"
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue to Parent Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PARENT DETAILS */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Parent / Guardian Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input_parent_name"
                  type="text"
                  required
                  placeholder="e.g. Rajesh Mehta"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-semibold text-slate-500">+91</span>
                  <input
                    id="input_mobile_number"
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98765 43210"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-slate-900"
                  />
                </div>
                <span className="text-[11px] text-slate-500">We send demo schedule link via WhatsApp/SMS</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Email Address</label>
                  <input
                    id="input_email"
                    type="email"
                    placeholder="parent@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">City</label>
                  <input
                    id="input_city"
                    type="text"
                    placeholder="e.g. Mumbai, Delhi, Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  id="btn_step2_next"
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue to Timing</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: INTEREST & PREFERENCE */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Program Track of Interest
                </label>
                <select
                  id="select_interest_area"
                  value={interestArea}
                  onChange={(e) => setInterestArea(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-slate-900 bg-white"
                >
                  <option value="3-Month Flagship (₹4,999 Total) - Small-Group Batch">3-Month Flagship Cohort (₹4,999 Total) — Small-Group Batch (Free Demo)</option>
                  <option value="1-Month Starter (₹1,999/mo) - Small-Group Batch">1-Month Starter Cohort (₹1,999/mo) — Small-Group Batch (Free Demo)</option>
                  <option value="1-on-1 Individual Mentorship (₹5,000/mo) - Private Classes">1-on-1 Individual Mentorship (₹5,000/mo) — Private Classes (Free Demo)</option>
                  <option value="Confidence Building & Fluency (Recommend in Demo)">General Evaluation / Recommend Program in Free Demo</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Preferred Demo Timing
                </label>
                <select
                  id="select_preferred_time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-slate-900 bg-white"
                >
                  <option value="Weekday Evening (5:00 PM - 7:00 PM)">Weekday Evening (5:00 PM - 7:00 PM)</option>
                  <option value="Weekday Evening (7:00 PM - 8:30 PM)">Weekday Evening (7:00 PM - 8:30 PM)</option>
                  <option value="Saturday Morning (10:30 AM - 12:30 PM)">Saturday Morning (10:30 AM - 12:30 PM)</option>
                  <option value="Sunday Morning (10:30 AM - 12:30 PM)">Sunday Morning (10:30 AM - 12:30 PM)</option>
                  <option value="Flexible / Contact to Coordinate">Flexible / Contact to Coordinate</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Anything specific you would like the teacher to know? (Optional)
                </label>
                <textarea
                  id="input_demo_notes"
                  rows={2}
                  placeholder="e.g. Hesitates when answering in school, speaks well with family but freezes in public."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-slate-900 resize-none"
                />
              </div>

              {/* Parental Consent */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                  <input
                    id="checkbox_consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span>
                    I confirm that I am the parent/guardian of {studentName || 'this student'}. I consent to receiving
                    demo scheduling notifications and academic guidance via Phone/WhatsApp.
                  </span>
                </label>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  id="btn_submit_demo_booking"
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span>Registering Demo...</span>
                  ) : (
                    <>
                      <span>CONFIRM FREE DEMO BOOKING</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </Modal>
  );
};
