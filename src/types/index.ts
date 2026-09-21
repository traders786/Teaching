export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export interface User {
  id: string;
  email: string;
  phone?: string | null;
  name: string;
  role: UserRole;
  avatar_url?: string | null;
  teacher_id?: string | null;
  student_id?: string | null;
}

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
  timezone?: string;
}

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

export type DemoStatus =
  | 'NEW'
  | 'ASSIGNED'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'NO_SHOW'
  | 'RESCHEDULED'
  | 'CANCELLED';

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
  google_meet_link?: string | null;
  zoom_meeting_id?: string | null;
  zoom_password?: string | null;
  zoom_join_url?: string | null;
  zoom_start_url?: string | null;
  zoom_is_live_api?: number | boolean;
  capacity: number;
  status: DemoStatus | string;
  notes: string | null;
  attendee_count?: number;
  student_name?: string;
  student_class?: string;
  student_age?: number;
  parent_name?: string;
  parent_phone?: string;
  parent_email?: string;
  city?: string;
  interest_area?: string;
  preferred_time?: string;
  scheduled_at?: string;
  teacher_feedback?: string;
  lead_id?: string;
  evaluation_id?: string;
  evaluation_outcome?: string;
  evaluated_at?: string;
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

export interface DemoEvaluation {
  id: string;
  demo_id: string;
  lead_id: string;
  teacher_id: string;
  spoken_english: 'Needs Practice' | 'Developing' | 'Good' | 'Strong';
  pronunciation: 'Needs Practice' | 'Developing' | 'Good' | 'Strong';
  fluency: 'Needs Practice' | 'Developing' | 'Good' | 'Strong';
  confidence: 'Needs Practice' | 'Developing' | 'Good' | 'Strong';
  public_speaking: 'Needs Practice' | 'Developing' | 'Good' | 'Strong';
  vocabulary: 'Needs Practice' | 'Developing' | 'Good' | 'Strong';
  sentence_formation: 'Needs Practice' | 'Developing' | 'Good' | 'Strong';
  listening: 'Needs Practice' | 'Developing' | 'Good' | 'Strong';
  debate_reasoning: 'Needs Practice' | 'Developing' | 'Good' | 'Strong';
  strengths: string;
  areas_to_improve: string;
  recommended_program: string;
  recommended_batch_id?: string | null;
  additional_notes?: string;
  outcome: 'Recommended' | 'Needs Follow-up' | 'Not Suitable' | 'Parent Decision Pending';
  evaluated_at: string;
}

export interface Teacher {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  photo_url: string | null;
  google_meet_link?: string | null;
  payout_per_demo?: number;
  qualification?: string | null;
  experience?: string | null;
  biography: string | null;
  expertise: string | null;
  achievements: string | null;
  availability: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | string;
  total_demos?: number;
  completed_demos?: number;
  pending_demos?: number;
  total_earnings?: number;
  assigned_batches_count?: number;
  active_students_count?: number;
  created_at: string;
}

export type StudentStatus = 'LEAD' | 'DEMO' | 'ENROLLED' | 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'INACTIVE' | 'PAUSED' | 'EXPIRED' | 'CANCELLED';

export interface Student {
  id: string;
  user_id?: string | null;
  lead_id: string | null;
  name: string;
  student_name?: string;
  class_grade: string;
  age: number | null;
  school?: string | null;
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
  teacher_name?: string;
  teacher_photo?: string | null;
  classes_attended?: number;
  created_at: string;
}

export type BatchStatus = 'DRAFT' | 'OPEN' | 'UPCOMING' | 'ACTIVE' | 'FULL' | 'NEEDS_TEACHER' | 'COMPLETED' | 'CANCELLED';

export interface Batch {
  id: string;
  batch_name: string;
  code?: string;
  name?: string;
  course_id: string;
  course_name?: string;
  teacher_id: string | null;
  teacher_name?: string;
  teacher_email?: string;
  teacher_phone?: string;
  grade_group?: string;
  class_range?: string;
  start_date: string;
  end_date?: string;
  schedule_days?: string;
  schedule_time: string;
  timezone?: string;
  meeting_link?: string | null;
  meeting_url?: string | null;
  target_capacity?: number;
  target_size?: number;
  max_capacity?: number;
  max_size?: number;
  status: BatchStatus | string;
  notes?: string | null;
  enrolled_count: number;
  total_sessions_count?: number;
  completed_sessions_count?: number;
  students?: any[];
  sessions?: any[];
  homework?: any[];
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

export type ClassSessionStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED';

export interface ClassSession {
  id: string;
  batch_id: string;
  batch_name?: string;
  grade_group?: string;
  teacher_id: string | null;
  teacher_name?: string;
  teacher_photo?: string | null;
  date: string;
  start_time: string;
  end_time: string;
  topic: string;
  module_id?: string | null;
  meeting_link?: string | null;
  google_meet_link?: string | null;
  recording_url?: string | null;
  status: ClassSessionStatus;
  teacher_notes?: string | null;
  student_count?: number;
  target_capacity?: number;
  present_count?: number;
  attendance_status?: 'PRESENT' | 'ABSENT' | 'LATE';
  attendance_notes?: string;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  session_id: string;
  student_id: string;
  batch_id: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  notes?: string | null;
  marked_by?: string;
  marked_at: string;
  topic?: string;
  date?: string;
  start_time?: string;
}

export interface CurriculumModule {
  id: string;
  course_id: string;
  course_name?: string;
  grade_group: string;
  module_number: number;
  title: string;
  description: string | null;
  created_at: string;
}

export interface CurriculumSession {
  id: string;
  module_id: string;
  course_id: string;
  grade_group: string;
  week_number: number;
  session_number: number;
  topic: string;
  learning_objective: string;
  activity?: string | null;
  speaking_exercise?: string | null;
  homework_suggestion?: string | null;
  required_materials?: string | null;
  is_completed?: number | boolean;
  created_at: string;
}

export type HomeworkSubmissionType = 'TEXT' | 'FILE' | 'AUDIO' | 'VIDEO' | 'LINK';
export type SubmissionStatus = 'SUBMITTED' | 'REVIEWED' | 'RESUBMIT';
export type MentorRating = 'Needs Practice' | 'Developing' | 'Good' | 'Strong';

export interface Homework {
  id: string;
  batch_id: string;
  batch_name?: string;
  grade_group?: string;
  session_id?: string | null;
  teacher_id: string;
  teacher_name?: string;
  title: string;
  description?: string | null;
  instructions?: string | null;
  due_date: string;
  submission_type: HomeworkSubmissionType;
  attachment_url?: string | null;
  status: 'ACTIVE' | 'CLOSED';
  total_submissions?: number;
  pending_reviews?: number;
  enrolled_students?: number;
  submission_id?: string;
  submission_status?: SubmissionStatus;
  score_rating?: MentorRating;
  mentor_feedback?: string;
  submitted_at?: string;
  created_at: string;
}

export interface HomeworkSubmission {
  id: string;
  homework_id: string;
  homework_title?: string;
  due_date?: string;
  instructions?: string;
  student_id: string;
  student_name?: string;
  class_grade?: string;
  school?: string;
  submission_type: HomeworkSubmissionType;
  content_text?: string | null;
  media_url?: string | null;
  file_name?: string | null;
  submitted_at: string;
  status: SubmissionStatus;
  score_rating?: MentorRating;
  mentor_feedback?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
}

export interface RecordingItem {
  id: string;
  session_id?: string | null;
  batch_id: string;
  batch_name?: string;
  teacher_id?: string | null;
  teacher_name?: string;
  title: string;
  topic: string;
  duration_minutes: number;
  recording_url: string;
  provider: 'GOOGLE_MEET' | 'ZOOM' | 'SECURE_STORAGE' | 'OTHER';
  status: 'AVAILABLE' | 'PROCESSING' | 'RESTRICTED';
  recorded_date: string;
  created_at: string;
}

export type TicketCategory =
  | 'Technical Issue'
  | 'Class Issue'
  | 'Homework'
  | 'Curriculum'
  | 'Account'
  | 'Payment'
  | 'Recording'
  | 'Other';

export type TicketPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'RESOLVED' | 'CLOSED';

export interface HelpdeskTicket {
  id: string;
  ticket_number: string;
  user_id: string;
  user_name: string;
  user_role: UserRole;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  attachment_url?: string | null;
  message_count?: number;
  last_message_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: UserRole;
  message: string;
  attachment_url?: string | null;
  created_at: string;
}

export interface InAppNotification {
  id: string;
  user_id: string;
  user_role?: UserRole;
  title: string;
  message: string;
  type: string;
  link_url?: string | null;
  is_read: number | boolean;
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

export type DashboardStats = {
  metrics: DashboardMetrics;
  sourceBreakdown: { lead_source: string; count: number }[];
  statusBreakdown: { status: string; count: number }[];
  recentActivities: (LeadActivity & { student_name: string; parent_name: string })[];
  upcomingDemos: DemoSession[];
};
