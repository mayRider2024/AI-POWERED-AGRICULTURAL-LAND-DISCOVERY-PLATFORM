
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { properties } from '../data/properties';
import { useSaved } from '../context/SavedPropertiesContext';
import { calculateGunthas, calculatePricePerAcre } from '../utils/calculations';
import { useLocalization } from '../utils/localization';


export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    localizeTaluka,
    localizeVillage,
    localizeRoadType,
    localizeLocation,
    formatSmartPrice,
    formatNumber,
    formatINRLocalized,
    formatDigits,
  } = useLocalization();
  const property = properties.find((p) => p.id === id);

  const { savedIds, toggleSave } = useSaved();


  if (!property) {
    return (
      <div className="p-4">
        <p className="text-red-600">Property not found.</p>
        <button
          className="mt-2 px-3 py-1 bg-gray-600 text-white rounded"
          onClick={() => navigate(-1)}
        >
          {t('propertyDetails.back')}
        </button>
      </div>
    );
  }

  const isSaved = savedIds.includes(property.id);
  const gunthas = calculateGunthas(property.areaAcres);
  const pricePerAcre = calculatePricePerAcre(property.pricePerGuntha);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-5 bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <button
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          {t('propertyDetails.back')}
        </button>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              isSaved ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => toggleSave(property.id)}
          >
            {isSaved ? t('propertyDetails.savedBtn') : t('propertyDetails.saveBtn')}
          </button>
          <button
            className="px-3 py-1.5 bg-gradient-to-r from-[#E86A17] to-[#C54E12] text-white rounded-lg text-xs font-semibold hover:opacity-95 shadow-xs"
            onClick={() => navigate(`/intelligence?id=${property.id}`)}
          >
            {t('propertyDetails.viewIntelligence')}
          </button>
        </div>
      </div>

      {/* Property Title & Header */}
      <div className="border-b border-gray-100 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold uppercase">
                {property.isDemo ? t('propertyDetails.demoListing') : t('propertyDetails.agriculturalParcel')}
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                {property.isDemo ? t('propertyDetails.fictionalDemoId') : t('propertyDetails.govtSurvey')}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-0.5">
              {property.isDemo ? `${t('common.demoReference')}: ${property.surveyNumber}` : `${t('common.surveyNo')} ${property.surveyNumber}`}
            </h1>
            <p className="text-sm text-gray-500">{localizeLocation(property.village, property.taluka, property.district)}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 block font-medium">{t('common.askingPrice')}</span>
            <span className="text-2xl font-bold text-[#C54E12]">{formatINRLocalized(property.totalPrice)}</span>
            <span className="text-xs text-gray-500 block font-medium">
              {formatSmartPrice(property.totalPrice)} ({formatINRLocalized(property.pricePerGuntha)} / {t('common.guntha')} · {formatINRLocalized(pricePerAcre)} / {t('common.acre')})
            </span>
          </div>
        </div>
      </div>

      {/* Photo Gallery Simulation / Land Visualization */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-xl overflow-hidden">
        <div className="sm:col-span-2 h-56 bg-gradient-to-br from-amber-700 to-orange-900 rounded-lg flex flex-col items-center justify-center text-white p-4 text-center">
          <span className="text-4xl mb-2">🌾</span>
          <span className="font-bold text-base">{localizeVillage(property.village)} · {property.surveyNumber}</span>
          <span className="text-xs text-amber-100 mt-1">{formatNumber(property.areaAcres)} {t('common.acres')} ({formatNumber(gunthas)} {t('common.gunthas')})</span>
          <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded mt-3">
            {t('propertyDetails.notVerifiedBoundary', { lat: property.coordinates[1], longitude: property.coordinates[0] })}
          </span>
        </div>
        <div className="space-y-2">
          <div className="h-26 bg-gradient-to-br from-orange-800 to-amber-950 rounded-lg flex flex-col items-center justify-center text-white text-center p-2">
            <span className="text-2xl">🛣️</span>
            <span className="text-xs font-semibold mt-1">{t('propertyDetails.roadProximityTitle')}</span>
            <span className="text-[10px] text-amber-200">
              {property.roadDistanceMeters ? t('propertyDetails.roadProximityEstimate', { distance: formatDigits(property.roadDistanceMeters), type: localizeRoadType(property.roadType) }) : t('propertyDetails.roadUnverified')}
            </span>
          </div>
          <div className="h-26 bg-gradient-to-br from-stone-800 to-stone-950 rounded-lg flex flex-col items-center justify-center text-white text-center p-2">
            <span className="text-2xl">📜</span>
            <span className="text-xs font-semibold mt-1">{t('propertyDetails.satbaraRecordTitle')}</span>
            <span className="text-[10px] text-amber-200">
              {t('propertyDetails.demoRecordOnly')}
            </span>
          </div>
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
          <span className="text-xs text-gray-400 block">{t('common.area')}</span>
          <span className="text-base font-bold text-gray-800">{formatNumber(property.areaAcres)} {t('common.acre')}</span>
          <span className="text-[10px] text-gray-500 block">{formatNumber(gunthas)} {t('common.gunthas')}</span>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
          <span className="text-xs text-gray-400 block">{t('common.ratePerGuntha')}</span>
          <span className="text-base font-bold text-gray-800">{formatINRLocalized(property.pricePerGuntha)}</span>
          <span className="text-[10px] text-gray-500 block">{formatDigits(1)} {t('common.acre')} = {formatDigits(40)} {t('common.gunthas')}</span>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
          <span className="text-xs text-gray-400 block">{t('common.roadDistance')}</span>
          <span className="text-base font-bold text-emerald-800">
            {property.roadDistanceMeters ? `~${formatDigits(property.roadDistanceMeters)}m` : t('propertyDetails.roadUnverified')}
          </span>
          <span className="text-[10px] text-emerald-600 block">
            {property.roadDistanceMeters ? `${localizeRoadType(property.roadType)} (${t('common.estimated')})` : ''}
          </span>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
          <span className="text-xs text-gray-400 block">{t('compare.verificationStatus')}</span>
          <span className="text-base font-bold text-amber-700 capitalize">{t('common.demoUnverified')}</span>
          <span className="text-[10px] text-amber-600 block">{t('propertyDetails.fictionalDemoId')}</span>
        </div>
      </div>

      {/* Official Government Verification Gateway */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs space-y-2">
        <h3 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
          <span>🏛️</span> {t('propertyDetails.officialVerificationTitle')}
        </h3>
        <p className="text-amber-800">
          {t('propertyDetails.officialVerificationDesc', { survey: property.surveyNumber, taluka: localizeTaluka(property.taluka) })}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <a
            href="https://bhulekh.mahabhumi.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-amber-800 text-white rounded font-medium hover:bg-amber-900"
          >
            {t('propertyDetails.searchMahabhulekh')}
          </a>
          <a
            href="https://mahabhunakasha.mahabhumi.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-white border border-amber-400 text-amber-900 rounded font-medium hover:bg-amber-100"
          >
            {t('propertyDetails.openCadastral')}
          </a>
          <button
            onClick={() => navigate('/records')}
            className="px-3 py-1.5 bg-gradient-to-r from-[#E86A17] to-[#C54E12] text-white rounded font-medium hover:opacity-95"
          >
            {t('propertyDetails.uploadSatbara')}
          </button>
        </div>
      </div>
    </div>
  );
}
