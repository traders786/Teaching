export interface BrandingConfig {
  brandName: string;
  tagline: string;
  contactPhone: string;
  supportWhatsapp: string;
  contactEmail: string;
  classBatchTargetSize: number;
  classBatchMaxSize: number;
  flagshipPrice: number;
  heroHeadline?: string;
  heroSubheadline?: string;
}

export type DashboardStats = {
  metrics: DashboardMetrics;
  sourceBreakdown: { lead_source: string; count: number }[];
  statusBreakdown: { status: string; count: number }[];
  recentActivities: (LeadActivity & { student_name: string; parent_name: string })[];
  upcomingDemos: DemoSession[];
};

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'DEMO_SCHEDULED'
  | 'DEMO_COMPLETED'
  | 'FOLLOW_UP'
  | 'PAYMENT_PENDING'
  | 'CONVERTED'
  | 'LOST';

export type LeadSource =
  | 'META_ADS'
  | 'INSTAGRAM'
  | 'GOOGLE'
  | 'REFERRAL'
  | 'EDUCATION_PARTNER'
  | 'ORGANIC'
  | 'DIRECT'
  | 'OTHER';

export interface Lead {
  id: string;
  student_name: string;
  student_class: string;
  student_age: number | null;
  parent_name: string;
  mobile_number: string;
  email: string | null;
  city: string | null;
  interest_area: string;
  preferred_time: string | null;
  notes: string | null;
  lead_source: LeadSource;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referral_code: string | null;
  status: LeadStatus;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  action_type:
    | 'CREATED'
    | 'STATUS_CHANGE'
    | 'NOTE_ADDED'
    | 'DEMO_SCHEDULED'
    | 'DEMO_COMPLETED'
    | 'PAYMENT_REQUESTED'
    | 'PAYMENT_COMPLETED'
    | 'STUDENT_CONVERTED';
  description: string;
  actor_name: string;
  actor_id?: string | null;
  metadata_json?: string | null;
  created_at: string;
}

export type DemoStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface DemoSession {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  teacher_id: string | null;
  teacher_name?: string;
  teacher_email?: string;
  meeting_link: string;
  capacity: number;
  status: DemoStatus | string;
  notes: string | null;
  attendee_count?: number;
  student_name?: string;
  student_class?: string;
  parent_name?: string;
  parent_phone?: string;
  scheduled_at?: string;
  duration_minutes?: number;
  teacher_feedback?: string;
  created_at: string;
}

export interface DemoAttendee {
  id: string;
  demo_id: string;
  lead_id: string;
  student_name: string;
  parent_phone: string;
  student_class?: string;
  city?: string;
  interest_area?: string;
  attendance_status: 'REGISTERED' | 'ATTENDED' | 'ABSENT';
  outcome: 'HIGH_POTENTIAL' | 'NEEDS_FOLLOW_UP' | 'NOT_INTERESTED' | 'READY_TO_ENROLL' | null;
  feedback: string | null;
  conversion_potential: 'HIGH' | 'MEDIUM' | 'LOW' | null;
  created_at: string;
}

export type StudentStatus = 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED' | 'PAUSED';

export interface Student {
  id: string;
  lead_id: string | null;
  name: string;
  student_name: string;
  class_grade: string;
  age: number | null;
  parent_name: string;
  parent_phone: string;
  parent_email: string | null;
  city: string | null;
  status: StudentStatus;
  batch_id?: string;
  batch_name?: string;
  schedule_days?: string;
  schedule_time?: string;
  course_name?: string;
  start_date?: string;
  end_date?: string;
  enrollment_status?: string;
  classes_attended?: number;
  created_at: string;
}

export type BatchStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Batch {
  id: string;
  batch_name: string;
  name?: string;
  course_id: string;
  course_name?: string;
  teacher_id: string | null;
  teacher_name?: string;
  start_date: string;
  end_date?: string;
  schedule_days?: string;
  schedule_time: string;
  meeting_link?: string | null;
  meeting_url?: string | null;
  target_capacity?: number;
  target_size?: number;
  max_capacity?: number;
  max_size?: number;
  class_range?: string;
  status: BatchStatus | string;
  notes?: string | null;
  enrolled_count: number;
  created_at: string;
}

export interface Course {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration_months: number;
  classes_per_week: number;
  total_classes: number;
  price_inr: number;
  currency: string;
  target_batch_size: number;
  max_batch_size: number;
  status: string;
  is_flagship: number;
  created_at: string;
}

export interface Teacher {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  photo_url: string | null;
  biography: string | null;
  expertise: string | null;
  achievements: string | null;
  availability: string | null;
  status: string;
  created_at: string;
}

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id: string;
  lead_id: string | null;
  student_id: string | null;
  course_id: string;
  course_name?: string;
  student_name?: string;
  student_class?: string;
  parent_name?: string;
  parent_phone?: string;
  parent_email?: string;
  amount_inr: number;
  currency: string;
  gateway: string;
  gateway_order_id: string | null;
  gateway_payment_id: string | null;
  status: PaymentStatus;
  payment_link: string | null;
  notes: string | null;
  created_at: string;
  paid_at: string | null;
}

export interface DashboardMetrics {
  totalLeads: number;
  newLeads: number;
  demoScheduled: number;
  demoCompleted: number;
  convertedStudents: number;
  activeStudents: number;
  pendingPaymentsCount: number;
  totalRevenue: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER';
}
