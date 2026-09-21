import React, { useState, useEffect } from 'react';
import { User, BrandingConfig, InAppNotification } from '../../types';
import { Logo } from '../ui/Logo';
import {
  LayoutDashboard,
  Users2,
  Calendar,
  GraduationCap,
  Layers,
  BookOpen,
  CreditCard,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  LifeBuoy,
  FileText,
  Bell,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { api } from '../../lib/api';

export type AdminTab =
  | 'dashboard'
  | 'leads'
  | 'demos'
  | 'teachers'
  | 'students'
  | 'batches'
  | 'courses'
  | 'curriculum'
  | 'payments'
  | 'helpdesk'
  | 'audit_logs'
  | 'settings';

interface AdminLayoutProps {
  user: User;
  branding: BrandingConfig;
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  onViewWebsite: () => void;
  onSwitchRole?: (role: 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT') => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  branding,
  activeTab,
  onSelectTab,
  onLogout,
  onViewWebsite,
  onSwitchRole,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

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

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'leads', label: 'Leads & Funnel', icon: <Users2 className="w-4 h-4" /> },
    { id: 'demos', label: 'Demo Management', icon: <Calendar className="w-4 h-4" /> },
    { id: 'teachers', label: 'Teachers & Payouts', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'students', label: 'Students Roster', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'batches', label: 'Batches & Capacity', icon: <Layers className="w-4 h-4" /> },
    { id: 'courses', label: 'Course Catalog', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'curriculum', label: 'Master Curriculum', icon: <FileText className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments & Revenue', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'helpdesk', label: 'Support Helpdesk', icon: <LifeBuoy className="w-4 h-4" /> },
    { id: 'audit_logs', label: 'Audit Trail', icon: <Shield className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings & Branding', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#10182C] text-slate-300 border-r border-slate-800 shrink-0">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-white tracking-tight">
              up<span className="text-[#F27C00]">speaq</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#F27C00] font-bold block mt-1">
              Admin Operations
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`admin_nav_${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#F27C00] text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Card & Foot Actions */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">
              {user?.name ? user.name[0] : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">{user?.name || 'Admin'}</div>
              <div className="text-[10px] text-slate-400 truncate">{user?.role || 'SUPER_ADMIN'}</div>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onViewWebsite}
            className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#10182C] text-white p-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-30">
        <span className="font-bold text-lg text-white">
          up<span className="text-[#F27C00]">speaq</span> Admin
        </span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex">
          <div className="w-72 bg-[#10182C] h-full p-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-white text-base">Upspeaq Operations</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                      activeTab === item.id ? 'bg-[#F27C00] text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 text-xs text-red-400 font-medium px-3 py-2 rounded-lg hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Control Bar with Quick Role Switcher and Notification Bell */}
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Active View:</span>
            <span className="text-xs font-bold text-[#10182C] bg-slate-100 px-2.5 py-0.5 rounded uppercase">
              {activeTab}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Role Switcher */}
            {onSwitchRole && (
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-[11px]">
                <span className="text-slate-500 px-1 font-medium hidden sm:inline">Role:</span>
                <button
                  onClick={() => onSwitchRole('SUPER_ADMIN')}
                  className="px-2 py-0.5 rounded bg-[#10182C] text-white font-semibold"
                >
                  Admin
                </button>
                <button
                  onClick={() => onSwitchRole('TEACHER')}
                  className="px-2 py-0.5 rounded hover:bg-slate-200 text-slate-700"
                >
                  Teacher
                </button>
                <button
                  onClick={() => onSwitchRole('STUDENT')}
                  className="px-2 py-0.5 rounded hover:bg-slate-200 text-slate-700"
                >
                  Student
                </button>
              </div>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#F27C00] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#10182C]">System Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-[11px] text-[#F27C00] hover:underline">
                        Mark read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">No new alerts.</div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="p-3 text-xs hover:bg-slate-50">
                          <span className="font-bold text-slate-800">{n.title}</span>
                          <p className="text-slate-500 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
