import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { properties } from '../data/properties';
import { useSaved } from '../context/SavedPropertiesContext';
import { useAuth } from '../context/AuthContext';
import { useLocalization } from '../utils/localization';
import {
  Heart,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogIn,
  ArrowRight,
  MapPin,
} from 'lucide-react';

export default function SavedProperties() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { savedIds, toggleSave, loading, error, localBookmarksMigrated } = useSaved();
  const {
    localizeDistrict,
    localizeLocation,
    formatSmartPrice,
    formatDigits,
    formatNumber,
    formatINRLocalized,
  } = useLocalization();

  const savedProperties = properties.filter((p) => savedIds.includes(p.id));

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 shadow-2xs">
            <Heart size={20} className="fill-rose-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-heading text-[#25211E]">
              {t('savedPage.title')}
            </h1>
            <p className="text-xs text-[#6B5E54]">
              {savedProperties.length === 0
                ? t('savedPage.emptyCount')
                : t('savedPage.savedCount', { count: formatDigits(savedProperties.length) })}
            </p>
          </div>
        </div>

        {/* Sync status badge */}
        <div className="flex items-center gap-1.5">
          {user ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <Cloud size={12} className="text-emerald-600" />
              <span>Cloud Synced</span>
            </span>
          ) : (
            <button
              onClick={() => navigate('/auth', { state: { from: '/saved' } })}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E86A17] bg-[#FFF3E3] border border-[#E0C7AD] hover:border-[#E86A17] px-2.5 py-1 rounded-full transition-colors"
            >
              <LogIn size={12} />
              <span>Sign in to sync</span>
            </button>
          )}
        </div>
      </div>

      {/* Migration feedback banner */}
      {localBookmarksMigrated && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{t('savedPage.migrationSuccess')}</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle size={16} className="text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="bg-white border border-[#E0C7AD] rounded-2xl p-10 text-center shadow-xs space-y-3">
          <Loader2 size={24} className="animate-spin text-[#E86A17] mx-auto" />
          <p className="text-xs text-[#8C7A6B] font-medium">Loading saved properties from cloud...</p>
        </div>
      ) : savedProperties.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-[#E0C7AD] rounded-2xl p-10 text-center shadow-xs space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#FFF3E3] border border-[#E86A17]/25 flex items-center justify-center text-2xl shadow-inner">
            🌾
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold font-heading text-[#25211E]">
              {t('savedPage.emptyTitle')}
            </h2>
            <p className="text-xs text-[#6B5E54] max-w-sm mx-auto leading-relaxed">
              {t('savedPage.emptySub')}
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => navigate('/explore')}
              className="px-5 py-2.5 bg-gradient-to-r from-[#E86A17] to-[#C54E12] hover:from-[#C54E12] hover:to-[#A83E0C] text-white rounded-xl font-bold text-xs shadow-md shadow-[#E86A17]/25 transition-all inline-flex items-center gap-1.5 active:scale-95"
            >
              <span>{t('savedPage.exploreBtn')}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ) : (
        /* Populated List */
        <>
          <div className="space-y-3">
            {savedProperties.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-[#E0C7AD] rounded-2xl p-4 shadow-xs hover:border-[#E86A17] transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-[#25211E]">
                      {p.isDemo ? `${t('common.demoReference')}: ${p.surveyNumber}` : `${t('common.surveyNo')} ${p.surveyNumber}`}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        p.district === 'Raigad'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-orange-100 text-orange-900 border border-orange-300'
                      }`}
                    >
                      {localizeDistrict(p.district)}
                    </span>
                    <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                      {t('common.demoUnverified')}
                    </span>
                  </div>

                  <span className="text-rose-500 fill-rose-500">
                    <Heart size={16} className="fill-rose-500" />
                  </span>
                </div>

                <p className="text-xs text-[#6B5E54] flex items-center gap-1 font-medium">
                  <MapPin size={13} className="text-[#E86A17] shrink-0" />
                  <span>{localizeLocation(p.village, p.taluka, p.district)}</span>
                </p>

                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs">
                  <span className="text-[#25211E] font-medium">
                    📐 {formatNumber(p.areaAcres)} {t('common.acres')} ({formatNumber(p.areaAcres * 40)} {t('common.gunthas')})
                  </span>
                  <span className="text-emerald-700 font-bold">
                    {formatINRLocalized(p.totalPrice)}
                  </span>
                  <span className="text-[11px] text-[#8C7A6B]">
                    ({formatSmartPrice(p.totalPrice)} · {formatINRLocalized(p.pricePerGuntha)} / {t('common.guntha')})
                  </span>
                </div>

                <div className="flex gap-2 pt-1 border-t border-[#F2DCC4]">
                  <button
                    className="px-3 py-1.5 bg-gradient-to-r from-[#E86A17] to-[#C54E12] text-white rounded-lg text-xs font-bold hover:opacity-95 shadow-2xs transition-all active:scale-95"
                    onClick={() => navigate(`/property/${p.id}`)}
                  >
                    {t('common.viewDetails')}
                  </button>
                  <button
                    className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors"
                    onClick={() => toggleSave(p.id)}
                  >
                    {t('common.remove')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#8C7A6B] text-center pt-2">
            {user ? t('savedPage.cloudSyncedNote') : t('savedPage.guestNote')}
          </p>
        </>
      )}
    </div>
  );
}
