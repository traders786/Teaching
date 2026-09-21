import React, { useState, useEffect } from 'react';
import { api, setStoredToken } from '../../lib/api';
import { User, BrandingConfig, UserRole } from '../../types';
import {
  Lock,
  Mail,
  Shield,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Users,
  CheckCircle2,
  Phone,
  HelpCircle,
  X,
} from 'lucide-react';

interface LoginViewProps {
  branding: BrandingConfig;
  onLoginSuccess: (user: User, redirectPath?: string) => void;
  onBackToHome: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  branding,
  onLoginSuccess,
  onBackToHome,
  onSuccessToast,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.login({ email: identifier, password });
      if (res?.token) {
        setStoredToken(res.token);
      }
      const user = res?.user || { id: 'usr_1', email: identifier, name: 'User', role: 'STUDENT' as UserRole };
      if (onSuccessToast) {
        onSuccessToast(`Welcome back, ${user.name} (${user.role})`);
      }
      onLoginSuccess(user, res?.redirectPath);
    } catch (err: any) {
      setError(err.message || 'Invalid email/phone or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.demoLogin(role);
      if (res?.token) {
        setStoredToken(res.token);
      }
      const user = res?.user || { id: 'usr_demo', email: 'demo@upspeaq.com', name: 'Demo User', role };
      if (onSuccessToast) {
        onSuccessToast(`Logged in as ${user.name} (${user.role})`);
      }
      onLoginSuccess(user, res?.redirectPath);
    } catch (err: any) {
      setError('Demo login failed. Please try credentials above.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setForgotModalOpen(false);
      setForgotSent(false);
      setForgotEmail('');
    }, 2500);
  };

  // Google OAuth Initialization
  useEffect(() => {
    const googleClientId = '274011561178-plve233fk574uulhncask4hvgnf7n7vt.apps.googleusercontent.com';

    const initGoogleAuth = () => {
      if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: googleClientId,
            callback: async (response: any) => {
              if (response?.credential) {
                try {
                  setLoading(true);
                  setError(null);
                  const res = await api.googleLogin(response.credential);
                  if (res?.token) {
                    setStoredToken(res.token);
                  }
                  const user = res?.user || { id: 'usr_google', email: 'user@gmail.com', name: 'Google User', role: 'STUDENT' as UserRole };
                  if (onSuccessToast) {
                    onSuccessToast(`Welcome to Upspeaq, ${user.name}!`);
                  }
                  onLoginSuccess(user, res?.redirectPath);
                } catch (err: any) {
                  setError(err?.message || 'Google sign-in failed. Please try email login.');
                } finally {
                  setLoading(false);
                }
              }
            },
          });

          const btnEl = document.getElementById('googleSignInBtn');
          if (btnEl) {
            btnEl.innerHTML = '';
            (window as any).google.accounts.id.renderButton(btnEl, {
              theme: 'outline',
              size: 'large',
              width: 340,
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'center',
            });
          }
        } catch (e) {
          console.warn('Google GSI init warning:', e);
        }
      }
    };

    const timer = setTimeout(initGoogleAuth, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Upspeaq Website</span>
        </button>

        <div className="text-center">
          <span className="text-3xl font-extrabold tracking-tight text-[#10182C]">
            up<span className="text-[#F27C00]">speaq</span>
          </span>
          <h2 className="mt-3 text-2xl font-bold text-[#10182C] tracking-tight">
            Welcome back
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Sign in to access your Admin, Teacher, or Student learning dashboard
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-slate-200/80">
          {/* 1-CLICK GOOGLE SIGN-IN BUTTON */}
          <div className="mb-5">
            <div id="googleSignInBtn" className="flex justify-center min-h-[44px]"></div>
            
            <div className="relative mt-5 mb-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 font-medium">Or sign in with email</span>
              </div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address or Mobile Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@speakindia.in or student@upspeaq.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27C00] transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs text-[#F27C00] font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#F27C00] transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#F27C00] hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow-md transition disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Quick One-Click Role Switcher */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block text-center mb-3">
              One-Click Role Demo Sign-In
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('SUPER_ADMIN')}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-center text-xs font-semibold transition"
              >
                <Shield className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('TEACHER')}
                className="p-2.5 bg-[#10182C] hover:bg-slate-800 text-white rounded-xl text-center text-xs font-semibold transition"
              >
                <GraduationCap className="w-4 h-4 mx-auto mb-1 text-[#F27C00]" />
                <span>Teacher</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('STUDENT')}
                className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-center text-xs font-semibold transition"
              >
                <Sparkles className="w-4 h-4 mx-auto mb-1 text-emerald-300" />
                <span>Student</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-[#10182C]">Reset Account Password</h3>
              <button onClick={() => setForgotModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotSent ? (
              <div className="py-6 text-center text-xs text-emerald-700 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="font-bold">Password reset instructions sent!</p>
                <p className="text-slate-500 text-[11px]">Check your email for the recovery link.</p>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="mt-4 space-y-4 text-xs">
                <p className="text-slate-500 text-[11px]">
                  Enter your registered email address and we'll send a password reset instruction link.
                </p>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@upspeaq.com"
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F27C00]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#F27C00] text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
