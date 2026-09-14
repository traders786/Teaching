import React from 'react';
import { Modal } from '../ui/Modal';
import { BrandingConfig } from '../../types';

interface LegalModalProps {
  isOpen: boolean;
  type: 'PRIVACY' | 'TERMS' | null;
  onClose: () => void;
  branding: BrandingConfig;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose, branding }) => {
  if (!isOpen || !type) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === 'PRIVACY' ? 'Privacy Policy & Student Safety' : 'Terms & Conditions of Service'}
      subtitle={`Policy governing ${branding.brandName} educational platform`}
      maxWidth="xl"
    >
      <div className="space-y-4 text-xs leading-relaxed text-slate-700 text-left">
        {type === 'PRIVACY' ? (
          <>
            <p className="font-bold text-slate-900">1. Student Safety & Data Protection</p>
            <p>
              At {branding.brandName}, the privacy and safety of our minor students (Class 4 to Class 12) is our
              highest priority. We only collect essential parent and student contact details necessary to schedule
              demo evaluations and maintain active cohort records.
            </p>

            <p className="font-bold text-slate-900">2. Live Classroom Conduct</p>
            <p>
              All live interactive video sessions are strictly monitored by certified faculty. Parents retain the
              explicit right to quietly observe any class. Video or audio recordings of minors are never published
              publicly without written parental consent.
            </p>

            <p className="font-bold text-slate-900">3. Contact & Communication</p>
            <p>
              Parental contact numbers are utilized solely for class scheduling links, timetable updates, and
              academic progress consultations. We never sell or distribute student or parent records to third-party
              marketing databases.
            </p>
          </>
        ) : (
          <>
            <p className="font-bold text-slate-900">1. Academic Enrollment & Term Structure</p>
            <p>
              The flagship program comprises 36 live interactive sessions spanning approximately 3 months (12 weeks).
              Batches are strictly capped at a target of {branding.classBatchTargetSize} students (with an absolute ceiling
              of {branding.classBatchMaxSize}) to guarantee individual speaking feedback.
            </p>

            <p className="font-bold text-slate-900">2. Attendance & Missed Classes</p>
            <p>
              Because active speaking cannot be substituted with pre-recorded videos, students are expected to attend
              their assigned slot. In case of school exam conflicts or medical emergencies, coordinate with your academic
              counsellor for makeup speaking assignments.
            </p>

            <p className="font-bold text-slate-900">3. Transparent Fee & Refund Policy</p>
            <p>
              The course fee of ₹{(branding.flagshipPrice || 4999).toLocaleString('en-IN')} covers the full 3-month term.
              Parents evaluate the pedagogical approach during the free 45-minute demo before any financial commitment
              is requested.
            </p>
          </>
        )}
      </div>
    </Modal>
  );
};
