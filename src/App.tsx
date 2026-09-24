import React, { useState, useEffect } from 'react';
import { api, getStoredToken, setStoredToken, removeStoredToken } from './lib/api';
import { User, BrandingConfig, Teacher, Course, Batch, Lead, UserRole } from './types';

// UI Components
import { ToastContainer, ToastMessage } from './components/ui/Toast';

// Public Components
import { Header, PublicPage } from './components/public/Header';
import { Footer } from './components/public/Footer';
import { BookDemoModal } from './components/public/BookDemoModal';
import { BookingFunnelModal } from './components/public/BookingFunnelModal';
import { ParentPaymentPortal } from './components/public/ParentPaymentPortal';
import { LegalModal } from './components/public/LegalModal';
import { FloatingWhatsApp } from './components/public/FloatingWhatsApp';

// Dedicated Detailed Pages
import { HomePage } from './pages/HomePage';
import { AboutUsPage } from './pages/AboutUsPage';
import { CurriculumPage } from './pages/CurriculumPage';
import { BatchesPage } from './pages/BatchesPage';
import { FacultyPage } from './pages/FacultyPage';
import { PricingPage } from './pages/PricingPage';
import { FaqPage } from './pages/FaqPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';

// Admin Components
import { AdminLayout, AdminTab } from './components/admin/AdminLayout';
import { LoginView } from './components/admin/LoginView';
import { DashboardView } from './components/admin/DashboardView';
import { LeadsView } from './components/admin/LeadsView';
import { DemosView } from './components/admin/DemosView';
import { TeachersView } from './components/admin/TeachersView';
import { StudentsView } from './components/admin/StudentsView';
import { BatchesView } from './components/admin/BatchesView';
import { CoursesView } from './components/admin/CoursesView';
import { AdminCurriculumView } from './components/admin/AdminCurriculumView';
import { PaymentsView } from './components/admin/PaymentsView';
import { AdminHelpdeskView } from './components/admin/AdminHelpdeskView';
import { AdminAuditLogsView } from './components/admin/AdminAuditLogsView';
import { SettingsView } from './components/admin/SettingsView';
import { LeadDetailModal } from './components/admin/LeadDetailModal';

// Teacher Components
import { TeacherLayout, TeacherTab } from './components/teacher/TeacherLayout';
import { TeacherDashboardView } from './components/teacher/TeacherDashboardView';
import { TeacherProfileView } from './components/teacher/TeacherProfileView';
import { TeacherDemosView } from './components/teacher/TeacherDemosView';
import { TeacherClassManagementView } from './components/teacher/TeacherClassManagementView';
import { TeacherCurriculumView } from './components/teacher/TeacherCurriculumView';
import { TeacherHomeworkView } from './components/teacher/TeacherHomeworkView';
import { TeacherRecordingsView } from './components/teacher/TeacherRecordingsView';
import { TeacherHelpdeskView } from './components/teacher/TeacherHelpdeskView';

// Student Components
import { StudentLayout, StudentTab } from './components/student/StudentLayout';
import { StudentDashboardView } from './components/student/StudentDashboardView';
import { StudentProfileView } from './components/student/StudentProfileView';
import { StudentCurriculumView } from './components/student/StudentCurriculumView';
import { StudentClassesView } from './components/student/StudentClassesView';
import { StudentHomeworkView } from './components/student/StudentHomeworkView';
import { StudentRecordingsView } from './components/student/StudentRecordingsView';
import { StudentHelpdeskView } from './components/student/StudentHelpdeskView';

export default function App() {
  // Navigation & View state
  const [currentView, setCurrentView] = useState<'PUBLIC' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PAYMENT' | 'LOGIN'>('PUBLIC');
  const [publicPage, setPublicPage] = useState<PublicPage>('home');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [teacherTab, setTeacherTab] = useState<TeacherTab>('dashboard');
  const [studentTab, setStudentTab] = useState<StudentTab>('dashboard');
  const [paymentIdParam, setPaymentIdParam] = useState<string | null>(null);

  // App-wide Data State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [branding, setBranding] = useState<BrandingConfig>({
    brandName: 'upspeaq',
    tagline: 'Every Child Deserves the Confidence to Speak',
    contactPhone: '+91 7004132088',
    supportWhatsapp: '+91 7004132088',
    contactEmail: 'upspeaqofficial@gmail.com',
    classBatchTargetSize: 8,
    classBatchMaxSize: 9,
    flagshipPrice: 4999,
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  // Inter-view communication state
  const [activeLeadForDetail, setActiveLeadForDetail] = useState<Lead | null>(null);
  const [initialTeacherDemoId, setInitialTeacherDemoId] = useState<string | null>(null);
  const [initialStudentHw, setInitialStudentHw] = useState<any | null>(null);

  // Modals state
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'PRIVACY' | 'TERMS' | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string, title?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Resolve appropriate portal view based on user role
  const resolveViewForUser = (user: User | null) => {
    if (!user) return 'PUBLIC';
    if (user.role === 'TEACHER') return 'TEACHER';
    if (user.role === 'STUDENT' || user.role === 'PARENT') return 'STUDENT';
    return 'ADMIN';
  };

  // URL Parsing and Sync
  const parseLocation = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const payId = urlParams.get('pay');
    const path = window.location.pathname;
    const viewParam = urlParams.get('view');
    const pageParam = urlParams.get('page') as PublicPage | null;

    const demoParam = urlParams.get('demo') || urlParams.get('book');
    if (demoParam === '1' || demoParam === 'true') {
      setIsDemoModalOpen(true);
    }

    if (payId) {
      setPaymentIdParam(payId);
      setCurrentView('PAYMENT');
    } else if (path.startsWith('/admin') || viewParam === 'admin') {
      setCurrentView('ADMIN');
      api.demoLogin('SUPER_ADMIN').then((res) => {
        setStoredToken(res.token);
        setCurrentUser(res.user);
      }).catch(() => {});
    } else if (path.startsWith('/teacher') || viewParam === 'teacher') {
      setCurrentView('TEACHER');
      api.demoLogin('TEACHER').then((res) => {
        setStoredToken(res.token);
        setCurrentUser(res.user);
      }).catch(() => {});
    } else if (path.startsWith('/student') || viewParam === 'student') {
      setCurrentView('STUDENT');
      api.demoLogin('STUDENT').then((res) => {
        setStoredToken(res.token);
        setCurrentUser(res.user);
      }).catch(() => {});
    } else if (path.startsWith('/login') || viewParam === 'login') {
      setCurrentView('LOGIN');
    } else {
      setCurrentView('PUBLIC');
      if (pageParam && ['home', 'about', 'curriculum', 'batches', 'faculty', 'pricing', 'faq', 'terms', 'privacy'].includes(pageParam)) {
        setPublicPage(pageParam);
      } else if (path.includes('about')) {
        setPublicPage('about');
      } else if (path.includes('terms')) {
        setPublicPage('terms');
      } else if (path.includes('privacy')) {
        setPublicPage('privacy');
      } else if (path.includes('curriculum')) {
        setPublicPage('curriculum');
      } else if (path.includes('batch')) {
        setPublicPage('about');
      } else if (path.includes('faculty') || path.includes('educators')) {
        setPublicPage('faculty');
      } else if (path.includes('pricing') || path.includes('fee')) {
        setPublicPage('pricing');
      } else if (path.includes('faq')) {
        setPublicPage('faq');
      } else {
        setPublicPage('home');
      }
    }
  };

  useEffect(() => {
    parseLocation();
    checkAuthSession();
    loadInitialData();

    const handlePopState = () => {
      parseLocation();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToPage = (page: PublicPage) => {
    setPublicPage(page);
    setCurrentView('PUBLIC');
    try {
      window.history.pushState(null, '', `?page=${page}`);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (e) {}
  };

  const navigateToLogin = () => {
    setCurrentView('LOGIN');
    try {
      window.history.pushState(null, '', '?view=login');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (e) {}
  };

  const navigateToAdmin = async () => {
    if (currentUser?.role === 'TEACHER') {
      setCurrentView('TEACHER');
      return;
    }
    if (currentUser?.role === 'STUDENT') {
      setCurrentView('STUDENT');
      return;
    }
    if (currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN') {
      setCurrentView('ADMIN');
      return;
    }
    // If not logged in, go to Login screen
    navigateToLogin();
  };

  const navigateBackToHome = () => {
    setCurrentView('PUBLIC');
    setPublicPage('home');
    try {
      window.history.pushState(null, '', window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (e) {}
  };

  const checkAuthSession = async () => {
    const token = getStoredToken();
    if (token) {
      try {
        const res = await api.getCurrentUser();
        setCurrentUser(res.user);
        return;
      } catch (err) {
        removeStoredToken();
        setCurrentUser(null);
      }
    }
  };

  const handleSwitchRole = async (role: UserRole) => {
    try {
      const res = await api.demoLogin(role);
      setStoredToken(res.token);
      setCurrentUser(res.user);

      if (role === 'TEACHER') {
        setCurrentView('TEACHER');
        setTeacherTab('dashboard');
        try { window.history.pushState(null, '', '?view=teacher'); } catch (e) {}
      } else if (role === 'STUDENT' || role === 'PARENT') {
        setCurrentView('STUDENT');
        setStudentTab('dashboard');
        try { window.history.pushState(null, '', '?view=student'); } catch (e) {}
      } else {
        setCurrentView('ADMIN');
        setAdminTab('dashboard');
        try { window.history.pushState(null, '', '?view=admin'); } catch (e) {}
      }

      addToast('info', `Switched active role to ${res.user.name} (${res.user.role})`);
    } catch (err) {
      addToast('error', 'Failed to switch role');
    }
  };

  const loadInitialData = async () => {
    try {
      const [settingsRes, teachersRes, coursesRes, batchesRes] = await Promise.all([
        api.getSettings(),
        api.getTeachers(),
        api.getCourses(),
        api.getBatches(),
      ]);

      if (settingsRes.branding) setBranding(settingsRes.branding);
      if (teachersRes.teachers) setTeachers(teachersRes.teachers);
      if (coursesRes.courses) setCourses(coursesRes.courses);
      if (batchesRes.batches) setBatches(batchesRes.batches);
    } catch (err) {}
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {}
    removeStoredToken();
    setCurrentUser(null);
    navigateBackToHome();
    addToast('info', 'You have been safely logged out.');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FAF9F6] text-slate-900 selection:bg-amber-200 selection:text-amber-900">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* VIEW 1: PARENT PAYMENT PORTAL */}
      {currentView === 'PAYMENT' && paymentIdParam ? (
        <ParentPaymentPortal
          paymentId={paymentIdParam}
          branding={branding}
          onBackToHome={navigateBackToHome}
          onSuccessToast={(msg) => addToast('success', msg)}
        />
      ) : currentView === 'LOGIN' || ((currentView === 'ADMIN' || currentView === 'TEACHER' || currentView === 'STUDENT') && !currentUser) ? (
        /* VIEW 2: DEDICATED AUTH / SIGN-IN VIEW */
        <LoginView
          branding={branding}
          onLoginSuccess={(user, redirectPath) => {
            setCurrentUser(user);
            loadInitialData();
            if (user.role === 'TEACHER') {
              setCurrentView('TEACHER');
              setTeacherTab('dashboard');
            } else if (user.role === 'STUDENT' || user.role === 'PARENT') {
              setCurrentView('STUDENT');
              setStudentTab('dashboard');
            } else {
              setCurrentView('ADMIN');
              setAdminTab('dashboard');
            }
          }}
          onBackToHome={navigateBackToHome}
          onSuccessToast={(msg) => addToast('success', msg)}
        />
      ) : currentView === 'TEACHER' && currentUser ? (
        /* VIEW 3: TEACHER PORTAL */
        <TeacherLayout
          user={currentUser}
          branding={branding}
          activeTab={teacherTab}
          onSelectTab={(tab) => setTeacherTab(tab)}
          onLogout={handleLogout}
          onViewWebsite={navigateBackToHome}
          onSwitchRole={handleSwitchRole}
        >
          {teacherTab === 'dashboard' && (
            <TeacherDashboardView
              onNavigateTab={(tab) => setTeacherTab(tab)}
              onOpenEvaluation={(demoId) => {
                setInitialTeacherDemoId(demoId);
                setTeacherTab('demos');
              }}
              onSuccessToast={(msg) => addToast('success', msg)}
              onErrorToast={(msg) => addToast('error', msg)}
            />
          )}

          {teacherTab === 'profile' && (
            <TeacherProfileView
              onSuccessToast={(msg) => addToast('success', msg)}
              onErrorToast={(msg) => addToast('error', msg)}
            />
          )}

          {teacherTab === 'demos' && (
            <TeacherDemosView
              initialDemoId={initialTeacherDemoId}
              onSuccessToast={(msg) => addToast('success', msg)}
              onErrorToast={(msg) => addToast('error', msg)}
            />
          )}

          {teacherTab === 'classes' && (
            <TeacherClassManagementView
              onSuccessToast={(msg) => addToast('success', msg)}
              onErrorToast={(msg) => addToast('error', msg)}
            />
          )}

          {teacherTab === 'curriculum' && <TeacherCurriculumView />}

          {teacherTab === 'homework' && (
            <TeacherHomeworkView
              onSuccessToast={(msg) => addToast('success', msg)}
              onErrorToast={(msg) => addToast('error', msg)}
            />
          )}

          {teacherTab === 'recordings' && (
            <TeacherRecordingsView
              onSuccessToast={(msg) => addToast('success', msg)}
              onErrorToast={(msg) => addToast('error', msg)}
            />
          )}

          {teacherTab === 'helpdesk' && (
            <TeacherHelpdeskView
              onSuccessToast={(msg) => addToast('success', msg)}
              onErrorToast={(msg) => addToast('error', msg)}
            />
          )}
        </TeacherLayout>
      ) : currentView === 'STUDENT' && currentUser ? (
        /* VIEW 4: STUDENT PORTAL */
        <StudentLayout
          user={currentUser}
          branding={branding}
          activeTab={studentTab}
          onSelectTab={(tab) => setStudentTab(tab)}
          onLogout={handleLogout}
          onViewWebsite={navigateBackToHome}
          onSwitchRole={handleSwitchRole}
        >
          {studentTab === 'dashboard' && (
            <StudentDashboardView
              onNavigateTab={(tab) => setStudentTab(tab)}
              onOpenSubmitHomework={(hw) => {
                setInitialStudentHw(hw);
                setStudentTab('homework');
              }}
              onSuccessToast={(msg) => addToast('success', msg)}
              onErrorToast={(msg) => addToast('error', msg)}
            />
          )}

          {studentTab === 'profile' && (
            <StudentProfileView
              onSuccessToast={(msg) => addToast('success', msg)}
              onErrorToast={(msg) => addToast('error', msg)}
            />
          )}

          {studentTab === 'curriculum' && <StudentCurriculumView />}

          {studentTab === 'classes' && <StudentClassesView />}

          {studentTab === 'homework' && (
            <StudentHomeworkView
              initialHwToSubmit={initialStudentHw}
              onSuccessToast={(msg) => addToast('success', msg)}
              onErrorToast={(msg) => addToast('error', msg)}
            />
          )}

          {studentTab === 'recordings' && <StudentRecordingsView />}

          {studentTab === 'helpdesk' && (
            <StudentHelpdeskView
              onSuccessToast={(msg) => addToast('success', msg)}
              onErrorToast={(msg) => addToast('error', msg)}
            />
          )}
        </StudentLayout>
      ) : currentView === 'ADMIN' && currentUser ? (
        /* VIEW 5: ADMIN OPERATIONS SYSTEM */
        <AdminLayout
          user={currentUser}
          branding={branding}
          activeTab={adminTab}
          onSelectTab={(tab) => setAdminTab(tab)}
          onLogout={handleLogout}
          onViewWebsite={navigateBackToHome}
          onSwitchRole={handleSwitchRole}
        >
          {adminTab === 'dashboard' && (
            <DashboardView
              onNavigateToLeads={() => setAdminTab('leads')}
              onNavigateToDemos={() => setAdminTab('demos')}
              onNavigateToStudents={() => setAdminTab('students')}
              onNavigateToBatches={() => setAdminTab('batches')}
              onNavigateToPayments={() => setAdminTab('payments')}
              onOpenLeadDetail={(lead) => setActiveLeadForDetail(lead)}
            />
          )}

          {adminTab === 'leads' && (
            <LeadsView
              teachers={teachers}
              courses={courses}
              batches={batches}
              onOpenLeadDetail={(lead) => setActiveLeadForDetail(lead)}
              onSuccessToast={(msg) => addToast('success', msg)}
              onErrorToast={(msg) => addToast('error', msg)}
            />
          )}

          {adminTab === 'demos' && (
            <DemosView
              teachers={teachers}
              onSuccessToast={(msg) => addToast('success', msg)}
              onErrorToast={(msg) => addToast('error', msg)}
            />
          )}

          {adminTab === 'teachers' && (
            <TeachersView
              onSuccessToast={(msg) => addToast('success', msg)}
              onErrorToast={(msg) => addToast('error', msg)}
            />
          )}

          {adminTab === 'students' && (
            <StudentsView
              batches={batches}
              courses={courses}
              onSuccessToast={(msg) => addToast('success', msg)}
              onErrorToast={(msg) => addToast('error', msg)}
            />
          )}

          {adminTab === 'batches' && (
            <BatchesView
              teachers={teachers}
              courses={courses}
              onSuccessToast={(msg) => addToast('success', msg)}
              onErrorToast={(msg) => addToast('error', msg)}
            />
          )}

          {adminTab === 'courses' && (
            <CoursesView
              courses={courses}
              onRefreshCourses={loadInitialData}
              onSuccessToast={(msg) => addToast('success', msg)}
              onErrorToast={(msg) => addToast('error', msg)}
            />
          )}

          {adminTab === 'curriculum' && (
            <AdminCurriculumView
              courses={courses}
              onSuccessToast={(msg) => addToast('success', msg)}
              onErrorToast={(msg) => addToast('error', msg)}
            />
          )}

          {adminTab === 'payments' && (
            <PaymentsView
              onSuccessToast={(msg) => addToast('success', msg)}
              onErrorToast={(msg) => addToast('error', msg)}
            />
          )}

          {adminTab === 'helpdesk' && (
            <AdminHelpdeskView
              onSuccessToast={(msg) => addToast('success', msg)}
              onErrorToast={(msg) => addToast('error', msg)}
            />
          )}

          {adminTab === 'audit_logs' && <AdminAuditLogsView />}

          {adminTab === 'settings' && (
            <SettingsView
              branding={branding}
              teachers={teachers}
              onUpdateBranding={(newB) => setBranding(newB)}
              onRefreshTeachers={loadInitialData}
              onSuccessToast={(msg) => addToast('success', msg)}
              onErrorToast={(msg) => addToast('error', msg)}
            />
          )}
        </AdminLayout>
      ) : (
        /* VIEW 6: PUBLIC STUDENT & PARENT FACING WEBSITE */
        <div className="flex-1 flex flex-col">
          <Header
            branding={branding}
            activePage={publicPage}
            onNavigatePage={navigateToPage}
            onOpenDemoModal={() => setIsDemoModalOpen(true)}
            onNavigateToAdmin={navigateToAdmin}
            onNavigateToLogin={navigateToLogin}
          />

          <main className="flex-1">
            {publicPage === 'home' && (
              <HomePage
                branding={branding}
                courses={courses}
                teachers={teachers}
                onOpenDemoModal={() => setIsDemoModalOpen(true)}
                onNavigatePage={navigateToPage}
              />
            )}

            {publicPage === 'about' && (
              <AboutUsPage
                branding={branding}
                onOpenDemoModal={() => setIsDemoModalOpen(true)}
                onNavigateFaculty={() => navigateToPage('faculty')}
                onNavigateCurriculum={() => navigateToPage('curriculum')}
              />
            )}

            {publicPage === 'curriculum' && (
              <CurriculumPage
                branding={branding}
                onOpenDemoModal={() => setIsDemoModalOpen(true)}
              />
            )}

            {publicPage === 'batches' && (
              <AboutUsPage
                branding={branding}
                onOpenDemoModal={() => setIsDemoModalOpen(true)}
                onNavigateFaculty={() => navigateToPage('faculty')}
                onNavigateCurriculum={() => navigateToPage('curriculum')}
              />
            )}

            {publicPage === 'faculty' && (
              <FacultyPage
                teachers={teachers}
                onOpenDemoModal={() => setIsDemoModalOpen(true)}
              />
            )}

            {publicPage === 'pricing' && (
              <PricingPage
                branding={branding}
                courses={courses}
                onOpenDemoModal={() => setIsDemoModalOpen(true)}
              />
            )}

            {publicPage === 'faq' && (
              <FaqPage
                branding={branding}
                onOpenDemoModal={() => setIsDemoModalOpen(true)}
              />
            )}

            {publicPage === 'terms' && (
              <TermsPage
                branding={branding}
                onOpenDemoModal={() => setIsDemoModalOpen(true)}
                onNavigateHome={() => navigateToPage('home')}
                onNavigatePrivacy={() => navigateToPage('privacy')}
              />
            )}

            {publicPage === 'privacy' && (
              <PrivacyPolicyPage
                branding={branding}
                onOpenDemoModal={() => setIsDemoModalOpen(true)}
                onNavigateHome={() => navigateToPage('home')}
                onNavigateTerms={() => navigateToPage('terms')}
              />
            )}
          </main>

          <Footer
            branding={branding}
            onOpenDemoModal={() => setIsDemoModalOpen(true)}
            onNavigateToAdmin={navigateToAdmin}
            onOpenLegalModal={(type) => setLegalModalType(type)}
            onNavigatePage={navigateToPage}
          />
        </div>
      )}

      {/* Global Bhanzu-Style Demo Booking Funnel Modal */}
      <BookingFunnelModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onBookingComplete={(res) => {
          addToast('success', `Demo slot confirmed for ${res.date} at ${res.timeSlot}! Confirmation email sent.`);
        }}
      />

      {/* Global Legal Modal */}
      <LegalModal
        isOpen={!!legalModalType}
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
        branding={branding}
      />

      {/* Global Lead Detail Modal (Accessible from admin view) */}
      <LeadDetailModal
        lead={activeLeadForDetail}
        isOpen={!!activeLeadForDetail}
        onClose={() => setActiveLeadForDetail(null)}
        teachers={teachers}
        courses={courses}
        batches={batches}
        onLeadUpdated={loadInitialData}
        onSuccessToast={(msg) => addToast('success', msg)}
        onErrorToast={(msg) => addToast('error', msg)}
      />

      {/* Floating Bottom-Right WhatsApp Bubble */}
      <FloatingWhatsApp branding={branding} />
    </div>
  );
}
