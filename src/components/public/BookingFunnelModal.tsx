import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  ChevronLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  MessageSquare,
  Mail,
  Smartphone,
  Loader2,
  ExternalLink,
  Download,
  FileText,
} from 'lucide-react';
import { api, getStoredUtmParams } from '../../lib/api';

export interface BookingLeadData {
  studentName: string;
  studentClass: string;
  parentName?: string;
  mobileNumber: string;
  email: string;
  hasLaptop?: boolean;
  understandsEnglish?: boolean;
  whatsappUpdates?: boolean;
}

// Resolve Curriculum & Worksheets PDF by Grade
export const getCurriculumPdfUrl = (grade?: string) => {
  const cleanGrade = (grade || '').toLowerCase();
  if (cleanGrade.includes('10')) {
    return '/curriculum/upspeaq-class-10-curriculum.pdf';
  }
  if (cleanGrade.includes('9')) {
    return '/curriculum/upspeaq-class-9-curriculum.pdf';
  }
  if (cleanGrade.includes('8')) {
    return '/curriculum/upspeaq-class-8-curriculum.pdf';
  }
  if (cleanGrade.includes('7')) {
    return '/curriculum/upspeaq-class-7-curriculum.pdf';
  }
  if (cleanGrade.includes('6')) {
    return '/curriculum/upspeaq-class-6-curriculum.pdf';
  }
  if (cleanGrade.includes('5')) {
    return '/curriculum/upspeaq-class-5-curriculum.pdf';
  }
  if (cleanGrade.includes('4')) {
    return '/curriculum/upspeaq-class-4-curriculum.pdf';
  }
  if (cleanGrade.includes('3')) {
    return '/curriculum/upspeaq-class-3-curriculum.pdf';
  }
  if (cleanGrade.includes('2')) {
    return '/curriculum/upspeaq-class-2-curriculum.pdf';
  }
  // Default to Class 1 for UKG / Class 1
  return '/curriculum/upspeaq-class-1-curriculum.pdf';
};

interface BookingFunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: BookingLeadData | null;
  onBookingComplete?: (bookingInfo: any) => void;
  onNavigateToDemoPortal?: (leadId: string) => void;
}

type FunnelStep = 'ENTER_DETAILS' | 'SLOT_SELECTION' | 'OTP_VERIFICATION' | 'THANK_YOU';

export const BookingFunnelModal: React.FC<BookingFunnelModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onBookingComplete,
  onNavigateToDemoPortal,
}) => {
  const [step, setStep] = useState<FunnelStep>('ENTER_DETAILS');
  const [formData, setFormData] = useState<BookingLeadData>({
    studentName: '',
    studentClass: 'Grade 4',
    parentName: '',
    mobileNumber: '',
    email: '',
    hasLaptop: true,
    understandsEnglish: true,
    whatsappUpdates: true,
  });

  const [detailsError, setDetailsError] = useState<string | null>(null);

  // Slot Picker State
  const [availableDates, setAvailableDates] = useState<{ label: string; fullDate: string; dayName: string; dateNum: string; monthStr: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00 AM');

  // OTP State
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Confirmed Booking State
  const [bookingResult, setBookingResult] = useState<{
    leadId: string;
    demoId: string;
    meetingLink: string;
    date: string;
    timeSlot: string;
    dateFormatted?: string;
  } | null>(null);

  // Survey State
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [surveyParentName, setSurveyParentName] = useState<string>('');
  const [surveySubmitted, setSurveySubmitted] = useState<boolean>(false);
  const [isSubmittingSurvey, setIsSubmittingSurvey] = useState<boolean>(false);

  // Reset or initialize state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData && initialData.mobileNumber && initialData.email) {
        setFormData((prev) => ({
          ...prev,
          ...initialData,
          parentName: initialData.parentName || `Parent of ${initialData.studentName}`,
        }));
        setSurveyParentName(initialData.parentName || '');
        setStep('SLOT_SELECTION');
      } else {
        setStep('ENTER_DETAILS');
      }
      setOtp(['', '', '', '']);
      setOtpError(null);
      setDetailsError(null);
      setSurveySubmitted(false);
    }
  }, [isOpen, initialData]);

  // Generate dynamic next 5 days
  useEffect(() => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 5; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const dateNum = d.getDate().toString();
      const monthStr = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const fullDate = d.toISOString().slice(0, 10);
      dates.push({
        label: `${dayName} ${dateNum} ${monthStr}`,
        fullDate,
        dayName,
        dateNum,
        monthStr,
      });
    }
    setAvailableDates(dates);
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0].fullDate);
    }
  }, []);

  // Resend Timer Countdown
  useEffect(() => {
    let interval: any = null;
    if (step === 'OTP_VERIFICATION' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  // Time Slot Options matching Bhanzu screenshots
  const daySlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
  const eveningSlots = ['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'];

  // Handle Details Form Submit -> Move to Slot Selection
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDetailsError(null);

    const cleanMobile = formData.mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setDetailsError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      setDetailsError('Please enter a valid email address');
      return;
    }

    if (!formData.studentName.trim()) {
      setDetailsError('Please enter your child’s name');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      mobileNumber: cleanMobile,
      parentName: prev.parentName || `Parent of ${prev.studentName.trim()}`,
    }));
    setSurveyParentName(formData.parentName || `Parent of ${formData.studentName.trim()}`);
    setStep('SLOT_SELECTION');
  };

  // Handle Slot Selection Submit -> Request OTP
  const handleProceedToOtp = async () => {
    setIsSendingOtp(true);
    setOtpError(null);

    try {
      await api.sendOtp({
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        studentName: formData.studentName,
      });

      setResendTimer(30);
      setCanResend(false);
      setStep('OTP_VERIFICATION');
    } catch (err: any) {
      setResendTimer(30);
      setCanResend(false);
      setStep('OTP_VERIFICATION');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle OTP Input Change
  const handleOtpChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleanVal;
    setOtp(newOtp);

    // Auto advance focus
    if (cleanVal && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto trigger verification when all 4 boxes filled
    if (cleanVal && index === 3 && newOtp.every((d) => d !== '')) {
      submitOtpVerification(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Resend OTP Trigger (Strictly Email)
  const handleResendOtp = async () => {
    setIsSendingOtp(true);
    setOtp(['', '', '', '']);
    setOtpError(null);
    try {
      await api.sendOtp({
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        studentName: formData.studentName,
      });
      setResendTimer(30);
      setCanResend(false);
    } catch (err: any) {
      setResendTimer(30);
      setCanResend(false);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP & Book Slot
  const submitOtpVerification = async (enteredOtp?: string) => {
    const codeToVerify = enteredOtp || otp.join('');
    if (codeToVerify.length !== 4) {
      setOtpError('Please enter the full 4-digit code.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);

    try {
      // 1. Verify OTP with backend
      await api.verifyOtp({
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        otp: codeToVerify,
      });

      // 2. Book Slot with Google Meet + Gmail SMTP Confirmation Email + UTM tracking
      const utm = getStoredUtmParams();
      const bookingRes = await api.bookSlot({
        studentName: formData.studentName || 'Student',
        studentClass: formData.studentClass || 'Grade 4',
        parentName: formData.parentName || `Parent of ${formData.studentName}`,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        hasLaptop: formData.hasLaptop,
        understandsEnglish: formData.understandsEnglish,
        whatsappUpdates: formData.whatsappUpdates,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        utmSource: utm.utmSource,
        utmMedium: utm.utmMedium,
        utmCampaign: utm.utmCampaign,
        utmContent: utm.utmContent,
        utmTerm: utm.utmTerm,
        gclid: utm.gclid,
        fbclid: utm.fbclid,
      });

      setBookingResult(bookingRes);

      // Persist lead demo in localStorage for Unenrolled Demo Dashboard
      try {
        localStorage.setItem(
          'upspeaq_demo_lead',
          JSON.stringify({
            leadId: bookingRes.leadId,
            studentName: bookingRes.studentName || formData.studentName,
            studentClass: bookingRes.studentClass || formData.studentClass,
            parentName: bookingRes.parentName || formData.parentName,
            email: bookingRes.email || formData.email,
            mobileNumber: bookingRes.mobileNumber || formData.mobileNumber,
            date: bookingRes.date || selectedDate,
            timeSlot: bookingRes.timeSlot || selectedTimeSlot,
            meetingLink: bookingRes.meetingLink || null,
            teacher: bookingRes.teacher || null,
          })
        );
      } catch (e) {}

      if (onBookingComplete) {
        onBookingComplete(bookingRes);
      }

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });

      setStep('THANK_YOU');
    } catch (err: any) {
      setOtpError(err.message || 'Invalid verification code. Please check and try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Handle Goal Toggle
  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  // Submit Survey Response
  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingResult?.leadId) {
      setSurveySubmitted(true);
      return;
    }

    setIsSubmittingSurvey(true);
    try {
      await api.submitSurvey({
        leadId: bookingResult.leadId,
        goals: selectedGoals,
        parentName: surveyParentName,
      });
      setSurveySubmitted(true);
    } catch (err) {
      setSurveySubmitted(true);
    } finally {
      setIsSubmittingSurvey(false);
    }
  };

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = () => {
    if (!selectedDate || !selectedTimeSlot) return '#';
    const title = encodeURIComponent(`upspeaq Free Live English Demo for ${formData.studentName}`);
    const details = encodeURIComponent(
      `Congratulations! Here is your free live English demo class with upspeaq.\n\nMeeting Link: ${bookingResult?.meetingLink || 'https://meet.google.com'}\n\nPlease join 5 minutes early with your child on a laptop/desktop.`
    );
    const location = encodeURIComponent(bookingResult?.meetingLink || 'Google Meet');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  const surveyOptions = [
    'Improve vocabulary',
    'Not sure, just exploring',
    'Improve spoken communication',
    'Develop public speaking skills',
    'Help with School academics',
    'Improve grammar and writing skills',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-auto">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2">
            {step === 'SLOT_SELECTION' && (
              <button
                onClick={() => setStep('ENTER_DETAILS')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer mr-1"
                title="Back to details"
              >
                <ChevronLeft className="w-5 h-5 text-orange-600" />
              </button>
            )}
            {step === 'OTP_VERIFICATION' && (
              <button
                onClick={() => setStep('SLOT_SELECTION')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer mr-1"
                title="Back to slot selection"
              >
                <ChevronLeft className="w-5 h-5 text-orange-600" />
              </button>
            )}
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-[#EA580C] font-heading tracking-tight">up</span>
              <span className="text-xl font-black text-slate-900 font-heading tracking-tight">speaq</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* STEP 1: ENTER LEAD DETAILS                                */}
        {/* ========================================================= */}
        {step === 'ENTER_DETAILS' && (
          <div className="p-6 sm:p-8 bg-[#FDFBF7]/60">
            <div className="text-center mb-5">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight leading-tight">
                Book a <span className="text-[#EA580C]">FREE Class</span> for your child!
              </h2>
              <div className="text-lg sm:text-xl font-black text-[#EA580C] font-heading mt-0.5">
                For Grade UKG to 10th
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 font-semibold mt-1.5">
                <span>😊</span>
                <span>Enter your details below</span>
              </div>
            </div>

            {detailsError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                {detailsError}
              </div>
            )}

            <form onSubmit={handleDetailsSubmit} className="space-y-3.5 max-w-lg mx-auto">
              
              {/* Mobile Number with Country Code */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-heading">
                  Parent's Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm font-bold shrink-0 shadow-2xs font-heading">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    placeholder="Parent's Mobile Number"
                    maxLength={10}
                    required
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 outline-hidden text-sm text-slate-900 font-medium placeholder-slate-400 shadow-2xs font-body"
                  />
                </div>
              </div>

              {/* Parent Email */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-heading">
                  Parent's Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Parent's Email Address"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 outline-hidden text-sm text-slate-900 font-medium placeholder-slate-400 shadow-2xs font-body"
                />
              </div>

              {/* Child's Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-heading">
                  Child's Name
                </label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="Child's Name"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 outline-hidden text-sm text-slate-900 font-medium placeholder-slate-400 shadow-2xs font-body"
                />
              </div>

              {/* Grade Dropdown (UKG to 10th) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-heading">
                  Grade
                </label>
                <select
                  value={formData.studentClass}
                  onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 outline-hidden text-sm text-slate-800 font-medium shadow-2xs cursor-pointer font-body"
                >
                  <option value="UKG">UKG</option>
                  <option value="Grade 1">1</option>
                  <option value="Grade 2">2</option>
                  <option value="Grade 3">3</option>
                  <option value="Grade 4">4</option>
                  <option value="Grade 5">5</option>
                  <option value="Grade 6">6</option>
                  <option value="Grade 7">7</option>
                  <option value="Grade 8">8</option>
                  <option value="Grade 9">9</option>
                  <option value="Grade 10">10</option>
                </select>
              </div>

              {/* Qualifying Question: Laptop/PC/Tab */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-heading">
                  Do you own a Laptop/PC/Tab?
                </label>
                <select
                  value={formData.hasLaptop ? 'Yes' : 'No'}
                  onChange={(e) => setFormData({ ...formData, hasLaptop: e.target.value === 'Yes' })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 outline-hidden text-sm text-slate-800 font-medium shadow-2xs cursor-pointer font-body"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Qualifying Question: Does your child understand English? */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-heading">
                  Does your child understand English?
                </label>
                <select
                  value={formData.understandsEnglish ? 'Yes' : 'No'}
                  onChange={(e) => setFormData({ ...formData, understandsEnglish: e.target.value === 'Yes' })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 outline-hidden text-sm text-slate-800 font-medium shadow-2xs cursor-pointer font-body"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Informative WhatsApp Notice */}
              <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs font-semibold text-emerald-800">
                <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Class communication and meeting updates will be shared on WhatsApp</span>
              </div>

              {/* Continue to Slot Picker CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#EA580C] hover:from-[#C2410C] hover:to-[#EA580C] text-white text-base font-black font-heading shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book A Free English Class</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: CHOOSE DEMO SLOT                                 */}
        {/* ========================================================= */}
        {step === 'SLOT_SELECTION' && (
          <div className="p-6 sm:p-8 bg-[#FDFBF7]/60">
            {/* Heading */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">
                Choose Demo Slot
              </h2>
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 font-semibold mt-1">
                <span>😊</span>
                <span>You are just one step away</span>
              </div>
              <div className="text-[11px] text-slate-600 font-bold uppercase tracking-wider mt-1">
                Timezone: Asia/Kolkata
              </div>
            </div>

            {/* Date Carousel Selector */}
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
              {availableDates.map((item) => {
                const isSelected = selectedDate === item.fullDate;
                return (
                  <button
                    key={item.fullDate}
                    type="button"
                    onClick={() => setSelectedDate(item.fullDate)}
                    className={`py-3 px-2 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${isSelected ? 'text-blue-100' : 'text-slate-600'}`}>
                      {item.dayName}
                    </span>
                    <span className="text-xl sm:text-2xl font-black font-heading my-0.5 leading-none">
                      {item.dateNum}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-blue-100' : 'text-slate-600'}`}>
                      {item.monthStr}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Time Slot Boxes Container */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-5">
              
              {/* Day Slots */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 font-heading mb-3">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Day ☀️</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {daySlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold font-heading border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-blue-200 hover:bg-blue-50/40'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Evening Slots */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 font-heading mb-3">
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Evening 🌙</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {eveningSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold font-heading border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-blue-200 hover:bg-blue-50/40'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Academic Counselor Fallback */}
            <div className="text-center mt-4">
              <p className="text-xs text-slate-600 font-medium">
                Couldn't find the slot required?{' '}
                <a
                  href="https://wa.me/917004132088?text=Hi%20upspeaq%20Team!%20I%20would%20like%20to%20request%20a%20custom%20slot%20for%20a%20free%20English%20demo%20class."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-bold underline cursor-pointer inline-flex items-center gap-1"
                >
                  Click Here
                </a>{' '}
                to chat with an academic counselor.
              </p>
            </div>

            {/* Confirm & Book CTA */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleProceedToOtp}
                disabled={isSendingOtp}
                className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#EA580C] to-[#F97316] hover:from-[#C2410C] hover:to-[#EA580C] text-white text-base font-black font-heading shadow-lg hover:shadow-orange-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isSendingOtp ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Preparing Demo Slot...</span>
                  </span>
                ) : (
                  <>
                    <span>Confirm & Book</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: VERIFY OTP SCREEN (EMAIL ONLY)                   */}
        {/* ========================================================= */}
        {step === 'OTP_VERIFICATION' && (
          <div className="p-6 sm:p-10 bg-[#FDFBF7]/60 text-center">
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">
              Verify Email Address To Confirm Slot
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed font-body">
              We have sent a 4-digit verification code to{' '}
              <strong className="text-slate-900">{formData.email}</strong>.
            </p>

            {/* Inline Change Email Link */}
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-600 mt-2">
              <button
                type="button"
                onClick={() => setStep('ENTER_DETAILS')}
                className="hover:underline cursor-pointer"
              >
                Change email or mobile number
              </button>
            </div>

            {/* Error Banner */}
            {otpError && (
              <div className="my-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                {otpError}
              </div>
            )}

            {/* 4-Digit OTP Boxes */}
            <div className="flex justify-center gap-3 sm:gap-4 my-6">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpInputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  autoFocus={idx === 0}
                  className="w-14 h-16 sm:w-16 sm:h-20 text-center text-2xl sm:text-3xl font-black font-mono rounded-2xl bg-white border-2 border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-hidden transition-all shadow-xs"
                />
              ))}
            </div>

            {/* Resend Section (Email Only) */}
            <div className="space-y-3 pt-2">
              <p className="text-xs text-slate-500 font-medium">
                Didn't receive the verification code in your email?
              </p>

              <div className="flex items-center justify-center">
                <button
                  type="button"
                  disabled={!canResend || isSendingOtp}
                  onClick={() => handleResendOtp()}
                  className="px-5 py-2.5 rounded-full border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-xs font-bold text-blue-700 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                >
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Resend Code via Email {resendTimer > 0 ? `(${resendTimer}s)` : ''}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500">
                Please check your Inbox and Spam / Promotions folder.
              </p>
            </div>

            {/* Verify CTA */}
            <div className="mt-8">
              <button
                type="button"
                onClick={() => submitOtpVerification()}
                disabled={isVerifyingOtp || otp.some((d) => !d)}
                className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#EA580C] to-[#F97316] hover:from-[#C2410C] hover:to-[#EA580C] text-white text-base font-black font-heading shadow-lg hover:shadow-orange-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isVerifyingOtp ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying Code & Booking Slot...</span>
                  </span>
                ) : (
                  <>
                    <span>Verify & Confirm Slot</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 4: THANK YOU & EXPERIENCE SURVEY                     */}
        {/* ========================================================= */}
        {step === 'THANK_YOU' && (
          <div className="bg-white">
            
            {/* Top Green Banner with Scalloped Edge */}
            <div className="bg-[#10B981] p-6 sm:p-8 text-white text-center relative">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
                Demo Booked Successfully
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1">
                Your demo is scheduled on
              </p>

              {/* Highlighted Schedule Box */}
              <div className="inline-flex items-center justify-center gap-2 sm:gap-4 px-6 py-3 rounded-full border border-dashed border-white/60 bg-white/15 backdrop-blur-md text-sm sm:text-base font-black font-heading mt-4 text-white">
                <span>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                <span>{new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                <span>{selectedTimeSlot}</span>
              </div>

              {/* Action Buttons: Add to Calendar + Download Grade Curriculum PDF + Open Demo Dashboard */}
              <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onNavigateToDemoPortal && bookingResult?.leadId) {
                      onNavigateToDemoPortal(bookingResult.leadId);
                    } else {
                      window.location.hash = 'demo-portal';
                    }
                  }}
                  className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-black font-heading uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer border border-amber-400/50"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Open Demo Prep Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>

                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-black font-heading uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Add to Calendar</span>
                </a>

                <a
                  href={getCurriculumPdfUrl(formData.studentClass)}
                  download={`upspeaq_${(formData.studentClass || 'Grade').replace(/\s+/g, '_')}_Curriculum_Worksheets.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-white/40 shadow-sm"
                  title={`Download ${formData.studentClass || 'Grade'} Curriculum Guide & Complimentary Worksheets PDF`}
                >
                  <FileText className="w-4 h-4 text-emerald-100" />
                  <span>Download Worksheets (PDF)</span>
                </a>
              </div>

              {/* Scalloped decorative bottom divider */}
              <div className="absolute -bottom-2 left-0 right-0 h-4 bg-[radial-gradient(circle,#ffffff_8px,transparent_8px)] bg-[length:16px_16px] pointer-events-none" />
            </div>

            {/* Coach Assignment Notice */}
            <div className="bg-amber-50/90 border-b border-amber-200/80 px-6 py-3.5 flex items-center justify-center gap-3 text-xs text-amber-900 font-medium">
              <Sparkles className="w-4 h-4 text-[#EA580C] shrink-0" />
              <span>
                <strong>Coach Assignment in Progress:</strong> We are matching {formData.studentName} with an expert mentor. You will receive your teacher's profile & live class link via email as soon as they confirm!
              </span>
            </div>

            {/* Experience Personalization Survey (NO Board Selector) */}
            <div className="p-6 sm:p-8 bg-[#FDFBF7]/60">
              
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                  Help Us To Make Your Experience Better
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 font-body">
                  How would you like our English course to help your child?
                </p>
              </div>

              {surveySubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-fadeIn">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-black text-emerald-900 font-heading">
                    Preferences Saved!
                  </h4>
                  <p className="text-xs text-emerald-700 font-body">
                    We've notified your child's demo teacher so they can tailor the diagnostic session accordingly.
                  </p>
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 rounded-full bg-[#EA580C] text-white text-xs font-bold cursor-pointer"
                    >
                      Done & Return to Homepage
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSurveySubmit} className="space-y-4 max-w-lg mx-auto">
                  
                  {/* Multi-Select Checkboxes */}
                  <div className="space-y-2.5">
                    {surveyOptions.map((option) => {
                      const isChecked = selectedGoals.includes(option);
                      return (
                        <label
                          key={option}
                          onClick={() => toggleGoal(option)}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none text-xs sm:text-sm font-medium ${
                            isChecked
                              ? 'bg-orange-50/70 border-[#EA580C] text-slate-900 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // handled by label click
                            className="w-4 h-4 rounded-sm border-slate-300 text-[#EA580C] focus:ring-[#EA580C] cursor-pointer"
                          />
                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Student & Parent Name Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-heading">
                        Student's Name
                      </label>
                      <input
                        type="text"
                        value={formData.studentName}
                        readOnly
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 font-heading">
                        Parent Name
                      </label>
                      <input
                        type="text"
                        value={surveyParentName}
                        onChange={(e) => setSurveyParentName(e.target.value)}
                        placeholder="Parent Name"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-[#EA580C] outline-hidden text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Submit Survey Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmittingSurvey}
                      className="w-full py-3.5 px-6 rounded-full bg-slate-800 hover:bg-slate-900 text-white text-sm font-black font-heading transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmittingSurvey ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>Submit</span>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
