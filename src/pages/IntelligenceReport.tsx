import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { properties } from '../data/properties';
import { calculateGunthas, calculatePricePerAcre } from '../utils/calculations';
import { useLocalization } from '../utils/localization';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function IntelligenceReport() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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

  // Read initial property id from query param ?id=... or fallback to first property
  const queryPropId = searchParams.get('id');
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (queryPropId !== null && queryPropId !== undefined) {
      return queryPropId;
    }
    return properties[0]?.id || 'p1';
  });

  // Sync state if URL query parameter changes
  useEffect(() => {
    if (queryPropId !== null && queryPropId !== undefined) {
      setSelectedId(queryPropId);
    }
  }, [queryPropId]);

  const handleSelectProperty = (newId: string) => {
    setSelectedId(newId);
    setSearchParams({ id: newId });
  };

  const property = properties.find((p) => p.id === selectedId);

  if (!property) {
    return (
      <div className="max-w-md mx-auto p-6 mt-12 bg-white rounded-2xl border border-red-200 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-base font-bold text-gray-900">Property Report Not Found</h2>
        <p className="text-xs text-gray-600">
          The requested land intelligence report could not be generated for ID: <span className="font-mono font-bold">{selectedId}</span>.
        </p>
        <button
          onClick={() => navigate('/home')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E86A17] text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </button>
      </div>
    );
  }

  // Calculate dynamic asking rate range for the selected property's district/taluka
  const sameDistrictProps = properties.filter((p) => p.district === property.district);
  const districtPrices = sameDistrictProps.map((p) => p.pricePerGuntha);
  const minAskingRate = Math.min(...districtPrices);
  const maxAskingRate = Math.max(...districtPrices);

  const isDemo = property.isDemo ?? true;
  const gunthas = calculateGunthas(property.areaAcres);
  const pricePerAcre = calculatePricePerAcre(property.pricePerGuntha);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 min-w-0">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📊</span>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{t('intelligence.title')}</h1>
            <p className="text-xs sm:text-sm text-gray-500">
              {t('intelligence.sub')}
            </p>
          </div>
        </div>

        {/* Property Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-600">{t('intelligence.selectProperty')}</label>
          <select
            value={selectedId}
            onChange={(e) => handleSelectProperty(e.target.value)}
            className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-medium"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.isDemo ? `${t('common.demoReference')}: ${p.surveyNumber}` : `Survey ${p.surveyNumber}`} ({localizeDistrict(p.district)} - {localizeTaluka(p.taluka)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Demo Data Notice Banner */}
      {isDemo && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
          <span className="text-xl leading-none">⚠️</span>
          <div>
            <span className="font-bold block text-sm text-amber-950">{t('intelligence.demoDisclaimerTitle')}</span>
            <p className="mt-0.5 text-amber-800">
              {t('intelligence.demoDisclaimerText')}
            </p>
          </div>
        </div>
      )}

      {/* Property Overview Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold">
              {isDemo ? t('intelligence.demoRefLabel') : t('intelligence.officialGatLabel')}
            </span>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-800">
                {isDemo ? `${t('common.demoReference')}: ${property.surveyNumber}` : `${t('common.surveyNo')} ${property.surveyNumber}`}
              </h2>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                isDemo ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isDemo ? t('propertyDetails.fictionalDemoId') : t('propertyDetails.govtSurvey')}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {localizeLocation(property.village, property.taluka, property.district)}
            </p>
          </div>
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full font-medium">
            {isDemo ? t('intelligence.simulatedListing') : 'Government Verified'}
          </span>
        </div>

        {/* Pricing & Area Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-[11px] text-gray-500 block">{t('intelligence.totalAskingPrice')}</span>
            <span className="text-lg font-bold text-green-700">{formatINRLocalized(property.totalPrice)}</span>
            <span className="text-[10px] text-gray-400 block mt-0.5">{formatSmartPrice(property.totalPrice)}</span>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-[11px] text-gray-500 block">{t('intelligence.totalArea')}</span>
            <span className="text-lg font-bold text-gray-800">{formatNumber(property.areaAcres)} {t('common.acres')}</span>
            <span className="text-[10px] text-gray-400 block mt-0.5">{formatNumber(gunthas)} {t('common.gunthas')} ({formatDigits(1)} {t('common.acre')} = {formatDigits(40)} {t('common.gunthas')})</span>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-[11px] text-gray-500 block">{t('intelligence.ratePerGuntha')}</span>
            <span className="text-lg font-bold text-gray-800">{formatINRLocalized(property.pricePerGuntha)}</span>
            <span className="text-[10px] text-gray-400 block mt-0.5">{t('explore.asking')}</span>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-[11px] text-gray-500 block">{t('intelligence.ratePerAcre')}</span>
            <span className="text-lg font-bold text-gray-800">{formatINRLocalized(pricePerAcre)}</span>
            <span className="text-[10px] text-gray-400 block mt-0.5">Rate/{t('common.guntha')} × {formatDigits(40)}</span>
          </div>
        </div>

        {/* Road & Spatial Proximity Intelligence */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2 text-xs text-emerald-950">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
              <span>🛣️</span> {t('intelligence.roadAnalysisTitle')}
            </h3>
            <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-semibold">
              {t('common.estimated')}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <span className="text-emerald-700 font-medium block">{t('intelligence.distanceToRoad')}</span>
              <span className="text-base font-bold text-emerald-900">~{formatDigits(property.roadDistanceMeters ?? 60)} meters</span>
              <span className="text-[10px] text-emerald-600 block">{t('common.estimated')}</span>
            </div>
            <div>
              <span className="text-emerald-700 font-medium block">{t('intelligence.accessRoadType')}</span>
              <span className="text-base font-bold text-emerald-900">{localizeRoadType(property.roadType)}</span>
              <span className="text-[10px] text-emerald-600 block">{t('common.estimated')}</span>
            </div>
            <div>
              <span className="text-emerald-700 font-medium block">{t('intelligence.demoCentroid')}</span>
              <span className="text-base font-bold text-emerald-900">{formatDigits(property.coordinates[1].toFixed(4))}°N, {formatDigits(property.coordinates[0].toFixed(4))}°E</span>
              <span className="text-[10px] text-emerald-600 block">{t('intelligence.simulatedCoordNote')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Due Diligence & Legal Verification Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <span>📋</span> {t('intelligence.checklistTitle')}
            </h3>
            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-semibold">
              Simulated Status
            </span>
          </div>
          <p className="text-[11px] text-gray-500">
            {t('intelligence.checklistDesc')}
          </p>
          <div className="space-y-2 text-xs">
            {[
              { label: '7/12 Extract (सातबारा उतारा)', status: 'Pending Official Verification' },
              { label: '8-A Mutation Register (फेरफार नोंद)', status: 'To Be Verified (Simulated)' },
              { label: 'Mahabhunakasha Cadastral Boundary', status: 'Unverified Point' },
              { label: 'Non-Agricultural (NA) Status', status: 'Unverified Class' },
              { label: 'Zone / Forest Land Clearance', status: 'Unverified Belt' },
              { label: 'Title Search (30 Years History)', status: 'Required Prior to Agreement' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History & Local Asking Comparisons */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <span>📈</span> {t('intelligence.priceInsightsTitle')}
            </h3>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
              {t('common.demoUnverified')}
            </span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900">
              <span className="font-semibold block mb-0.5">{t('intelligence.dealsTransparency')}</span>
              <p className="text-[11px] text-amber-800">
                {t('intelligence.dealsTransparencyText')}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-semibold text-gray-700 block">{t('intelligence.talukaRatesRange', { taluka: localizeTaluka(property.taluka) })}</span>
              <div className="flex justify-between text-gray-600 py-0.5">
                <span>{t('intelligence.minAsking')}</span>
                <span className="font-medium">{formatINRLocalized(minAskingRate)} / {t('common.guntha')}</span>
              </div>
              <div className="flex justify-between text-gray-600 py-0.5">
                <span>{t('intelligence.maxAsking')}</span>
                <span className="font-medium">{formatINRLocalized(maxAskingRate)} / {t('common.guntha')}</span>
              </div>
              <div className="flex justify-between text-gray-600 py-0.5 font-bold text-gray-800 border-t border-gray-100 pt-1">
                <span>{t('intelligence.subjectAsking')}</span>
                <span className="text-emerald-700">{formatINRLocalized(property.pricePerGuntha)} / {t('common.guntha')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Land Records Portal Link Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="font-bold block text-sm text-blue-950">{t('common.officialPortals')}</span>
          <p className="text-blue-800 mt-0.5">
            {t('home.portalText')}
          </p>
        </div>
        <a
          href="https://bhulekh.mahabhumi.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap"
        >
          {t('intelligence.openMahabhulekh')}
        </a>
      </div>
    </div>
  );
}
