import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { evaluatePasswordStrength } from '../utils/passwordStrength';

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { updatePassword, clearPasswordRecovery } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const strength = evaluatePasswordStrength(password);

  const handleSuggestPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let generated = '';
    generated += 'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 24)];
    generated += 'abcdefghijkmnpqrstuvwxyz'[Math.floor(Math.random() * 24)];
    generated += '23456789'[Math.floor(Math.random() * 8)];
    generated += '!@#$%&*'[Math.floor(Math.random() * 7)];
    for (let i = 4; i < 14; i++) {
      generated += chars[Math.floor(Math.random() * chars.length)];
    }
    generated = generated.split('').sort(() => 0.5 - Math.random()).join('');
    setPassword(generated);
    setConfirmPassword(generated);
    setShowPassword(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!strength.isStrong) {
      setErrorMessage(t('auth.errors.shortPassword'));
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(t('auth.errors.passwordsDontMatch'));
      return;
    }

    setLoading(true);
    try {
      const { error } = await updatePassword(password);
      if (error) {
        setErrorMessage(error.message);
      } else {
        clearPasswordRecovery();
        setSuccessMessage(t('auth.passwordUpdated'));
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 1800);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update password';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#FFF3E3] flex flex-col justify-between text-[#25211E]">
      <header className="safe-area-top px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E86A17] to-[#C54E12] flex items-center justify-center text-white font-black text-lg shadow-sm shadow-[#E86A17]/25">
            L
          </div>
          <span className="font-heading font-extrabold text-base tracking-tight text-[#25211E]">
            LandLens<span className="text-[#E86A17]">AI</span>
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E0C7AD] p-6 shadow-sm space-y-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-black text-[#25211E] tracking-tight">
              {t('auth.newPasswordTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B5E54] mt-1">
              {t('auth.newPasswordSubtitle')}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#25211E]">
                  {t('auth.newPasswordLabel')} *
                </label>
                <button
                  type="button"
                  onClick={handleSuggestPassword}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C54E12] hover:text-[#E86A17]"
                >
                  <Sparkles size={12} className="text-[#E86A17]" />
                  <span>{t('auth.suggestStrong')}</span>
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C7A6B]">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#D1BAA3] focus:border-[#E86A17] focus:ring-1 focus:ring-[#E86A17] outline-none text-sm bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8C7A6B] hover:text-[#25211E]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Live Strength Meter */}
              {password.length > 0 && (
                <div className="p-3 rounded-xl bg-[#FFF3E3] border border-[#E0C7AD] space-y-2.5">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px]">
                    <div
                      className={`flex items-center gap-1.5 ${
                        strength.hasMinLength ? 'text-emerald-800 font-bold' : 'text-[#8C7A6B]'
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
                      className={`flex items-center gap-1.5 ${
                        strength.hasUppercase ? 'text-emerald-800 font-bold' : 'text-[#8C7A6B]'
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
                      className={`flex items-center gap-1.5 ${
                        strength.hasNumber ? 'text-emerald-800 font-bold' : 'text-[#8C7A6B]'
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
                      className={`flex items-center gap-1.5 ${
                        strength.hasSpecialChar ? 'text-emerald-800 font-bold' : 'text-[#8C7A6B]'
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
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D1BAA3] focus:border-[#E86A17] focus:ring-1 focus:ring-[#E86A17] outline-none text-sm bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#E86A17] to-[#C54E12] text-white font-heading font-black text-sm flex items-center justify-center gap-2 shadow-sm shadow-[#E86A17]/30 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  <span>{t('auth.saveNewPassword')}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="text-xs font-semibold text-[#8C7A6B] hover:text-[#25211E] underline"
            >
              ← {t('common.home')}
            </button>
          </div>
        </div>
      </main>

      <footer className="safe-area-bottom py-3 text-center text-[11px] text-[#8C7A6B]">
        Secured with Supabase Authentication · LandLens AI
      </footer>
    </div>
  );
}
