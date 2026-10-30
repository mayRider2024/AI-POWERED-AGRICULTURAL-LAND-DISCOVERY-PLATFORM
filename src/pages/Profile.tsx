import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Mail,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Cloud,
  KeyRound,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Sparkles,
  Check,
  X,
  ShieldAlert,
} from 'lucide-react';
import type { UserProfile } from '../types/profile';
import { evaluatePasswordStrength } from '../utils/passwordStrength';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, profile, profileLoading, updateProfile, signOut, updatePassword, deleteAccount } = useAuth();

  const [fullName, setFullName] = useState<string>('');
  const [userRole, setUserRole] = useState<UserProfile['user_role']>('land_seeker');
  const [preferredDistrict, setPreferredDistrict] = useState<'Raigad' | 'Palghar' | ''>('');
  const [preferredLang, setPreferredLang] = useState<'en' | 'mr' | 'hi'>('en');

  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);

  // Account Security: Change Password
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

  // Account Security: Delete Account
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Sync state with cloud profile when loaded or changed
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setUserRole(profile.user_role || 'land_seeker');
      setPreferredDistrict(profile.preferred_district || '');
      setPreferredLang(profile.preferred_language || 'en');
    } else if (user) {
      const fallbackName =
        user.user_metadata?.display_name ||
        user.user_metadata?.full_name ||
        user.email?.split('@')[0] ||
        '';
      setFullName(fallbackName);
    }
  }, [profile, user]);

  const handleSave = async () => {
    setSaveError(null);
    setSaveSuccess(false);

    if (!user) {
      // Local fallback for guest
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      return;
    }

    setSaving(true);
    const { error } = await updateProfile({
      full_name: fullName.trim() || null,
      user_role: userRole,
      preferred_district: preferredDistrict ? preferredDistrict : null,
      preferred_language: preferredLang,
    });

    setSaving(false);
    if (error) {
      setSaveError(error.message || t('profile.saveError'));
    } else {
      setSaveSuccess(true);
      // If language was changed in dropdown, apply it to i18n instance
      if (preferredLang !== i18n.language) {
        i18n.changeLanguage(preferredLang);
      }
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const newStrength = evaluatePasswordStrength(newPassword);

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
    setNewPassword(generated);
    setConfirmNewPassword(generated);
    setShowNewPassword(true);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError(null);
    setPasswordChangeSuccess(false);

    if (!user || !user.email) {
      setPasswordChangeError('You must be signed in to change your password.');
      return;
    }

    if (!currentPassword) {
      setPasswordChangeError('Current password is required to verify identity.');
      return;
    }

    if (!newStrength.isStrong) {
      setPasswordChangeError(t('auth.errors.shortPassword'));
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError(t('auth.errors.passwordsDontMatch'));
      return;
    }

    setChangingPassword(true);

    try {
      // 1. Reauthenticate current user with current password
      const { error: reauthErr } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (reauthErr) {
        setPasswordChangeError('Incorrect current password.');
        setChangingPassword(false);
        return;
      }

      // 2. Update to new password
      const { error: updateErr } = await updatePassword(newPassword);
      if (updateErr) {
        setPasswordChangeError(updateErr.message);
      } else {
        setPasswordChangeSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setTimeout(() => {
          setPasswordChangeSuccess(false);
          setShowPasswordSection(false);
        }, 3000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to change password';
      setPasswordChangeError(msg);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError(null);

    if (deleteConfirmationText.trim().toUpperCase() !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm account deletion.');
      return;
    }

    setDeletingAccount(true);

    try {
      const { error } = await deleteAccount(deletePassword || undefined);
      if (error) {
        setDeleteError(error.message);
        setDeletingAccount(false);
      } else {
        setShowDeleteModal(false);
        navigate('/home', { replace: true });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Account deletion failed';
      setDeleteError(msg);
      setDeletingAccount(false);
    }
  };

  const handleSignOut = async () => {
    setLoggingOut(true);
    await signOut();
    setLoggingOut(false);
    navigate('/auth', { replace: true });
  };

  const headerDisplayName =
    fullName.trim() ||
    profile?.full_name ||
    user?.user_metadata?.display_name ||
    (user ? user.email?.split('@')[0] : 'Guest User');

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      {/* Authenticated / Account Header Card */}
      <div className="bg-white border border-[#E0C7AD] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#FFE2C4] to-[#FFF3E3] border border-[#E86A17]/25 rounded-2xl flex items-center justify-center text-[#E86A17] font-black text-2xl shadow-2xs">
            {headerDisplayName.charAt(0).toUpperCase() || <UserIcon size={24} />}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold text-[#25211E] truncate font-heading">
              {headerDisplayName}
            </h1>
            {user ? (
              <div className="flex items-center gap-1.5 text-xs text-[#6B5E54] mt-0.5 truncate">
                <Mail size={13} className="text-[#8C7A6B] shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
            ) : (
              <p className="text-xs text-[#8C7A6B]">{t('profile.demoProfile')}</p>
            )}

            <div className="mt-1.5 flex items-center gap-2">
              {user ? (
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  <ShieldCheck size={11} className="text-emerald-600" />
                  {t('profile.cloudSynced')}
                </span>
              ) : (
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium inline-block">
                  {t('profile.demoProfile')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Auth Action (Log Out or Sign In) */}
        {user ? (
          <button
            type="button"
            onClick={handleSignOut}
            disabled={loggingOut}
            className="w-full py-2.5 px-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100/70 text-red-700 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <LogOut size={14} />
            <span>{loggingOut ? t('auth.loggingOut') : t('auth.logout')}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/auth')}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#E86A17] to-[#C54E12] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-2xs hover:opacity-95 transition-all"
          >
            <LogIn size={14} />
            <span>{t('auth.login')} / {t('auth.createAccount')}</span>
          </button>
        )}
      </div>

      {/* Language Selector Card */}
      <div className="bg-white border border-[#E0C7AD] rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#25211E] text-sm flex items-center gap-2">
            <span>🌐</span> {t('profile.language')}
          </h2>
        </div>
        <LanguageSwitcher variant="inline" />
      </div>

      {/* Preferences & Profile form */}
      <div className="bg-white border border-[#E0C7AD] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[#25211E] text-sm flex items-center gap-2">
            <Cloud size={16} className="text-[#E86A17]" />
            <span>{t('profile.title')}</span>
          </h2>
          {profileLoading && (
            <span className="text-[11px] text-[#8C7A6B] flex items-center gap-1">
              <Loader2 size={12} className="animate-spin text-[#E86A17]" />
              Syncing...
            </span>
          )}
        </div>

        {/* Read-only email notice for authenticated users */}
        {user && (
          <div>
            <label className="block text-xs font-bold text-[#6B5E54] mb-1">
              {t('profile.emailLabel')}
            </label>
            <input
              type="text"
              value={user.email || ''}
              readOnly
              disabled
              className="w-full bg-[#FFF8F0] border border-[#E0C7AD] text-[#6B5E54] rounded-xl px-3 py-2 text-xs font-medium cursor-not-allowed"
            />
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-[#25211E] mb-1">
            {t('profile.displayName')}
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Mayuresh Loke"
            className="w-full border border-[#D5C2B0] rounded-xl px-3 py-2.5 text-xs text-[#25211E] bg-white focus:outline-none focus:border-[#E86A17] focus:ring-1 focus:ring-[#E86A17]"
          />
        </div>

        {/* Non-privileged role preference */}
        <div>
          <label className="block text-xs font-bold text-[#25211E] mb-1">
            {t('profile.role')}
          </label>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserProfile['user_role'])}
            className="w-full border border-[#D5C2B0] rounded-xl px-3 py-2.5 text-xs text-[#25211E] bg-white focus:outline-none focus:border-[#E86A17]"
          >
            <option value="land_seeker">{t('profile.roleLandSeeker')}</option>
            <option value="farmer">{t('profile.roleFarmer')}</option>
            <option value="investor">{t('profile.roleInvestor')}</option>
            <option value="agent">{t('profile.roleAgent')}</option>
            <option value="researcher">{t('profile.roleResearcher')}</option>
          </select>
        </div>

        {/* Preferred District */}
        <div>
          <label className="block text-xs font-bold text-[#25211E] mb-1">
            {t('profile.preferredDistrict')}
          </label>
          <select
            value={preferredDistrict}
            onChange={(e) => setPreferredDistrict(e.target.value as 'Raigad' | 'Palghar' | '')}
            className="w-full border border-[#D5C2B0] rounded-xl px-3 py-2.5 text-xs text-[#25211E] bg-white focus:outline-none focus:border-[#E86A17]"
          >
            <option value="">{t('profile.anyDistrict')}</option>
            <option value="Raigad">Raigad (रायगड)</option>
            <option value="Palghar">Palghar (पालघर)</option>
          </select>
        </div>

        {/* Save Feedback Alerts */}
        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{t('profile.savedSuccess')}</span>
          </div>
        )}

        {saveError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle size={16} className="text-red-600 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-gradient-to-r from-[#E86A17] to-[#C54E12] hover:from-[#C54E12] hover:to-[#A83E0C] text-white rounded-xl font-bold text-xs shadow-md shadow-[#E86A17]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-70"
        >
          {saving && <Loader2 size={15} className="animate-spin text-white" />}
          <span>{saving ? t('profile.saving') : t('profile.savePreferences')}</span>
        </button>
      </div>

      {/* Account Security Card (Only for authenticated users) */}
      {user && (
        <div className="bg-white border border-[#E0C7AD] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-[#25211E] text-sm flex items-center gap-2">
                <KeyRound size={16} className="text-[#E86A17]" />
                <span>{t('profile.accountSecurity')}</span>
              </h2>
              <p className="text-[11px] text-[#8C7A6B] mt-0.5">
                {t('profile.accountSecuritySub')}
              </p>
            </div>
          </div>

          {/* Change Password Toggle */}
          <div className="border border-[#E0C7AD] rounded-xl overflow-hidden bg-[#FFFBF7]">
            <button
              type="button"
              onClick={() => {
                setShowPasswordSection(!showPasswordSection);
                setPasswordChangeError(null);
                setPasswordChangeSuccess(false);
              }}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FFF3E3] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E86A17]/10 flex items-center justify-center text-[#E86A17]">
                  <Lock size={15} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#25211E]">
                    {t('profile.changePassword')}
                  </p>
                  <p className="text-[10px] text-[#8C7A6B]">
                    Update your account login password
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#E86A17]">
                {showPasswordSection ? '▲' : '▼'}
              </span>
            </button>

            {showPasswordSection && (
              <form onSubmit={handleChangePassword} className="p-4 border-t border-[#E0C7AD] space-y-3 bg-white animate-fadeIn">
                {passwordChangeSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>{t('profile.passwordChangedSuccess')}</span>
                  </div>
                )}

                {passwordChangeError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-600 shrink-0" />
                    <span>{passwordChangeError}</span>
                  </div>
                )}

                {/* Current Password Field (for reauthentication) */}
                <div>
                  <label className="block text-xs font-bold text-[#25211E] mb-1">
                    {t('profile.currentPassword')}
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="current-password"
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full border border-[#D5C2B0] rounded-xl px-3 py-2 text-xs text-[#25211E] pr-9 bg-white focus:outline-none focus:border-[#E86A17]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7A6B]"
                    >
                      {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* New Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#25211E]">
                      {t('profile.newPassword')}
                    </label>
                    <button
                      type="button"
                      onClick={handleSuggestPassword}
                      className="text-[11px] text-[#E86A17] hover:underline font-semibold flex items-center gap-1"
                    >
                      <Sparkles size={11} />
                      {t('auth.suggestStrong')}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="new-password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full border border-[#D5C2B0] rounded-xl px-3 py-2 text-xs text-[#25211E] pr-9 bg-white focus:outline-none focus:border-[#E86A17]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7A6B]"
                    >
                      {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="p-2.5 bg-[#FFF8F0] border border-[#E0C7AD] rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#6B5E54]">Strength:</span>
                      <span className="font-bold text-[10px] text-[#25211E]">
                        {t(newStrength.labelKey)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#E0C7AD]/40 rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${
                            step <= newStrength.score
                              ? newStrength.colorClass
                              : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-[#6B5E54] pt-1">
                      <span className="flex items-center gap-1">
                        {newStrength.hasMinLength ? (
                          <Check size={11} className="text-emerald-600 shrink-0" />
                        ) : (
                          <X size={11} className="text-gray-400 shrink-0" />
                        )}
                        8+ chars
                      </span>
                      <span className="flex items-center gap-1">
                        {newStrength.hasUppercase ? (
                          <Check size={11} className="text-emerald-600 shrink-0" />
                        ) : (
                          <X size={11} className="text-gray-400 shrink-0" />
                        )}
                        Uppercase
                      </span>
                      <span className="flex items-center gap-1">
                        {newStrength.hasNumber ? (
                          <Check size={11} className="text-emerald-600 shrink-0" />
                        ) : (
                          <X size={11} className="text-gray-400 shrink-0" />
                        )}
                        Number
                      </span>
                      <span className="flex items-center gap-1">
                        {newStrength.hasSpecialChar ? (
                          <Check size={11} className="text-emerald-600 shrink-0" />
                        ) : (
                          <X size={11} className="text-gray-400 shrink-0" />
                        )}
                        Symbol (!@#$)
                      </span>
                    </div>
                  </div>
                )}

                {/* Confirm New Password Field */}
                <div>
                  <label className="block text-xs font-bold text-[#25211E] mb-1">
                    {t('profile.confirmNewPassword')}
                  </label>
                  <input
                    type="password"
                    name="confirm-new-password"
                    autoComplete="new-password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full border border-[#D5C2B0] rounded-xl px-3 py-2 text-xs text-[#25211E] bg-white focus:outline-none focus:border-[#E86A17]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={changingPassword || !newStrength.isStrong || newPassword !== confirmNewPassword}
                  className="w-full py-2.5 bg-gradient-to-r from-[#E86A17] to-[#C54E12] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
                >
                  {changingPassword && <Loader2 size={13} className="animate-spin text-white" />}
                  <span>{changingPassword ? 'Updating…' : t('profile.changePassword')}</span>
                </button>
              </form>
            )}
          </div>

          {/* Danger Zone: Delete Account */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setShowDeleteModal(true);
                setDeleteError(null);
                setDeleteConfirmationText('');
                setDeletePassword('');
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-red-300 bg-red-50/50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <Trash2 size={14} className="text-red-600" />
              <span>{t('profile.deleteAccount')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-red-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <ShieldAlert size={22} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#25211E]">
                  {t('profile.deleteAccount')}
                </h3>
                <p className="text-[11px] text-red-600 font-semibold">
                  Permanent & Irreversible
                </p>
              </div>
            </div>

            <p className="text-xs text-[#6B5E54] leading-relaxed">
              {t('profile.deleteAccountWarning')}
            </p>

            {deleteError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[11px] flex items-center gap-2">
                <AlertCircle size={14} className="text-red-600 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            {/* Current Password reauthentication prompt */}
            <div>
              <label className="block text-[11px] font-bold text-[#25211E] mb-1">
                {t('profile.reauthRequired')}
              </label>
              <div className="relative">
                <input
                  type={showDeletePassword ? 'text' : 'password'}
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full border border-[#D5C2B0] rounded-xl px-3 py-2 text-xs text-[#25211E] pr-9 bg-white focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7A6B]"
                >
                  {showDeletePassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Confirm text field */}
            <div>
              <label className="block text-[11px] font-bold text-[#25211E] mb-1">
                {t('profile.deleteAccountConfirmPrompt')}
              </label>
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder="DELETE"
                className="w-full border border-red-300 rounded-xl px-3 py-2 text-xs font-mono font-bold tracking-widest text-red-600 bg-red-50/30 uppercase focus:outline-none focus:border-red-600"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingAccount}
                className="flex-1 py-2.5 rounded-xl border border-[#D5C2B0] bg-[#FFF8F0] hover:bg-[#FFE8D1] text-xs font-bold text-[#6B5E54] transition-all"
              >
                {t('profile.cancel')}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deletingAccount || deleteConfirmationText.trim().toUpperCase() !== 'DELETE'}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
              >
                {deletingAccount && <Loader2 size={13} className="animate-spin text-white" />}
                <span>{deletingAccount ? 'Deleting…' : t('profile.confirmDelete')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Navigation Shortcuts */}
      <div className="bg-white border border-[#E0C7AD] rounded-2xl p-5 shadow-xs space-y-3">
        <h2 className="font-bold text-[#25211E] text-sm">{t('profile.platformTools')}</h2>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <a
            href="/records"
            className="p-3 bg-[#FFF8F0] border border-[#E0C7AD] rounded-xl flex items-center gap-2 hover:bg-[#FFE8D1] font-semibold text-[#25211E] transition-colors"
          >
            <span>📜</span> {t('landRecords.title')}
          </a>
          <a
            href="/intelligence"
            className="p-3 bg-[#FFF8F0] border border-[#E0C7AD] rounded-xl flex items-center gap-2 hover:bg-[#FFE8D1] font-semibold text-[#25211E] transition-colors"
          >
            <span>📊</span> {t('common.intelligenceReport')}
          </a>
        </div>
      </div>

      {/* Settings & Onboarding Replay */}
      <div className="bg-white border border-[#E0C7AD] rounded-2xl p-5 shadow-xs space-y-3">
        <h2 className="font-bold text-[#25211E] text-sm flex items-center gap-2">
          <span>⚙️</span> Settings & App Guide
        </h2>
        <a
          href="/onboarding"
          className="p-3.5 bg-gradient-to-r from-[#FFF3E3] to-white border border-[#E0C7AD] rounded-xl flex items-center justify-between hover:border-[#E86A17] hover:shadow-2xs transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E86A17]/15 flex items-center justify-center text-[#E86A17]">
              ✨
            </div>
            <div>
              <p className="text-xs font-bold text-[#25211E] group-hover:text-[#E86A17] transition-colors">
                {t('onboarding.reopenTitle')}
              </p>
              <p className="text-[11px] text-[#8C7A6B]">
                {t('onboarding.reopenDesc')}
              </p>
            </div>
          </div>
          <span className="text-[#E86A17] font-bold text-sm">→</span>
        </a>
      </div>

      {/* About section with official Bhulekh disclaimer */}
      <div className="bg-[#FFF8F0] border border-[#E0C7AD] rounded-2xl p-4">
        <h3 className="font-bold text-[#4E443C] text-xs mb-1">{t('profile.aboutTitle')}</h3>
        <p className="text-[11px] text-[#6B5E54] leading-relaxed">
          {t('profile.aboutText')}{' '}
          <a
            href="https://bhulekh.mahabhumi.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold text-[#C54E12]"
          >
            bhulekh.mahabhumi.gov.in
          </a>.
        </p>
      </div>
    </div>
  );
}
