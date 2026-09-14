import React, { useState, useEffect } from 'react';
import { Student, Batch, Course } from '../../types';
import { api } from '../../lib/api';
import { Badge } from '../ui/Badge';
import {
  GraduationCap,
  Search,
  RefreshCw,
  Phone,
  MessageCircle,
  Edit2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Modal } from '../ui/Modal';

interface StudentsViewProps {
  batches: Batch[];
  courses: Course[];
  onSuccessToast: (msg: string) => void;
  onErrorToast: (msg: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  batches,
  courses,
  onSuccessToast,
  onErrorToast,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Edit / Reassign Batch Modal
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [reassignBatchId, setReassignBatchId] = useState('');
  const [studentStatus, setStudentStatus] = useState('ACTIVE');
  const [classesAttended, setClassesAttended] = useState(0);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadStudents();
  }, [statusFilter]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await api.getStudents({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      setStudents(res.students || []);
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setUpdating(true);
    try {
      await api.updateStudent(selectedStudent.id, {
        batch_id: reassignBatchId || undefined,
        status: studentStatus as any,
        classes_attended: classesAttended,
      });
      setSelectedStudent(null);
      loadStudents();
      onSuccessToast('Student enrollment updated successfully!');
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to update student');
    } finally {
      setUpdating(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.student_name.toLowerCase().includes(q) ||
      s.parent_name.toLowerCase().includes(q) ||
      s.parent_phone.includes(q) ||
      (s.city && s.city.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-6 md:p-8 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active Students Roster</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track enrolled learners, cohort allocations, and graduation progress
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadStudents}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            title="Refresh Roster"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search */}
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

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['ALL', 'ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st === 'ALL' ? 'All Students' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Student & Grade</th>
                <th className="py-3 px-4">Parent & Contact</th>
                <th className="py-3 px-4">Assigned Cohort Batch</th>
                <th className="py-3 px-4">Attendance Progress</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    {loading ? 'Fetching students...' : 'No enrolled students matching filter.'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{st.student_name}</div>
                      <div className="text-[11px] text-slate-500">
                        {st.class_grade} {st.age ? `• ${st.age} yrs` : ''} {st.city ? `• ${st.city}` : ''}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{st.parent_name}</div>
                      <div className="text-[11px] text-slate-500">{st.parent_phone}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {st.batch_name ? (
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-amber-600" />
                          <span>{st.batch_name}</span>
                        </div>
                      ) : (
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200">
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">
                        {st.classes_attended || 0} / 36 classes
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{
                            width: `${Math.min(100, Math.round(((st.classes_attended || 0) / 36) * 100))}%`,
                          }}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant="student" value={st.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://wa.me/91${st.parent_phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                          title="WhatsApp Parent"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => {
                            setSelectedStudent(st);
                            setReassignBatchId(st.batch_id || '');
                            setStudentStatus(st.status);
                            setClassesAttended(st.classes_attended || 0);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Edit
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

      {/* Edit Student Modal */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title={`Student Record: ${selectedStudent?.student_name}`}
        subtitle={`Enrolled: ${selectedStudent?.created_at?.slice(0, 10)}`}
        maxWidth="md"
      >
        {selectedStudent && (
          <form onSubmit={handleUpdateStudent} className="space-y-4 text-left text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Assign or Change Cohort Batch</label>
              <select
                value={reassignBatchId}
                onChange={(e) => setReassignBatchId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium"
              >
                <option value="">-- Leave Unassigned --</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.enrolled_count || 0}/8 students)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Enrollment Status</label>
                <select
                  value={studentStatus}
                  onChange={(e) => setStudentStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="PAUSED">PAUSED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Classes Attended (out of 36)</label>
                <input
                  type="number"
                  min={0}
                  max={36}
                  value={classesAttended}
                  onChange={(e) => setClassesAttended(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white font-bold"
              >
                {updating ? 'Saving...' : 'Update Record'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
