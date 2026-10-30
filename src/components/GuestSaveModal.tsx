import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, LogIn, ArrowRight, X } from 'lucide-react';
import { useSaved } from '../context/SavedPropertiesContext';

export default function GuestSaveModal() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { guestPromptModalOpen, setGuestPromptModalOpen, pendingGuestPropertyId } = useSaved();

  if (!guestPromptModalOpen) return null;

  const handleSignIn = () => {
    setGuestPromptModalOpen(false);
    navigate('/auth', {
      state: {
        from: pendingGuestPropertyId ? `/property/${pendingGuestPropertyId}` : '/saved',
      },
    });
  };

  const handleDismiss = () => {
    setGuestPromptModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-[#E0C7AD] p-6 shadow-2xl space-y-4 relative animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-[#8C7A6B] hover:text-[#25211E] p-1 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header Icon */}
        <div className="w-13 h-13 mx-auto rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 shadow-inner">
          <Heart size={26} className="fill-rose-500" />
        </div>

        {/* Text */}
        <div className="text-center space-y-1.5">
          <h3 className="text-lg font-heading font-black text-[#25211E]">
            {t('savedPage.guestModalTitle')}
          </h3>
          <p className="text-xs text-[#6B5E54] leading-relaxed">
            {t('savedPage.guestModalMessage')}
          </p>
        </div>

        {/* Buttons */}
        <div className="pt-2 space-y-2">
          <button
            onClick={handleSignIn}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#E86A17] to-[#C54E12] hover:from-[#C54E12] hover:to-[#A83E0C] shadow-md shadow-[#E86A17]/25 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
          >
            <LogIn size={15} />
            <span>{t('auth.login')} / {t('auth.createAccount')}</span>
            <ArrowRight size={14} />
          </button>

          <button
            onClick={handleDismiss}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-[#6B5E54] hover:bg-[#FFF3E3] transition-colors"
          >
            {t('savedPage.continueBrowsing')}
          </button>
        </div>
      </div>
    </div>
  );
}
