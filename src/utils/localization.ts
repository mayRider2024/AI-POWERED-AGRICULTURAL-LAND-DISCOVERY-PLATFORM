import { useTranslation } from 'react-i18next';

// Mapping for Districts
export const DISTRICT_NAMES: Record<string, { en: string; hi: string; mr: string }> = {
  Raigad: { en: 'Raigad', hi: 'रायगढ़', mr: 'रायगड' },
  Palghar: { en: 'Palghar', hi: 'पालघर', mr: 'पालघर' },
};

// Mapping for Talukas in Raigad & Palghar
export const TALUKA_NAMES: Record<string, { en: string; hi: string; mr: string }> = {
  Alibag: { en: 'Alibag', hi: 'अलीबाग', mr: 'अलिबाग' },
  Pen: { en: 'Pen', hi: 'पेण', mr: 'पेण' },
  Panvel: { en: 'Panvel', hi: 'पनवेल', mr: 'पनवेल' },
  Mhasala: { en: 'Mhasala', hi: 'म्हासला', mr: 'म्हसळा' },
  Roha: { en: 'Roha', hi: 'रोहा', mr: 'रोहा' },
  Talasari: { en: 'Talasari', hi: 'तलासरी', mr: 'तलासरी' },
  Vikramgad: { en: 'Vikramgad', hi: 'विक्रमगढ', mr: 'विक्रमगड' },
  Dahanu: { en: 'Dahanu', hi: 'दहाणू', mr: 'डहाणू' },
  Wada: { en: 'Wada', hi: 'वाडा', mr: 'वाडा' },
};

// Mapping for Villages in Demo Data
export const VILLAGE_NAMES: Record<string, { en: string; hi: string; mr: string }> = {
  Uppal: { en: 'Uppal', hi: 'उप्पल', mr: 'उप्पल' },
  Kashipur: { en: 'Kashipur', hi: 'काशीपुर', mr: 'काशीपूर' },
  Dhumal: { en: 'Dhumal', hi: 'धुमाल', mr: 'धुमाळ' },
  Nandur: { en: 'Nandur', hi: 'नांदूर', mr: 'नांदूर' },
  Kadam: { en: 'Kadam', hi: 'कदम', mr: 'कदम' },
  Murdadi: { en: 'Murdadi', hi: 'मुरदाडी', mr: 'मुरदाडी' },
  Apta: { en: 'Apta', hi: 'आपटा', mr: 'आपटा' },
  Nagothane: { en: 'Nagothane', hi: 'नागोठणे', mr: 'नागोठणे' },
};

// Mapping for Road Types
export const ROAD_TYPES: Record<string, { en: string; hi: string; mr: string }> = {
  'Paved State Highway': {
    en: 'Paved State Highway',
    hi: 'पक्की राज्य राजमार्ग सड़क',
    mr: 'डांबरी राज्य महामार्ग',
  },
  'Village Road (Tar)': {
    en: 'Village Road (Tar)',
    hi: 'डामरी ग्रामीण सड़क',
    mr: 'डांबरी ग्रामीण रस्ता',
  },
  'District Road': {
    en: 'District Road',
    hi: 'जिला सड़क',
    mr: 'जिल्हा रस्ता',
  },
  'Kaccha / Farm Track': {
    en: 'Kaccha / Farm Track',
    hi: 'कच्चा खेत मार्ग',
    mr: 'कच्चा शेत रस्ता',
  },
  'Paved Approach Road': {
    en: 'Paved Approach Road',
    hi: 'पक्की पहुंच मार्ग सड़क',
    mr: 'डांबरी पोहोच रस्ता',
  },
  'Paved Road': {
    en: 'Paved Road',
    hi: 'पक्की सड़क',
    mr: 'डांबरी रस्ता',
  },
  'Coastal Road': {
    en: 'Coastal Road',
    hi: 'तटीय मार्ग',
    mr: 'सागरी महामार्ग',
  },
  'National Highway 48 Feeder': {
    en: 'National Highway 48 Feeder',
    hi: 'राष्ट्रीय राजमार्ग 48 संपर्क मार्ग',
    mr: 'राष्ट्रीय महामार्ग ४८ जोड रस्ता',
  },
  'Road': {
    en: 'Road',
    hi: 'सड़क',
    mr: 'रस्ता',
  },
};

// Digit conversion map for Devanagari (Hindi and Marathi)
const DEVANAGARI_DIGITS: Record<string, string> = {
  '0': '०',
  '1': '१',
  '2': '२',
  '3': '३',
  '4': '४',
  '5': '५',
  '6': '६',
  '7': '७',
  '8': '८',
  '9': '९',
};

/**
 * Converts Western digits 0-9 in a string or number to Devanagari digits ०-९
 */
export function toDevanagariDigits(val: string | number): string {
  return String(val).replace(/[0-9]/g, (digit) => DEVANAGARI_DIGITS[digit] || digit);
}

/**
 * Formats a number with Indian grouping (e.g. 50,00,000) using native digits for the active language.
 * - en: 50,00,000
 * - hi / mr: ५०,००,०००
 */
export function formatLocalizedNumber(
  amount: number,
  lang: 'en' | 'hi' | 'mr',
  options?: { maximumFractionDigits?: number; minimumFractionDigits?: number }
): string {
  const formatted = amount.toLocaleString('en-IN', {
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
  });
  if (lang === 'hi' || lang === 'mr') {
    return toDevanagariDigits(formatted);
  }
  return formatted;
}

/**
 * Formats Indian Currency with symbol (e.g. ₹50,00,000 vs ₹५०,००,०००)
 */
export function formatLocalizedINR(amount: number, lang: 'en' | 'hi' | 'mr'): string {
  return `₹${formatLocalizedNumber(Math.round(amount), lang)}`;
}

/**
 * Hook providing localization helpers for locations, roads, numbers, and units.
 */
export function useLocalization() {
  const { i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) as 'en' | 'hi' | 'mr') || 'en';

  const localizeDistrict = (name: string): string => {
    return DISTRICT_NAMES[name]?.[lang] ?? name;
  };

  const localizeTaluka = (name: string): string => {
    return TALUKA_NAMES[name]?.[lang] ?? name;
  };

  const localizeVillage = (name: string): string => {
    return VILLAGE_NAMES[name]?.[lang] ?? name;
  };

  const localizeRoadType = (roadType?: string): string => {
    if (!roadType) return lang === 'hi' ? 'सड़क' : lang === 'mr' ? 'रस्ता' : 'Road';
    return ROAD_TYPES[roadType]?.[lang] ?? roadType;
  };

  const localizeLocation = (village: string, taluka: string, district: string): string => {
    const locV = localizeVillage(village);
    const locT = localizeTaluka(taluka);
    const locD = localizeDistrict(district);

    if (lang === 'hi') {
      return `${locV}, तालुका ${locT}, ${locD}`;
    }
    if (lang === 'mr') {
      return `${locV}, तालुका ${locT}, ${locD}`;
    }
    return `${village}, Taluka ${taluka}, ${district}`;
  };

  const formatNumber = (
    val: number,
    options?: { maximumFractionDigits?: number; minimumFractionDigits?: number }
  ): string => {
    return formatLocalizedNumber(val, lang, options);
  };

  const formatINRLocalized = (amount: number): string => {
    return formatLocalizedINR(amount, lang);
  };

  const formatDigits = (val: string | number): string => {
    if (lang === 'hi' || lang === 'mr') {
      return toDevanagariDigits(val);
    }
    return String(val);
  };

  const formatLakhLocalized = (amount: number): string => {
    const inLakhs = amount / 100000;
    const formattedNum = formatLocalizedNumber(inLakhs, lang, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    if (lang === 'hi') return `₹${formattedNum} लाख`;
    if (lang === 'mr') return `₹${formattedNum} लाख`;
    return `₹${formattedNum} Lakh`;
  };

  const formatCroreLocalized = (amount: number): string => {
    const inCrores = amount / 10000000;
    const formattedNum = formatLocalizedNumber(inCrores, lang, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    if (lang === 'hi') return `₹${formattedNum} करोड़`;
    if (lang === 'mr') return `₹${formattedNum} कोटी`;
    return `₹${formattedNum} Cr`;
  };

  const formatSmartPrice = (amount: number): string => {
    if (amount >= 10000000) return formatCroreLocalized(amount);
    return formatLakhLocalized(amount);
  };

  return {
    lang,
    localizeDistrict,
    localizeTaluka,
    localizeVillage,
    localizeRoadType,
    localizeLocation,
    formatNumber,
    formatINRLocalized,
    formatDigits,
    formatLakhLocalized,
    formatCroreLocalized,
    formatSmartPrice,
  };
}
