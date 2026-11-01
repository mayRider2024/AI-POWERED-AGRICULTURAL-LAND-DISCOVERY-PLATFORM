import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTranslation } from 'react-i18next';
import { useSaved } from '../context/SavedPropertiesContext';
import { properties } from '../data/properties';
import { DISTRICT_BOUNDARIES } from '../data/districtBoundaries';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocalization } from '../utils/localization';

// Tell MapLibre where to find its Web Worker.
// Vite's ?url suffix copies the file to dist/assets/ and returns its URL.
// Without this, MapLibre cannot spawn a worker and renders nothing.
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
maplibregl.setWorkerUrl(maplibreWorkerUrl);


export default function MapViewEnhanced() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightParam = searchParams.get('highlight');
  const { t } = useTranslation();
  const {
    localizeDistrict,
    localizeLocation,
    localizeRoadType,
    formatSmartPrice,
    formatDigits,
    formatNumber,
    formatINRLocalized,
  } = useLocalization();

  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedPropId, setSelectedPropId] = useState<string | null>(highlightParam);

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
      center: filterDistrict === 'Raigad' ? [73.15, 18.65] : filterDistrict === 'Palghar' ? [72.95, 19.45] : [73.0, 19.0],
      zoom: filterDistrict ? 9.6 : 8.2,
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

      // Add District Boundaries GeoJSON Layer to clearly delineate Palghar & Raigad
      map.addSource('district-boundaries', {
        type: 'geojson',
        data: DISTRICT_BOUNDARIES as any,
      });

      // Layer 1: Fill polygon for each district with transparent brand tint
      map.addLayer({
        id: 'district-fills',
        type: 'fill',
        source: 'district-boundaries',
        paint: {
          'fill-color': ['get', 'fillColor'],
          'fill-opacity': 0.85,
        },
      });

      // Layer 2: Prominent dashed borders clearly marking outer district limits
      map.addLayer({
        id: 'district-lines',
        type: 'line',
        source: 'district-boundaries',
        paint: {
          'line-color': ['get', 'borderColor'],
          'line-width': 2.5,
          'line-dasharray': [3, 2],
        },
      });

      // Add property markers
      filteredProperties.forEach((p) => {
        const isHighlighted = p.id === (selectedPropId || highlightParam);
        const el = document.createElement('div');
        el.style.cssText = `
          width: ${isHighlighted ? '36px' : '28px'};
          height: ${isHighlighted ? '36px' : '28px'};
          background: ${isHighlighted ? '#ea580c' : p.district === 'Raigad' ? '#16a34a' : '#2563eb'};
          border: ${isHighlighted ? '3px solid #ffedd5' : '2px solid white'};
          border-radius: 50%;
          cursor: pointer;
          box-shadow: ${isHighlighted ? '0 0 15px rgba(234, 88, 12, 0.8), 0 4px 10px rgba(0,0,0,0.4)' : '0 2px 6px rgba(0,0,0,0.3)'};
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.2s;
          transform: ${isHighlighted ? 'scale(1.15)' : 'scale(1)'};
          z-index: ${isHighlighted ? '50' : '1'};
        `;
        el.innerHTML = `<span style="color:white;font-size:${isHighlighted ? '13px' : '10px'};font-weight:bold;">₹</span>`;
        el.title = `${p.surveyNumber} — ${p.district}`;
        el.addEventListener('click', () => setSelectedPropId(p.id));

        new maplibregl.Marker({ element: el })
          .setLngLat(p.coordinates)
          .addTo(map);
      });

      // If a property was requested to be highlighted from URL, pan and zoom to it
      if (highlightParam) {
        const targetProp = properties.find((p) => p.id === highlightParam);
        if (targetProp) {
          map.flyTo({
            center: targetProp.coordinates,
            zoom: 13,
            duration: 1200,
          });
        }
      }
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
          className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded text-sm font-medium hover:opacity-95 shadow-sm transition-all whitespace-nowrap"
          onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
        >
          {viewMode === 'map' ? t('explore.listView') : t('explore.mapView')}
        </button>
        <button
          className="px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200 rounded text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
          onClick={() => setShowFilters(!showFilters)}
        >
          {t('explore.filters')} {filterDistrict || filterTaluka || filterVillage || minArea !== '' || maxPrice !== '' || maxRoadDist !== '' ? '●' : ''}
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

        {/* Quick District Focus Toggle */}
        <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200">
          <button
            onClick={() => {
              setFilterDistrict('');
              if (mapRef.current) {
                mapRef.current.flyTo({ center: [73.0, 19.0], zoom: 8.2, duration: 1000 });
              }
            }}
            className={`px-2 py-1 rounded text-xs font-bold transition-all ${
              filterDistrict === ''
                ? 'bg-white text-stone-800 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setFilterDistrict('Raigad');
              if (mapRef.current) {
                mapRef.current.flyTo({ center: [73.15, 18.65], zoom: 9.6, duration: 1000 });
              }
            }}
            className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all ${
              filterDistrict === 'Raigad'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block" />
            Raigad
          </button>
          <button
            onClick={() => {
              setFilterDistrict('Palghar');
              if (mapRef.current) {
                mapRef.current.flyTo({ center: [72.95, 19.45], zoom: 9.6, duration: 1000 });
              }
            }}
            className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all ${
              filterDistrict === 'Palghar'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-blue-700 hover:bg-blue-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-300 inline-block" />
            Palghar
          </button>
        </div>

        <span className="ml-auto text-xs text-gray-500 whitespace-nowrap pl-1">{t('home.listingsCount', { count: formatDigits(filteredProperties.length) })}</span>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-gray-50 border-b border-gray-200 p-3 grid grid-cols-2 sm:flex sm:flex-wrap gap-2 z-10 flex-shrink-0 w-full">
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="border bg-white rounded px-2 py-1.5 text-sm w-full sm:w-auto"
          >
            <option value="">{t('explore.allDistricts')}</option>
            <option value="Raigad">Raigad</option>
            <option value="Palghar">Palghar</option>
          </select>
          <input
            type="text"
            placeholder={t('explore.talukaPlaceholder')}
            value={filterTaluka}
            onChange={(e) => setFilterTaluka(e.target.value)}
            className="border bg-white rounded px-2 py-1.5 text-sm w-full sm:w-28"
          />
          <input
            type="text"
            placeholder={t('explore.villagePlaceholder')}
            value={filterVillage}
            onChange={(e) => setFilterVillage(e.target.value)}
            className="border bg-white rounded px-2 py-1.5 text-sm w-full sm:w-28"
          />
          <input
            type="number"
            placeholder={t('explore.minAreaPlaceholder')}
            value={minArea}
            onChange={(e) => setMinArea(e.target.value ? Number(e.target.value) : '')}
            className="border bg-white rounded px-2 py-1.5 text-sm w-full sm:w-32"
          />
          <input
            type="number"
            placeholder={t('explore.maxPricePlaceholder')}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
            className="border bg-white rounded px-2 py-1.5 text-sm w-full sm:w-32"
          />
          <input
            type="number"
            placeholder={t('explore.maxRoadPlaceholder')}
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
            {t('explore.clear')}
          </button>
        </div>
      )}

      {/* Map / List area */}
      <div className="relative flex-1 overflow-hidden">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-20">
            <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-gray-600 text-sm">{t('explore.loadingMap')}</p>
            <p className="text-gray-400 text-xs mt-1">{t('explore.connectingTiles')}</p>
          </div>
        )}

        {/* Error overlay */}
        {!isLoading && mapError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-20 p-6 text-center">
            <div className="text-4xl mb-3">🗺️</div>
            <p className="text-red-600 font-medium mb-1">{t('explore.mapUnavailable')}</p>
            <p className="text-gray-500 text-sm mb-4">{mapError}</p>
            <button
              onClick={initMap}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded font-medium hover:opacity-95 shadow-sm transition-all"
            >
              {t('explore.retry')}
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="mt-2 px-4 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300"
            >
              {t('explore.viewListInstead')}
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
              <p className="text-gray-500 text-center mt-8">{t('explore.noMatch')}</p>
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
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${p.district === 'Raigad' ? 'bg-amber-100 text-amber-800' : 'bg-orange-100 text-orange-800'}`}>
                      {localizeDistrict(p.district)}
                    </span>
                  </div>
                  <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-medium">{t('common.demoUnverified')}</span>
                </div>
                <p className="text-sm text-gray-600">{localizeLocation(p.village, p.taluka, p.district)}</p>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mt-2 text-sm">
                  <span className="text-gray-700">📐 {formatNumber(p.areaAcres)} {t('common.acres')} ({formatNumber(p.areaAcres * 40)} {t('common.gunthas')})</span>
                  <span className="text-emerald-700 font-semibold">{formatINRLocalized(p.totalPrice)}</span>
                  <span className="text-xs text-gray-500">
                    ({formatSmartPrice(p.totalPrice)} · {formatINRLocalized(p.pricePerGuntha)} / {t('common.guntha')})
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded text-xs font-medium hover:opacity-95 shadow-sm transition-all"
                    onClick={(e) => { e.stopPropagation(); navigate(`/property/${p.id}`); }}
                  >
                    {t('common.viewDetails')}
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                    onClick={(e) => { e.stopPropagation(); toggleSave(p.id); }}
                  >
                    {savedIds.includes(p.id) ? '♥ ' + t('common.saved') : '♡ ' + t('common.save')}
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
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${selectedProperty.district === 'Raigad' ? 'bg-amber-100 text-amber-800' : 'bg-orange-100 text-orange-800'}`}>
                  {localizeDistrict(selectedProperty.district)}
                </span>
              </div>
              <button onClick={() => setSelectedPropId(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                {t('common.demoUnverified')}
              </span>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                📍 {t('explore.demoLocationNotice')}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600 space-y-1">
              {/* Synthetic Listing Location & Illustrative Coordinates Banner */}
              <div className="bg-amber-50/70 border border-amber-200/90 rounded-lg p-2 text-xs text-amber-900 space-y-0.5">
                <div className="flex items-center gap-1 font-bold text-[#C54E12]">
                  <span>🌾 Synthetic Property Listing</span>
                </div>
                <p className="font-semibold text-gray-800">
                  Demo Village: {selectedProperty.village} · Taluka: {selectedProperty.taluka} · District: {selectedProperty.district}
                </p>
                <p className="text-[11px] text-gray-500 font-mono">
                  Illustrative Map Coordinates: {selectedProperty.coordinates[1].toFixed(4)}°N, {selectedProperty.coordinates[0].toFixed(4)}°E
                </p>
              </div>

              <p className="font-medium text-gray-700">
                📐 {formatNumber(selectedProperty.areaAcres)} {t('common.acres')} ({formatNumber(selectedProperty.areaAcres * 40)} {t('common.gunthas')})
              </p>
              <p className="text-emerald-700 font-bold">
                {formatINRLocalized(selectedProperty.totalPrice)} <span className="text-xs text-gray-500 font-normal">{t('explore.asking')}</span>
                <span className="block text-xs text-gray-500 font-normal">
                  {formatSmartPrice(selectedProperty.totalPrice)} · {formatINRLocalized(selectedProperty.pricePerGuntha)} / {t('common.guntha')}
                </span>
              </p>
              {selectedProperty.roadDistanceMeters && (
                <p className="text-xs text-gray-500">
                  🛣️ ~{formatDigits(selectedProperty.roadDistanceMeters)}m {localizeRoadType(selectedProperty.roadType)} ({t('common.estimated')})
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
                {t('propertyDetails.searchMahabhulekh')}
              </a>
              <div className="flex gap-2">
                <button
                  className="flex-1 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded text-sm font-medium hover:opacity-95 shadow-sm transition-all"
                  onClick={() => navigate(`/property/${selectedProperty.id}`)}
                >
                  {t('common.viewDetails')}
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
