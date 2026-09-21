import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Sparkles,
  Award,
  Layers,
  FileText,
  ChevronDown,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { api } from '../../lib/api';

export function TeacherCurriculumView() {
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('Class 4-7');
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  const loadCurriculum = async () => {
    try {
      setLoading(true);
      const res = await api.getTeacherCurriculum();
      setModules(res.modules || []);
      setSessions(res.sessions || []);
      if (res.modules && res.modules.length > 0) {
        setExpandedModuleId(res.modules[0].id);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurriculum();
  }, []);

  const gradeTabs = [
    { id: 'Class 4-7', label: 'Junior (Class 4 – 7)' },
    { id: 'Class 8-12', label: 'Senior (Class 8 – 12)' },
    { id: 'Grade 9-10', label: 'Grade 9 & 10 (Advanced Board Prep)' },
  ];

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
            <span>Master Curriculum Board</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Reference standard learning objectives, weekly speaking activities, and assignments.
          </p>
        </div>

        {/* Grade Filter */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {gradeTabs.map((gt) => (
            <button
              key={gt.id}
              onClick={() => {
                setSelectedGrade(gt.id);
                const firstForGrade = modules.find((m) => m.grade_group === gt.id);
                if (firstForGrade) setExpandedModuleId(firstForGrade.id);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                selectedGrade === gt.id
                  ? 'bg-white text-[#10182C] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {gt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Modules Accordion */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-32 bg-slate-200/70 rounded-xl"></div>
          <div className="h-32 bg-slate-200/70 rounded-xl"></div>
        </div>
      ) : filteredModules.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Curriculum Modules Available</h3>
          <p className="text-xs text-slate-500 mt-1">Admin manages the master syllabus for this grade category.</p>
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
                {/* Module Header */}
                <button
                  onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                  className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-50/80 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#10182C] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      M{mod.module_number}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#10182C] text-base">{mod.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{mod.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {moduleSessions.length} Sessions
                    </span>
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                  </div>
                </button>

                {/* Module Sessions List */}
                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-100 space-y-4 bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {moduleSessions.map((sess) => (
                        <div
                          key={sess.id}
                          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold text-[#F27C00] bg-amber-50 px-2 py-0.5 rounded">
                                Week {sess.week_number} &bull; Session {sess.session_number}
                              </span>
                              <h4 className="font-bold text-sm text-[#10182C] mt-1.5">{sess.topic}</h4>
                            </div>
                          </div>

                          <div className="text-xs space-y-2 text-slate-700">
                            <div>
                              <strong className="text-slate-900 block text-[11px]">Learning Objective:</strong>
                              <p className="text-slate-600 mt-0.5">{sess.learning_objective}</p>
                            </div>

                            {sess.activity && (
                              <div className="p-2 bg-indigo-50/60 rounded-lg text-indigo-950">
                                <strong className="text-[11px] block text-indigo-900">Live Class Activity:</strong>
                                <p className="text-[11px] mt-0.5">{sess.activity}</p>
                              </div>
                            )}

                            {sess.speaking_exercise && (
                              <div className="p-2 bg-amber-50/60 rounded-lg text-amber-950">
                                <strong className="text-[11px] block text-amber-900">Speaking Exercise:</strong>
                                <p className="text-[11px] mt-0.5">{sess.speaking_exercise}</p>
                              </div>
                            )}

                            {sess.homework_suggestion && (
                              <div>
                                <strong className="text-slate-900 block text-[11px]">Homework Prompt:</strong>
                                <p className="text-slate-600 text-[11px] mt-0.5">{sess.homework_suggestion}</p>
                              </div>
                            )}
                          </div>
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
    </div>
  );
}
