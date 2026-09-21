import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Sparkles,
  Play,
  FileText,
  Clock,
  Layers,
  ChevronRight,
  Award,
  Check,
  Download,
  HelpCircle,
  FolderOpen,
  Send,
  ExternalLink,
  BookMarked,
  FileCheck,
  CheckSquare,
  Square,
} from 'lucide-react';
import { api } from '../../lib/api';

interface StudentCurriculumViewProps {
  onSuccessToast?: (msg: string) => void;
  onErrorToast?: (msg: string) => void;
}

export function StudentCurriculumView({ onSuccessToast, onErrorToast }: StudentCurriculumViewProps) {
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [gradeGroup, setGradeGroup] = useState('Class 4-7');
  const [allGradeGroups, setAllGradeGroups] = useState<string[]>([]);
  const [progress, setProgress] = useState({ totalSessions: 0, completedCount: 0, progressPercent: 0 });
  
  // Navigation Tabs: Modules vs Worksheets
  const [activeTab, setActiveTab] = useState<'CURRICULUM' | 'WORKSHEETS' | 'ANSWER_KEY'>('CURRICULUM');
  const [activeWorksheet, setActiveWorksheet] = useState<number>(1);
  const [togglingSessionId, setTogglingSessionId] = useState<string | null>(null);

  const loadCurriculum = async (targetGrade?: string) => {
    try {
      setLoading(true);
      const res = await api.getStudentCurriculum(targetGrade);
      setModules(res.modules || []);
      setSessions(res.sessions || []);
      setGradeGroup(res.gradeGroup || 'Class 4-7');
      setAllGradeGroups(res.allGradeGroups?.length ? res.allGradeGroups : ['Class 4-7', 'Class 8-12', 'Grade 9-10']);
      if (res.progress) {
        setProgress(res.progress);
      }
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to load curriculum syllabus.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurriculum();
  }, []);

  const handleToggleComplete = async (sessionId: string) => {
    try {
      setTogglingSessionId(sessionId);
      const res = await api.toggleStudentCurriculumComplete(sessionId);
      if (onSuccessToast) onSuccessToast(res.message);
      
      // Update local state smoothly
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === sessionId) {
            const isNowCompleted = !s.student_completed && !s.is_completed;
            return {
              ...s,
              student_completed: isNowCompleted ? 1 : 0,
              is_completed: isNowCompleted ? 1 : 0,
            };
          }
          return s;
        })
      );

      // Recalculate progress
      const updatedCompleted = sessions.filter((s) => (s.id === sessionId ? !s.student_completed : s.student_completed || s.is_completed)).length;
      const pct = sessions.length > 0 ? Math.round((updatedCompleted / sessions.length) * 100) : 0;
      setProgress((p) => ({
        ...p,
        completedCount: updatedCompleted,
        progressPercent: pct,
      }));
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to update progress status.');
    } finally {
      setTogglingSessionId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title & Grade Folder Selector */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#10182C] flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#F27C00]" />
              <span>Curriculum & Progress Tracker</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Structured public speaking & language skill milestones aligned with your grade and board examinations.
          </p>
        </div>

        {/* Grade Folder Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <FolderOpen className="w-4 h-4 text-slate-500 ml-2" />
          <span className="text-[11px] font-bold text-slate-600 mr-1">Grade Level:</span>
          {['Class 4-7', 'Class 8-12', 'Grade 9-10'].map((g) => (
            <button
              key={g}
              onClick={() => {
                setGradeGroup(g);
                loadCurriculum(g);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                gradeGroup === g
                  ? 'bg-white text-[#10182C] shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {g === 'Grade 9-10' ? 'Grade 9 & 10 (Advanced)' : g === 'Class 4-7' ? 'Junior (Class 4–7)' : 'Senior (Class 8–12)'}
            </button>
          ))}
        </div>
      </div>

      {/* OVERALL PROGRESS BAR BANNER */}
      <div className="bg-gradient-to-r from-[#10182C] via-slate-900 to-[#1e293b] text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#F27C00] uppercase tracking-wider bg-orange-500/10 border border-orange-500/30 px-2.5 py-0.5 rounded">
              Cohort Progression
            </span>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{gradeGroup} Learning Path</span>
              <span className="text-xs font-medium text-slate-300">({progress.completedCount} of {progress.totalSessions || sessions.length} sessions completed)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Click the checkmark icon on any session to mark your progress as you complete classroom activities and assignments.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-3xl font-extrabold text-[#F27C00]">{progress.progressPercent}%</span>
            <span className="block text-[11px] text-slate-400 font-medium">Completed</span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-4 w-full bg-slate-800/90 rounded-full h-3.5 p-0.5 overflow-hidden border border-slate-700">
          <div
            className="bg-gradient-to-r from-[#F27C00] to-amber-400 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${Math.min(100, Math.max(0, progress.progressPercent))}%` }}
          ></div>
        </div>
      </div>

      {/* VIEW TABS: CURRICULUM SYLLABUS vs PRACTICE WORKSHEETS vs ANSWER KEY */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-semibold max-w-md">
        <button
          onClick={() => setActiveTab('CURRICULUM')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'CURRICULUM'
              ? 'bg-white text-[#10182C] shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#F27C00]" />
          <span>Curriculum Modules</span>
        </button>

        <button
          onClick={() => setActiveTab('WORKSHEETS')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'WORKSHEETS'
              ? 'bg-white text-[#10182C] shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>7 Practice Worksheets</span>
        </button>

        <button
          onClick={() => setActiveTab('ANSWER_KEY')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'ANSWER_KEY'
              ? 'bg-white text-[#10182C] shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Answer Key</span>
        </button>
      </div>

      {/* TAB 1: CURRICULUM MODULES & TOPIC COMPLETION */}
      {activeTab === 'CURRICULUM' && (
        <div className="space-y-6">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-36 bg-slate-200/70 rounded-2xl"></div>
              <div className="h-36 bg-slate-200/70 rounded-2xl"></div>
            </div>
          ) : modules.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">Curriculum Syllabus Loading</h3>
              <p className="text-xs text-slate-500 mt-1">Modules for {gradeGroup} are being arranged.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {modules.map((mod) => {
                const moduleSessions = sessions.filter((s) => s.module_id === mod.id);

                return (
                  <div key={mod.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#10182C] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                          M{mod.module_number}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#10182C] text-base">{mod.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{mod.description}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {moduleSessions.length} Topics
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {moduleSessions.map((sess) => {
                        const isCompleted = Boolean(sess.student_completed || sess.is_completed);

                        return (
                          <div
                            key={sess.id}
                            className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                              isCompleted
                                ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                                : 'bg-white border-slate-200 hover:border-amber-300'
                            }`}
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-[10px] font-bold text-[#F27C00] uppercase">
                                  Week {sess.week_number} • Session {sess.session_number}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleToggleComplete(sess.id)}
                                  disabled={togglingSessionId === sess.id}
                                  title={isCompleted ? 'Click to unmark completion' : 'Click to mark topic completed'}
                                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg transition cursor-pointer ${
                                    isCompleted
                                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                                      : 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-900 border border-slate-200'
                                  }`}
                                >
                                  {isCompleted ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Completed</span>
                                    </>
                                  ) : (
                                    <>
                                      <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                                      <span>Mark Done</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              <h4 className="font-bold text-sm text-[#10182C] mt-2.5">{sess.topic}</h4>
                              <p className="text-xs text-slate-600 mt-1">{sess.learning_objective}</p>

                              {sess.activity && (
                                <div className="mt-3 p-2.5 bg-slate-50/80 rounded-lg border border-slate-200/80 text-[11px] text-slate-700">
                                  <strong className="text-slate-900 block text-[10px] uppercase font-bold text-[#F27C00]">
                                    Activity & Speaking Exercise:
                                  </strong>
                                  <p className="mt-0.5">{sess.activity}</p>
                                </div>
                              )}
                            </div>

                            {sess.homework_suggestion && (
                              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                                <span>Suggested HW: <strong>{sess.homework_suggestion}</strong></span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 7 PRACTICE WORKSHEETS (FROM PDF) */}
      {activeTab === 'WORKSHEETS' && (
        <div className="space-y-6">
          {/* Worksheet Selector Tabs */}
          <div className="flex flex-wrap gap-2 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
            {[
              { id: 1, title: 'WS 1: Grammar (Grade 9)', category: 'Modals & Connectors' },
              { id: 2, title: 'WS 2: Grammar (Grade 10)', category: 'Editing & Gap-filling' },
              { id: 3, title: 'WS 3: Vocabulary (G9 & 10)', category: 'Idioms & Word Substitution' },
              { id: 4, title: 'WS 4: Critical Appreciation', category: 'Unseen Passage & Poem' },
              { id: 5, title: 'WS 5: Speech Writing', category: 'Exam Format Template' },
              { id: 6, title: 'WS 6: Debate & Extempore', category: 'Rebuttal & JAM Topics' },
              { id: 7, title: 'WS 7: Spoken English & Viva', category: 'Fluency & Mock Interview' },
            ].map((ws) => (
              <button
                key={ws.id}
                onClick={() => setActiveWorksheet(ws.id)}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition cursor-pointer flex flex-col items-start ${
                  activeWorksheet === ws.id
                    ? 'bg-[#10182C] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{ws.title}</span>
                <span className={`text-[10px] font-normal ${activeWorksheet === ws.id ? 'text-amber-400' : 'text-slate-500'}`}>
                  {ws.category}
                </span>
              </button>
            ))}
          </div>

          {/* Worksheet 1 */}
          {activeWorksheet === 1 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#F27C00] uppercase tracking-wider">Practice Worksheet 1</span>
                  <h3 className="text-xl font-bold text-[#10182C]">Grammar (Grade 9)</h3>
                  <p className="text-xs text-slate-500">Modal Auxiliaries • Connectors • Direct-Indirect Speech</p>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl">Grade 9 Board Prep</span>
              </div>

              <div className="space-y-4 text-xs text-slate-800">
                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-[#10182C]">A. Fill in the blanks with a suitable modal (can, must, should, may):</h4>
                  <p>1. You __________ finish your homework before you watch TV.</p>
                  <p>2. __________ I borrow your pen for a moment?</p>
                  <p>3. Students __________ respect their teachers.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-[#10182C]">B. Join the sentences using the connector given in brackets:</h4>
                  <p>1. He was tired. He continued working. <em>(although)</em></p>
                  <p>2. She saved money. She could buy a new phone. <em>(so that)</em></p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-[#10182C]">C. Change into Indirect Speech:</h4>
                  <p>1. She said, "What a beautiful painting this is!"</p>
                  <p>2. The officer said, "Stand in a queue, please."</p>
                  <p>3. He asked, "Have you completed the project?"</p>
                </div>
              </div>
            </div>
          )}

          {/* Worksheet 2 */}
          {activeWorksheet === 2 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#F27C00] uppercase tracking-wider">Practice Worksheet 2</span>
                  <h3 className="text-xl font-bold text-[#10182C]">Grammar (Grade 10)</h3>
                  <p className="text-xs text-slate-500">Editing • Gap-filling • Integrated Grammar</p>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl">Grade 10 Board Prep</span>
              </div>

              <div className="space-y-4 text-xs text-slate-800">
                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-[#10182C]">A. Editing — rewrite the passage correctly (one error per line):</h4>
                  <p className="italic bg-white p-3 rounded-lg border border-slate-200">
                    "He don't know the way to the station. He are looking for someone to help him. Yesterday, he ask a stranger for direction, but stranger did not understand he clearly."
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-[#10182C]">B. Fill in the blanks with suitable prepositions/connectors (in spite of, because, into, with):</h4>
                  <p>1. __________ the heavy rain, the match continued.</p>
                  <p>2. She succeeded __________ her hard work and dedication.</p>
                  <p>3. He divided the cake __________ four equal parts.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-[#10182C]">C. Rewrite as directed:</h4>
                  <p>1. "You must not cross the road when the light is red." <em>(Change to Passive)</em></p>
                  <p>2. Combine using a suitable connector: "He was ill. He went to school."</p>
                </div>
              </div>
            </div>
          )}

          {/* Worksheet 3 */}
          {activeWorksheet === 3 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#F27C00] uppercase tracking-wider">Practice Worksheet 3</span>
                  <h3 className="text-xl font-bold text-[#10182C]">Vocabulary Building (Grade 9 & 10)</h3>
                  <p className="text-xs text-slate-500">Synonyms in context • Idioms • One-word substitution</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-800">
                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-[#10182C]">A. Choose the word closest in meaning:</h4>
                  <p>1. Her <u>candid</u> response surprised everyone. <em>(honest / rude / careless)</em></p>
                  <p>2. The manager tried to <u>mitigate</u> the damage. <em>(increase / reduce / ignore)</em></p>
                  <p>3. He is known for his <u>tenacious</u> attitude. <em>(lazy / determined / shy)</em></p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-[#10182C]">B. Use each idiom in a sentence of your own:</h4>
                  <p>1. <strong>"Once in a blue moon"</strong></p>
                  <p>2. <strong>"Hit the nail on the head"</strong></p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-[#10182C]">C. One-word substitution:</h4>
                  <p>1. A person who loves and collects books — ___________</p>
                  <p>2. A remedy for all diseases/problems — ___________</p>
                  <p>3. One who is present everywhere at the same time — ___________</p>
                </div>
              </div>
            </div>
          )}

          {/* Worksheet 4 */}
          {activeWorksheet === 4 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[10px] font-bold text-[#F27C00] uppercase tracking-wider">Practice Worksheet 4</span>
                <h3 className="text-xl font-bold text-[#10182C]">Critical Appreciation</h3>
                <p className="text-xs text-slate-500">Unseen passage, poem analysis & précis practice</p>
              </div>

              <div className="space-y-4 text-xs text-slate-800">
                <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                  <h4 className="font-bold text-sm text-[#10182C]">📖 Unseen Passage Comprehension:</h4>
                  <p className="italic bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                    "Progress, we are told, is measured in speed — faster trains, faster internet, faster decisions. Yet the wisest people in history often achieved their greatest work through patience, not haste. The scientist who spends a decade on a single question, the writer who rewrites a page ten times, the craftsman who refuses to rush a single joint — all remind us that some of the most valuable things cannot be hurried. Perhaps true progress lies not in doing things faster, but in doing the right things well."
                  </p>
                  <p>1. According to the passage, how is progress usually measured?</p>
                  <p>2. Give one example the author uses to show the value of patience.</p>
                  <p>3. What is the author's main message in your own words?</p>
                  <p>4. Suggest a suitable title for this passage.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                  <h4 className="font-bold text-sm text-[#10182C]">🎵 Poem Analysis:</h4>
                  <div className="italic bg-white p-3 rounded-lg border border-slate-200 leading-relaxed font-serif">
                    "The city sleeps beneath a quilt of light,<br />
                    Its towers whispering to the waking dawn;<br />
                    Time, that silent sculptor, carves the night,<br />
                    And leaves its mark on all who linger on."
                  </div>
                  <p>1. Identify and explain one figure of speech used in the stanza.</p>
                  <p>2. What does "Time, that silent sculptor" suggest about the poet's view of time?</p>
                </div>
              </div>
            </div>
          )}

          {/* Worksheet 5 */}
          {activeWorksheet === 5 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[10px] font-bold text-[#F27C00] uppercase tracking-wider">Practice Worksheet 5</span>
                <h3 className="text-xl font-bold text-[#10182C]">Speech Writing (Exam-Format Practice)</h3>
                <p className="text-xs text-slate-500">Guided structure for board language papers & stage speeches</p>
              </div>

              <div className="p-5 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-slate-800 space-y-3">
                <h4 className="font-bold text-sm text-slate-900">Topic: "The Importance of Protecting the Environment"</h4>
                <div className="space-y-2 font-mono text-[11px] bg-white p-4 rounded-lg border border-amber-200/80">
                  <p><strong>1. Title:</strong> [Concise, eye-catching heading]</p>
                  <p><strong>2. Salutation:</strong> "Respected Principal, teachers, and my dear friends..."</p>
                  <p><strong>3. Opening Hook:</strong> [A startling statistic, question, or quote]</p>
                  <p><strong>4. Point 1 + Example:</strong> [Causes & urgency of ecological degradation]</p>
                  <p><strong>5. Point 2 + Example:</strong> [Individual student actions & daily conservation]</p>
                  <p><strong>6. Point 3 + Example:</strong> [Future generations' right to clean air and water]</p>
                  <p><strong>7. Closing Statement:</strong> [Call to action & memorable punchline]</p>
                  <p><strong>8. Thanking Note:</strong> "Thank you for listening patiently."</p>
                </div>
              </div>
            </div>
          )}

          {/* Worksheet 6 */}
          {activeWorksheet === 6 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[10px] font-bold text-[#F27C00] uppercase tracking-wider">Practice Worksheet 6</span>
                <h3 className="text-xl font-bold text-[#10182C]">Debate Writing & Extempore (JAM)</h3>
                <p className="text-xs text-slate-500">Argument building • Rebuttal practice • Rapid JAM topics</p>
              </div>

              <div className="space-y-4 text-xs text-slate-800">
                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-[#10182C]">Motion: "Examinations are not a true measure of a student's ability."</h4>
                  <p className="text-slate-600">Choose your side: <strong>[ ] For</strong> or <strong>[ ] Against</strong></p>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5 font-mono text-[11px]">
                    <p>• Argument 1 + Evidence</p>
                    <p>• Argument 2 + Evidence</p>
                    <p>• Anticipated objection from the opposing side</p>
                    <p>• Your sharp rebuttal</p>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-indigo-950">🎙️ 1-Minute Extempore & JAM Topics:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li>"Is technology making us less social?"</li>
                    <li>"The value of failure in personal growth"</li>
                    <li>"Should students have a say in how schools are run?"</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Worksheet 7 */}
          {activeWorksheet === 7 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[10px] font-bold text-[#F27C00] uppercase tracking-wider">Practice Worksheet 7</span>
                <h3 className="text-xl font-bold text-[#10182C]">Spoken English & Interview Skills</h3>
                <p className="text-xs text-slate-500">Fluency cards • Group discussion prompts • Mock interview</p>
              </div>

              <div className="space-y-4 text-xs text-slate-800">
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-amber-950">🗣️ Fluency Cards (Pick 2 and speak for 1–2 minutes):</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li>A challenge I overcame and what I learned from it.</li>
                    <li>My view on whether marks truly reflect a student's ability.</li>
                    <li>A leader (real or fictional) I admire and why.</li>
                    <li>One change I would bring to my school if I could.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-slate-900">👥 Group Discussion Simulation (4–5 Students):</h4>
                  <p><strong>Topic:</strong> "Should students be allowed to choose their own subjects from Grade 9 onwards?"</p>
                  <p className="text-slate-500 text-[11px]">Rule: (a) State clear position, (b) support with evidence, (c) respond respectfully to a peer.</p>
                </div>

                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-sm text-emerald-950">👔 Mock Interview Q&A:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li>"Tell me about yourself in under a minute."</li>
                    <li>"What is one strength and one area you are working to improve?"</li>
                    <li>"Why do you think public speaking and communication matter to you?"</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TEACHER'S ANSWER KEY */}
      {activeTab === 'ANSWER_KEY' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Solutions & Guide</span>
            <h3 className="text-xl font-bold text-[#10182C]">Teacher's Answer Key (Worksheets 1–4)</h3>
            <p className="text-xs text-slate-500">Self-correction answers for grammar and critical appreciation practice.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
              <h4 className="font-bold text-slate-900">Worksheet 1 — Grammar (Grade 9)</h4>
              <p><strong>A.</strong> 1. must/should | 2. May | 3. should</p>
              <p><strong>B.</strong> 1. Although he was tired, he continued working. | 2. She saved money so that she could buy a new phone.</p>
              <p><strong>C.</strong> 1. She exclaimed that it was a beautiful painting. | 2. The officer requested them to stand in a queue. | 3. He asked if/whether she had completed the project.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
              <h4 className="font-bold text-slate-900">Worksheet 2 — Grammar (Grade 10)</h4>
              <p><strong>A.</strong> "He doesn't know the way to the station. He is looking for someone to help him. Yesterday, he asked a stranger for directions, but the stranger did not understand him clearly."</p>
              <p><strong>B.</strong> 1. In spite of | 2. because of | 3. into</p>
              <p><strong>C.</strong> 1. The road must not be crossed when the light is red. | 2. Although he was ill, he went to school.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
              <h4 className="font-bold text-slate-900">Worksheet 3 — Vocabulary</h4>
              <p><strong>A.</strong> 1. honest | 2. reduce | 3. determined</p>
              <p><strong>B.</strong> Sample sentences will vary — verify correct register.</p>
              <p><strong>C.</strong> 1. Bibliophile | 2. Panacea | 3. Omnipresent</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
              <h4 className="font-bold text-slate-900">Worksheet 4 — Critical Appreciation</h4>
              <p><strong>1.</strong> In terms of speed (faster trains, faster internet, faster decisions).</p>
              <p><strong>2.</strong> The scientist spending a decade on a single question, or writer rewriting ten times.</p>
              <p><strong>3.</strong> True progress lies in doing things well, not simply doing them faster.</p>
              <p><strong>4.</strong> Sample title: "The True Meaning of Progress".</p>
              <p><strong>5.</strong> Metaphor: "quilt of light" / Personification: "towers whispering".</p>
              <p><strong>6.</strong> It suggests time quietly and gradually sculpts and shapes everything.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
