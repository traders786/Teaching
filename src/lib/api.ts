import {
  BrandingConfig,
  Lead,
  LeadActivity,
  DemoSession,
  DemoAttendee,
  Student,
  Batch,
  Course,
  Teacher,
  Payment,
  DashboardMetrics,
  User,
} from '../types';

const TOKEN_STORAGE_KEY = 'speakindia_auth_token';
let inMemoryToken: string | null = null;

export function getStoredToken(): string | null {
  try {
    const token = typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(TOKEN_STORAGE_KEY) : null;
    return token || inMemoryToken;
  } catch (e) {
    return inMemoryToken;
  }
}

export function setStoredToken(token: string) {
  inMemoryToken = token;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  } catch (e) {
    // Graceful fallback to memory storage
  }
}

export function clearStoredToken() {
  inMemoryToken = null;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch (e) {
    // Graceful fallback
  }
}

export const removeStoredToken = clearStoredToken;

// ==========================================
// CLIENT-SIDE LOCAL STORAGE MOCK ENGINE (FOR GITHUB PAGES)
// ==========================================

const DEFAULT_COURSES: Course[] = [
  {
    id: 'crs_starter_monthly',
    name: '1-Month Communication & Fluency Starter',
    slug: '1-month-starter',
    description: '1-Month intensive starter cohort for Class 4-12 students. Build fundamental English speaking fluency, eliminate stage shyness, and practice live weekly speech assignments in 8-student batches.',
    duration_months: 1,
    classes_per_week: 3,
    total_classes: 12,
    price_inr: 1999,
    currency: 'INR',
    target_batch_size: 8,
    max_batch_size: 9,
    status: 'ACTIVE',
    is_flagship: 0,
    created_at: '2026-09-14 12:00:00',
  },
  {
    id: 'crs_flagship_1',
    name: '3-Month Flagship Communication & Confidence Cohort',
    slug: 'live-communication-confidence',
    description: 'Comprehensive 3-month interactive masterclass for Class 4-12 students. Master spoken English fluency, articulation, debate reasoning, and unshakeable stage confidence in live, 8-student batches.',
    duration_months: 3,
    classes_per_week: 3,
    total_classes: 36,
    price_inr: 4999,
    currency: 'INR',
    target_batch_size: 8,
    max_batch_size: 9,
    status: 'ACTIVE',
    is_flagship: 1,
    created_at: '2026-09-14 12:00:00',
  },
  {
    id: 'crs_individual_1on1',
    name: '1-on-1 Individual Speech Coaching (Private Classes)',
    slug: 'individual-1on1-classes',
    description: 'Exclusive 1-on-1 personalized speech mentorship with a dedicated senior coach. Tailored curriculum, flexible scheduling, and focused preparation for school debates, competitions, and confidence.',
    duration_months: 1,
    classes_per_week: 3,
    total_classes: 12,
    price_inr: 5000,
    currency: 'INR',
    target_batch_size: 1,
    max_batch_size: 1,
    status: 'ACTIVE',
    is_flagship: 0,
    created_at: '2026-09-14 12:00:00',
  },
];

const DEFAULT_TEACHERS: Teacher[] = [
  {
    id: 'tch_1',
    user_id: 'usr_teacher_1',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@speakindia.in',
    phone: '+91 98111 22334',
    photo_url: null,
    biography: 'Senior Communication & Debate Educator with 7+ years of experience mentoring school students for national parliamentary debate circuits. (Verified Faculty Profile)',
    expertise: 'Public Speaking, Extempore, Debate Structuring, Accent Neutrality',
    achievements: 'Trained 450+ school speakers, 12 National Debate finalists',
    availability: 'Mon-Fri 4 PM - 8 PM IST',
    status: 'ACTIVE',
    created_at: '2026-09-14 12:00:00',
  },
  {
    id: 'tch_2',
    user_id: 'usr_teacher_2',
    name: 'Vikramaditya Sen',
    email: 'vikram.sen@speakindia.in',
    phone: '+91 98222 33445',
    photo_url: null,
    biography: 'Drama and Spoken English Specialist passionate about breaking hesitation and stage anxiety in middle school students. (Verified Faculty Profile)',
    expertise: 'Spoken English Fluency, Overcoming Stage Fear, Storytelling, Body Language',
    achievements: 'Conducted 100+ school confidence workshops across Delhi NCR and Bengaluru',
    availability: 'Tue-Sat 3 PM - 7 PM IST',
    status: 'ACTIVE',
    created_at: '2026-09-14 12:00:00',
  },
];

const DEFAULT_BATCHES: Batch[] = [
  {
    id: 'batch_1',
    batch_name: 'Junior Orators (Class 4 - 7) - Mon/Wed/Fri Evening',
    course_id: 'crs_flagship_1',
    course_name: '3-Month Flagship Communication & Confidence Cohort',
    teacher_id: 'tch_2',
    teacher_name: 'Vikramaditya Sen',
    start_date: '2026-10-01',
    end_date: '2026-12-31',
    schedule_days: 'Monday, Wednesday, Friday',
    schedule_time: '5:00 PM - 6:00 PM IST',
    meeting_link: 'https://meet.google.com/speak-india-batch1',
    target_capacity: 8,
    max_capacity: 9,
    status: 'UPCOMING',
    notes: 'Focus on story narration, daily conversational English, and building confidence in answering questions.',
    enrolled_count: 1,
    created_at: '2026-09-14 12:00:00',
  },
  {
    id: 'batch_2',
    batch_name: 'Senior Debaters (Class 8 - 12) - Tue/Thu/Sat Evening',
    course_id: 'crs_flagship_1',
    course_name: '3-Month Flagship Communication & Confidence Cohort',
    teacher_id: 'tch_1',
    teacher_name: 'Ananya Sharma',
    start_date: '2026-10-02',
    end_date: '2027-01-02',
    schedule_days: 'Tuesday, Thursday, Saturday',
    schedule_time: '6:30 PM - 7:30 PM IST',
    meeting_link: 'https://meet.google.com/speak-india-batch2',
    target_capacity: 8,
    max_capacity: 9,
    status: 'UPCOMING',
    notes: 'Focus on formal debate arguments, impromptu speaking, interview presence, and persuasive presentation.',
    enrolled_count: 0,
    created_at: '2026-09-14 12:00:00',
  },
];

const DEFAULT_LEADS: Lead[] = [
  {
    id: 'lead_101',
    student_name: 'Aarav Mehta',
    student_class: 'Class 6',
    student_age: 11,
    parent_name: 'Rajesh Mehta',
    mobile_number: '+91 98201 55442',
    email: 'rajesh.mehta@example.com',
    city: 'Mumbai',
    interest_area: 'Confidence Building',
    preferred_time: 'Weekday Evenings (5-7 PM)',
    notes: 'Hesitates to speak in school assembly, parent wants more stage practice.',
    lead_source: 'META_ADS',
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    utm_term: null,
    referral_code: null,
    status: 'NEW',
    assigned_to: null,
    created_at: '2026-09-14 12:00:00',
    updated_at: '2026-09-14 12:00:00',
  },
  {
    id: 'lead_102',
    student_name: 'Diya Patel',
    student_class: 'Class 8',
    student_age: 13,
    parent_name: 'Bhavna Patel',
    mobile_number: '+91 98450 12345',
    email: 'bhavna.patel@example.com',
    city: 'Bengaluru',
    interest_area: 'Public Speaking',
    preferred_time: 'Weekend Mornings',
    notes: 'Very bright student, wants to participate in inter-school debate.',
    lead_source: 'ORGANIC',
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    utm_term: null,
    referral_code: null,
    status: 'DEMO_SCHEDULED',
    assigned_to: null,
    created_at: '2026-09-14 12:00:00',
    updated_at: '2026-09-14 12:00:00',
  },
];

const DEFAULT_DEMOS: DemoSession[] = [
  {
    id: 'demo_session_1',
    title: 'Interactive Speech & Confidence Demo (Slot A)',
    date: '2026-09-18',
    start_time: '5:30 PM',
    end_time: '6:15 PM',
    teacher_id: 'tch_1',
    teacher_name: 'Ananya Sharma',
    meeting_link: 'https://meet.google.com/demo-slot-a',
    capacity: 2,
    status: 'SCHEDULED',
    notes: '2-student focused assessment demo session to identify speaking hesitation and fluency.',
    attendee_count: 1,
    student_name: 'Diya Patel',
    scheduled_at: '2026-09-18 5:30 PM',
    created_at: '2026-09-14 12:00:00',
  },
];

function getLocalData<T>(key: string, defaultVal: T): T {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(`speakindia_${key}`);
      if (stored) return JSON.parse(stored);
    }
  } catch (e) {}
  return defaultVal;
}

function setLocalData<T>(key: string, val: T): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(`speakindia_${key}`, JSON.stringify(val));
    }
  } catch (e) {}
}

// Client-side fallback router when backend API is unavailable (static hosting like GitHub Pages)
function handleStaticClientFallback<T>(endpoint: string, options: RequestInit = {}): T {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body as string) : {};

  // 1. Auth Login / Demo Login
  if (endpoint.includes('/api/auth/demo-login') || endpoint.includes('/api/auth/login')) {
    const role = (body.role || 'SUPER_ADMIN').toUpperCase();
    const user: User = {
      id: role === 'SUPER_ADMIN' ? 'usr_admin_1' : role === 'ADMIN' ? 'usr_counselor_1' : 'usr_teacher_1',
      email: role === 'SUPER_ADMIN' ? 'admin@speakindia.in' : role === 'ADMIN' ? 'counselor@speakindia.in' : 'teacher@speakindia.in',
      name: role === 'SUPER_ADMIN' ? 'Head Administrator' : role === 'ADMIN' ? 'Admissions Lead' : 'Senior Speech Coach',
      role: role as any,
    };
    const token = 'ghpages_mock_token_' + Date.now();
    setStoredToken(token);
    return { token, user } as T;
  }

  // 2. Auth Me
  if (endpoint.includes('/api/auth/me')) {
    const user: User = {
      id: 'usr_admin_1',
      email: 'admin@speakindia.in',
      name: 'Head Administrator',
      role: 'SUPER_ADMIN',
    };
    return { user } as T;
  }

  // 3. Book Demo
  if (endpoint.includes('/api/leads/book-demo') || (endpoint.includes('/api/leads') && method === 'POST')) {
    const leads = getLocalData<Lead[]>('leads', DEFAULT_LEADS);
    const refNumber = 'SI-DEMO-' + Math.floor(100000 + Math.random() * 900000);
    const newLead: Lead = {
      id: 'lead_' + Date.now(),
      student_name: body.studentName || body.student_name || 'Student',
      student_class: body.studentClass || body.student_class || 'Class 6',
      student_age: body.studentAge || body.student_age || 11,
      parent_name: body.parentName || body.parent_name || 'Parent',
      mobile_number: body.mobileNumber || body.mobile_number || '',
      email: body.email || null,
      city: body.city || null,
      interest_area: body.interestArea || body.interest_area || 'Confidence Building',
      preferred_time: body.preferredTime || body.preferred_time || 'Weekday Evening (5-7 PM)',
      notes: body.notes || null,
      lead_source: body.leadSource || 'ORGANIC',
      utm_source: body.utmSource || null,
      utm_medium: body.utmMedium || null,
      utm_campaign: body.utmCampaign || null,
      utm_content: null,
      utm_term: null,
      referral_code: null,
      status: 'NEW',
      assigned_to: null,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    leads.unshift(newLead);
    setLocalData('leads', leads);

    return {
      success: true,
      message: 'Demo session booked successfully!',
      bookingReference: refNumber,
      studentName: newLead.student_name,
    } as T;
  }

  // 4. Courses
  if (endpoint.includes('/api/courses')) {
    const courses = getLocalData<Course[]>('courses', DEFAULT_COURSES);
    return { courses } as T;
  }

  // 5. Teachers
  if (endpoint.includes('/api/teachers')) {
    const teachers = getLocalData<Teacher[]>('teachers', DEFAULT_TEACHERS);
    return { teachers } as T;
  }

  // 6. Batches
  if (endpoint.includes('/api/batches')) {
    const batches = getLocalData<Batch[]>('batches', DEFAULT_BATCHES);
    return { batches } as T;
  }

  // 7. Leads
  if (endpoint.includes('/api/leads')) {
    const leads = getLocalData<Lead[]>('leads', DEFAULT_LEADS);
    return {
      leads,
      pagination: { total: leads.length, page: 1, limit: 50, totalPages: 1 },
    } as T;
  }

  // 8. Demos
  if (endpoint.includes('/api/demos')) {
    const demos = getLocalData<DemoSession[]>('demos', DEFAULT_DEMOS);
    return { demos } as T;
  }

  // 9. Stats / Dashboard
  if (endpoint.includes('/api/stats')) {
    const leads = getLocalData<Lead[]>('leads', DEFAULT_LEADS);
    const demos = getLocalData<DemoSession[]>('demos', DEFAULT_DEMOS);
    const metrics: DashboardMetrics = {
      totalLeads: leads.length,
      newLeads: leads.filter((l) => l.status === 'NEW').length,
      demoScheduled: demos.filter((d) => d.status === 'SCHEDULED').length,
      demoCompleted: 1,
      convertedStudents: 1,
      activeStudents: 1,
      pendingPaymentsCount: 0,
      totalRevenue: 4999,
    };
    return {
      metrics,
      stats: {
        ...metrics,
        total_leads: metrics.totalLeads,
        new_leads: metrics.newLeads,
        demos_scheduled: metrics.demoScheduled,
        demos_attended: metrics.demoCompleted,
        paid_conversions: metrics.convertedStudents,
        active_students: metrics.activeStudents,
        total_revenue_inr: metrics.totalRevenue,
        batches_count: 2,
      },
      sourceBreakdown: [{ lead_source: 'ORGANIC', count: leads.length }],
      statusBreakdown: [{ status: 'NEW', count: leads.length }],
      recentActivities: [],
      upcomingDemos: demos,
      recentLeads: leads.slice(0, 5),
    } as T;
  }

  // 10. Settings / Branding
  if (endpoint.includes('/api/settings')) {
    return {
      branding: {
        brandName: 'Speak India',
        tagline: 'Empowering Young Minds with Voice, Courage & Conviction',
        contactPhone: '+91 98765 43210',
        supportWhatsapp: '+91 98765 43210',
        contactEmail: 'admissions@speakindia.in',
        classBatchTargetSize: 8,
        classBatchMaxSize: 9,
        flagshipPrice: 4999,
      },
    } as T;
  }

  // 11. Payments
  if (endpoint.includes('/api/payments')) {
    return { payments: [] } as T;
  }

  // Default fallback
  return { success: true } as T;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // If static host returns 404/405, fallback gracefully
      if (response.status === 404 || response.status === 405) {
        return handleStaticClientFallback<T>(endpoint, options);
      }
      const data = await response.json().catch(() => ({}));
      const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    const data = await response.json().catch(() => ({}));
    return data as T;
  } catch (err: any) {
    // If network error (e.g. offline or static host routing), use fallback
    if (
      typeof window !== 'undefined' &&
      (window.location.hostname.includes('github.io') || !navigator.onLine || err.message?.includes('Failed to fetch') || err.message?.includes('405'))
    ) {
      return handleStaticClientFallback<T>(endpoint, options);
    }
    throw err;
  }
}

export const api = {
  // Authentication
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  demoLogin: (role: 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' = 'SUPER_ADMIN') =>
    request<{ token: string; user: User }>('/api/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    }),

  logout: () =>
    request<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    }),

  getMe: () => request<{ user: User }>('/api/auth/me'),
  getCurrentUser: () => request<{ user: User }>('/api/auth/me'),

  // Public Booking
  bookDemo: (payload: {
    studentName: string;
    studentClass: string;
    studentAge?: number | string;
    parentName: string;
    mobileNumber: string;
    email?: string;
    city?: string;
    interestArea?: string;
    preferredTime?: string;
    notes?: string;
    leadSource?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    consent: boolean;
  }) =>
    request<{ success: boolean; message: string; bookingReference: string; studentName: string }>(
      '/api/leads/book-demo',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),

  // Leads
  getLeads: (params?: {
    status?: string;
    source?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.source) query.set('source', params.source);
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.sort) query.set('sort', params.sort);
    return request<{
      leads: Lead[];
      pagination: { total: number; page: number; limit: number; totalPages: number };
    }>(`/api/leads?${query.toString()}`);
  },

  getLeadById: (id: string) =>
    request<{
      lead: Lead;
      activities: LeadActivity[];
      demos: any[];
      payments: Payment[];
      student: Student | null;
    }>(`/api/leads/${id}`),

  createLead: (payload: any) =>
    request<{ success: boolean; message: string; bookingReference?: string }>(
      '/api/leads/book-demo',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),

  updateLeadStatus: (id: string, status: string, notes?: string) =>
    request<{ lead: Lead; message: string }>(`/api/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    }),

  updateLead: (id: string, updates: Partial<Lead>) =>
    request<{ lead: Lead; message: string }>(`/api/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  addLeadActivity: (leadId: string, description: string, actionType: string = 'NOTE_ADDED') =>
    request<{ activity: LeadActivity; message: string }>(`/api/leads/${leadId}/activities`, {
      method: 'POST',
      body: JSON.stringify({ description, actionType }),
    }),

  convertLeadToStudent: (leadId: string, batchId?: string, courseId?: string) =>
    request<{ success: boolean; message: string; student: Student }>(`/api/leads/${leadId}/convert`, {
      method: 'POST',
      body: JSON.stringify({ batchId, courseId }),
    }),

  // Demos
  getDemos: (params?: { status?: string }) => {
    const query = params?.status && params.status !== 'ALL' ? `?status=${params.status}` : '';
    return request<{ demos: DemoSession[] }>(`/api/demos${query}`);
  },

  createDemo: (payload: any) =>
    request<{ demo: DemoSession; message: string }>('/api/demos', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getDemoById: (id: string) =>
    request<{ demo: DemoSession; attendees: DemoAttendee[] }>(`/api/demos/${id}`),

  updateDemo: (id: string, updates: Partial<DemoSession>) =>
    request<{ demo: DemoSession; message: string }>(`/api/demos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  addDemoAttendee: (demoId: string, leadId: string) =>
    request<{ message: string }>(`/api/demos/${demoId}/attendees`, {
      method: 'POST',
      body: JSON.stringify({ leadId }),
    }),

  updateDemoAttendee: (
    demoId: string,
    attendeeId: string,
    data: {
      attendanceStatus?: 'REGISTERED' | 'ATTENDED' | 'ABSENT';
      outcome?: string;
      feedback?: string;
      conversionPotential?: string;
    }
  ) =>
    request<{ message: string }>(`/api/demos/${demoId}/attendees/${attendeeId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Batches
  getBatches: () => request<{ batches: Batch[] }>('/api/batches'),

  createBatch: (payload: Partial<Batch>) =>
    request<{ batch: Batch; message: string }>('/api/batches', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getBatchById: (id: string) =>
    request<{ batch: Batch; students: (Student & { enrolled_at: string })[] }>(`/api/batches/${id}`),

  updateBatch: (id: string, updates: Partial<Batch>) =>
    request<{ batch: Batch; message: string }>(`/api/batches/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  assignStudentToBatch: (batchId: string, studentId: string) =>
    request<{ success: boolean; message: string; warning?: string; enrolledCount: number }>(
      `/api/batches/${batchId}/students`,
      {
        method: 'POST',
        body: JSON.stringify({ studentId }),
      }
    ),

  removeStudentFromBatch: (batchId: string, studentId: string) =>
    request<{ message: string }>(`/api/batches/${batchId}/students/${studentId}`, {
      method: 'DELETE',
    }),

  // Students
  getStudents: (params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    return request<{ students: Student[] }>(`/api/students?${query.toString()}`);
  },

  getStudentById: (id: string) =>
    request<{ student: Student; enrollments: any[]; activeBatch?: any }>(`/api/students/${id}`),

  updateStudent: (id: string, updates: Partial<Student>) =>
    request<{ student: Student; message: string }>(`/api/students/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  // Courses
  getCourses: () => request<{ courses: Course[] }>('/api/courses'),

  createCourse: (payload: Partial<Course>) =>
    request<{ course: Course; message: string }>('/api/courses', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateCourse: (id: string, updates: Partial<Course>) =>
    request<{ course: Course; message: string }>(`/api/courses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  // Teachers
  getTeachers: () => request<{ teachers: Teacher[] }>('/api/teachers'),

  createTeacher: (payload: Partial<Teacher>) =>
    request<{ teacher: Teacher; message: string }>('/api/teachers', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateTeacher: (id: string, updates: Partial<Teacher>) =>
    request<{ teacher: Teacher; message: string }>(`/api/teachers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  // Payments
  getPayments: (params?: { status?: string }) => {
    const query = params?.status && params.status !== 'ALL' ? `?status=${params.status}` : '';
    return request<{ payments: Payment[] }>(`/api/payments${query}`);
  },

  getPaymentById: (id: string) => request<{ payment: Payment }>(`/api/payments/${id}`),

  createPaymentRequest: (payload: any) =>
    request<{ success: boolean; payment: Payment; paymentLink: string; paymentUrl?: string; message: string }>(
      '/api/payments/create-request',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),

  createPayment: (payload: any) =>
    request<{ success: boolean; payment: Payment; paymentLink: string; paymentUrl?: string; message: string }>(
      '/api/payments/create-request',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),

  updatePaymentStatus: (id: string, status: string, meta?: any) =>
    request<{ payment: Payment; message: string }>(`/api/payments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, ...meta }),
    }),

  processPublicPayment: (id: string, payload: { paymentMethod?: string; transactionRef?: string }) =>
    request<{ success: boolean; message: string; payment: Payment; studentId?: string }>(
      `/api/payments/${id}/process-public`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),

  // Settings & Branding
  getBranding: () => request<{ branding: BrandingConfig }>('/api/settings/branding'),
  getSettings: () => request<{ branding: BrandingConfig }>('/api/settings/branding'),

  updateBranding: (branding: Partial<BrandingConfig>) =>
    request<{ success: boolean; branding: BrandingConfig; message: string }>(
      '/api/settings/branding',
      {
        method: 'PUT',
        body: JSON.stringify(branding),
      }
    ),
  updateSettings: (branding: Partial<BrandingConfig>) =>
    request<{ success: boolean; branding: BrandingConfig; message: string }>(
      '/api/settings/branding',
      {
        method: 'PUT',
        body: JSON.stringify(branding),
      }
    ),

  // Dashboard Stats
  getDashboardStats: () =>
    request<{
      metrics: DashboardMetrics;
      stats: DashboardMetrics;
      sourceBreakdown: { lead_source: string; count: number }[];
      statusBreakdown: { status: string; count: number }[];
      recentActivities: (LeadActivity & { student_name: string; parent_name: string })[];
      upcomingDemos: DemoSession[];
      recentLeads: Lead[];
    }>('/api/stats/dashboard'),
};
