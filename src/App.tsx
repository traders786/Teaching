import React, { useState, useEffect } from 'react';
import { api, getStoredToken, setStoredToken, removeStoredToken } from './lib/api';
import { User, BrandingConfig, Teacher, Course, Batch, Lead } from './types';

// UI Components
import { ToastContainer, ToastMessage } from './components/ui/Toast';

// Public Components
import { Header, PublicPage } from './components/public/Header';
import { Footer } from './components/public/Footer';
import { BookDemoModal } from './components/public/BookDemoModal';
import { ParentPaymentPortal } from './components/public/ParentPaymentPortal';
import { LegalModal } from './components/public/LegalModal';

// Dedicated Detailed Pages
import { HomePage } from './pages/HomePage';
import { CurriculumPage } from './pages/CurriculumPage';
import { BatchesPage } from './pages/BatchesPage';
import { FacultyPage } from './pages/FacultyPage';
import { PricingPage } from './pages/PricingPage';
import { FaqPage } from './pages/FaqPage';

// Admin Components
import { AdminLayout, AdminTab } from './components/admin/AdminLayout';
import { LoginView } from './components/admin/LoginView';
import { DashboardView } from './components/admin/DashboardView';
import { LeadsView } from './components/admin/LeadsView';
import { DemosView } from './components/admin/DemosView';
import { StudentsView } from './components/admin/StudentsView';
import { BatchesView } from './components/admin/BatchesView';
import { CoursesView } from './components/admin/CoursesView';
import { PaymentsView } from './components/admin/PaymentsView';
import { SettingsView } from './components/admin/SettingsView';
import { LeadDetailModal } from './components/admin/LeadDetailModal';

export default function App() {
  // Navigation & View state
  const [currentView, setCurrentView] = useState<'PUBLIC' | 'ADMIN' | 'PAYMENT'>('PUBLIC');
  const [publicPage, setPublicPage] = useState<PublicPage>('home');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [paymentIdParam, setPaymentIdParam] = useState<string | null>(null);

  // App-wide Data State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [branding, setBranding] = useState<BrandingConfig>({
    brandName: 'Speak India',
    tagline: 'Empowering Young Minds with Voice, Courage & Conviction',
    contactPhone: '+91 98765 43210',
    supportWhatsapp: '+91 98765 43210',
    contactEmail: 'admissions@speakindia.in',
    classBatchTargetSize: 8,
    classBatchMaxSize: 9,
    flagshipPrice: 4999,
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  // Modals state
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'PRIVACY' | 'TERMS' | null>(null);
  const [activeLeadForDetail, setActiveLeadForDetail] = useState<Lead | null>(null);

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

  // URL Parsing and Sync
  const parseLocation = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const payId = urlParams.get('pay');
    const path = window.location.pathname;
    const viewParam = urlParams.get('view');
    const pageParam = urlParams.get('page') as PublicPage | null;

    if (payId) {
      setPaymentIdParam(payId);
      setCurrentView('PAYMENT');
    } else if (path.startsWith('/admin') || viewParam === 'admin') {
      setCurrentView('ADMIN');
    } else {
      setCurrentView('PUBLIC');
      if (pageParam && ['home', 'curriculum', 'batches', 'faculty', 'pricing', 'faq'].includes(pageParam)) {
        setPublicPage(pageParam);
      } else if (path.includes('curriculum')) {
        setPublicPage('curriculum');
      } else if (path.includes('batch')) {
        setPublicPage('batches');
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
    window.history.pushState(null, '', `?page=${page}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const navigateToAdmin = async () => {
    setCurrentView('ADMIN');
    try {
      window.history.pushState(null, '', '?view=admin');
    } catch (e) {}
    try {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (e) {}

    // If not authenticated, automatically log in as Super Admin so the portal is instantly usable
    if (!currentUser) {
      try {
        const res = await api.demoLogin('SUPER_ADMIN');
        setStoredToken(res.token);
        setCurrentUser(res.user);
        loadInitialData();
        addToast('success', `Welcome to Operations Portal (${res.user.name})`);
      } catch (err) {
        console.warn('Auto-login error:', err);
      }
    }
  };

  const navigateBackToHome = () => {
    setCurrentView('PUBLIC');
    setPublicPage('home');
    try {
      window.history.pushState(null, '', window.location.pathname);
    } catch (e) {}
    try {
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

    // If directly landing on admin view in URL, auto-authenticate
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('view') === 'admin' || window.location.pathname.startsWith('/admin')) {
        const res = await api.demoLogin('SUPER_ADMIN');
        setStoredToken(res.token);
        setCurrentUser(res.user);
      }
    } catch (e) {}
  };

  const handleSwitchRole = async (role: 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER') => {
    try {
      const res = await api.demoLogin(role);
      setStoredToken(res.token);
      setCurrentUser(res.user);
      addToast('info', `Switched role to ${res.user.name} (${res.user.role})`);
    } catch (err) {
      addToast('error', 'Failed to switch staff role');
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

      if (settingsRes.branding) {
        setBranding(settingsRes.branding);
      }
      if (teachersRes.teachers) {
        setTeachers(teachersRes.teachers);
      }
      if (coursesRes.courses) {
        setCourses(coursesRes.courses);
      }
      if (batchesRes.batches) {
        setBatches(batchesRes.batches);
      }
    } catch (err) {
      console.warn('Initial data load error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // ignore
    }
    removeStoredToken();
    setCurrentUser(null);
    navigateBackToHome();
    addToast('info', 'You have been logged out of the staff portal.');
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
      ) : currentView === 'ADMIN' ? (
        /* VIEW 2: OPERATIONS & ADMIN SYSTEM */
        !currentUser ? (
          <LoginView
            branding={branding}
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              loadInitialData();
            }}
            onBackToHome={navigateBackToHome}
            onSuccessToast={(msg) => addToast('success', msg)}
          />
        ) : (
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

            {adminTab === 'payments' && (
              <PaymentsView
                onSuccessToast={(msg) => addToast('success', msg)}
                onErrorToast={(msg) => addToast('error', msg)}
              />
            )}

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
        )
      ) : (
        /* VIEW 3: PUBLIC STUDENT & PARENT FACING DETAILED PAGES */
        <div className="flex-1 flex flex-col">
          <Header
            branding={branding}
            activePage={publicPage}
            onNavigatePage={navigateToPage}
            onOpenDemoModal={() => setIsDemoModalOpen(true)}
            onNavigateToAdmin={navigateToAdmin}
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

            {publicPage === 'curriculum' && (
              <CurriculumPage
                branding={branding}
                onOpenDemoModal={() => setIsDemoModalOpen(true)}
              />
            )}

            {publicPage === 'batches' && (
              <BatchesPage
                branding={branding}
                onOpenDemoModal={() => setIsDemoModalOpen(true)}
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

      {/* Global Book Demo Modal */}
      <BookDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        branding={branding}
        onSuccessToast={(msg) => addToast('success', msg)}
      />

      {/* Global Legal Modal */}
      <LegalModal
        isOpen={!!legalModalType}
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
        branding={branding}
      />

      {/* Global Lead Detail Modal (Accessible from any admin view) */}
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
    </div>
  );
}
