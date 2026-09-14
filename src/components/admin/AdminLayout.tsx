import React, { useState } from 'react';
import { User, BrandingConfig } from '../../types';
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
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'leads'
  | 'demos'
  | 'students'
  | 'batches'
  | 'courses'
  | 'payments'
  | 'settings';

interface AdminLayoutProps {
  user: User;
  branding: BrandingConfig;
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  onViewWebsite: () => void;
  onSwitchRole?: (role: 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER') => void;
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

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'leads', label: 'Leads & Funnel', icon: <Users2 className="w-4 h-4" /> },
    { id: 'demos', label: 'Demo Sessions', icon: <Calendar className="w-4 h-4" /> },
    { id: 'students', label: 'Students Roster', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'batches', label: 'Batches & Capacity', icon: <Layers className="w-4 h-4" /> },
    { id: 'courses', label: 'Course Catalog', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments & Links', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'settings', label: 'Branding & Config', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center">
              SI
            </div>
            <div>
              <span className="text-sm font-bold text-white block leading-tight truncate max-w-[140px]">
                {branding.brandName}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-amber-400 block">
                Ops Control Portal
              </span>
            </div>
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
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
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
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center justify-between">
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate">{user.name}</span>
                <span className="text-[10px] text-slate-400 block truncate">{user.email}</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {user.role}
              </span>
            </div>
          </div>

          {onSwitchRole && (
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">Switch Role Preview:</span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => onSwitchRole('SUPER_ADMIN')}
                  className={`px-1.5 py-1 text-[10px] rounded font-medium truncate cursor-pointer transition-colors ${
                    user.role === 'SUPER_ADMIN' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Super Admin"
                >
                  Admin
                </button>
                <button
                  onClick={() => onSwitchRole('ADMIN')}
                  className={`px-1.5 py-1 text-[10px] rounded font-medium truncate cursor-pointer transition-colors ${
                    user.role === 'ADMIN' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Admissions Lead"
                >
                  Ops
                </button>
                <button
                  onClick={() => onSwitchRole('TEACHER')}
                  className={`px-1.5 py-1 text-[10px] rounded font-medium truncate cursor-pointer transition-colors ${
                    user.role === 'TEACHER' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Teacher"
                >
                  Coach
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              onClick={onViewWebsite}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Site</span>
            </button>

            <button
              id="btn_admin_logout"
              onClick={onLogout}
              className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
            SI
          </div>
          <span className="text-sm font-bold truncate max-w-[160px]">{branding.brandName}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onViewWebsite}
            className="text-xs text-slate-300 border border-slate-700 px-2.5 py-1 rounded-md"
          >
            Site
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 text-slate-200 border-b border-slate-800 p-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                  activeTab === item.id ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">{user.name}</span>
            <button onClick={onLogout} className="text-xs text-rose-400 font-semibold">
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
