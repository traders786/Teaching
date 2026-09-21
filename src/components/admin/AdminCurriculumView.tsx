import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Layers,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { api } from '../../lib/api';
import { Course } from '../../types';

interface AdminCurriculumViewProps {
  courses: Course[];
  onSuccessToast?: (msg: string) => void;
  onErrorToast?: (msg: string) => void;
}

export function AdminCurriculumView({
  courses,
  onSuccessToast,
  onErrorToast,
}: AdminCurriculumViewProps) {
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState('Class 4-7');
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  // Add Module Modal State
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [courseId, setCourseId] = useState('crs_flagship_1');
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDesc, setModuleDesc] = useState('');
  const [moduleNumber, setModuleNumber] = useState(1);

  // Add Session Modal State
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState('');
  const [sessWeek, setSessWeek] = useState(1);
  const [sessNumber, setSessNumber] = useState(1);
  const [sessTopic, setSessTopic] = useState('');
  const [sessObjective, setSessObjective] = useState('');
  const [sessActivity, setSessActivity] = useState('');
  const [sessExercise, setSessExercise] = useState('');
  const [sessHomework, setSessHomework] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getCurriculumAll();
      setModules(res.modules || []);
      setSessions(res.sessions || []);
      if (res.modules && res.modules.length > 0) {
        setExpandedModuleId(res.modules[0].id);
      }
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to load curriculum.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleTitle) return;

    try {
      setSubmitting(true);
      await api.createCurriculumModule({
        course_id: courseId,
        grade_group: selectedGrade,
        module_number: Number(moduleNumber) || 1,
        title: moduleTitle,
        description: moduleDesc,
      });

      if (onSuccessToast) onSuccessToast('Curriculum module created.');
      setIsAddModuleOpen(false);
      setModuleTitle('');
      setModuleDesc('');
      loadData();
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to create module.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetModuleId || !sessTopic || !sessObjective) return;

    try {
      setSubmitting(true);
      await api.createCurriculumSession({
        module_id: targetModuleId,
        course_id: courseId,
        grade_group: selectedGrade,
        week_number: Number(sessWeek) || 1,
        session_number: Number(sessNumber) || 1,
        topic: sessTopic,
        learning_objective: sessObjective,
        activity: sessActivity,
        speaking_exercise: sessExercise,
        homework_suggestion: sessHomework,
      });

      if (onSuccessToast) onSuccessToast('Curriculum session added.');
      setIsAddSessionOpen(false);
      setSessTopic('');
      setSessObjective('');
      setSessActivity('');
      setSessExercise('');
      setSessHomework('');
      loadData();
    } catch (e) {
      if (onErrorToast) onErrorToast('Failed to create session.');
    } finally {
      setSubmitting(false);
    }
  };

  const gradeOptions = ['Class 4-7', 'Class 8-12', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

  const filteredModules = modules.filter(
    (m) => m.grade_group === selectedGrade || m.grade_group.includes(selectedGrade)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#10182C] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#F27C00]" />
            <span>Master Curriculum Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Author and configure the master speech, debate, and confidence syllabus across Classes 4 to 12.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModuleOpen(true)}
            className="px-4 py-2.5 bg-[#10182C] text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Module</span>
          </button>
        </div>
      </div>

      {/* Grade Selector Row */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-500 mr-2">Grade Group:</span>
        {gradeOptions.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGrade(g)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedGrade === g
                ? 'bg-[#F27C00] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Modules List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-32 bg-slate-200/70 rounded-xl"></div>
          <div className="h-32 bg-slate-200/70 rounded-xl"></div>
        </div>
      ) : filteredModules.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Modules for {selectedGrade}</h3>
          <p className="text-xs text-slate-500 mt-1">Click "Add Module" to start creating the syllabus for this grade.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredModules.map((mod) => {
            const isExpanded = expandedModuleId === mod.id;
            const moduleSessions = sessions.filter((s) => s.module_id === mod.id);

            return (
              <div
                key={mod.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition"
              >
                <div className="p-5 flex items-center justify-between hover:bg-slate-50/80 transition cursor-pointer"
                  onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#10182C] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      M{mod.module_number}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#10182C] text-base">{mod.title}</h3>
                      <p className="text-xs text-slate-500">{mod.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTargetModuleId(mod.id);
                        setIsAddSessionOpen(true);
                      }}
                      className="px-3 py-1.5 bg-[#F27C00] text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Session</span>
                    </button>
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-100 space-y-3 bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {moduleSessions.map((sess) => (
                        <div key={sess.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                          <span className="text-[10px] font-bold text-[#F27C00] bg-amber-50 px-2 py-0.5 rounded">
                            Week {sess.week_number} &bull; Session {sess.session_number}
                          </span>
                          <h4 className="font-bold text-sm text-[#10182C]">{sess.topic}</h4>
                          <p className="text-xs text-slate-600"><strong>Objective:</strong> {sess.learning_objective}</p>
                          {sess.activity && (
                            <p className="text-xs text-slate-500"><strong>Activity:</strong> {sess.activity}</p>
                          )}
                          {sess.homework_suggestion && (
                            <p className="text-xs text-slate-500"><strong>HW:</strong> {sess.homework_suggestion}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ADD MODULE MODAL */}
      {isAddModuleOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-[#10182C]">Add Curriculum Module</h3>
              <button onClick={() => setIsAddModuleOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddModule} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Module Title</label>
                <input
                  type="text"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  placeholder="e.g. Structure: The 3-Part Speech & Storytelling"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Module Number</label>
                <input
                  type="number"
                  value={moduleNumber}
                  onChange={(e) => setModuleNumber(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Focus</label>
                <textarea
                  rows={3}
                  value={moduleDesc}
                  onChange={(e) => setModuleDesc(e.target.value)}
                  placeholder="Core speaking techniques and competencies covered in this module..."
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModuleOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#F27C00] text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Module'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SESSION MODAL */}
      {isAddSessionOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-[#10182C]">Add Curriculum Session</h3>
              <button onClick={() => setIsAddSessionOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSession} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Week Number</label>
                  <input
                    type="number"
                    value={sessWeek}
                    onChange={(e) => setSessWeek(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Session Number</label>
                  <input
                    type="number"
                    value={sessNumber}
                    onChange={(e) => setSessNumber(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Session Topic</label>
                <input
                  type="text"
                  value={sessTopic}
                  onChange={(e) => setSessTopic(e.target.value)}
                  placeholder="e.g. Speaking Without Hesitation"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Learning Objective</label>
                <textarea
                  rows={2}
                  value={sessObjective}
                  onChange={(e) => setSessObjective(e.target.value)}
                  placeholder="Introduce yourself clearly and confidently without filler sounds."
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Live Class Activity</label>
                <textarea
                  rows={2}
                  value={sessActivity}
                  onChange={(e) => setSessActivity(e.target.value)}
                  placeholder="e.g. 60-Second Superpower Introduction challenge"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Homework Suggestion</label>
                <textarea
                  rows={2}
                  value={sessHomework}
                  onChange={(e) => setSessHomework(e.target.value)}
                  placeholder="e.g. Record a 60-second video introducing your favorite hobby."
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSessionOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#F27C00] text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
