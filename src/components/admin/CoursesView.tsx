import React, { useState, useEffect } from 'react';
import { Course } from '../../types';
import { api } from '../../lib/api';
import { BookOpen, Plus, RefreshCw, CheckCircle2, Star, Edit2 } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface CoursesViewProps {
  courses: Course[];
  onSuccessToast: (msg: string) => void;
  onErrorToast: (msg: string) => void;
  onRefreshCourses: () => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  onSuccessToast,
  onErrorToast,
  onRefreshCourses,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceInr, setPriceInr] = useState(4999);
  const [durationMonths, setDurationMonths] = useState(3);
  const [classesPerWeek, setClassesPerWeek] = useState(3);
  const [totalClasses, setTotalClasses] = useState(36);
  const [targetBatchSize, setTargetBatchSize] = useState(8);
  const [maxBatchSize, setMaxBatchSize] = useState(9);
  const [isFlagship, setIsFlagship] = useState(false);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditingCourse(null);
    setName('');
    setDescription('Intensive speech and debate coaching cohort.');
    setPriceInr(4999);
    setDurationMonths(3);
    setClassesPerWeek(3);
    setTotalClasses(36);
    setTargetBatchSize(8);
    setMaxBatchSize(9);
    setIsFlagship(false);
    setShowAddModal(true);
  };

  const openEdit = (c: Course) => {
    setEditingCourse(c);
    setName(c.name);
    setDescription(c.description || '');
    setPriceInr(c.price_inr);
    setDurationMonths(c.duration_months);
    setClassesPerWeek(c.classes_per_week);
    setTotalClasses(c.total_classes);
    setTargetBatchSize(c.target_batch_size);
    setMaxBatchSize(c.max_batch_size);
    setIsFlagship(!!c.is_flagship);
    setShowAddModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCourse) {
        await api.updateCourse(editingCourse.id, {
          name,
          description,
          price_inr: priceInr,
          duration_months: durationMonths,
          classes_per_week: classesPerWeek,
          total_classes: totalClasses,
          target_batch_size: targetBatchSize,
          max_batch_size: maxBatchSize,
          is_flagship: isFlagship,
        });
        onSuccessToast('Course updated successfully');
      } else {
        await api.createCourse({
          name,
          description,
          price_inr: priceInr,
          duration_months: durationMonths,
          classes_per_week: classesPerWeek,
          total_classes: totalClasses,
          target_batch_size: targetBatchSize,
          max_batch_size: maxBatchSize,
          is_flagship: isFlagship,
        });
        onSuccessToast('New course tier added to catalog');
      }
      setShowAddModal(false);
      onRefreshCourses();
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Course Curriculum Catalog</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage program structures, session counts, and live pricing for student admissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course Program</span>
          </button>
        </div>
      </div>

      {/* Courses Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className={`p-6 rounded-2xl bg-white border flex flex-col justify-between transition-all shadow-2xs ${
              course.is_flagship ? 'border-amber-500 ring-2 ring-amber-400/20' : 'border-slate-200'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <BookOpen className="w-5 h-5" />
                </div>
                {course.is_flagship && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    <Star className="w-3 h-3 fill-amber-700 text-amber-700" />
                    <span>FLAGSHIP</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{course.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{course.description}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Term Duration:</span>
                  <strong className="text-slate-900">{course.duration_months} Months ({course.total_classes} Classes)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Pacing:</span>
                  <strong className="text-slate-900">{course.classes_per_week} classes / week</strong>
                </div>
                <div className="flex justify-between">
                  <span>Batch Strict Cap:</span>
                  <strong className="text-slate-900">{course.target_batch_size} students (Max {course.max_batch_size})</strong>
                </div>
              </div>

              <div className="pt-2 flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-medium">Program Fee:</span>
                <span className="text-2xl font-extrabold text-slate-900">
                  ₹{course.price_inr.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => openEdit(course)}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Configure Program</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Course Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingCourse ? `Edit: ${editingCourse.name}` : 'Create New Course Program'}
        subtitle="Specify academic duration, live class volume, and fee amount"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-left text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Course Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Master Public Speaking & MUN Program"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Syllabus overview and target student profile..."
              className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Fee in INR (₹) *</label>
              <input
                type="number"
                required
                min={500}
                value={priceInr}
                onChange={(e) => setPriceInr(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Duration (Months) *</label>
              <input
                type="number"
                required
                min={1}
                max={12}
                value={durationMonths}
                onChange={(e) => setDurationMonths(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Classes Per Week</label>
              <input
                type="number"
                required
                min={1}
                max={7}
                value={classesPerWeek}
                onChange={(e) => setClassesPerWeek(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Total Program Classes</label>
              <input
                type="number"
                required
                min={1}
                value={totalClasses}
                onChange={(e) => setTotalClasses(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFlagship}
                onChange={(e) => setIsFlagship(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <span className="font-bold text-slate-800">
                Designate as Primary Flagship Program on Website
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-amber-600 text-white font-bold"
            >
              {saving ? 'Saving...' : 'Save Course'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
