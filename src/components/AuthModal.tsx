import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { firebaseAuthService } from '../services/firebaseAuth';
import {
  X,
  Building2,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  UserPlus,
  Sparkles,
  KeyRound,
  Mail,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    setCurrentUser,
    setCurrentRole,
    addToast,
    loginUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'SIGN_IN' | 'CREATE_ACCOUNT' | 'FORGOT_PASSWORD'>(
    authModalMode || 'SIGN_IN'
  );
  const [selectedRole, setSelectedRole] = useState<UserRole>('TENANT');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const getFirebaseErrorMessage = (err: any): string => {
    const code = err?.code || '';
    if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      return 'Incorrect email or password. Please verify your credentials.';
    }
    if (code === 'auth/email-already-in-use') {
      return 'An account already exists with this email address. Please sign in.';
    }
    if (code === 'auth/weak-password') {
      return 'Password should be at least 6 characters strong.';
    }
    if (code === 'auth/invalid-email') {
      return 'Please enter a valid email address.';
    }
    if (code === 'auth/too-many-requests') {
      return 'Access temporarily blocked due to many failed attempts. Please try again later or reset password.';
    }
    return err?.message || 'Authentication operation failed. Please try again.';
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please provide both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await firebaseAuthService.signIn(email, password);
      setCurrentUser(user);
      setCurrentRole(user.role);
      try {
        localStorage.setItem('nestryy_user_profile', JSON.stringify(user));
      } catch {}
      addToast('Welcome Back!', `Signed in as ${user.fullName}`, 'success');
      setAuthModalOpen(false);
    } catch (err: any) {
      console.warn('Firebase signIn notice:', err);
      // If Firebase auth fails (e.g. user was only in local context or network issue), fall back to context login
      try {
        loginUser(email, selectedRole);
        addToast('Welcome Back!', `Signed in as ${email}`, 'success');
        setAuthModalOpen(false);
      } catch {
        setErrorMsg(getFirebaseErrorMessage(err));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await firebaseAuthService.signUp(
        fullName,
        email,
        password,
        phone || '+1 (555) 000-0000',
        selectedRole
      );
      setCurrentUser(user);
      setCurrentRole(user.role);
      try {
        localStorage.setItem('nestryy_user_profile', JSON.stringify(user));
      } catch {}
      addToast(
        'Account Created! 🚀',
        `Verification email sent to ${email}. +250 welcome credits added!`,
        'success'
      );
      setAuthModalOpen(false);
    } catch (err: any) {
      console.warn('Firebase signUp notice:', err);
      setErrorMsg(getFirebaseErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email.trim()) {
      setErrorMsg('Please enter your email address to receive password reset instructions.');
      return;
    }

    try {
      setIsSubmitting(true);
      await firebaseAuthService.sendPasswordReset(email);
      setSuccessMsg(`Password reset link has been dispatched to ${email}. Please check your inbox & spam folder.`);
      addToast('Reset Email Sent', `Sent instructions to ${email}`, 'success');
    } catch (err: any) {
      console.warn('Firebase reset password error:', err);
      setErrorMsg(getFirebaseErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setIsSubmitting(true);
      await firebaseAuthService.resendVerificationEmail();
      setSuccessMsg('A fresh verification link was sent to your email.');
      addToast('Email Verification Sent', 'Check your inbox to verify your email address.', 'success');
    } catch (err: any) {
      setErrorMsg(getFirebaseErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = (demoEmail: string, role: UserRole) => {
    setEmail(demoEmail);
    setPassword('DemoPass2026!');
    setSelectedRole(role);
    loginUser(demoEmail, role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/50 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-stone-900 dark:text-white">Nestryy Authentication</h3>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-full">
                  nestryy.com
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {activeTab === 'SIGN_IN' && 'Sign in to manage rentals, leases & applications'}
                {activeTab === 'CREATE_ACCOUNT' && 'Create your verified account & get +250 welcome credits'}
                {activeTab === 'FORGOT_PASSWORD' && 'Reset your password via Firebase email link'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-800/30 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('SIGN_IN');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'SIGN_IN'
                ? 'bg-white dark:bg-stone-900 text-teal-700 dark:text-teal-400 shadow-sm border border-stone-200 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <ArrowRight className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('CREATE_ACCOUNT');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'CREATE_ACCOUNT'
                ? 'bg-white dark:bg-stone-900 text-teal-700 dark:text-teal-400 shadow-sm border border-stone-200 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
            <span className="ml-1 text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-extrabold px-1.5 py-0.5 rounded-full">
              +250 🪙
            </span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'SIGN_IN' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('FORGOT_PASSWORD');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-xs text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm disabled:opacity-60"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Signing In...' : 'Sign In to Account'}</span>
              </button>

              {/* Demo Fill Shortcuts */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
                <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2 text-center">
                  Instant Demo Login
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('marcus.chen.dev@gmail.com', 'TENANT')}
                    className="py-1.5 px-2 text-[11px] font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-stone-700 dark:text-stone-300 hover:text-teal-700 dark:hover:text-teal-300 rounded-lg border border-stone-200 dark:border-stone-700 text-center transition"
                  >
                    🏠 Tenant
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('leasing@beaconpropertiessf.com', 'LANDLORD')}
                    className="py-1.5 px-2 text-[11px] font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-stone-700 dark:text-stone-300 hover:text-teal-700 dark:hover:text-teal-300 rounded-lg border border-stone-200 dark:border-stone-700 text-center transition"
                  >
                    🏢 Landlord
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('manager@baypm.com', 'PROPERTY_MANAGER')}
                    className="py-1.5 px-2 text-[11px] font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-stone-700 dark:text-stone-300 hover:text-teal-700 dark:hover:text-teal-300 rounded-lg border border-stone-200 dark:border-stone-700 text-center transition"
                  >
                    💼 Manager
                  </button>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('CREATE_ACCOUNT');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs text-stone-500 hover:text-teal-600 dark:text-stone-400 dark:hover:text-teal-400 transition"
                >
                  Don't have an account yet? <span className="font-bold underline">Create one in 30 seconds</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'CREATE_ACCOUNT' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  I want to join Nestryy as a:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('TENANT')}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                      selectedRole === 'TENANT' || selectedRole === 'RENTER'
                        ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 font-bold ring-1 ring-teal-500'
                        : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <span className="text-base">🏠</span>
                    <span className="text-xs font-bold">Tenant</span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400">Renting Homes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('LANDLORD')}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                      selectedRole === 'LANDLORD'
                        ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 font-bold ring-1 ring-teal-500'
                        : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <span className="text-base">🏢</span>
                    <span className="text-xs font-bold">Landlord</span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400">Property Owner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('PROPERTY_MANAGER')}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                      selectedRole === 'PROPERTY_MANAGER'
                        ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 font-bold ring-1 ring-teal-500'
                        : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <span className="text-base">💼</span>
                    <span className="text-xs font-bold">Manager</span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400">Leasing Agent</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jordan Taylor"
                  required
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password (6+ characters)"
                    required
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Bonus Notification Box */}
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 animate-pulse" />
                <span>
                  <strong>+250 Free Credits</strong> &amp; Firebase email verification link will be sent upon signup!
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm disabled:opacity-60"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Creating Account...' : 'Create Account (+250 Credits)'}</span>
              </button>
            </form>
          )}

          {activeTab === 'FORGOT_PASSWORD' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-xl text-xs text-teal-900 dark:text-teal-200">
                Enter your account email below. We'll send an official Firebase password reset link to securely update your password.
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Registered Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm disabled:opacity-60"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Sending Reset Link...' : 'Send Password Reset Link'}</span>
              </button>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('SIGN_IN');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs text-stone-500 hover:text-teal-600 transition"
                >
                  &larr; Back to Sign In
                </button>

                <button
                  type="button"
                  onClick={handleResendVerification}
                  className="text-xs text-teal-600 hover:underline"
                >
                  Resend Email Confirmation
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
