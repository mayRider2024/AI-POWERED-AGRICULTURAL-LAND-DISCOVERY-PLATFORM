
import { useParams, useNavigate } from 'react-router-dom';
import { properties } from '../data/properties';
import { useSaved } from '../context/SavedPropertiesContext';


export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
          Go Back
        </button>
      </div>
    );
  }

  const isSaved = savedIds.includes(property.id);
  const gunthas = property.areaAcres * 40;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-5 bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <button
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              isSaved ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => toggleSave(property.id)}
          >
            {isSaved ? '♥ Saved' : '♡ Save Property'}
          </button>
          <button
            className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800"
            onClick={() => navigate('/intelligence')}
          >
            📊 View Intelligence Report
          </button>
        </div>
      </div>

      {/* Property Title & Header */}
      <div className="border-b border-gray-100 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase">Agricultural Land Parcel</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-0.5">{property.surveyNumber}</h1>
            <p className="text-sm text-gray-500">{property.village}, Taluka {property.taluka}, District {property.district}, Maharashtra</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 block font-medium">Asking Price</span>
            <span className="text-2xl font-bold text-green-700">₹{property.totalPrice.toLocaleString()}</span>
            <span className="text-xs text-gray-500 block">₹{(property.totalPrice / 100000).toFixed(2)} Lakh (₹{property.pricePerGuntha.toLocaleString()} / guntha)</span>
          </div>
        </div>
      </div>

      {/* Photo Gallery Simulation / Land Visualization */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-xl overflow-hidden">
        <div className="sm:col-span-2 h-56 bg-gradient-to-br from-green-800 to-emerald-900 rounded-lg flex flex-col items-center justify-center text-white p-4 text-center">
          <span className="text-4xl mb-2">🌾</span>
          <span className="font-bold text-base">Agricultural Land Plot {property.surveyNumber}</span>
          <span className="text-xs text-green-200 mt-1">{property.areaAcres} Acres ({gunthas} Gunthas) · Fertile Soil</span>
          <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded mt-3">Coordinates: {property.coordinates[1]}°N, {property.coordinates[0]}°E</span>
        </div>
        <div className="space-y-2">
          <div className="h-26 bg-gradient-to-br from-lime-800 to-green-900 rounded-lg flex flex-col items-center justify-center text-white text-center p-2">
            <span className="text-2xl">🛣️</span>
            <span className="text-xs font-semibold mt-1">Road Proximity</span>
            <span className="text-[10px] text-green-200">{property.roadDistanceMeters ?? 60}m to {property.roadType ?? 'Village Road'}</span>
          </div>
          <div className="h-26 bg-gradient-to-br from-teal-800 to-emerald-950 rounded-lg flex flex-col items-center justify-center text-white text-center p-2">
            <span className="text-2xl">📜</span>
            <span className="text-xs font-semibold mt-1">7/12 Land Record</span>
            <span className="text-[10px] text-teal-200">Gat No. Registered</span>
          </div>
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
          <span className="text-xs text-gray-400 block">Total Acreage</span>
          <span className="text-base font-bold text-gray-800">{property.areaAcres} ac</span>
          <span className="text-[10px] text-gray-500 block">{gunthas} Gunthas</span>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
          <span className="text-xs text-gray-400 block">Rate / Guntha</span>
          <span className="text-base font-bold text-gray-800">₹{property.pricePerGuntha.toLocaleString()}</span>
          <span className="text-[10px] text-gray-500 block">Standard Unit</span>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
          <span className="text-xs text-gray-400 block">Road Distance</span>
          <span className="text-base font-bold text-emerald-800">{property.roadDistanceMeters ?? 60}m</span>
          <span className="text-[10px] text-emerald-600 block">{property.roadType ?? 'Tar Road'}</span>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
          <span className="text-xs text-gray-400 block">Verification</span>
          <span className="text-base font-bold text-yellow-700 capitalize">{property.verificationStatus}</span>
          <span className="text-[10px] text-yellow-600 block">Demo Record</span>
        </div>
      </div>

      {/* Official Government Verification Gateway */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs space-y-2">
        <h3 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
          <span>🏛️</span> Official Maharashtra Record Verification
        </h3>
        <p className="text-amber-800">
          Verify authentic 7/12 (सातबारा), 8A khate-utara, and survey boundaries for Survey <strong>{property.surveyNumber}</strong> directly through Maharashtra Revenue Department services:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <a
            href="https://bhulekh.mahabhumi.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-amber-800 text-white rounded font-medium hover:bg-amber-900"
          >
            Search on Mahabhulekh 7/12 →
          </a>
          <a
            href="https://mahabhunakasha.mahabhumi.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-white border border-amber-400 text-amber-900 rounded font-medium hover:bg-amber-100"
          >
            View Cadastral Map (भू-नकाशा) →
          </a>
          <button
            onClick={() => navigate('/records')}
            className="px-3 py-1.5 bg-green-700 text-white rounded font-medium hover:bg-green-800"
          >
            Upload 7/12 Document to Verify →
          </button>
        </div>
      </div>
    </div>
  );
}
