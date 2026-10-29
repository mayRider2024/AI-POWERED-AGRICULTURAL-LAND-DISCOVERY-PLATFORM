import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useSaved } from '../context/SavedPropertiesContext';
import { properties } from '../data/properties';
import { useNavigate } from 'react-router-dom';

// Tell MapLibre where to find its Web Worker.
// Vite's ?url suffix copies the file to dist/assets/ and returns its URL.
// Without this, MapLibre cannot spawn a worker and renders nothing.
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
maplibregl.setWorkerUrl(maplibreWorkerUrl);


export default function MapViewEnhanced() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedPropId, setSelectedPropId] = useState<string | null>(null);

  // Filters state
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterTaluka, setFilterTaluka] = useState('');
  const [filterVillage, setFilterVillage] = useState('');
  const [minArea, setMinArea] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [maxRoadDist, setMaxRoadDist] = useState<number | ''>('');
  const [showFilters, setShowFilters] = useState(false);
  const [mapStyle, setMapStyle] = useState<'liberty' | 'positron' | 'bright'>('liberty');

  const { savedIds, toggleSave } = useSaved();

  const filteredProperties = properties.filter((p) => {
    if (filterDistrict && p.district !== filterDistrict) return false;
    if (filterTaluka && p.taluka.toLowerCase() !== filterTaluka.toLowerCase()) return false;
    if (filterVillage && p.village.toLowerCase() !== filterVillage.toLowerCase()) return false;
    if (minArea !== '' && p.areaAcres < Number(minArea)) return false;
    if (maxPrice !== '' && p.totalPrice > Number(maxPrice)) return false;
    if (maxRoadDist !== '' && p.roadDistanceMeters && p.roadDistanceMeters > Number(maxRoadDist)) return false;
    return true;
  });

  const styleUrls = {
    liberty: 'https://tiles.openfreemap.org/styles/liberty',
    positron: 'https://tiles.openfreemap.org/styles/positron',
    bright: 'https://tiles.openfreemap.org/styles/bright',
  };

  const initMap = () => {
    if (!mapContainer.current) return;

    // Clean up previous instance
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    setIsLoading(true);
    setMapError(null);

    // OpenFreeMap style: liberty, positron, or bright — legitimate, free, OpenStreetMap-based tiles
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrls[mapStyle],
      center: [73.15, 18.9],
      zoom: 8.5,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      'top-right'
    );

    // Timeout: if map hasn't loaded in 12s, show error
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setMapError('Map tiles could not be loaded. Check your internet connection.');
      }
    }, 12000);

    map.on('load', () => {
      clearTimeout(timeout);
      setIsLoading(false);
      setMapError(null);

      // Add property markers
      filteredProperties.forEach((p) => {
        const el = document.createElement('div');
        el.style.cssText = `
          width: 28px; height: 28px;
          background: ${p.district === 'Raigad' ? '#16a34a' : '#2563eb'};
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
        `;
        el.innerHTML = '<span style="color:white;font-size:10px;font-weight:bold;">₹</span>';
        el.title = `${p.surveyNumber} — ${p.district}`;
        el.addEventListener('click', () => setSelectedPropId(p.id));

        new maplibregl.Marker({ element: el })
          .setLngLat(p.coordinates)
          .addTo(map);
      });
    });

    map.on('error', (e: { error?: { message?: string } }) => {
      clearTimeout(timeout);
      setIsLoading(false);
      setMapError(`Map error: ${e.error?.message ?? 'Unknown error'}`);
    });

    mapRef.current = map;
  };

  useEffect(() => {
    initMap();
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDistrict, filterTaluka, filterVillage, minArea, maxPrice, maxRoadDist, mapStyle]);

  // Ensure map resizes whenever the container changes size (e.g. sidebar toggle, orientation change, layout shift)
  useEffect(() => {
    const container = mapContainer.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const selectedProperty = properties.find((p) => p.id === selectedPropId);

  return (
    <div className="relative w-full h-full flex flex-col min-w-0">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-white border-b border-gray-200 z-10 flex-shrink-0 w-full overflow-x-auto">
        <button
          className="px-3 py-1.5 bg-green-700 text-white rounded text-sm font-medium hover:bg-green-800 transition-colors whitespace-nowrap"
          onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
        >
          {viewMode === 'map' ? '☰ List View' : '🗺 Map View'}
        </button>
        <button
          className="px-3 py-1.5 bg-blue-700 text-white rounded text-sm font-medium hover:bg-blue-800 transition-colors whitespace-nowrap"
          onClick={() => setShowFilters(!showFilters)}
        >
          ⚙ Filters {filterDistrict || filterTaluka || filterVillage || minArea !== '' || maxPrice !== '' || maxRoadDist !== '' ? '●' : ''}
        </button>
        <select
          value={mapStyle}
          onChange={(e) => setMapStyle(e.target.value as 'liberty' | 'positron' | 'bright')}
          className="border border-gray-300 rounded px-2 py-1.5 text-xs bg-white text-gray-700"
          title="Map Style"
        >
          <option value="liberty">Liberty (OSM)</option>
          <option value="positron">Positron (Clean)</option>
          <option value="bright">Bright (Vibrant)</option>
        </select>
        <span className="ml-auto text-xs text-gray-500 whitespace-nowrap pl-1">{filteredProperties.length} properties</span>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-gray-50 border-b border-gray-200 p-3 grid grid-cols-2 sm:flex sm:flex-wrap gap-2 z-10 flex-shrink-0 w-full">
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="border bg-white rounded px-2 py-1.5 text-sm w-full sm:w-auto"
          >
            <option value="">All Districts</option>
            <option value="Raigad">Raigad</option>
            <option value="Palghar">Palghar</option>
          </select>
          <input
            type="text"
            placeholder="Taluka"
            value={filterTaluka}
            onChange={(e) => setFilterTaluka(e.target.value)}
            className="border bg-white rounded px-2 py-1.5 text-sm w-full sm:w-28"
          />
          <input
            type="text"
            placeholder="Village"
            value={filterVillage}
            onChange={(e) => setFilterVillage(e.target.value)}
            className="border bg-white rounded px-2 py-1.5 text-sm w-full sm:w-28"
          />
          <input
            type="number"
            placeholder="Min Area (ac)"
            value={minArea}
            onChange={(e) => setMinArea(e.target.value ? Number(e.target.value) : '')}
            className="border bg-white rounded px-2 py-1.5 text-sm w-full sm:w-32"
          />
          <input
            type="number"
            placeholder="Max Price (₹)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
            className="border bg-white rounded px-2 py-1.5 text-sm w-full sm:w-32"
          />
          <input
            type="number"
            placeholder="Max Road Dist (m)"
            value={maxRoadDist}
            onChange={(e) => setMaxRoadDist(e.target.value ? Number(e.target.value) : '')}
            className="border bg-white rounded px-2 py-1.5 text-sm w-full sm:w-36"
            title="Max distance to nearest mapped road in metres"
          />
          <button
            className="col-span-2 sm:col-span-1 px-3 py-1.5 bg-gray-200 rounded text-sm hover:bg-gray-300 font-medium"
            onClick={() => {
              setFilterDistrict('');
              setFilterTaluka('');
              setFilterVillage('');
              setMinArea('');
              setMaxPrice('');
              setMaxRoadDist('');
            }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Map / List area */}
      <div className="relative flex-1 overflow-hidden">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-20">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-gray-600 text-sm">Loading map tiles…</p>
            <p className="text-gray-400 text-xs mt-1">Connecting to OpenFreeMap</p>
          </div>
        )}

        {/* Error overlay */}
        {!isLoading && mapError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-20 p-6 text-center">
            <div className="text-4xl mb-3">🗺️</div>
            <p className="text-red-600 font-medium mb-1">Map tiles unavailable</p>
            <p className="text-gray-500 text-sm mb-4">{mapError}</p>
            <button
              onClick={initMap}
              className="px-4 py-2 bg-green-700 text-white rounded font-medium hover:bg-green-800 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="mt-2 px-4 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300"
            >
              View as List instead
            </button>
          </div>
        )}

        {/* Map container */}
        <div
          ref={mapContainer}
          className="absolute inset-0"
          style={{ display: viewMode === 'map' ? 'block' : 'none' }}
        />

        {/* List view */}
        {viewMode === 'list' && (
          <div className="absolute inset-0 overflow-auto p-4 space-y-3">
            {filteredProperties.length === 0 && (
              <p className="text-gray-500 text-center mt-8">No properties match the current filters.</p>
            )}
            {filteredProperties.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedPropId(p.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-semibold text-gray-800">{p.surveyNumber}</span>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${p.district === 'Raigad' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {p.district}
                    </span>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">DEMO / UNVERIFIED</span>
                </div>
                <p className="text-sm text-gray-600">{p.taluka} · {p.village}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-gray-700">📐 {p.areaAcres} acres</span>
                  <span className="text-green-700 font-medium">₹{p.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    className="px-3 py-1 bg-green-700 text-white rounded text-xs hover:bg-green-800"
                    onClick={(e) => { e.stopPropagation(); navigate(`/property/${p.id}`); }}
                  >
                    View Details
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                    onClick={(e) => { e.stopPropagation(); toggleSave(p.id); }}
                  >
                    {savedIds.includes(p.id) ? '♥ Saved' : '♡ Save'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Property preview popup */}
        {selectedProperty && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[92%] sm:w-80 max-w-sm bg-white rounded-xl shadow-2xl p-4 z-30 border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-semibold text-gray-800">{selectedProperty.surveyNumber}</span>
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${selectedProperty.district === 'Raigad' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {selectedProperty.district}
                </span>
              </div>
              <button onClick={() => setSelectedPropId(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                DEMO / UNVERIFIED
              </span>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                📍 Approx Point (±25m)
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600 space-y-1">
              <p>{selectedProperty.taluka} · {selectedProperty.village}</p>
              <p>📐 {selectedProperty.areaAcres} acres ({(selectedProperty.areaAcres * 40).toFixed(0)} gunthas)</p>
              <p className="text-green-700 font-bold">₹{selectedProperty.totalPrice.toLocaleString()} <span className="text-xs text-gray-500 font-normal">asking</span></p>
              {selectedProperty.roadDistanceMeters && (
                <p className="text-xs text-gray-500">
                  🛣️ ~{selectedProperty.roadDistanceMeters}m to {selectedProperty.roadType || 'road'} (OpenStreetMap calc)
                </p>
              )}
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100 flex flex-col gap-1.5">
              <a
                href="https://bhulekh.mahabhumi.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded text-xs font-semibold hover:bg-amber-100"
              >
                Verify on Mahabhulekh 7/12 →
              </a>
              <div className="flex gap-2">
                <button
                  className="flex-1 px-3 py-1.5 bg-green-700 text-white rounded text-sm hover:bg-green-800"
                  onClick={() => navigate(`/property/${selectedProperty.id}`)}
                >
                  View Intelligence Report
                </button>
                <button
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                  onClick={() => toggleSave(selectedProperty.id)}
                >
                  {savedIds.includes(selectedProperty.id) ? '♥' : '♡'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
