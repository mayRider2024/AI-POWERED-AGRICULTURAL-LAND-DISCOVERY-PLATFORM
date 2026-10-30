import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { evaluatePasswordStrength } from '../utils/passwordStrength';

type AuthMode = 'login' | 'signup' | 'forgot_password';

export default function Auth() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    signIn,
    signUp,
    resetPasswordForEmail,
    isConfigured,
    emailVerifiedNotification,
    clearEmailVerified,
    user,
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Field-specific validation errors for instant feedback
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    displayName?: string;
  }>({});

  // RFC 5322 standard email validation regex
  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  // Dynamic password strength evaluation
  const strength = evaluatePasswordStrength(password);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/home';

  // Automatically trigger the verification modal & switch mode when deep link or confirmation arrives
  useEffect(() => {
    if (emailVerifiedNotification) {
      setShowVerifiedModal(true);
      setMode('login');
      setSuccessMessage(t('auth.emailVerifiedMessage'));
      setErrorMessage(null);
    }
  }, [emailVerifiedNotification, t]);

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setShowPassword(false);
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});
  };

  const resetFormState = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});
  };

  const validateForm = (): boolean => {
    const errors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
      displayName?: string;
    } = {};

    const cleanEmail = email.trim();

    // 1. Strict Email Check
    if (!cleanEmail) {
      errors.email = t('auth.errors.emailRequired');
    } else if (!EMAIL_REGEX.test(cleanEmail)) {
      errors.email = t('auth.errors.invalidEmail');
    }

    if (mode === 'signup') {
      // 2. Full Name check on Signup
      if (!displayName.trim()) {
        errors.displayName = t('auth.errors.nameRequired');
      }

      // 3. Strict Password checks on Signup (requires all 4 criteria)
      if (!password) {
        errors.password = t('auth.errors.passwordRequired');
      } else if (!strength.isStrong) {
        errors.password = t('auth.errors.shortPassword');
      }

      // 4. Confirm Password match
      if (!confirmPassword) {
        errors.confirmPassword = t('auth.errors.passwordRequired');
      } else if (password !== confirmPassword) {
        errors.confirmPassword = t('auth.errors.passwordsDontMatch');
      }
    } else if (mode === 'login') {
      // 5. Login password check
      if (!password) {
        errors.password = t('auth.errors.passwordRequired');
      } else if (password.length < 6) {
        errors.password = t('auth.errors.loginShortPassword');
      }
    }

    setFieldErrors(errors);

    // If any error exists, set primary banner error to the first error message
    const errorList = Object.values(errors);
    if (errorList.length > 0) {
      setErrorMessage(errorList[0]);
      return false;
    }

    return true;
  };

  const handleSuggestPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let generated = '';
    // Guarantee at least 1 uppercase, 1 lowercase, 1 digit, 1 special
    generated += 'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 24)];
    generated += 'abcdefghijkmnpqrstuvwxyz'[Math.floor(Math.random() * 24)];
    generated += '23456789'[Math.floor(Math.random() * 8)];
    generated += '!@#$%&*'[Math.floor(Math.random() * 7)];
    for (let i = 4; i < 14; i++) {
      generated += chars[Math.floor(Math.random() * chars.length)];
    }
    // Shuffle
    generated = generated.split('').sort(() => 0.5 - Math.random()).join('');
    setPassword(generated);
    setConfirmPassword(generated);
    setShowPassword(true);
    setFieldErrors((prev) => ({ ...prev, password: undefined, confirmPassword: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          setErrorMessage(error.message);
        } else {
          navigate(from, { replace: true });
        }
      } else if (mode === 'signup') {
        const { error, user } = await signUp(email.trim(), password, displayName.trim());
        if (error) {
          setErrorMessage(error.message);
        } else {
          // If Supabase has email confirmation enabled, user identity has no session yet
          if (user && !user.confirmed_at) {
            setSuccessMessage(t('auth.signupSuccessCheckEmail'));
          } else {
            navigate(from, { replace: true });
          }
        }
      } else if (mode === 'forgot_password') {
        const { error } = await resetPasswordForEmail(email.trim());
        if (error) {
          // If rate limit error or network error, inform user
          if (error.message?.toLowerCase().includes('rate') || error.status === 429) {
            setErrorMessage(error.message);
          } else {
            // Generalize failure to avoid account enumeration
            setSuccessMessage(t('auth.resetPasswordSuccess'));
          }
        } else {
          setSuccessMessage(t('auth.resetPasswordSuccess'));
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#FFF3E3] flex flex-col justify-between text-[#25211E]">
      {/* Top Bar with Branding & Language Switcher */}
      <header className="safe-area-top px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E86A17] to-[#C54E12] flex items-center justify-center text-white font-black text-lg shadow-sm shadow-[#E86A17]/25">
            L
          </div>
          <div>
            <span className="font-heading font-extrabold text-base tracking-tight text-[#25211E]">
              LandLens<span className="text-[#E86A17]">AI</span>
            </span>
            <span className="block text-[10px] text-[#8C7A6B] font-semibold tracking-wider uppercase">
              Maharashtra Farmlands
            </span>
          </div>
        </div>

        <LanguageSwitcher variant="header" />
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E0C7AD] p-6 shadow-sm space-y-5">
          {/* Unconfigured Supabase Banner if anon key missing */}
          {!isConfigured && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5">
              <ShieldAlert size={18} className="text-amber-700 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <p className="font-bold">Supabase Config Required</p>
                <p className="mt-0.5">{t('auth.unconfiguredNotice')}</p>
              </div>
            </div>
          )}

          {/* Title & Mode switch */}
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-black text-[#25211E] tracking-tight">
              {mode === 'login' && t('auth.signInToAccount')}
              {mode === 'signup' && t('auth.createAccount')}
              {mode === 'forgot_password' && t('auth.forgotPasswordTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B5E54] mt-1">
              {mode === 'login' && t('auth.loginSubtitle')}
              {mode === 'signup' && t('auth.signupSubtitle')}
              {mode === 'forgot_password' && t('auth.forgotPasswordSubtitle')}
            </p>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-fadeIn">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'signup' && (
              <div>
                <label className="block font-bold text-[#25211E] mb-1">
                  {t('auth.nameLabel')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C7A6B]">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      if (fieldErrors.displayName) {
                        setFieldErrors((prev) => ({ ...prev, displayName: undefined }));
                      }
                    }}
                    placeholder={t('auth.namePlaceholder')}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border outline-none text-sm bg-white transition-all ${
                      fieldErrors.displayName
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-[#D1BAA3] focus:border-[#E86A17] focus:ring-1 focus:ring-[#E86A17]'
                    }`}
                  />
                </div>
                {fieldErrors.displayName && (
                  <p className="mt-1 text-[11px] font-bold text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{fieldErrors.displayName}</span>
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block font-bold text-[#25211E] mb-1">
                {t('auth.emailLabel')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C7A6B]">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) {
                      setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  placeholder={t('auth.emailPlaceholder')}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border outline-none text-sm bg-white transition-all ${
                    fieldErrors.email
                      ? 'border-red-500 ring-1 ring-red-500'
                      : 'border-[#D1BAA3] focus:border-[#E86A17] focus:ring-1 focus:ring-[#E86A17]'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-[11px] font-bold text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{fieldErrors.email}</span>
                </p>
              )}
            </div>

            {mode !== 'forgot_password' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#25211E]">
                    {t('auth.passwordLabel')} *
                  </label>
                  {mode === 'login' ? (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot_password')}
                      className="text-[11px] font-bold text-[#E86A17] hover:underline"
                    >
                      {t('auth.forgotPassword')}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSuggestPassword}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C54E12] hover:text-[#E86A17]"
                    >
                      <Sparkles size={12} className="text-[#E86A17]" />
                      <span>{t('auth.suggestStrong')}</span>
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C7A6B]">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) {
                        setFieldErrors((prev) => ({ ...prev, password: undefined }));
                      }
                    }}
                    placeholder={t('auth.passwordPlaceholder')}
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl border outline-none text-sm bg-white transition-all ${
                      fieldErrors.password
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-[#D1BAA3] focus:border-[#E86A17] focus:ring-1 focus:ring-[#E86A17]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8C7A6B] hover:text-[#25211E]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{fieldErrors.password}</span>
                  </p>
                )}

                {/* Live Password Strength Meter & Checklist (Only in signup mode when user types) */}
                {mode === 'signup' && password.length > 0 && (
                  <div className="p-3 rounded-xl bg-[#FFF3E3] border border-[#E0C7AD] space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#25211E]">
                        {t('auth.strengthLabel')}:
                      </span>
                      <span
                        className={`font-black uppercase tracking-wider ${
                          strength.score <= 1
                            ? 'text-red-600'
                            : strength.score <= 3
                            ? 'text-amber-600'
                            : 'text-emerald-700'
                        }`}
                      >
                        {t(strength.labelKey)}
                      </span>
                    </div>

                    {/* Progress Bar Segments */}
                    <div className="grid grid-cols-4 gap-1.5 h-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`rounded-full transition-all duration-300 ${
                            strength.score >= step
                              ? strength.colorClass
                              : 'bg-[#E5D2BF]'
                          }`}
                        />
                      ))}
                    </div>

                    {/* 4 Interactive Rules Checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px]">
                      <div
                        className={`flex items-center gap-1.5 transition-colors ${
                          strength.hasMinLength
                            ? 'text-emerald-800 font-bold'
                            : 'text-[#8C7A6B]'
                        }`}
                      >
                        {strength.hasMinLength ? (
                          <Check size={13} className="text-emerald-600 shrink-0" strokeWidth={3} />
                        ) : (
                          <X size={13} className="text-gray-400 shrink-0" strokeWidth={2} />
                        )}
                        <span>{t('auth.ruleMinLength')}</span>
                      </div>

                      <div
                        className={`flex items-center gap-1.5 transition-colors ${
                          strength.hasUppercase
                            ? 'text-emerald-800 font-bold'
                            : 'text-[#8C7A6B]'
                        }`}
                      >
                        {strength.hasUppercase ? (
                          <Check size={13} className="text-emerald-600 shrink-0" strokeWidth={3} />
                        ) : (
                          <X size={13} className="text-gray-400 shrink-0" strokeWidth={2} />
                        )}
                        <span>{t('auth.ruleUppercase')}</span>
                      </div>

                      <div
                        className={`flex items-center gap-1.5 transition-colors ${
                          strength.hasNumber
                            ? 'text-emerald-800 font-bold'
                            : 'text-[#8C7A6B]'
                        }`}
                      >
                        {strength.hasNumber ? (
                          <Check size={13} className="text-emerald-600 shrink-0" strokeWidth={3} />
                        ) : (
                          <X size={13} className="text-gray-400 shrink-0" strokeWidth={2} />
                        )}
                        <span>{t('auth.ruleNumber')}</span>
                      </div>

                      <div
                        className={`flex items-center gap-1.5 transition-colors ${
                          strength.hasSpecialChar
                            ? 'text-emerald-800 font-bold'
                            : 'text-[#8C7A6B]'
                        }`}
                      >
                        {strength.hasSpecialChar ? (
                          <Check size={13} className="text-emerald-600 shrink-0" strokeWidth={3} />
                        ) : (
                          <X size={13} className="text-gray-400 shrink-0" strokeWidth={2} />
                        )}
                        <span>{t('auth.ruleSpecial')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block font-bold text-[#25211E] mb-1">
                  {t('auth.confirmPasswordLabel')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C7A6B]">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (fieldErrors.confirmPassword) {
                        setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                      }
                    }}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border outline-none text-sm bg-white transition-all ${
                      fieldErrors.confirmPassword
                        ? 'border-red-500 ring-1 ring-red-500'
                        : 'border-[#D1BAA3] focus:border-[#E86A17] focus:ring-1 focus:ring-[#E86A17]'
                    }`}
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-[11px] font-bold text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{fieldErrors.confirmPassword}</span>
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#E86A17] to-[#C54E12] text-white font-heading font-black text-sm flex items-center justify-center gap-2 shadow-sm shadow-[#E86A17]/30 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Loading…</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'login' && t('auth.login')}
                    {mode === 'signup' && t('auth.createAccount')}
                    {mode === 'forgot_password' && t('auth.sendResetLink')}
                  </span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Toggle between login / signup / back */}
          <div className="pt-2 border-t border-[#F0D8C0] text-center text-xs">
            {mode === 'login' && (
              <p className="text-[#6B5E54]">
                {t('auth.dontHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="font-bold text-[#E86A17] hover:underline"
                >
                  {t('auth.createAccount')}
                </button>
              </p>
            )}

            {mode === 'signup' && (
              <p className="text-[#6B5E54]">
                {t('auth.alreadyHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-bold text-[#E86A17] hover:underline"
                >
                  {t('auth.login')}
                </button>
              </p>
            )}

            {mode === 'forgot_password' && (
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="font-bold text-[#E86A17] hover:underline"
              >
                ← {t('auth.backToLogin')}
              </button>
            )}
          </div>

          {/* Continue as Guest link */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="text-xs font-semibold text-[#8C7A6B] hover:text-[#25211E] underline"
            >
              {t('auth.continueAsGuest')} →
            </button>
          </div>
        </div>
      </main>

      {/* Email Verified Popup Modal */}
      {showVerifiedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-[#E0C7AD] p-6 shadow-2xl text-center space-y-4 animate-scaleUp">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg font-heading font-black text-[#25211E]">
                {t('auth.emailVerifiedTitle')}
              </h2>
              <p className="text-xs text-[#6B5E54] leading-relaxed">
                {t('auth.emailVerifiedMessage')}
              </p>
            </div>

            <div className="pt-2 space-y-2">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowVerifiedModal(false);
                    clearEmailVerified();
                    navigate(from, { replace: true });
                  }}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#E86A17] to-[#C54E12] hover:from-[#C54E12] hover:to-[#A83E0C] shadow-md shadow-[#E86A17]/25 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                >
                  <span>{t('auth.enterApp')}</span>
                  <ArrowRight size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowVerifiedModal(false);
                    clearEmailVerified();
                    switchMode('login');
                  }}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#E86A17] to-[#C54E12] hover:from-[#C54E12] hover:to-[#A83E0C] shadow-md shadow-[#E86A17]/25 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                >
                  <span>{t('auth.proceedToLogin')}</span>
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="safe-area-bottom py-3 text-center text-[11px] text-[#8C7A6B]">
        Secured with Supabase Authentication · LandLens AI
      </footer>
    </div>
  );
}
