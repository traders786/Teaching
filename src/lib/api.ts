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

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
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

  createDemo: (payload: {
    title?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    teacherId?: string;
    meetingLink?: string;
    capacity?: number;
    notes?: string;
    lead_id?: string;
    scheduled_at?: string;
    teacher_id?: string;
    meeting_link?: string;
  }) =>
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

  createPaymentRequest: (payload: {
    leadId?: string;
    lead_id?: string;
    studentId?: string;
    student_id?: string;
    courseId?: string;
    course_id?: string;
    amountInr?: number;
    amount_inr?: number;
    notes?: string;
  }) =>
    request<{ success: boolean; payment: Payment; paymentLink: string; paymentUrl?: string; message: string }>(
      '/api/payments/create-request',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),

  createPayment: (payload: {
    leadId?: string;
    lead_id?: string;
    studentId?: string;
    student_id?: string;
    courseId?: string;
    course_id?: string;
    amountInr?: number;
    amount_inr?: number;
    notes?: string;
  }) =>
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
