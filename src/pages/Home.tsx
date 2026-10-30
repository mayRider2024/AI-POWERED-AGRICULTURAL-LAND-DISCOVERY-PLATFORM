import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Sparkles,
  ArrowRight,
  Heart,
  ChevronRight,
  SlidersHorizontal,
  X,
  FileText,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { properties } from '../data/properties';
import { useSaved } from '../context/SavedPropertiesContext';
import { useLocalization } from '../utils/localization';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { savedIds, toggleSave } = useSaved();
  const {
    localizeDistrict,
    localizeTaluka,
    localizeLocation,
    localizeRoadType,
    formatSmartPrice,
    formatDigits,
    formatNumber,
    formatINRLocalized,
  } = useLocalization();

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<'All' | 'Raigad' | 'Palghar'>('All');
  const [selectedBudget, setSelectedBudget] = useState<'all' | 'under50l' | 'under1cr' | 'above1cr'>('all');
  const [selectedAcreage, setSelectedAcreage] = useState<'all' | 'small' | 'medium' | 'large'>('all');

  // Filter computation
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // District filter
      if (selectedDistrict !== 'All' && p.district !== selectedDistrict) return false;

      // Budget filter
      if (selectedBudget === 'under50l' && p.totalPrice > 5000000) return false;
      if (selectedBudget === 'under1cr' && p.totalPrice > 10000000) return false;
      if (selectedBudget === 'above1cr' && p.totalPrice <= 10000000) return false;

      // Acreage filter
      if (selectedAcreage === 'small' && p.areaAcres > 2.0) return false;
      if (selectedAcreage === 'medium' && (p.areaAcres <= 2.0 || p.areaAcres > 5.0)) return false;
      if (selectedAcreage === 'large' && p.areaAcres <= 5.0) return false;

      // Search keyword filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.surveyNumber.toLowerCase().includes(q) ||
          p.taluka.toLowerCase().includes(q) ||
          p.village.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [selectedDistrict, selectedBudget, selectedAcreage, searchQuery]);

  const raigadCount = properties.filter((p) => p.district === 'Raigad').length;
  const palgharCount = properties.filter((p) => p.district === 'Palghar').length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      navigate('/explore');
      return;
    }
    const lower = searchQuery.toLowerCase();
    if (
      lower.includes('show') ||
      lower.includes('find') ||
      lower.includes('दाखवा') ||
      lower.includes('शेती') ||
      lower.includes('under') ||
      lower.includes('between')
    ) {
      navigate('/assistant', { state: { prefill: searchQuery } });
    } else {
      navigate('/explore');
    }
  };

  const hasActiveFilters =
    selectedDistrict !== 'All' || selectedBudget !== 'all' || selectedAcreage !== 'all' || searchQuery.trim().length > 0;

  const clearAllFilters = () => {
    setSelectedDistrict('All');
    setSelectedBudget('all');
    setSelectedAcreage('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-full w-full bg-[#FFF3E3] text-[#25211E] pb-24 select-none">
      {/* ──────────────────────────────────────────
          1. Rich Saffron & Marigold Branded Header
      ────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-[#C54E12] via-[#E86A17] to-[#FF9A3C] text-white safe-area-top shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Custom Saffron Diamond Brand Symbol */}
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center font-extrabold text-sm text-white shadow-inner tracking-tight">
              <span>LL</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-base tracking-tight text-white leading-none">
                  {t('common.appName')}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-black/20 text-orange-100 uppercase tracking-wider">
                  {t('common.appTagline')}
                </span>
              </div>
              <p className="text-[11px] font-medium text-orange-100/90 leading-tight mt-0.5">
                {t('common.subregion')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Switcher Button */}
            <LanguageSwitcher variant="header" />

            <button
              onClick={() => navigate('/explore')}
              className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 border border-white/20"
              title={t('common.map')}
            >
              <Compass size={14} />
              <span className="hidden sm:inline">{t('common.map')}</span>
            </button>
            <button
              onClick={() => navigate('/saved')}
              className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white relative active:scale-95 transition-all shadow-xs"
              title={t('common.saved')}
              aria-label={t('common.saved')}
            >
              <Heart
                size={17}
                strokeWidth={2.2}
                className={savedIds.length > 0 ? 'text-white fill-white' : 'text-white'}
              />
              {savedIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#25211E] text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  {formatDigits(savedIds.length)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-4 space-y-5">
        {/* ──────────────────────────────────────────
            2. Warm Saffron Hero & Primary Search Experience
        ────────────────────────────────────────── */}
        <div className="rounded-2xl bg-gradient-to-b from-[#FFE8D1] to-[#FFE2C4] border border-[#F2C99F] p-4 sm:p-5 shadow-sm space-y-3.5 relative overflow-hidden">
          {/* Subtle warm sunbeam accent */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF9A3C]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-1">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E86A17]/10 text-[#C54E12] text-[11px] font-bold uppercase tracking-wider">
              <span>🌾</span> {t('home.bannerSub')}
            </div>
            {/* CORRECTED HEADLINE PER USER INSTRUCTION */}
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#25211E] tracking-tight leading-snug">
              {t('home.headline')}
            </h1>
            <p className="text-xs sm:text-sm text-[#4E443C] font-normal leading-relaxed">
              {t('home.subheadline')}
            </p>
          </div>

          {/* Prominent High-Contrast Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative z-10 flex items-center bg-white rounded-xl border border-[#E0BC95] shadow-xs focus-within:border-[#E86A17] focus-within:ring-2 focus-within:ring-[#E86A17]/20 transition-all p-1.5 pl-3.5"
          >
            <Search size={18} strokeWidth={2.2} className="text-[#E86A17] mr-2.5 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('home.searchPlaceholder')}
              className="w-full bg-transparent text-sm text-[#25211E] placeholder:text-stone-400 outline-none font-medium py-1"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-stone-400 hover:text-stone-600 mr-1"
              >
                <X size={15} />
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-[#E86A17] hover:bg-[#C54E12] text-white rounded-lg text-xs font-bold transition-all active:scale-95 shadow-xs flex-shrink-0"
            >
              {t('common.search')}
            </button>
          </form>

          {/* Compact AI Discovery Shortcut with Marigold Accent */}
          <button
            onClick={() => navigate('/assistant')}
            className="w-full bg-[#FFFDFB] hover:bg-white border border-[#EAC49D] rounded-xl px-3.5 py-2.5 flex items-center justify-between transition-all active:scale-[0.99] text-left shadow-2xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-md bg-[#FFE8D1] text-[#E86A17] flex items-center justify-center flex-shrink-0">
                <Sparkles size={14} strokeWidth={2.4} />
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-[#25211E]">
                  {t('home.aiShortcutTitle')}
                </span>
                <span className="text-xs text-[#6B5E54] ml-1.5 hidden sm:inline font-normal">
                  {t('home.aiShortcutSub')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#E86A17] flex-shrink-0">
              <span>{t('home.askAi')}</span>
              <ArrowRight size={13} strokeWidth={2.5} />
            </div>
          </button>
        </div>

        {/* ──────────────────────────────────────────
            3. Maharashtra Regional District Discovery
        ────────────────────────────────────────── */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider">
              {t('home.browseDistrict')}
            </h2>
            <button
              onClick={() => navigate('/explore')}
              className="text-xs font-bold text-[#C54E12] hover:text-[#E86A17] flex items-center gap-0.5"
            >
              <span>{t('home.exploreMap')}</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Raigad Tile */}
            <div
              onClick={() => setSelectedDistrict(selectedDistrict === 'Raigad' ? 'All' : 'Raigad')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedDistrict === 'Raigad'
                  ? 'bg-gradient-to-br from-[#C54E12] to-[#E86A17] border-[#C54E12] text-white shadow-sm ring-2 ring-[#FF9A3C]'
                  : 'bg-white border-[#EAD2B8] hover:border-[#E86A17] text-[#25211E] shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-amber-500">🚩</span>
                    <h3 className="font-heading font-extrabold text-sm tracking-tight">{localizeDistrict('Raigad')}</h3>
                  </div>
                  <p className={`text-[11px] mt-0.5 ${selectedDistrict === 'Raigad' ? 'text-orange-100' : 'text-[#6B5E54]'}`}>
                    {localizeTaluka('Alibag')}, {localizeTaluka('Pen')}, {localizeTaluka('Panvel')}, {localizeTaluka('Mhasala')}
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedDistrict === 'Raigad' ? 'bg-white/20 text-white' : 'bg-[#FFE8D1] text-[#C54E12]'
                  }`}
                >
                  {formatDigits(raigadCount)}
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[11px] font-bold">
                <span className={selectedDistrict === 'Raigad' ? 'text-amber-200' : 'text-[#E86A17]'}>
                  {selectedDistrict === 'Raigad' ? `✓ ${t('home.selected')}` : t('home.filterDistrict')}
                </span>
                <ChevronRight size={13} className={selectedDistrict === 'Raigad' ? 'text-orange-200' : 'text-[#A08E7F]'} />
              </div>
            </div>

            {/* Palghar Tile */}
            <div
              onClick={() => setSelectedDistrict(selectedDistrict === 'Palghar' ? 'All' : 'Palghar')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedDistrict === 'Palghar'
                  ? 'bg-gradient-to-br from-[#C54E12] to-[#E86A17] border-[#C54E12] text-white shadow-sm ring-2 ring-[#FF9A3C]'
                  : 'bg-white border-[#EAD2B8] hover:border-[#E86A17] text-[#25211E] shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-amber-500">🚩</span>
                    <h3 className="font-heading font-extrabold text-sm tracking-tight">{localizeDistrict('Palghar')}</h3>
                  </div>
                  <p className={`text-[11px] mt-0.5 ${selectedDistrict === 'Palghar' ? 'text-orange-100' : 'text-[#6B5E54]'}`}>
                    {localizeTaluka('Talasari')}, {localizeTaluka('Vikramgad')}, {localizeTaluka('Dahanu')}
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedDistrict === 'Palghar' ? 'bg-white/20 text-white' : 'bg-[#FFE8D1] text-[#C54E12]'
                  }`}
                >
                  {formatDigits(palgharCount)}
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[11px] font-bold">
                <span className={selectedDistrict === 'Palghar' ? 'text-amber-200' : 'text-[#E86A17]'}>
                  {selectedDistrict === 'Palghar' ? `✓ ${t('home.selected')}` : t('home.filterDistrict')}
                </span>
                <ChevronRight size={13} className={selectedDistrict === 'Palghar' ? 'text-orange-200' : 'text-[#A08E7F]'} />
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────
            4. Refined Saffron/Peach Filter Row
        ────────────────────────────────────────── */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#8C7A6B] uppercase tracking-wider">
              <SlidersHorizontal size={13} strokeWidth={2.4} className="text-[#E86A17]" />
              <span>{t('home.filterProperties')}</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#C54E12] hover:text-[#E86A17] font-bold underline"
              >
                {t('home.resetAll')}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {/* District Segment Selector */}
            <div className="flex items-center gap-1 bg-white border border-[#E0C7AD] rounded-lg p-0.5 shadow-2xs">
              {(['All', 'Raigad', 'Palghar'] as const).map((dist) => (
                <button
                  key={dist}
                  onClick={() => setSelectedDistrict(dist)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                    selectedDistrict === dist
                      ? 'bg-[#E86A17] text-white shadow-2xs'
                      : 'text-[#6B5E54] hover:text-[#25211E]'
                  }`}
                >
                  {dist === 'All' ? t('common.all') : localizeDistrict(dist)}
                </button>
              ))}
            </div>

            {/* Budget Chip Dropdown */}
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value as any)}
              className={`text-xs font-bold py-1.5 px-2.5 rounded-lg border outline-none bg-white transition-all shadow-2xs ${
                selectedBudget !== 'all'
                  ? 'border-[#E86A17] text-[#C54E12] bg-[#FFE8D1]'
                  : 'border-[#E0C7AD] text-[#4E443C]'
              }`}
            >
              <option value="all">{t('home.budgetAny')}</option>
              <option value="under50l">{t('home.budgetUnder50L')}</option>
              <option value="under1cr">{t('home.budgetUnder1Cr')}</option>
              <option value="above1cr">{t('home.budgetAbove1Cr')}</option>
            </select>

            {/* Acreage Chip Dropdown */}
            <select
              value={selectedAcreage}
              onChange={(e) => setSelectedAcreage(e.target.value as any)}
              className={`text-xs font-bold py-1.5 px-2.5 rounded-lg border outline-none bg-white transition-all shadow-2xs ${
                selectedAcreage !== 'all'
                  ? 'border-[#E86A17] text-[#C54E12] bg-[#FFE8D1]'
                  : 'border-[#E0C7AD] text-[#4E443C]'
              }`}
            >
              <option value="all">{t('home.acreageAny')}</option>
              <option value="small">{t('home.acreageSmall')}</option>
              <option value="medium">{t('home.acreageMedium')}</option>
              <option value="large">{t('home.acreageLarge')}</option>
            </select>
          </div>
        </section>

        {/* ──────────────────────────────────────────
            5. Featured Properties (Full-Width Saffron-Accented Cards)
        ────────────────────────────────────────── */}
        <section className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-heading text-[#25211E] tracking-tight">
                {t('home.featuredTitle')}
              </h2>
              <p className="text-xs text-[#6B5E54] font-normal">
                {t('home.featuredSub')}
              </p>
            </div>
            <span className="text-xs font-bold text-[#C54E12] bg-[#FFE8D1] px-2.5 py-0.5 rounded-full border border-[#F2C99F]">
              {t('home.listingsCount', { count: formatDigits(filteredProperties.length) })}
            </span>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="bg-white border border-[#E0C7AD] rounded-2xl p-8 text-center space-y-2 shadow-2xs">
              <p className="text-sm font-bold text-[#25211E]">{t('home.noMatchTitle')}</p>
              <p className="text-xs text-[#6B5E54] max-w-sm mx-auto">
                {t('home.noMatchSub')}
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-2 px-4 py-1.5 bg-[#E86A17] text-white rounded-lg text-xs font-bold hover:bg-[#C54E12] transition-all"
              >
                {t('home.clearFilters')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProperties.map((p) => {
                const isSaved = savedIds.includes(p.id);
                const gunthas = p.areaAcres * 40;
                const pricePerAcre = p.pricePerGuntha * 40;

                return (
                  <article
                    key={p.id}
                    onClick={() => navigate(`/property/${p.id}`)}
                    className="bg-white rounded-2xl border border-[#EAD2B8] shadow-xs hover:border-[#E86A17] transition-all cursor-pointer overflow-hidden active:scale-[0.99]"
                  >
                    {/* Top Warm Peach Header Panel */}
                    <div className="bg-gradient-to-r from-[#FFE8D1] to-[#FFF3E3] p-4 border-b border-[#F2DCC4] flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-extrabold text-[#C54E12] uppercase tracking-wide">
                            {p.isDemo ? `${t('common.demoReference')}: ${p.surveyNumber}` : `${t('common.surveyNo')} ${p.surveyNumber}`}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            {t('common.demoUnverified')}
                          </span>
                        </div>
                        <p className="text-xs text-[#4E443C] flex items-center gap-1 font-semibold">
                          <MapPin size={13} className="text-[#E86A17]" />
                          <span>{localizeLocation(p.village, p.taluka, p.district)}</span>
                        </p>
                      </div>

                      {/* Bookmark / Save Action */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(p.id);
                        }}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          isSaved
                            ? 'bg-rose-50 text-rose-600 border border-rose-300'
                            : 'bg-white border border-[#E0C7AD] text-stone-400 hover:text-[#C54E12]'
                        }`}
                        title={isSaved ? t('common.saved') : t('common.save')}
                      >
                        <Heart size={16} className={isSaved ? 'fill-rose-500' : ''} />
                      </button>
                    </div>

                    {/* Middle: Prominent Saffron Financial & Acreage Data */}
                    <div className="p-4 space-y-3">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider block">
                            {t('common.askingPrice')}
                          </span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black font-heading text-[#C54E12] tracking-tight">
                              {formatINRLocalized(p.totalPrice)}
                            </span>
                            <span className="text-xs text-[#6B5E54] font-semibold">
                              ({formatSmartPrice(p.totalPrice)})
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider block">
                            {t('common.area')}
                          </span>
                          <span className="text-base font-extrabold text-[#25211E]">
                            {formatNumber(p.areaAcres)} {t('common.acres')}
                          </span>
                          <span className="text-xs text-[#6B5E54] block font-medium">
                            {formatNumber(gunthas)} {t('common.gunthas')}
                          </span>
                        </div>
                      </div>

                      {/* Unit Rates Warm Bar */}
                      <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#FFF9F2] rounded-xl border border-[#F2DFC9] text-xs">
                        <div>
                          <span className="text-[#8C7A6B] block text-[11px] font-medium">{t('common.ratePerGuntha')}</span>
                          <span className="font-bold text-[#25211E]">{formatINRLocalized(p.pricePerGuntha)}</span>
                        </div>
                        <div>
                          <span className="text-[#8C7A6B] block text-[11px] font-medium">{t('common.ratePerAcre')}</span>
                          <span className="font-bold text-[#25211E]">{formatINRLocalized(pricePerAcre)}</span>
                        </div>
                      </div>

                      {/* Road Proximity Line with Leaf Green Positive Status */}
                      {p.roadDistanceMeters && (
                        <p className="text-xs text-[#4E443C] flex items-center gap-1.5 font-medium">
                          <span className="w-2 h-2 rounded-full bg-[#287A52] flex-shrink-0" />
                          <span>
                            ~{formatDigits(p.roadDistanceMeters)}m {localizeRoadType(p.roadType)} <span className="text-[#8C7A6B]">({t('common.estimated')})</span>
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Bottom: Dedicated Action Row with Saffron Primary Button */}
                    <div className="px-4 py-3 bg-[#FFFDFB] border-t border-[#F2DCC4] flex items-center justify-between gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/intelligence?id=${p.id}`);
                        }}
                        className="text-xs font-bold text-[#C54E12] hover:text-[#E86A17] flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-[#FFE8D1] transition-colors"
                      >
                        <FileText size={14} />
                        <span>{t('common.intelligenceReport')}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/property/${p.id}`);
                        }}
                        className="px-4 py-2 bg-[#E86A17] hover:bg-[#C54E12] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all active:scale-95 shadow-xs"
                      >
                        <span>{t('common.viewDetails')}</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* ──────────────────────────────────────────
            6. Official Maharashtra Land Records Gateway Card
        ────────────────────────────────────────── */}
        <section className="bg-white border border-[#E0C7AD] rounded-2xl p-4 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 text-[#C54E12]">
            <ShieldCheck size={18} strokeWidth={2.2} />
            <h3 className="font-heading font-extrabold text-sm text-[#25211E]">
              {t('common.officialPortals')}
            </h3>
          </div>
          <p className="text-xs text-[#6B5E54] leading-relaxed">
            {t('home.portalText')}
          </p>
          <div className="flex flex-wrap gap-2 pt-1 text-xs font-bold">
            <a
              href="https://bhulekh.mahabhumi.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#FFF3E3] border border-[#E0C7AD] hover:bg-[#FFE8D1] rounded-lg text-[#C54E12] flex items-center gap-1.5 transition-colors"
            >
              <span>Mahabhulekh (7/12)</span>
              <ExternalLink size={12} />
            </a>
            <a
              href="https://mahabhunakasha.mahabhumi.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#FFF3E3] border border-[#E0C7AD] hover:bg-[#FFE8D1] rounded-lg text-[#C54E12] flex items-center gap-1.5 transition-colors"
            >
              <span>Mahabhunakasha GIS</span>
              <ExternalLink size={12} />
            </a>
            <button
              onClick={() => navigate('/records')}
              className="px-3 py-1.5 bg-[#FFE8D1] border border-[#F2C99F] hover:bg-[#FFDFC0] rounded-lg text-[#C54E12] transition-colors"
            >
              {t('home.landRecordsTool')}
            </button>
          </div>
        </section>

        {/* ──────────────────────────────────────────
            7. Demo Notice & Compliance Footnote
        ────────────────────────────────────────── */}
        <footer className="pt-2 pb-4 text-center text-xs text-[#8C7A6B] space-y-1">
          <p className="font-medium">
            {t('common.disclaimerNotice')}
          </p>
          <p>
            {t('common.disclaimerVerify')}{' '}
            <a
              href="https://bhulekh.mahabhumi.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[#C54E12] hover:text-[#E86A17] font-bold"
            >
              bhulekh.mahabhumi.gov.in
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
