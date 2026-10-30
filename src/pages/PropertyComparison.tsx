import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { properties } from '../data/properties';
import { useLocalization } from '../utils/localization';

export default function PropertyComparison() {
  const { t } = useTranslation();
  const {
    localizeDistrict,
    localizeVillage,
    localizeTaluka,
    localizeRoadType,
    formatSmartPrice,
    formatNumber,
    formatINRLocalized,
    formatDigits,
  } = useLocalization();
  const [selectedIds, setSelectedIds] = useState<string[]>(['p1', 'p3']);

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const comparedProperties = properties.filter((p) => selectedIds.includes(p.id));

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚖️</span>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{t('compare.title')}</h1>
            <p className="text-xs sm:text-sm text-gray-500">
              {t('compare.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Property Selector Pills */}
      <div className="flex flex-wrap gap-2 bg-white p-3 rounded-xl border border-gray-200 shadow-sm items-center">
        <span className="text-xs font-semibold text-gray-600">{t('compare.selectProperties')}:</span>
        {properties.map((p) => {
          const isSelected = selectedIds.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => handleToggle(p.id)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                isSelected
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {isSelected ? '✓ ' : '+ '} {p.surveyNumber} ({localizeDistrict(p.district)})
            </button>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left p-3.5 w-1/4">{t('compare.metric')}</th>
                {comparedProperties.map((p) => (
                  <th key={p.id} className="text-left p-3.5">
                    <span className="font-bold text-gray-900 block text-sm">{p.surveyNumber}</span>
                    <span className="text-[11px] text-gray-500 normal-case">
                      {localizeVillage(p.village)}, {localizeTaluka(p.taluka)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              <tr>
                <td className="p-3.5 font-semibold text-gray-800 bg-gray-50/50">{t('compare.district')}</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.district === 'Raigad' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {localizeDistrict(p.district)}
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3.5 font-semibold text-gray-800 bg-gray-50/50">{t('compare.areaAcres')}</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-3.5 font-medium">{formatNumber(p.areaAcres)} {t('property.acres')}</td>
                ))}
              </tr>

              <tr>
                <td className="p-3.5 font-semibold text-gray-800 bg-gray-50/50">{t('compare.areaGunthas')}</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-3.5">{formatNumber(p.areaAcres * 40)} {t('units.guntha')}</td>
                ))}
              </tr>

              <tr>
                <td className="p-3.5 font-semibold text-gray-800 bg-gray-50/50">{t('compare.pricePerGuntha')}</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-3.5 font-semibold">{formatINRLocalized(p.pricePerGuntha)}</td>
                ))}
              </tr>

              <tr>
                <td className="p-3.5 font-semibold text-gray-800 bg-gray-50/50">{t('compare.ratePerAcre')}</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-3.5 font-semibold text-gray-700">{formatINRLocalized(p.pricePerGuntha * 40)}</td>
                ))}
              </tr>

              <tr>
                <td className="p-3.5 font-semibold text-gray-800 bg-gray-50/50">{t('compare.totalAskingPrice')}</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-3.5 font-bold text-green-700 text-sm">
                    {formatINRLocalized(p.totalPrice)}
                    <span className="text-[10px] text-gray-400 block font-normal">
                      {formatSmartPrice(p.totalPrice)}
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3.5 font-semibold text-gray-800 bg-gray-50/50">{t('compare.roadDistance')}</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-3.5 font-medium text-emerald-800">
                    {formatDigits(p.roadDistanceMeters ?? 60)} m
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3.5 font-semibold text-gray-800 bg-gray-50/50">{t('compare.roadType')}</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-3.5 text-gray-600">
                    {localizeRoadType(p.roadType ?? 'Paved Village Road')}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3.5 font-semibold text-gray-800 bg-gray-50/50">{t('compare.verificationStatus')}</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-3.5">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-medium text-[10px]">
                      {p.verificationStatus}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
