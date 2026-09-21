import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Clock,
  Phone,
  ClipboardCheck,
  CheckCircle2,
  Play,
  X,
  UserCheck,
  Save,
  Zap,
  Bell,
  RefreshCw,
  MapPin,
  BookOpen,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../../lib/api';

interface TeacherDemosViewProps {
  initialDemoId?: string | null;
  onSuccessToast?: (msg: string) => void;
  onErrorToast?: (msg: string) => void;
}

export function TeacherDemosView({
  initialDemoId,
  onSuccessToast,
  onErrorToast,
}: TeacherDemosViewProps) {
  const [loadingAssigned, setLoadingAssigned] = useState(true);
  const [loadingAvailable, setLoadingAvailable] = useState(true);
  const [assignedDemos, setAssignedDemos] = useState<any[]>([]);
  const [availableDemos, setAvailableDemos] = useState<any[]>([]);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [selectedDemo, setSelectedDemo] = useState<any | null>(null);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [submittingEval, setSubmittingEval] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Evaluation form state
  const [spokenEnglish, setSpokenEnglish] = useState('Good');
  const [pronunciation, setPronunciation] = useState('Good');
  const [fluency, setFluency] = useState('Developing');
  const [confidence, setConfidence] = useState('Developing');
  const [publicSpeaking, setPublicSpeaking] = useState('Developing');
  const [vocabulary, setVocabulary] = useState('Good');
  const [sentenceFormation, setSentenceFormation] = useState('Good');
  const [listening, setListening] = useState('Strong');
  const [debateReasoning, setDebateReasoning] = useState('Developing');
  const [strengths, setStrengths] = useState('');
  const [areasToImprove, setAreasToImprove] = useState('');
  const [recommendedProgram, setRecommendedProgram] = useState('3-Month Flagship Communication & Confidence Cohort');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [outcome, setOutcome] = useState('Recommended');

  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadAssignedDemos = useCallback(async () => {
    try {
      setLoadingAssigned(true);
      const res = await api.getTeacherDemos();
      setAssignedDemos(res.demos || []);
      if (initialDemoId) {
        const found = res.demos?.find((d: any) => d.id === initialDemoId);
        if (found) openEvaluationModal(found);
      }
    } catch {
      // silent
    } finally {
      setLoadingAssigned(false);
    }
  }, [initialDemoId]);

  const loadAvailableDemos = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoadingAvailable(true);
      const res = await api.getAvailableTeacherDemos();
      setAvailableDemos(res.demos || []);
      setLastRefreshed(new Date());
    } catch {
      // silent
    } finally {
      if (!silent) setLoadingAvailable(false);
    }
  }, []);

  useEffect(() => {
    loadAssignedDemos();
    loadAvailableDemos();

    // Auto-refresh available demos every 30 seconds
    refreshTimerRef.current = setInterval(() => {
      loadAvailableDemos(true);
    }, 30000);

    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, [loadAssignedDemos, loadAvailableDemos]);

  const handleClaimDemo = async (demo: any) => {
    if (claimingId) return;
    setClaimingId(demo.id);
    try {
      const res = await api.claimTeacherDemo(demo.id);
      if (onSuccessToast) onSuccessToast(res.message || 'Demo claimed successfully!');
      // Remove from available, reload assigned
      setAvailableDemos((prev) => prev.filter((d) => d.id !== demo.id));
      await loadAssignedDemos();
    } catch (err: any) {
      const msg = err?.message || 'Failed to claim demo.';
      if (onErrorToast) onErrorToast(msg);
      // Refresh available list — might already be gone
      loadAvailableDemos(true);
    } finally {
      setClaimingId(null);
    }
  };

  const openEvaluationModal = async (demo: any) => {
    setSelectedDemo(demo);
    setIsEvalModalOpen(true);
    setStrengths('Curious and eager to speak, good active listening.');
    setAreasToImprove('Needs practice pausing before responding and eliminating filler words.');
    setAdditionalNotes('Demonstrated strong potential for the Junior Communication Cohort.');
    try {
      const detailRes = await api.getTeacherDemoById(demo.id);
      if (detailRes.evaluation) {
        const ev = detailRes.evaluation;
        setSpokenEnglish(ev.spoken_english || 'Good');
        setPronunciation(ev.pronunciation || 'Good');
        setFluency(ev.fluency || 'Developing');
        setConfidence(ev.confidence || 'Developing');
        setPublicSpeaking(ev.public_speaking || 'Developing');
        setVocabulary(ev.vocabulary || 'Good');
        setSentenceFormation(ev.sentence_formation || 'Good');
        setListening(ev.listening || 'Strong');
        setDebateReasoning(ev.debate_reasoning || 'Developing');
        setStrengths(ev.strengths || '');
        setAreasToImprove(ev.areas_to_improve || '');
        setRecommendedProgram(ev.recommended_program || '3-Month Flagship Communication & Confidence Cohort');
        setAdditionalNotes(ev.additional_notes || '');
        setOutcome(ev.outcome || 'Recommended');
      }
    } catch {}
  };

  const handleSaveEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDemo) return;
    try {
      setSubmittingEval(true);
      await api.submitDemoEvaluation(selectedDemo.id, {
        lead_id: selectedDemo.lead_id,
        spoken_english: spokenEnglish,
        pronunciation,
        fluency,
        confidence,
        public_speaking: publicSpeaking,
        vocabulary,
        sentence_formation: sentenceFormation,
        listening,
        debate_reasoning: debateReasoning,
        strengths,
        areas_to_improve: areasToImprove,
        recommended_program: recommendedProgram,
        additional_notes: additionalNotes,
        outcome,
      });
      if (onSuccessToast) onSuccessToast('Demo evaluation submitted successfully.');
      setIsEvalModalOpen(false);
      loadAssignedDemos();
    } catch {
      if (onErrorToast) onErrorToast('Failed to submit demo evaluation.');
    } finally {
      setSubmittingEval(false);
    }
  };

  const ratingOptions = ['Needs Practice', 'Developing', 'Good', 'Strong'];

  const timeAgo = () => {
    const secs = Math.floor((new Date().getTime() - lastRefreshed.getTime()) / 1000);
    if (secs < 10) return 'just now';
    if (secs < 60) return `${secs}s ago`;
    return `${Math.floor(secs / 60)}m ago`;
  };

  return (
    <div className="space-y-8">

      {/* ─── AVAILABLE DEMOS — First Come First Serve ─── */}
      <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/40 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Available Demos
                {availableDemos.length > 0 && (
                  <span className="bg-white text-amber-600 text-xs font-black px-2 py-0.5 rounded-full animate-pulse">
                    {availableDemos.length} OPEN
                  </span>
                )}
              </h2>
              <p className="text-xs text-amber-100 mt-0.5">
                First teacher to accept gets assigned — first come, first served
              </p>
            </div>
          </div>
          <button
            onClick={() => loadAvailableDemos()}
            className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refreshed {timeAgo()}</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {loadingAvailable ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-amber-100/70 rounded-xl" />
              ))}
            </div>
          ) : availableDemos.length === 0 ? (
            <div className="text-center py-8 text-amber-700/60">
              <Bell className="w-10 h-10 mx-auto mb-2 text-amber-300" />
              <p className="text-sm font-semibold text-amber-800">No demos available right now</p>
              <p className="text-xs text-amber-600 mt-1">
                When a new demo is created without an assigned teacher, it will appear here instantly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableDemos.map((demo) => {
                const isClaiming = claimingId === demo.id;
                const anyoneClaiming = claimingId !== null;
                return (
                  <div
                    key={demo.id}
                    className="bg-white rounded-xl border-2 border-amber-200 shadow-sm hover:border-amber-400 hover:shadow-md transition-all duration-200 flex flex-col"
                  >
                    <div className="p-4 flex-1">
                      {/* Badge + Title */}
                      <div className="flex items-start gap-2 mb-3">
                        <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                          UNCLAIMED
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          {demo.attendee_count || 1} student
                        </span>
                      </div>

                      <h3 className="font-bold text-[#10182C] text-base leading-tight">
                        {demo.student_name || 'Student'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {demo.student_class || 'Class'}
                      </p>

                      <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="font-semibold text-slate-800">
                            {demo.date} &bull; {demo.start_time}–{demo.end_time}
                          </span>
                        </div>
                        {demo.city && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{demo.city}</span>
                          </div>
                        )}
                        {demo.interest_area && (
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{demo.interest_area}</span>
                          </div>
                        )}
                        {demo.notes && (
                          <p className="text-[11px] text-slate-400 italic line-clamp-2 mt-1">
                            {demo.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Claim Button */}
                    <div className="px-4 pb-4">
                      <button
                        onClick={() => handleClaimDemo(demo)}
                        disabled={anyoneClaiming}
                        className={`
                          w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200
                          ${isClaiming
                            ? 'bg-amber-400 text-white cursor-wait'
                            : anyoneClaiming
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-300 hover:scale-[1.02] active:scale-100'
                          }
                        `}
                      >
                        {isClaiming ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Claiming...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5" />
                            <span>Accept &amp; Claim Demo</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── ASSIGNED DEMOS ─── */}
      <div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-[#10182C] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F27C00]" />
              Your Assigned Demos
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Conduct assessments and submit mentor evaluations for each student.
            </p>
          </div>
          {!loadingAssigned && (
            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
              {assignedDemos.length} demo{assignedDemos.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loadingAssigned ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-44 bg-slate-200/70 rounded-xl" />
            ))}
          </div>
        ) : assignedDemos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No demos assigned yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Claim a demo from "Available Demos" above to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {assignedDemos.map((demo) => (
              <div
                key={demo.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-amber-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        demo.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : demo.status === 'ASSIGNED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {demo.status === 'ASSIGNED' ? 'Claimed by You' : demo.status}
                    </span>
                    {demo.evaluation_outcome && (
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {demo.evaluation_outcome}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-[#10182C] text-lg mt-2.5">
                    {demo.student_name || 'Student'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {demo.student_class || 'Class'} &bull; {demo.city || 'India'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Parent: <strong>{demo.parent_name || 'Parent'}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{demo.parent_phone || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-800 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#F27C00]" />
                      <span>{demo.date} at {demo.start_time}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={demo.meeting_link || 'https://meet.google.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-2 bg-[#10182C] text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Start Demo</span>
                  </a>
                  <button
                    onClick={() => openEvaluationModal(demo)}
                    className="flex-1 py-2 bg-[#F27C00] text-white rounded-lg text-xs font-semibold hover:bg-amber-600 transition flex items-center justify-center gap-1 shadow-xs"
                  >
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    <span>{demo.evaluation_id ? 'View Evaluation' : 'Evaluate'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── DEMO EVALUATION MODAL ─── */}
      {isEvalModalOpen && selectedDemo && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-bold text-[#10182C] flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-[#F27C00]" />
                  Mentor Speech Evaluation: {selectedDemo.student_name}
                </h2>
                <p className="text-xs text-slate-500">{selectedDemo.student_class} &bull; Parent: {selectedDemo.parent_name}</p>
              </div>
              <button
                onClick={() => setIsEvalModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvaluation} className="p-6 space-y-6">
              <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3.5 text-xs text-amber-900">
                <strong>Mentor Observation Note:</strong> These ratings reflect mentor observations during the live interaction to assess speech clarity, articulation, and stage confidence.
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Core Assessment Areas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Spoken English', value: spokenEnglish, setter: setSpokenEnglish },
                    { label: 'Pronunciation & Clarity', value: pronunciation, setter: setPronunciation },
                    { label: 'Fluency & Pacing', value: fluency, setter: setFluency },
                    { label: 'Confidence & Eye Contact', value: confidence, setter: setConfidence },
                    { label: 'Public Speaking Presence', value: publicSpeaking, setter: setPublicSpeaking },
                    { label: 'Vocabulary Range', value: vocabulary, setter: setVocabulary },
                    { label: 'Sentence Formation', value: sentenceFormation, setter: setSentenceFormation },
                    { label: 'Listening & Comprehension', value: listening, setter: setListening },
                    { label: 'Debate & Reasoning', value: debateReasoning, setter: setDebateReasoning },
                  ].map((item) => (
                    <div key={item.label} className="bg-slate-50 p-3 rounded-lg border border-slate-200/70">
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">{item.label}</label>
                      <select
                        value={item.value}
                        onChange={(e) => item.setter(e.target.value)}
                        className="w-full text-xs font-medium bg-white border border-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#F27C00]"
                      >
                        {ratingOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Strengths Observed</label>
                  <textarea
                    rows={2}
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                    placeholder="e.g. Highly creative thoughts, quick answering, strong voice projection..."
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#F27C00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Areas for Improvement & Practice</label>
                  <textarea
                    rows={2}
                    value={areasToImprove}
                    onChange={(e) => setAreasToImprove(e.target.value)}
                    placeholder="e.g. Practice the 2-second pause before speaking, structure sentences..."
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#F27C00]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Recommended Program</label>
                    <select
                      value={recommendedProgram}
                      onChange={(e) => setRecommendedProgram(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:border-[#F27C00]"
                    >
                      <option value="3-Month Flagship Communication & Confidence Cohort">3-Month Flagship Cohort (Recommended)</option>
                      <option value="1-Month Communication & Fluency Starter">1-Month Starter Cohort</option>
                      <option value="1-on-1 Individual Speech Coaching (Private Classes)">1-on-1 Private Mentorship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Demo Outcome Recommendation</label>
                    <select
                      value={outcome}
                      onChange={(e) => setOutcome(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:border-[#F27C00]"
                    >
                      <option value="Recommended">Recommended (Ready to Enroll)</option>
                      <option value="Needs Follow-up">Needs Follow-up (Parent Q&A)</option>
                      <option value="Parent Decision Pending">Parent Decision Pending</option>
                      <option value="Not Suitable">Not Suitable for Current Level</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Additional Mentor Notes</label>
                  <textarea
                    rows={2}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Private notes for admissions coordinator / counsellor..."
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-[#F27C00]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEvalModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEval}
                  className="px-5 py-2.5 bg-[#F27C00] text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition flex items-center gap-2 shadow-xs disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{submittingEval ? 'Submitting...' : 'SAVE DEMO EVALUATION'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
