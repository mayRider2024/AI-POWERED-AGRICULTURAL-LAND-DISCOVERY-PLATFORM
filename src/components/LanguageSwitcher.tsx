import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES, type SupportedLanguageCode } from '../i18n';

export interface LanguageSwitcherProps {
  variant?: 'header' | 'inline' | 'dropdown';
  className?: string;
}

export function LanguageSwitcher({ variant = 'header', className = '' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = (i18n.language?.slice(0, 2) as SupportedLanguageCode) || 'en';

  const handleSelectLanguage = (code: SupportedLanguageCode) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-1.5 p-1 bg-white border border-[#E0C7AD] rounded-xl shadow-2xs ${className}`}>
        {SUPPORTED_LANGUAGES.map((l) => {
          const isActive = currentLang === l.code;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => handleSelectLanguage(l.code)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                isActive
                  ? 'bg-[#E86A17] text-white shadow-2xs'
                  : 'text-[#6B5E54] hover:text-[#25211E] hover:bg-[#FFE8D1]/50'
              }`}
            >
              {l.native}
            </button>
          );
        })}
      </div>
    );
  }

  // Header compact pill / modal selector
  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 border border-white/25 shadow-2xs"
        aria-label="Change language"
      >
        <Globe size={14} className="text-white" />
        <span className="uppercase text-[11px] tracking-wide">
          {SUPPORTED_LANGUAGES.find((l) => l.code === currentLang)?.native || 'EN'}
        </span>
      </button>

      {/* Popover / Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-[#FFFDFB] border border-[#EAD2B8] shadow-lg z-50 overflow-hidden py-1">
            <div className="px-3 py-1.5 border-b border-[#F2DCC4] text-[10px] font-bold text-[#8C7A6B] uppercase tracking-wider">
              Select Language / भाषा
            </div>
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-[#FFE8D1] text-[#C54E12]'
                      : 'text-[#25211E] hover:bg-[#FFF3E3]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-heading">{lang.native}</span>
                    <span className="text-[10px] text-[#8C7A6B] font-normal">{lang.label}</span>
                  </div>
                  {isSelected && <Check size={14} strokeWidth={2.5} className="text-[#E86A17]" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default LanguageSwitcher;
