import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  ArrowRight,
  UserCheck,
  Sparkles,
  Building2,
  Eye,
  EyeOff,
  KeyRound,
  Smartphone,
  AlertTriangle,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [requireMfa, setRequireMfa] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(true);

  // 2FA Challenge State
  const [mfaChallenge, setMfaChallenge] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [resendTimer, setResendTimer] = useState(60);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, verifyOtp } = useAuth();
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-red-500', text: 'text-red-600' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-orange-500', text: 'text-orange-600' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-blue-600', text: 'text-blue-600' };
    return { score: 100, label: 'Strong (Enterprise Compliant)', color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  const strength = getPasswordStrength(password);

  useEffect(() => {
    let timer;
    if (mfaChallenge && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [mfaChallenge, resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!captchaVerified) {
      setError('Please complete the operator security verification challenge');
      return;
    }

    setLoading(true);
    const result = await login(username, password, requireMfa);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else if (result.mfaRequired) {
      setMfaChallenge({
        tempToken: result.tempToken,
        username: result.username,
        maskedPhone: result.maskedPhone,
        sandboxOtp: result.sandboxOtp
      });
      setOtpCode(result.sandboxOtp || '');
      setResendTimer(60);
    } else {
      setError(result.error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setError('Please enter a valid 6-digit verification OTP');
      return;
    }
    setError('');
    setLoading(true);
    const result = await verifyOtp(mfaChallenge.username, mfaChallenge.tempToken, otpCode);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const handleQuickLogin = (uname) => {
    setUsername(uname);
    setPassword('password123');
    setError('');
    setMfaChallenge(null);
    login(uname, 'password123', false).then((res) => {
      if (res.success) navigate('/dashboard');
      else setError(res.error);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Light ambient multi-color lighting: Red, Orange, Blue, Green */}
      <div className="absolute top-0 left-10 w-96 h-96 bg-red-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="flex justify-center">
          {/* Red & Orange Gradient Brand Icon */}
          <div className="w-14 h-14 rounded-2xl gradient-red-orange flex items-center justify-center text-white shadow-xl shadow-red-500/25">
            <Radio className="w-8 h-8 animate-pulse" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-extrabold text-slate-900 tracking-tight">
          Apex Telecom India
        </h2>
        <div className="flex items-center justify-center gap-2 mt-1.5">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Enterprise Carrier CRM
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            5G Core Live
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            DoT Shield Active
          </span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Pure White Crisp Card */}
        <div className="bg-white border border-slate-200/90 py-8 px-6 shadow-xl rounded-3xl">
          {/* Security Alert / Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2.5 animate-shake">
              <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{error}</p>
                <p className="text-[11px] text-red-600/80 mt-0.5">
                  Brute-force protection locks access after 5 consecutive failures.
                </p>
              </div>
            </div>
          )}

          {!mfaChallenge ? (
            /* STEP 1: CREDENTIALS AUTHENTICATION */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Operator Username / Staff ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. superadmin, manager, sales1"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all font-medium"
                  />
                  <div className="absolute right-3 top-3 text-slate-400">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <span className={`text-[10px] font-bold ${strength.text}`}>
                    {strength.label}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>

              {/* 2FA Step-up Toggle & Operator Compliance */}
              <div className="pt-1 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-semibold select-none">
                  <input
                    type="checkbox"
                    checked={requireMfa}
                    onChange={(e) => setRequireMfa(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Enforce 2FA / OTP Verification</span>
                </label>
                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  TRAI Rule 4B
                </span>
              </div>

              {/* Anti-Bot Human Verification Check (Green Accent) */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 select-none font-semibold">
                  <input
                    type="checkbox"
                    checked={captchaVerified}
                    onChange={(e) => setCaptchaVerified(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[11px]">
                    Verified Telecom Operator Session
                  </span>
                </label>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>

              {/* Red-Orange Primary Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white gradient-red-orange hover:opacity-95 shadow-md shadow-red-500/25 flex items-center justify-center gap-2 transition-all mt-3 active:scale-[0.98]"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In with Carrier Shield'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* STEP 2: MULTI-FACTOR AUTHENTICATION (MFA / 2FA OTP) */
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
              <div className="text-center pb-2">
                <div className="inline-flex p-3 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 mb-2">
                  <Smartphone className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Two-Factor Authentication</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter the 6-digit OTP dispatched to authorized mobile{' '}
                  <span className="text-blue-600 font-mono font-bold">
                    {mfaChallenge.maskedPhone}
                  </span>
                </p>
              </div>

              {mfaChallenge.sandboxOtp && (
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Sandbox Test OTP:</span>
                  </div>
                  <span className="font-mono font-extrabold tracking-widest text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-200 shadow-sm">
                    {mfaChallenge.sandboxOtp}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="849201"
                  className="w-full text-center tracking-[0.4em] font-mono font-extrabold text-xl py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Resend OTP in {resendTimer}s</span>
                <button
                  type="button"
                  onClick={() => setMfaChallenge(null)}
                  className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Change Account</span>
                </button>
              </div>

              {/* Blue-Green Verify Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white gradient-blue-green hover:opacity-95 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all mt-2 active:scale-[0.98]"
              >
                <span>{loading ? 'Validating Token...' : 'Verify OTP & Authorize Session'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Persona Switcher with Red, White, Orange, Blue, Green Accents */}
          <div className="mt-7 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Quick Test Roles (One-Click)
              </p>
              <span className="text-[10px] text-slate-400 font-mono">pwd: password123</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Red - Super Admin */}
              <button
                type="button"
                onClick={() => handleQuickLogin('superadmin')}
                className="p-2 rounded-xl bg-red-50/60 hover:bg-red-50 border border-red-200 text-left transition-colors"
              >
                <div className="font-bold text-red-700">Super Admin</div>
                <div className="text-[10px] text-red-600/80">Full Access</div>
              </button>

              {/* Blue - CRM Manager */}
              <button
                type="button"
                onClick={() => handleQuickLogin('manager')}
                className="p-2 rounded-xl bg-blue-50/60 hover:bg-blue-50 border border-blue-200 text-left transition-colors"
              >
                <div className="font-bold text-blue-700">CRM Manager</div>
                <div className="text-[10px] text-blue-600/80">Ops & SLA</div>
              </button>

              {/* Orange - Sales Exec */}
              <button
                type="button"
                onClick={() => handleQuickLogin('sales1')}
                className="p-2 rounded-xl bg-orange-50/60 hover:bg-orange-50 border border-orange-200 text-left transition-colors"
              >
                <div className="font-bold text-orange-700">Sales Exec</div>
                <div className="text-[10px] text-orange-600/80">Kanban Leads</div>
              </button>

              {/* Red - Support Exec */}
              <button
                type="button"
                onClick={() => handleQuickLogin('support1')}
                className="p-2 rounded-xl bg-red-50/60 hover:bg-red-50 border border-red-200 text-left transition-colors"
              >
                <div className="font-bold text-red-700">Support Exec</div>
                <div className="text-[10px] text-red-600/80">Tickets & SLA</div>
              </button>

              {/* Green - Billing Exec */}
              <button
                type="button"
                onClick={() => handleQuickLogin('billing1')}
                className="p-2 rounded-xl bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-200 text-left transition-colors"
              >
                <div className="font-bold text-emerald-700">Billing Exec</div>
                <div className="text-[10px] text-emerald-600/80">GST Invoices</div>
              </button>

              {/* Orange - Field Tech */}
              <button
                type="button"
                onClick={() => handleQuickLogin('tech1')}
                className="p-2 rounded-xl bg-orange-50/60 hover:bg-orange-50 border border-orange-200 text-left transition-colors"
              >
                <div className="font-bold text-orange-700">Field Tech</div>
                <div className="text-[10px] text-orange-600/80">Tower Visits</div>
              </button>
            </div>
          </div>
        </div>

        {/* Compliance Footer (Red, Blue, Green dots) */}
        <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-blue-600" />
            <span>256-Bit SSL/TLS</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-600" />
            <span>DoT / TRAI Compliant</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            <span>DPDPA 2023 Masked</span>
          </div>
        </div>
      </div>
    </div>
  );
};
