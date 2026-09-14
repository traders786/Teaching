import React from 'react';
import { LeadStatus, LeadSource, DemoStatus, StudentStatus, BatchStatus, PaymentStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-800 border-sky-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap leading-none ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const LeadStatusBadge: React.FC<{ status: LeadStatus }> = ({ status }) => {
  const map: Record<LeadStatus, { label: string; variant: BadgeProps['variant'] }> = {
    NEW: { label: 'New Lead', variant: 'info' },
    CONTACTED: { label: 'Contacted', variant: 'warning' },
    DEMO_SCHEDULED: { label: 'Demo Scheduled', variant: 'info' },
    DEMO_COMPLETED: { label: 'Demo Done', variant: 'success' },
    FOLLOW_UP: { label: 'Follow Up', variant: 'warning' },
    PAYMENT_PENDING: { label: 'Payment Pending', variant: 'warning' },
    CONVERTED: { label: 'Enrolled / Converted', variant: 'success' },
    LOST: { label: 'Lost / Closed', variant: 'neutral' },
  };

  const item = map[status] || { label: status, variant: 'neutral' };
  return <Badge variant={item.variant}>{item.label}</Badge>;
};

export const LeadSourceBadge: React.FC<{ source: LeadSource | string }> = ({ source }) => {
  const labels: Record<string, string> = {
    META_ADS: 'Meta Ads',
    INSTAGRAM: 'Instagram',
    GOOGLE: 'Google Search',
    REFERRAL: 'Referral',
    EDUCATION_PARTNER: 'Partner School',
    ORGANIC: 'Organic',
    DIRECT: 'Direct Web',
    OTHER: 'Other',
  };

  return <Badge variant="neutral">{labels[source] || source}</Badge>;
};

export const DemoStatusBadge: React.FC<{ status: DemoStatus }> = ({ status }) => {
  const map: Record<DemoStatus, { label: string; variant: BadgeProps['variant'] }> = {
    SCHEDULED: { label: 'Scheduled', variant: 'info' },
    COMPLETED: { label: 'Completed', variant: 'success' },
    CANCELLED: { label: 'Cancelled', variant: 'danger' },
    NO_SHOW: { label: 'No Show', variant: 'warning' },
  };

  const item = map[status] || { label: status, variant: 'neutral' };
  return <Badge variant={item.variant}>{item.label}</Badge>;
};

export const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  const map: Record<PaymentStatus, { label: string; variant: BadgeProps['variant'] }> = {
    PENDING: { label: 'Pending', variant: 'warning' },
    PAID: { label: 'Paid & Verified', variant: 'success' },
    FAILED: { label: 'Failed', variant: 'danger' },
    REFUNDED: { label: 'Refunded', variant: 'neutral' },
  };

  const item = map[status] || { label: status, variant: 'neutral' };
  return <Badge variant={item.variant}>{item.label}</Badge>;
};

export const BatchStatusBadge: React.FC<{ status: BatchStatus }> = ({ status }) => {
  const map: Record<BatchStatus, { label: string; variant: BadgeProps['variant'] }> = {
    UPCOMING: { label: 'Upcoming', variant: 'info' },
    ACTIVE: { label: 'In Progress', variant: 'success' },
    COMPLETED: { label: 'Completed', variant: 'neutral' },
    CANCELLED: { label: 'Cancelled', variant: 'danger' },
  };

  const item = map[status] || { label: status, variant: 'neutral' };
  return <Badge variant={item.variant}>{item.label}</Badge>;
};

export const StudentStatusBadge: React.FC<{ status: StudentStatus }> = ({ status }) => {
  const map: Record<StudentStatus, { label: string; variant: BadgeProps['variant'] }> = {
    ACTIVE: { label: 'Active Learner', variant: 'success' },
    PENDING: { label: 'Batch Pending', variant: 'warning' },
    PAUSED: { label: 'Paused', variant: 'warning' },
    COMPLETED: { label: 'Graduated', variant: 'neutral' },
    EXPIRED: { label: 'Expired', variant: 'danger' },
    CANCELLED: { label: 'Cancelled', variant: 'neutral' },
  };

  const item = map[status] || { label: status, variant: 'neutral' };
  return <Badge variant={item.variant}>{item.label}</Badge>;
};
