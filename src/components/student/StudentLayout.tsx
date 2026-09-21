import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  User,
  BookOpen,
  Calendar,
  FileText,
  Video,
  LifeBuoy,
  LogOut,
  Bell,
  Menu,
  X,
  ExternalLink,
  Sparkles,
  Award,
} from 'lucide-react';
import { User as UserType, BrandingConfig, InAppNotification } from '../../types';
import { api } from '../../lib/api';

export type StudentTab =
  | 'dashboard'
  | 'profile'
  | 'course'
  | 'curriculum'
  | 'classes'
  | 'homework'
  | 'recordings'
  | 'helpdesk';

interface StudentLayoutProps {
  user: UserType;
  branding: BrandingConfig;
  activeTab: StudentTab;
  onSelectTab: (tab: StudentTab) => void;
  onLogout: () => void;
  onViewWebsite: () => void;
  onSwitchRole?: (role: 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT') => void;
  children: React.ReactNode;
}

export function StudentLayout({
  user,
  branding,
  activeTab,
  onSelectTab,
  onLogout,
  onViewWebsite,
  onSwitchRole,
  children,
}: StudentLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const loadNotifications = async () => {
    try {
      const res = await api.getNotifications();
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (e) {}
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    } catch (e) {}
  };

  const navItems = [
    { id: 'dashboard' as StudentTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile' as StudentTab, label: 'My Profile', icon: User },
    { id: 'curriculum' as StudentTab, label: 'My Curriculum', icon: BookOpen },
    { id: 'classes' as StudentTab, label: 'My Classes', icon: Calendar },
    { id: 'homework' as StudentTab, label: 'Homework', icon: FileText },
    { id: 'recordings' as StudentTab, label: 'Recorded Sessions', icon: Video },
    { id: 'helpdesk' as StudentTab, label: 'Helpdesk', icon: LifeBuoy },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-sans text-slate-800">
      {/* Top Banner for Fast Role Switching & Context */}
      <div className="bg-[#10182C] text-slate-300 text-xs px-4 py-2 flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            STUDENT LEARNING PORTAL
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="text-slate-300">Welcome, <strong className="text-white font-medium">{user.name}</strong></span>
        </div>

        <div className="flex items-center gap-2 mt-1 sm:mt-0">
          <span className="text-slate-400 hidden md:inline">Switch Role:</span>
          {onSwitchRole && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onSwitchRole('SUPER_ADMIN')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-[11px]"
              >
                Admin
              </button>
              <button
                onClick={() => onSwitchRole('TEACHER')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-[11px]"
              >
                Teacher
              </button>
              <button
                onClick={() => onSwitchRole('STUDENT')}
                className="px-2 py-0.5 rounded bg-emerald-600 text-white font-medium text-[11px]"
              >
                Student
              </button>
            </div>
          )}
          <button
            onClick={onViewWebsite}
            className="flex items-center gap-1 text-slate-300 hover:text-white ml-2 text-[11px] underline underline-offset-2"
          >
            Public Site <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-[#10182C]">
                up<span className="text-[#F27C00]">speaq</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Student Learning Space
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full relative transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#F27C00] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-sm text-[#10182C]">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-[#F27C00] hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-600">No notifications yet.</div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 text-xs transition ${
                            !notif.is_read ? 'bg-amber-50/60 font-medium' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-slate-800">{notif.title}</span>
                            <span className="text-[10px] text-slate-600">{new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-slate-600 mt-1">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Student Profile Widget */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {user.name ? user.name[0] : 'S'}
                </div>
              )}
              <div className="hidden md:block text-left text-xs leading-tight">
                <div className="font-semibold text-[#10182C]">{user.name}</div>
                <div className="text-slate-600">Enrolled Student</div>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <nav className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs space-y-1 sticky top-24">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-[#F27C00]/10 text-[#F27C00] font-semibold border-l-3 border-[#F27C00]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#F27C00]' : 'text-slate-600'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-xs bg-white h-full shadow-2xl p-4 flex flex-col z-50">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <span className="font-bold text-lg text-[#10182C]">
                  up<span className="text-[#F27C00]">speaq</span> Learner
                </span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                        isActive
                          ? 'bg-[#F27C00]/10 text-[#F27C00] font-semibold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 text-sm text-red-600 font-medium px-3 py-2 rounded-lg hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
