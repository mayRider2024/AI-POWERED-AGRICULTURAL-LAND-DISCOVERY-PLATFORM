import { useState } from 'react';
import { properties } from '../data/properties';
import { calculateGunthas, calculatePricePerAcre, formatINR, formatLakh } from '../utils/calculations';

export default function IntelligenceReport() {
  const [selectedId, setSelectedId] = useState<string>('p1');
  const property = properties.find((p) => p.id === selectedId) || properties[0];

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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">LandLens Intelligence Report</h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Land valuation, infrastructure proximity, and due diligence checklist
            </p>
          </div>
        </div>

        {/* Property Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-600">Select Property:</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-medium"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.isDemo ? `Demo Ref: ${p.surveyNumber}` : `Survey ${p.surveyNumber}`} ({p.district} - {p.taluka})
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
            <span className="font-bold block text-sm text-amber-950">Demonstration Record Disclaimer</span>
            <p className="mt-0.5 text-amber-800">
              This report contains simulated demonstration data for testing and UI evaluation. All parcel boundaries, coordinates, road distances, road types, legal status entries, and asking price comparisons are <strong>unverified simulated estimates</strong> and do <strong>not</strong> represent authenticated government land records.
            </p>
          </div>
        </div>
      )}

      {/* Property Overview Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold">
              {isDemo ? 'Demo Reference ID (Simulated)' : 'Official Survey / Gat Identifier'}
            </span>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-800">
                {isDemo ? `Demo Ref: ${property.surveyNumber}` : `Survey No. ${property.surveyNumber}`}
              </h2>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                isDemo ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isDemo ? 'Fictional Demo Parcel' : 'Government Record'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {property.village}, Taluka {property.taluka}, District {property.district} (Approximate area)
            </p>
          </div>
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full font-medium">
            {isDemo ? 'Simulated Listing · Unverified' : 'Government Verified'}
          </span>
        </div>

        {/* Pricing & Area Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-[11px] text-gray-500 block">Total Asking Price</span>
            <span className="text-lg font-bold text-green-700">{formatINR(property.totalPrice)}</span>
            <span className="text-[10px] text-gray-400 block mt-0.5">{formatLakh(property.totalPrice)}</span>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-[11px] text-gray-500 block">Total Area</span>
            <span className="text-lg font-bold text-gray-800">{property.areaAcres} Acres</span>
            <span className="text-[10px] text-gray-400 block mt-0.5">{gunthas} Gunthas (1 ac = 40 gunthas)</span>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-[11px] text-gray-500 block">Rate per Guntha</span>
            <span className="text-lg font-bold text-gray-800">{formatINR(property.pricePerGuntha)}</span>
            <span className="text-[10px] text-gray-400 block mt-0.5">Asking rate</span>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-[11px] text-gray-500 block">Rate per Acre</span>
            <span className="text-lg font-bold text-gray-800">{formatINR(pricePerAcre)}</span>
            <span className="text-[10px] text-gray-400 block mt-0.5">Calculated (Rate/Guntha × 40)</span>
          </div>
        </div>

        {/* Road & Spatial Proximity Intelligence */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2 text-xs text-emerald-950">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
              <span>🛣️</span> Geographic & Road Proximity (Simulated)
            </h3>
            <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-semibold">
              Estimated Analysis
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <span className="text-emerald-700 font-medium block">Distance to Nearest Mapped Road:</span>
              <span className="text-base font-bold text-emerald-900">~{property.roadDistanceMeters ?? 60} meters</span>
              <span className="text-[10px] text-emerald-600 block">Estimated from demo point, not verified access</span>
            </div>
            <div>
              <span className="text-emerald-700 font-medium block">Access Road Type:</span>
              <span className="text-base font-bold text-emerald-900">{property.roadType ?? 'Paved Village Road'}</span>
              <span className="text-[10px] text-emerald-600 block">Simulated classification</span>
            </div>
            <div>
              <span className="text-emerald-700 font-medium block">Demo Centroid Coordinates:</span>
              <span className="text-base font-bold text-emerald-900">{property.coordinates[1].toFixed(4)}°N, {property.coordinates[0].toFixed(4)}°E</span>
              <span className="text-[10px] text-emerald-600 block">Simulated coordinate — not a legal survey boundary</span>
            </div>
          </div>
        </div>
      </div>

      {/* Due Diligence & Legal Verification Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <span>📋</span> Land Records Due Diligence Checklist
            </h3>
            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-semibold">
              Simulated Status
            </span>
          </div>
          <p className="text-[11px] text-gray-500">
            For demonstration only. Fictional parcels have not been authenticated against official state registries.
          </p>
          <div className="space-y-2 text-xs">
            {[
              { label: '7/12 Extract (सातबारा उतारा)', status: 'Pending Official Verification (Simulated)' },
              { label: '8-A Mutation Register (फेरफार नोंद)', status: 'To Be Verified (Simulated)' },
              { label: 'Mahabhunakasha Cadastral Boundary', status: 'Unverified Point / Boundary Map Pending' },
              { label: 'Non-Agricultural (NA) Status', status: 'Unverified Agricultural Class (Simulated)' },
              { label: 'Zone / Forest Land Clearance', status: 'Unverified Belt (Simulated)' },
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
              <span>📈</span> Local Price Insights (Simulated Estimates)
            </h3>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
              Unverified
            </span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900">
              <span className="font-semibold block mb-0.5">Registered Deals Transparency</span>
              <p className="text-[11px] text-amber-800">
                Authentic registered transaction records are unavailable for this fictional demo reference. Figures are illustrative asking rates declared for testing and do not represent actual completed government deed registries.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-semibold text-gray-700 block">Taluka Asking Rates Range ({property.taluka}) [Simulated]:</span>
              <div className="flex justify-between text-gray-600 py-0.5">
                <span>Minimum Asking:</span>
                <span className="font-medium">₹46,000 / guntha</span>
              </div>
              <div className="flex justify-between text-gray-600 py-0.5">
                <span>Maximum Asking:</span>
                <span className="font-medium">₹52,000 / guntha</span>
              </div>
              <div className="flex justify-between text-gray-600 py-0.5 font-bold text-gray-800 border-t border-gray-100 pt-1">
                <span>Subject Parcel Asking:</span>
                <span className="text-green-700">{formatINR(property.pricePerGuntha)} / guntha</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Land Records Portal Link Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="font-bold block text-sm text-blue-950">Looking for Official Maharashtra Government Records?</span>
          <p className="text-blue-800 mt-0.5">
            Visit the official Mahabhulekh portal to access authentic, digitally signed 7/12 extracts and 8-A khate utara.
          </p>
        </div>
        <a
          href="https://bhulekh.mahabhumi.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap"
        >
          Open Mahabhulekh ↗
        </a>
      </div>
    </div>
  );
}
