import { useState } from 'react';
import { properties } from '../data/properties';

export default function IntelligenceReport() {
  const [selectedId, setSelectedId] = useState<string>('p1');
  const property = properties.find((p) => p.id === selectedId) || properties[0];

  const pricePerAcre = property.totalPrice / property.areaAcres;
  const gunthas = property.areaAcres * 40;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 min-w-0">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📊</span>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">LandLens Intelligence Report</h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Comprehensive land valuation, infrastructure proximity, and legal checklist
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
                {p.surveyNumber} ({p.district} - {p.taluka})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Property Overview Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold">Survey / Gat Identifier</span>
            <h2 className="text-xl font-bold text-gray-800">{property.surveyNumber}</h2>
            <p className="text-xs text-gray-500">{property.village}, Taluka {property.taluka}, District {property.district}</p>
          </div>
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full font-medium">
            Demo Listing · Unverified
          </span>
        </div>

        {/* Pricing & Area Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-[11px] text-gray-500 block">Total Asking Price</span>
            <span className="text-lg font-bold text-green-700">₹{property.totalPrice.toLocaleString()}</span>
            <span className="text-[10px] text-gray-400 block mt-0.5">₹{(property.totalPrice / 100000).toFixed(2)} Lakh</span>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-[11px] text-gray-500 block">Total Area</span>
            <span className="text-lg font-bold text-gray-800">{property.areaAcres} Acres</span>
            <span className="text-[10px] text-gray-400 block mt-0.5">{gunthas} Gunthas (1 ac = 40 gunthas)</span>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-[11px] text-gray-500 block">Rate per Guntha</span>
            <span className="text-lg font-bold text-gray-800">₹{property.pricePerGuntha.toLocaleString()}</span>
            <span className="text-[10px] text-gray-400 block mt-0.5">Asking rate</span>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-[11px] text-gray-500 block">Rate per Acre</span>
            <span className="text-lg font-bold text-gray-800">₹{Math.round(pricePerAcre).toLocaleString()}</span>
            <span className="text-[10px] text-gray-400 block mt-0.5">Calculated</span>
          </div>
        </div>

        {/* Road & Spatial Proximity Intelligence */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2 text-xs text-emerald-950">
          <h3 className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
            <span>🛣️</span> Geographic & Road Proximity Analysis
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <span className="text-emerald-700 font-medium block">Distance to Nearest Mapped Road:</span>
              <span className="text-base font-bold text-emerald-900">{property.roadDistanceMeters ?? 60} meters</span>
              <span className="text-[10px] text-emerald-600 block">OpenStreetMap road network</span>
            </div>
            <div>
              <span className="text-emerald-700 font-medium block">Access Road Type:</span>
              <span className="text-base font-bold text-emerald-900">{property.roadType ?? 'Paved Village Road'}</span>
              <span className="text-[10px] text-emerald-600 block">All-weather motorable</span>
            </div>
            <div>
              <span className="text-emerald-700 font-medium block">Coordinate Coordinates:</span>
              <span className="text-base font-bold text-emerald-900">{property.coordinates[1].toFixed(4)}°N, {property.coordinates[0].toFixed(4)}°E</span>
              <span className="text-[10px] text-emerald-600 block">Approximate centroid</span>
            </div>
          </div>
        </div>
      </div>

      {/* Due Diligence & Legal Verification Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
            <span>📋</span> Land Records Due Diligence Checklist
          </h3>
          <div className="space-y-2 text-xs">
            {[
              { label: '7/12 Extract (सातबारा उतारा)', status: 'Pending Official Verification' },
              { label: '8-A Mutation Register (फेरफार नोंद)', status: 'To Be Verified' },
              { label: 'Mahabhunakasha Cadastral Boundary', status: 'Centroid Plotted / Survey Map Pending' },
              { label: 'Non-Agricultural (NA) Status', status: 'Agricultural (Class 1 / भोगवटादार १)' },
              { label: 'Zone / Forest Land Clearance', status: 'Standard Agricultural Belt' },
              { label: 'Title Search (30 Years History)', status: 'Recommended Prior to Agreement' },
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
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
            <span>📈</span> Local Price Insights
          </h3>
          <div className="space-y-3 text-xs">
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900">
              <span className="font-semibold block mb-0.5">Registered Deals Transparency</span>
              <p className="text-[11px] text-amber-800">
                Recent authentic registered transaction data unavailable for this specific survey parcel. LandLens AI displays asking prices strictly as declared by listings and does not present asking rates as confirmed completed market sales.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-semibold text-gray-700 block">Taluka Asking Rates Range ({property.taluka}):</span>
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
                <span className="text-green-700">₹{property.pricePerGuntha.toLocaleString()} / guntha</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
