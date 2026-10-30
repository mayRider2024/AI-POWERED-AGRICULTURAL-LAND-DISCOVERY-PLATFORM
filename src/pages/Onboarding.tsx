import { useState, useRef, useEffect, type TouchEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Compass,
  MapPin,
  FileText,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Languages,
  Layers,
  TrendingUp,
  Map,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, type SupportedLanguageCode } from '../i18n';
import { useLocalization } from '../utils/localization';

export const ONBOARDING_STORAGE_KEY = 'landlens_onboarding_v1_completed';

interface OnboardingProps {
  onComplete?: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { t, i18n } = useTranslation();
  const { formatDigits } = useLocalization();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Swipe gesture tracking
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const currentLang = (i18n.language?.slice(0, 2) as SupportedLanguageCode) || 'en';

  const completeOnboarding = () => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    } catch {
      // ignore local storage errors
    }
    if (onComplete) {
      onComplete();
    } else {
      navigate('/auth', { replace: true });
    }
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleLanguageSelect = (code: SupportedLanguageCode) => {
    i18n.changeLanguage(code);
  };

  // Touch handlers for fluid swiping
  const handleTouchStart = (e: TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 45;

    if (diff > minSwipeDistance && currentStep < 2) {
      // Swiped left -> next
      setCurrentStep((prev) => prev + 1);
    } else if (diff < -minSwipeDistance && currentStep > 0) {
      // Swiped right -> back
      setCurrentStep((prev) => prev - 1);
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentStep < 2) {
        setCurrentStep((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        setCurrentStep((prev) => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  return (
    <div
      className="relative flex flex-col h-[100dvh] w-full bg-[#FFF3E3] text-[#25211E] overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header / App Branding & Skip */}
      <header className="safe-area-top px-5 pt-4 pb-2 flex items-center justify-between z-20">
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

        {currentStep < 2 ? (
          <button
            type="button"
            onClick={completeOnboarding}
            className="text-xs font-bold text-[#8C7A6B] hover:text-[#E86A17] px-3 py-1.5 rounded-full hover:bg-[#FFE2C4]/60 active:scale-95 transition-all"
          >
            {t('onboarding.skip')}
          </button>
        ) : (
          <div className="w-12" />
        )}
      </header>

      {/* Main Slide Carousel */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        <div
          className="flex-1 flex transition-transform duration-300 ease-out h-full"
          style={{ transform: `translateX(-${currentStep * 100}%)` }}
        >
          {/* ───────────────── SCREEN 1: Welcome & Value ───────────────── */}
          <div className="w-full shrink-0 flex flex-col justify-between px-6 py-4 overflow-y-auto">
            <div className="space-y-4 max-w-md mx-auto w-full my-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE2C4] border border-[#E86A17]/20 text-[#C54E12] text-xs font-extrabold shadow-2xs">
                <Sparkles size={13} className="text-[#E86A17]" />
                <span>{t('onboarding.screen1Badge')}</span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-[#25211E] whitespace-pre-line leading-tight">
                  {t('onboarding.screen1Title')}
                </h1>
                <p className="mt-2.5 text-xs sm:text-sm text-[#6B5E54] leading-relaxed">
                  {t('onboarding.screen1Subtitle')}
                </p>
              </div>

              {/* Farmland Visual Graphic Card */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFE8D1] via-white to-[#FFF3E3] p-4 border border-[#E0C7AD] shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0D8C0]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#287A52] animate-pulse" />
                    <span className="text-xs font-bold text-[#25211E]">
                      {t('common.subregion')}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E86A17]/10 text-[#C54E12]">
                    Raigad & Palghar
                  </span>
                </div>

                <div className="mt-3.5 space-y-2.5">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/80 border border-[#EFE0D0] shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-[#E86A17]/15 flex items-center justify-center text-[#E86A17] shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#25211E] truncate">
                        {t('onboarding.screen1Highlight1')}
                      </p>
                      <p className="text-[10px] text-[#8C7A6B]">
                        Alibag, Pen, Panvel, Palghar, Dahanu & Wada
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/80 border border-[#EFE0D0] shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-[#287A52]/15 flex items-center justify-center text-[#287A52] shrink-0">
                      <TrendingUp size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#25211E] truncate">
                        {t('onboarding.screen1Highlight2')}
                      </p>
                      <p className="text-[10px] text-[#8C7A6B]">
                        Transparent rates: ₹/Guntha & ₹/Acre side-by-side
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/80 border border-[#EFE0D0] shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-[#FF9A3C]/20 flex items-center justify-center text-[#C54E12] shrink-0">
                      <Compass size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#25211E] truncate">
                        {t('onboarding.screen1Highlight3')}
                      </p>
                      <p className="text-[10px] text-[#8C7A6B]">
                        Direct road distances & creek/river proximity indicators
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ───────────────── SCREEN 2: Discover Smarter ───────────────── */}
          <div className="w-full shrink-0 flex flex-col justify-between px-6 py-4 overflow-y-auto">
            <div className="space-y-4 max-w-md mx-auto w-full my-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE2C4] border border-[#E86A17]/20 text-[#C54E12] text-xs font-extrabold shadow-2xs">
                <Map size={13} className="text-[#E86A17]" />
                <span>{t('onboarding.screen2Badge')}</span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-[#25211E] leading-tight">
                  {t('onboarding.screen2Title')}
                </h1>
                <p className="mt-2.5 text-xs sm:text-sm text-[#6B5E54] leading-relaxed">
                  {t('onboarding.screen2Subtitle')}
                </p>
              </div>

              {/* Feature Cards Grid */}
              <div className="space-y-2.5">
                <div className="bg-white rounded-xl p-3.5 border border-[#E0C7AD] shadow-2xs flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E86A17]/10 text-[#E86A17] flex items-center justify-center shrink-0 mt-0.5">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-[#25211E]">
                      {t('onboarding.screen2Feature1Title')}
                    </h3>
                    <p className="text-[11px] text-[#6B5E54] mt-0.5 leading-normal">
                      {t('onboarding.screen2Feature1Desc')}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3.5 border border-[#E0C7AD] shadow-2xs flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#287A52]/10 text-[#287A52] flex items-center justify-center shrink-0 mt-0.5">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-[#25211E]">
                      {t('onboarding.screen2Feature2Title')}
                    </h3>
                    <p className="text-[11px] text-[#6B5E54] mt-0.5 leading-normal">
                      {t('onboarding.screen2Feature2Desc')}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3.5 border border-[#E0C7AD] shadow-2xs flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#C54E12]/10 text-[#C54E12] flex items-center justify-center shrink-0 mt-0.5">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-[#25211E]">
                      {t('onboarding.screen2Feature3Title')}
                    </h3>
                    <p className="text-[11px] text-[#6B5E54] mt-0.5 leading-normal">
                      {t('onboarding.screen2Feature3Desc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Responsible Disclaimer Box */}
              <div className="bg-[#FFE2C4]/70 border border-[#E86A17]/25 rounded-xl p-3 flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-[#C54E12] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#7A3E14] leading-relaxed">
                  <strong className="font-extrabold">Demo Notice:</strong>{' '}
                  {t('onboarding.screen2Disclaimer')}
                </p>
              </div>
            </div>
          </div>

          {/* ───────────────── SCREEN 3: Language & Get Started ───────────────── */}
          <div className="w-full shrink-0 flex flex-col justify-between px-6 py-4 overflow-y-auto">
            <div className="space-y-4 max-w-md mx-auto w-full my-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE2C4] border border-[#E86A17]/20 text-[#C54E12] text-xs font-extrabold shadow-2xs">
                <Languages size={13} className="text-[#E86A17]" />
                <span>{t('onboarding.screen3Badge')}</span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-[#25211E] whitespace-pre-line leading-tight">
                  {t('onboarding.screen3Title')}
                </h1>
                <p className="mt-2.5 text-xs sm:text-sm text-[#6B5E54] leading-relaxed">
                  {t('onboarding.screen3Subtitle')}
                </p>
              </div>

              {/* Interactive Language Selector */}
              <div className="space-y-2.5 pt-1">
                <label className="block text-xs font-extrabold text-[#25211E] tracking-tight">
                  {t('onboarding.screen3SelectLang')}
                </label>

                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = currentLang === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`w-full p-3.5 rounded-xl border flex items-center justify-between text-left transition-all active:scale-[0.99] ${
                        isSelected
                          ? 'bg-[#E86A17] text-white border-[#C54E12] shadow-sm shadow-[#E86A17]/30 ring-2 ring-[#E86A17]/30'
                          : 'bg-white hover:bg-[#FFE8D1]/60 text-[#25211E] border-[#E0C7AD] shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs uppercase ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-[#FFF3E3] text-[#C54E12]'
                          }`}
                        >
                          {lang.code}
                        </div>
                        <div>
                          <p className="font-heading font-extrabold text-sm">
                            {lang.native}
                          </p>
                          <p
                            className={`text-[10px] ${
                              isSelected ? 'text-white/80' : 'text-[#8C7A6B]'
                            }`}
                          >
                            {lang.label}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-white text-[#E86A17] border-white'
                            : 'border-[#D1BAA3] bg-transparent text-transparent'
                        }`}
                      >
                        <Check size={13} strokeWidth={3} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Ready prompt */}
              <p className="text-center text-xs font-semibold text-[#8C7A6B] pt-1">
                {t('onboarding.screen3Ready')}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Controls / Pagination Dots & Action Buttons */}
      <footer className="safe-area-bottom px-6 py-4 bg-gradient-to-t from-[#FFF3E3] via-[#FFF3E3] to-transparent z-20">
        <div className="max-w-md mx-auto space-y-4">
          {/* Progress Indicators */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((idx) => {
                const isActive = currentStep === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentStep(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-7 bg-[#E86A17]'
                        : 'w-2 bg-[#D9C4AF] hover:bg-[#B89F87]'
                    }`}
                  />
                );
              })}
            </div>

            <span className="text-[11px] font-bold text-[#8C7A6B]">
              {formatDigits(currentStep + 1)} / {formatDigits(3)}
            </span>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-3">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-3 rounded-xl bg-white border border-[#E0C7AD] text-[#25211E] font-heading font-bold text-xs flex items-center gap-1.5 shadow-2xs hover:bg-[#FFE8D1]/50 active:scale-95 transition-all"
              >
                <ChevronLeft size={16} />
                <span>{t('onboarding.back')}</span>
              </button>
            ) : null}

            {currentStep < 2 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-[#E86A17] to-[#C54E12] text-white font-heading font-black text-sm flex items-center justify-center gap-2 shadow-sm shadow-[#E86A17]/30 hover:opacity-95 active:scale-[0.98] transition-all"
              >
                <span>{t('onboarding.next')}</span>
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={completeOnboarding}
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-[#E86A17] to-[#C54E12] text-white font-heading font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-[#E86A17]/35 hover:opacity-95 active:scale-[0.98] transition-all"
              >
                <span>{t('onboarding.getStarted')}</span>
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
