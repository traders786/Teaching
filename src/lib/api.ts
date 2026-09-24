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
  UserRole,
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
// GOOGLE & META ADS UTM ATTRIBUTION TRACKER
// ==========================================
const UTM_STORAGE_KEY = 'upspeaq_ad_attribution';

export interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
}

export function captureUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source') || undefined;
    const utmMedium = params.get('utm_medium') || undefined;
    const utmCampaign = params.get('utm_campaign') || undefined;
    const utmContent = params.get('utm_content') || undefined;
    const utmTerm = params.get('utm_term') || undefined;
    const gclid = params.get('gclid') || undefined;
    const fbclid = params.get('fbclid') || undefined;

    if (utmSource || utmCampaign || gclid || fbclid) {
      const attribution: UtmParams = {
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,
        gclid,
        fbclid,
      };
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(attribution));
      return attribution;
    }

    const saved = sessionStorage.getItem(UTM_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
}

export function getStoredUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};
  try {
    const saved = sessionStorage.getItem(UTM_STORAGE_KEY);
    return saved ? JSON.parse(saved) : captureUtmParams();
  } catch (e) {
    return {};
  }
}

// Auto-capture on module load
if (typeof window !== 'undefined') {
  captureUtmParams();
}


// ==========================================
// CLIENT-SIDE LOCAL STORAGE MOCK ENGINE (FOR GITHUB PAGES)
// ==========================================

const DEFAULT_COURSES: Course[] = [
  {
    id: 'crs_starter_monthly',
    name: '1-Month Communication & Fluency Starter',
    slug: '1-month-starter',
    description: '1-Month intensive starter cohort for Class 4-12 students. Build fundamental English speaking fluency, eliminate stage shyness, and practice live weekly speech assignments in intimate small-group batches.',
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
    description: 'Comprehensive 3-month interactive masterclass for Class 4-12 students. Master spoken English fluency, articulation, debate reasoning, and unshakeable stage confidence in live, intimate small-group batches.',
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
    name: 'Afshan Parween',
    email: 'parweenafshan0@gmail.com',
    phone: '+91 96089 93562',
    photo_url: null,
    biography: 'National-Level Elocution Bronze Medallist and experienced communication trainer with a B.A. (Honours) in Economics and B.Ed practical training.',
    expertise: 'Spoken English Fluency, Elocution, Speech Confidence, Storytelling, Critical Thinking',
    achievements: 'Bronze Medalist in National-Level Elocution Contest (83 universities); Trained 300+ students in live speech drills',
    availability: 'Tue-Sat 3 PM - 7 PM IST',
    status: 'ACTIVE',
    created_at: '2026-09-14 12:00:00',
  },
];

const DEFAULT_BATCHES: Batch[] = [
  {
    id: 'batch_1',
    batch_name: 'Junior Orators (UKG - Class 4) — Batch J04',
    course_id: 'crs_flagship_1',
    course_name: '3-Month Flagship Communication & Confidence Cohort',
    teacher_id: 'tch_1',
    teacher_name: 'Mrs. Ananya Sharma',
    start_date: '2026-09-01',
    end_date: '2026-11-30',
    schedule_days: 'Monday, Wednesday, Friday',
    schedule_time: '5:00 PM - 5:45 PM IST',
    meeting_link: 'https://meet.google.com/upspeaq-batch-j04',
    target_capacity: 8,
    max_capacity: 9,
    status: 'ACTIVE',
    notes: 'Focus on story narration, daily conversational English, and building confidence in answering questions.',
    enrolled_count: 5,
    created_at: '2026-09-14 12:00:00',
  },
  {
    id: 'batch_2',
    batch_name: 'Senior Debaters (Class 5 - 10) — Batch S02',
    course_id: 'crs_flagship_1',
    course_name: '3-Month Flagship Communication & Confidence Cohort',
    teacher_id: 'tch_2',
    teacher_name: 'Afshan Parween',
    start_date: '2026-09-02',
    end_date: '2026-12-02',
    schedule_days: 'Tuesday, Thursday, Saturday',
    schedule_time: '6:30 PM - 7:15 PM IST',
    meeting_link: 'https://meet.google.com/upspeaq-batch-s02',
    target_capacity: 8,
    max_capacity: 9,
    status: 'ACTIVE',
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
  let body: any = {};
  try {
    if (typeof options.body === 'string') {
      body = JSON.parse(options.body);
    }
  } catch (e) {}

  // 1. Auth Login / Demo Login / Google Login
  if (endpoint.includes('/api/auth/demo-login') || endpoint.includes('/api/auth/login') || endpoint.includes('/api/auth/google')) {
    const emailStr = (body.email || '').toLowerCase();
    const role: UserRole = body.role
      ? body.role.toUpperCase()
      : emailStr.includes('admin')
      ? 'SUPER_ADMIN'
      : emailStr.includes('teacher') || emailStr.includes('ananya')
      ? 'TEACHER'
      : 'STUDENT';

    const user: User = {
      id: role === 'SUPER_ADMIN' ? 'usr_admin_1' : role === 'TEACHER' ? 'usr_teacher_1' : 'usr_student_1',
      email: emailStr || (role === 'SUPER_ADMIN' ? 'admin@speakindia.in' : 'student@upspeaq.com'),
      name: role === 'SUPER_ADMIN' ? 'Head Administrator' : role === 'TEACHER' ? 'Ananya Sharma' : 'Student Champion',
      role: role,
    };
    const token = 'session_token_' + Date.now();
    setStoredToken(token);
    return {
      token,
      user,
      redirectPath: role === 'SUPER_ADMIN' || role === 'ADMIN' ? '/admin/dashboard' : role === 'TEACHER' ? '/teacher/dashboard' : '/student/dashboard',
    } as T;
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
        brandName: 'upspeaq',
        tagline: 'Empowering Young Minds with Voice, Courage & Conviction',
        contactPhone: '+91 7004132088',
        supportWhatsapp: '+91 7004132088',
        contactEmail: 'upspeaqofficial@gmail.com',
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

  const isStaticEnvironment =
    typeof window !== 'undefined' &&
    (window.location.hostname.includes('github.io') ||
      window.location.protocol === 'file:' ||
      window.location.hostname.includes('pages.dev') ||
      !window.location.port ||
      window.location.port === '80' ||
      window.location.port === '443');

  // On GitHub Pages or static hosts where no Node.js backend exists, immediately use fallback
  if (isStaticEnvironment && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
    await new Promise((resolve) => setTimeout(resolve, 250)); // natural micro-delay for realistic UI feedback
    return handleStaticClientFallback<T>(endpoint, options);
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (isStaticEnvironment && (response.status === 404 || response.status === 405)) {
        return handleStaticClientFallback<T>(endpoint, options);
      }
      const data = await response.json().catch(() => ({}));
      const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    const data = await response.json().catch(() => ({}));
    return data as T;
  } catch (err: any) {
    if (isStaticEnvironment && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
      return handleStaticClientFallback<T>(endpoint, options);
    }
    throw err;
  }
}

export const api = {
  // Authentication
  login: (emailOrPayload: string | { email: string; password: string; role?: string }, maybePassword?: string) => {
    const body = typeof emailOrPayload === 'string'
      ? { email: emailOrPayload, password: maybePassword || '' }
      : emailOrPayload;
    return request<{ token: string; user: User; redirectPath?: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  demoLogin: (role: UserRole = 'SUPER_ADMIN') =>
    request<{ token: string; user: User; redirectPath?: string }>('/api/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    }),

  logout: () =>
    request<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    }),

  getMe: () => request<{ user: User }>('/api/auth/me'),
  getCurrentUser: () => request<{ user: User }>('/api/auth/me'),

  auth: {
    login: (emailOrPayload: string | { email: string; password: string; role?: string }, maybePassword?: string) => {
      const body = typeof emailOrPayload === 'string'
        ? { email: emailOrPayload, password: maybePassword || '' }
        : emailOrPayload;
      return request<{ token: string; user: User; redirectPath?: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      });
    },
    demoLogin: (role: UserRole = 'SUPER_ADMIN') =>
      request<{ token: string; user: User; redirectPath?: string }>('/api/auth/demo-login', {
        method: 'POST',
        body: JSON.stringify({ role }),
      }),
    googleLogin: (credential: string) =>
      request<{ token: string; user: User; redirectPath?: string }>('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential }),
      }),
    logout: () =>
      request<{ message: string }>('/api/auth/logout', {
        method: 'POST',
      }),
    getMe: () => request<{ user: User }>('/api/auth/me'),
    getCurrentUser: () => request<{ user: User }>('/api/auth/me'),
  },

  googleLogin: (credential: string) =>
    request<{ token: string; user: User; redirectPath?: string }>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    }),

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
    request<{
      success: boolean;
      message: string;
      bookingReference: string;
      studentName: string;
      token?: string;
      user?: User;
      demoDetails?: any;
    }>('/api/leads/book-demo', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

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

  // Live Funnel OTP & Slot Booking APIs
  sendOtp: (payload: { email: string; mobileNumber?: string; studentName?: string }) =>
    request<{ success: boolean; message: string; devOtp?: string }>('/api/leads/send-otp', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  verifyOtp: (payload: { email?: string; mobileNumber?: string; otp: string }) =>
    request<{ success: boolean; verified: boolean; message: string }>('/api/leads/verify-otp', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  bookSlot: (payload: {
    studentName: string;
    studentClass?: string;
    parentName?: string;
    mobileNumber: string;
    email: string;
    hasLaptop?: boolean;
    understandsEnglish?: boolean;
    whatsappUpdates?: boolean;
    date: string;
    timeSlot: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    gclid?: string;
    fbclid?: string;
  }) =>
    request<{
      success: boolean;
      leadId: string;
      demoId: string;
      meetingLink: string;
      date: string;
      timeSlot: string;
      dateFormatted?: string;
    }>('/api/leads/book-slot', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  submitSurvey: (payload: { leadId: string; goals: string[]; parentName?: string }) =>
    request<{ success: boolean; message: string }>('/api/leads/survey-response', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

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

  getMeetStatus: () =>
    request<{ isConfigured: boolean; provider: string; workspaceDomain?: string }>('/api/demos/meet-status'),

  getZoomStatus: () =>
    request<{ isConfigured: boolean; provider: string; accountIdMasked?: string }>('/api/demos/meet-status'),

  createMeetDemo: (payload: {
    lead_id?: string;
    student_name?: string;
    student_class?: string;
    parent_name?: string;
    parent_phone?: string;
    topic?: string;
    title?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    teacherId?: string;
    teacher_id?: string;
    scheduled_at?: string;
    notes?: string;
    meetingLink?: string;
  }) =>
    request<{ success: boolean; demo: DemoSession; meet: any; zoom?: any; message: string }>('/api/demos/create-meet', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  createZoomDemo: (payload: {
    lead_id?: string;
    student_name?: string;
    student_class?: string;
    parent_name?: string;
    parent_phone?: string;
    topic?: string;
    title?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    teacherId?: string;
    teacher_id?: string;
    scheduled_at?: string;
    notes?: string;
    meetingLink?: string;
  }) =>
    request<{ success: boolean; demo: DemoSession; zoom: any; meet?: any; message: string }>('/api/demos/create-meet', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

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

  // Google Meet Settings
  getMeetSettings: () =>
    request<{ configured: boolean; defaultMeetingUrl: string; workspaceDomain: string; defaultRoomPrefix: string }>(
      '/api/settings/meet'
    ),

  saveMeetSettings: (payload: { defaultMeetingUrl?: string; workspaceDomain?: string; defaultRoomPrefix?: string }) =>
    request<{ success: boolean; message: string; configured: boolean }>('/api/settings/meet', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  getZoomSettings: () =>
    request<{ configured: boolean; accountId: string; clientId: string; hasSecret: boolean; clientSecretMasked?: string }>(
      '/api/settings/meet'
    ),

  saveZoomSettings: (payload: { accountId?: string; clientId?: string; clientSecret?: string }) =>
    request<{ success: boolean; message: string; configured: boolean }>('/api/settings/meet', {
      method: 'PUT',
      body: JSON.stringify(payload),
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

  getTeacherDemoHistory: (teacherId: string) =>
    request<{
      teacher: Teacher;
      demos: any[];
      payoutRate: number;
      totalEarned: number;
      completedCount: number;
      pendingCount: number;
    }>(`/api/teachers/${teacherId}/demos`),

  createTeacher: (payload: Partial<Teacher> & { googleMeetLink?: string }) =>
    request<{ teacher: Teacher; message: string }>('/api/teachers', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateTeacher: (id: string, updates: Partial<Teacher> & { googleMeetLink?: string }) =>
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

  // ==========================================
  // TEACHER PORTAL APIs
  // ==========================================
  getTeacherDashboard: () =>
    request<{
      teacher: Teacher;
      metrics: {
        todayClassesCount: number;
        upcomingDemosCount: number;
        activeStudentsCount: number;
        pendingHomeworkCount: number;
        openTicketsCount: number;
      };
      todayClasses: any[];
      upcomingDemos: any[];
    }>('/api/teacher/dashboard'),

  getTeacherProfile: () =>
    request<{ teacher: Teacher; assignedBatches: Batch[] }>('/api/teacher/profile'),

  updateTeacherProfile: (payload: Partial<Teacher>) =>
    request<{ teacher: Teacher; message: string }>('/api/teacher/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  getTeacherDemos: () =>
    request<{ demos: any[] }>('/api/teacher/demos'),

  getAvailableTeacherDemos: () =>
    request<{ demos: any[] }>('/api/teacher/demos/available'),

  claimTeacherDemo: (demoId: string) =>
    request<{ success: boolean; demo: any; message: string }>(`/api/teacher/demos/${demoId}/claim`, {
      method: 'POST',
    }),

  getTeacherDemoById: (id: string) =>
    request<{ demo: any; evaluation: any }>(`/api/teacher/demos/${id}`),

  submitDemoEvaluation: (demoId: string, evaluation: any) =>
    request<{ message: string; evaluationId: string }>(`/api/teacher/demos/${demoId}/evaluation`, {
      method: 'POST',
      body: JSON.stringify(evaluation),
    }),

  getTeacherBatches: () =>
    request<{ batches: any[] }>('/api/teacher/batches'),

  getTeacherBatchById: (id: string) =>
    request<{ batch: any; students: any[]; sessions: any[] }>(`/api/teacher/batches/${id}`),

  getTeacherStudentDetail: (id: string) =>
    request<{ student: any; attendanceRecords: any[]; homeworkSubmissions: any[] }>(`/api/teacher/students/${id}`),

  getTeacherSessions: () =>
    request<{ sessions: any[] }>('/api/teacher/sessions'),

  markTeacherAttendance: (sessionId: string, batchId: string, attendanceList: any[]) =>
    request<{ message: string }>(`/api/teacher/sessions/${sessionId}/attendance`, {
      method: 'POST',
      body: JSON.stringify({ batch_id: batchId, attendanceList }),
    }),

  updateSessionNotes: (sessionId: string, payload: any) =>
    request<{ message: string }>(`/api/teacher/sessions/${sessionId}/notes`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getTeacherCurriculum: () =>
    request<{ modules: any[]; sessions: any[] }>('/api/teacher/curriculum'),

  getTeacherHomework: () =>
    request<{ homework: any[] }>('/api/teacher/homework'),

  createTeacherHomework: (payload: any) =>
    request<{ message: string; homeworkId: string }>('/api/teacher/homework', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getHomeworkSubmissions: (homeworkId: string) =>
    request<{ homework: any; submissions: any[] }>(`/api/teacher/homework/${homeworkId}/submissions`),

  submitHomeworkFeedback: (submissionId: string, payload: { score_rating: string; mentor_feedback: string; status?: string }) =>
    request<{ message: string }>(`/api/teacher/homework/submissions/${submissionId}/feedback`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getTeacherRecordings: () =>
    request<{ recordings: any[] }>('/api/teacher/recordings'),

  createTeacherRecording: (payload: any) =>
    request<{ message: string; recordingId: string }>('/api/teacher/recordings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  deleteTeacherRecording: (id: string) =>
    request<{ message: string }>(`/api/teacher/recordings/${id}`, {
      method: 'DELETE',
    }),

  updateBatchMeetingLink: (batchId: string, meetingLink: string, sessionId?: string) =>
    request<{ message: string }>(`/api/teacher/batches/${batchId}/meeting-link`, {
      method: 'PATCH',
      body: JSON.stringify({ meeting_link: meetingLink, session_id: sessionId }),
    }),

  uploadTeacherPhoto: (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    return request<{ success: boolean; photo_url: string; teacher?: any; message: string }>('/api/teacher/photo', {
      method: 'POST',
      body: formData,
    });
  },

  // ==========================================
  // STUDENT PORTAL APIs
  // ==========================================
  getStudentDashboard: () =>
    request<{
      student: any;
      nextClass: any;
      upcomingDemo?: any;
      availableCourses?: any[];
      branding?: any;
      homework?: any[];
      pendingHomework?: any[];
      latestFeedback?: any;
      progress: {
        totalClasses: number;
        completedClasses: number;
        attendedClasses: number;
        totalHomeworkSubmitted?: number;
        submittedHomeworkCount?: number;
        progressPercentage?: number;
        attendancePercentage?: number;
      };
      recentRecordings: any[];
    }>('/api/student/dashboard'),

  submitEnrollmentRequest: (payload: { courseId: string; courseName?: string; notes?: string; studentName?: string; parentPhone?: string }) =>
    request<{ success: boolean; message: string }>('/api/student/enroll-request', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  directStudentEnroll: (courseId: string) =>
    request<{ success: boolean; message: string; result?: any }>('/api/student/direct-enroll', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    }),

  getStudentProfile: () =>
    request<{ student: any }>('/api/student/profile'),

  uploadStudentPhoto: (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    return request<{ success: boolean; photo_url: string; student?: any; message: string }>('/api/student/photo', {
      method: 'POST',
      body: formData,
    });
  },

  getStudentCurriculum: (gradeGroup?: string) =>
    request<{
      gradeGroup: string;
      studentEnrolledGrade: string;
      allGradeGroups: string[];
      modules: any[];
      sessions: any[];
      progress: { totalSessions: number; completedCount: number; progressPercent: number };
    }>(`/api/student/curriculum${gradeGroup ? `?grade_group=${encodeURIComponent(gradeGroup)}` : ''}`),

  toggleStudentCurriculumComplete: (sessionId: string) =>
    request<{ completed: boolean; message: string }>('/api/student/curriculum/toggle-complete', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    }),

  getStudentClasses: () =>
    request<{ upcomingClasses: any[]; pastClasses: any[]; defaultMeetingLink?: string }>('/api/student/classes'),

  getStudentHomework: () =>
    request<{ homeworkList: any[] }>('/api/student/homework'),

  uploadStudentFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request<{ success: boolean; url: string; fileName: string; bytes: number; format: string }>('/api/student/upload', {
      method: 'POST',
      body: formData,
    });
  },

  submitStudentHomework: (homeworkId: string, payload: { submission_type: string; content_text?: string; media_url?: string; file_name?: string }) =>
    request<{ message: string }>(`/api/student/homework/${homeworkId}/submit`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getStudentRecordings: () =>
    request<{ recordings: any[] }>('/api/student/recordings'),

  submitStudentHelpdeskInquiry: (payload: { category: string; subject: string; message: string }) =>
    request<{ success: boolean; ticketNumber: string; ticketId: string; officialEmail: string; message: string }>('/api/student/helpdesk/inquiry', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getStudentHelpdeskInquiries: () =>
    request<{ inquiries: any[] }>('/api/student/helpdesk/inquiries'),

  // ==========================================
  // HELPDESK & SUPPORT APIs
  // ==========================================
  getHelpdeskTickets: () =>
    request<{ tickets: any[] }>('/api/helpdesk/tickets'),

  createHelpdeskTicket: (payload: { subject: string; category: string; priority?: string; description: string; attachment_url?: string }) =>
    request<{ message: string; ticket: { id: string; ticket_number: string } }>('/api/helpdesk/tickets', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getHelpdeskTicketById: (id: string) =>
    request<{ ticket: any; messages: any[] }>(`/api/helpdesk/tickets/${id}`),

  replyHelpdeskTicket: (id: string, payload: { message: string; attachment_url?: string }) =>
    request<{ message: string; messageId: string }>(`/api/helpdesk/tickets/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateHelpdeskStatus: (id: string, status: string) =>
    request<{ message: string }>(`/api/helpdesk/tickets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // ==========================================
  // MASTER CURRICULUM APIs
  // ==========================================
  getCurriculumAll: () =>
    request<{ modules: any[]; sessions: any[] }>('/api/curriculum/all'),

  createCurriculumModule: (payload: any) =>
    request<{ message: string; moduleId: string }>('/api/curriculum/modules', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  createCurriculumSession: (payload: any) =>
    request<{ message: string; sessionId: string }>('/api/curriculum/sessions', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateCurriculumSession: (id: string, payload: any) =>
    request<{ message: string }>(`/api/curriculum/sessions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  // Automated Academy Rebuild APIs
  assignBatchTeacher: (batchId: string, teacherId: string) =>
    request<{ batch: Batch; message: string }>(`/api/batches/${batchId}/teacher`, {
      method: 'PATCH',
      body: JSON.stringify({ teacher_id: teacherId }),
    }),

  transferStudent: (payload: { studentId: string; fromBatchId: string; toBatchId: string; reason?: string }) =>
    request<{ success: boolean; message: string; fromBatchName?: string; toBatchName?: string }>(
      '/api/batches/transfer',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),

  manualEnrollStudent: (payload: { studentId: string; courseId?: string; preferredDays?: string; preferredTime?: string; gradeGroup?: string; reason?: string }) =>
    request<{ success: boolean; message: string; result: any }>('/api/students/manual-enroll', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  retryAutoPlace: (enrollmentId: string) =>
    request<{ success: boolean; placement: any }>(`/api/batches/auto-place/${enrollmentId}`, {
      method: 'POST',
    }),

  getSessionAttendance: (sessionId: string) =>
    request<{ session: any; roster: any[] }>(`/api/teacher/classes/${sessionId}/attendance`),

  saveSessionAttendance: (sessionId: string, attendanceRecords: any[]) =>
    request<{ success: boolean; message: string }>(`/api/teacher/classes/${sessionId}/attendance`, {
      method: 'POST',
      body: JSON.stringify({ attendanceRecords }),
    }),

  updateClassSession: (sessionId: string, updates: { teacherNotes?: string; recordingUrl?: string; status?: string; meetingLink?: string }) =>
    request<{ session: any; message: string }>(`/api/teacher/classes/${sessionId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  // Notifications APIs
  getNotifications: () =>
    request<{ notifications: any[]; unreadCount: number }>('/api/notifications'),

  markNotificationRead: (id: string) =>
    request<{ message: string }>(`/api/notifications/${id}/read`, {
      method: 'PATCH',
    }),

  markAllNotificationsRead: () =>
    request<{ message: string }>('/api/notifications/read-all', {
      method: 'POST',
    }),
};
