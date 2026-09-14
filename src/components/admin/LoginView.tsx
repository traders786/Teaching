import React, { useState } from 'react';
import { api, setStoredToken } from '../../lib/api';
import { User, BrandingConfig } from '../../types';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, ArrowLeft, Zap } from 'lucide-react';

interface LoginViewProps {
  branding: BrandingConfig;
  onLoginSuccess: (user: User) => void;
  onBackToHome: () => void;
  onSuccessToast: (msg: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  branding,
  onLoginSuccess,
  onBackToHome,
  onSuccessToast,
}) => {
  const [email, setEmail] = useState('admin@speakindia.in');
  const [password, setPassword] = useState('AdminPassword123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performLogin = async (loginEmail: string, loginPass: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.login(loginEmail.trim(), loginPass);
      setStoredToken(res.token);
      onLoginSuccess(res.user);
      onSuccessToast(`Welcome back, ${res.user.name}`);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin(email, password);
  };

  const handleRoleLogin = async (role: 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER') => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.demoLogin(role);
      setStoredToken(res.token);
      onLoginSuccess(res.user);
      onSuccessToast(`Logged in as ${res.user.name} (${res.user.role})`);
    } catch (err: any) {
      // Fallback to manual login
      if (role === 'SUPER_ADMIN') {
        await performLogin('admin@speakindia.in', 'AdminPassword123!');
      } else if (role === 'ADMIN') {
        await performLogin('counselor@speakindia.in', 'AdminPassword123!');
      } else {
        await performLogin('teacher@speakindia.in', 'AdminPassword123!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOneClickLogin = () => handleRoleLogin('SUPER_ADMIN');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-left">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Back Link */}
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
            onBackToHome();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-6 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {branding.brandName} Website</span>
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-500 flex items-center justify-center font-black text-xl mx-auto shadow-sm">
            SI
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Staff & Operations Portal</h2>
          <p className="text-xs text-slate-500">Secure role-based access for admissions, teachers and administrators</p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200 shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* One-Click Fast Login Assistant */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>One-Click Role Access</span>
              </span>
              <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded-md">Live Demo</span>
            </div>
            <p className="text-[11px] text-amber-900/80 leading-relaxed">
              Select a staff role below to instantly authenticate and inspect the operations system:
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                id="admin_btn_login_super_admin"
                disabled={loading}
                onClick={() => handleRoleLogin('SUPER_ADMIN')}
                className="w-full py-2.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 active:scale-[0.99] disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Super Admin (Full Operations)</span>
                </div>
                <span className="text-[10px] bg-amber-700/60 px-1.5 py-0.5 rounded">All Access</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="admin_btn_login_counselor"
                  disabled={loading}
                  onClick={() => handleRoleLogin('ADMIN')}
                  className="py-2 px-2.5 rounded-lg bg-white hover:bg-slate-50 active:scale-[0.99] border border-amber-300 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <span>Admissions Lead</span>
                </button>
                <button
                  type="button"
                  id="admin_btn_login_teacher"
                  disabled={loading}
                  onClick={() => handleRoleLogin('TEACHER')}
                  className="py-2 px-2.5 rounded-lg bg-white hover:bg-slate-50 active:scale-[0.99] border border-amber-300 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <span>Senior Faculty</span>
                </button>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <span className="h-px bg-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
              Or sign in manually
            </span>
            <span className="h-px bg-slate-200 w-full" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Staff Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="admin_input_email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@speakindia.in"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="admin_input_password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
              id="admin_btn_login_submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-amber-400 font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Operations</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Credentials Reference */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-700">Seeded Credentials:</span>
              <span className="text-slate-500 font-mono">admin@speakindia.in / AdminPassword123!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
