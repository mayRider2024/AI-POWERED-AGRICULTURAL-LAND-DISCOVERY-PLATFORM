import { properties } from '../data/properties';
import { useSaved } from '../context/SavedPropertiesContext';
import { useLocalization } from '../utils/localization';

const total = properties.length;
const raigad = properties.filter((p) => p.district === 'Raigad').length;
const palghar = properties.filter((p) => p.district === 'Palghar').length;
const avgPrice = Math.round(properties.reduce((s, p) => s + p.totalPrice, 0) / total);
const avgArea = +(properties.reduce((s, p) => s + p.areaAcres, 0) / total).toFixed(2);

export default function AdminDashboard() {
  const { savedIds } = useSaved();
  const { formatDigits, formatNumber, formatINRLocalized } = useLocalization();

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-5 space-y-5 w-full min-w-0">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-2xl flex-shrink-0">⚙</span>
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          <span className="inline-block text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium mt-0.5">
            DEMO DATA ONLY — Not a real admin panel
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {[
          { label: 'Total listings', value: formatDigits(total), icon: '🏡', color: 'bg-green-50 border-green-100 text-green-700' },
          { label: 'Raigad', value: formatDigits(raigad), icon: '📍', color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
          { label: 'Palghar', value: formatDigits(palghar), icon: '📍', color: 'bg-blue-50 border-blue-100 text-blue-700' },
          { label: 'User saved', value: formatDigits(savedIds.length), icon: '♥', color: 'bg-red-50 border-red-100 text-red-600' },
        ].map((s) => (
          <div key={s.label} className={`border rounded-xl p-3 sm:p-4 ${s.color}`}>
            <p className="text-xl sm:text-2xl">{s.icon}</p>
            <p className="text-xl sm:text-2xl font-bold mt-1">{s.value}</p>
            <p className="text-xs mt-0.5 opacity-90">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-3.5 sm:p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Avg. price (demo)</p>
          <p className="text-lg sm:text-xl font-bold text-gray-800">{formatINRLocalized(avgPrice)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3.5 sm:p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Avg. area (demo)</p>
          <p className="text-lg sm:text-xl font-bold text-gray-800">{formatNumber(avgArea)} acres</p>
        </div>
      </div>

      {/* Listings table with horizontally scrollable container */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden w-full">
        <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold text-gray-700 text-sm">Demo Listings</h2>
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">All fictional / unverified</span>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-3.5 py-2.5 font-semibold">Survey</th>
                <th className="text-left px-3.5 py-2.5 font-semibold">District</th>
                <th className="text-left px-3.5 py-2.5 font-semibold">Taluka / Village</th>
                <th className="text-right px-3.5 py-2.5 font-semibold">Area (ac)</th>
                <th className="text-right px-3.5 py-2.5 font-semibold">Price (₹)</th>
                <th className="text-center px-3.5 py-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3.5 py-2.5 font-medium text-gray-800 whitespace-nowrap">{p.surveyNumber}</td>
                  <td className="px-3.5 py-2.5 whitespace-nowrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.district === 'Raigad' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {p.district}
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5 text-gray-600 whitespace-nowrap">{p.taluka} / {p.village}</td>
                  <td className="px-3.5 py-2.5 text-right text-gray-700 whitespace-nowrap">{formatNumber(p.areaAcres)}</td>
                  <td className="px-3.5 py-2.5 text-right text-green-700 font-medium whitespace-nowrap">{formatINRLocalized(p.totalPrice)}</td>
                  <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded font-medium">
                      {p.verificationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center pb-2">
        All listings are demo data. Official records: <a href="https://bhulekh.mahabhumi.gov.in" target="_blank" rel="noopener noreferrer" className="underline">bhulekh.mahabhumi.gov.in</a>
      </p>
    </div>
  );
}
