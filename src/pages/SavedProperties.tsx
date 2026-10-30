import { useNavigate } from 'react-router-dom';
import { properties } from '../data/properties';
import { useSaved } from '../context/SavedPropertiesContext';

export default function SavedProperties() {
  const navigate = useNavigate();
  const { savedIds, toggleSave } = useSaved();

  const savedProperties = properties.filter((p) => savedIds.includes(p.id));

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">♥</span>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Saved Properties</h1>
          <p className="text-sm text-gray-500">
            {savedProperties.length === 0
              ? 'No properties saved yet'
              : `${savedProperties.length} saved · persisted in browser`}
          </p>
        </div>
      </div>

      {savedProperties.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm">
          <div className="text-5xl mb-4">🌾</div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Nothing saved yet</h2>
          <p className="text-gray-500 text-sm mb-4">
            Browse properties in Raigad and Palghar and tap ♡ to save them here.
          </p>
          <button
            onClick={() => navigate('/explore')}
            className="px-5 py-2 bg-green-700 text-white rounded-lg font-medium text-sm hover:bg-green-800 transition-colors"
          >
            Explore Properties
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {savedProperties.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800">{p.surveyNumber}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        p.district === 'Raigad'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {p.district}
                    </span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
                      DEMO / UNVERIFIED
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  {p.taluka} · {p.village}
                </p>

                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm mb-3">
                  <span className="text-gray-700">📐 {p.areaAcres} acres ({p.areaAcres * 40} gunthas)</span>
                  <span className="text-green-700 font-bold">₹{p.totalPrice.toLocaleString()}</span>
                  <span className="text-xs text-gray-500">
                    (₹{p.pricePerGuntha.toLocaleString()} / guntha · ₹{(p.pricePerGuntha * 40).toLocaleString()} / ac)
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    className="px-3 py-1.5 bg-green-700 text-white rounded-lg text-sm hover:bg-green-800 transition-colors"
                    onClick={() => navigate(`/property/${p.id}`)}
                  >
                    View Details
                  </button>
                  <button
                    className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm hover:bg-red-100 transition-colors"
                    onClick={() => toggleSave(p.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 text-center">
            Saved properties are stored in your browser only. Data is fictional.
          </p>
        </>
      )}
    </div>
  );
}
