import { useEffect, useRef, useState, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import { useSaved } from '../context/SavedPropertiesContext';
import { properties, type Property } from '../data/properties';
import { DISTRICT_BOUNDARIES } from '../data/districtBoundaries';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocalization } from '../utils/localization';
import { filterProperties } from '../utils/propertyFilter';

// Tell MapLibre where to find its Web Worker.
// Vite's ?url suffix copies the file to dist/assets/ and returns its URL.
// Without this, MapLibre cannot spawn a worker and renders nothing.
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
maplibregl.setWorkerUrl(maplibreWorkerUrl);

export default function MapViewEnhanced() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const isMapLoadedRef = useRef(false);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get('q') || '';
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

  // Search input state (synchronized with URL query parameter)
  const [searchInput, setSearchInput] = useState(qParam);

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

  // Synchronize search input if URL changes externally
  useEffect(() => {
    setSearchInput(qParam);
  }, [qParam]);

  // Synchronize highlighted property if URL changes
  useEffect(() => {
    if (highlightParam) {
      setSelectedPropId(highlightParam);
    }
  }, [highlightParam]);

  // Centralized filtering pipeline: produced once and shared across List, Map, and Counters
  const filteredProperties = useMemo(() => {
    return filterProperties(properties, {
      query: qParam,
      district: filterDistrict,
      taluka: filterTaluka,
      village: filterVillage,
      minArea: minArea,
      maxPrice: maxPrice,
      maxRoadDist: maxRoadDist,
    });
  }, [qParam, filterDistrict, filterTaluka, filterVillage, minArea, maxPrice, maxRoadDist]);

  const styleUrls = {
    liberty: 'https://tiles.openfreemap.org/styles/liberty',
    positron: 'https://tiles.openfreemap.org/styles/positron',
    bright: 'https://tiles.openfreemap.org/styles/bright',
  };

  // Helper: update property markers on existing map instance
  const updateMarkers = (map: maplibregl.Map, propsToRender: Property[]) => {
    // Remove existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    propsToRender.forEach((p) => {
      const isHighlighted = p.id === (selectedPropId || highlightParam);
      const el = document.createElement('div');
      el.style.cssText = `
        width: ${isHighlighted ? '36px' : '28px'};
        height: ${isHighlighted ? '36px' : '28px'};
        background: ${isHighlighted ? '#ea580c' : p.district === 'Raigad' ? '#16a34a' : '#2563eb'};
        border: ${isHighlighted ? '3px solid #ffedd5' : '2px solid white'};
        border-radius: 50%;
        cursor: pointer;
        box-shadow: ${
          isHighlighted
            ? '0 0 15px rgba(234, 88, 12, 0.8), 0 4px 10px rgba(0,0,0,0.4)'
            : '0 2px 6px rgba(0,0,0,0.3)'
        };
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.2s;
        transform: ${isHighlighted ? 'scale(1.15)' : 'scale(1)'};
        z-index: ${isHighlighted ? '50' : '1'};
      `;
      el.innerHTML = `<span style="color:white;font-size:${
        isHighlighted ? '13px' : '10px'
      };font-weight:bold;">₹</span>`;
      el.title = `${p.surveyNumber} — ${p.district}`;
      el.addEventListener('click', () => setSelectedPropId(p.id));

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(p.coordinates)
        .addTo(map);

      markersRef.current.push(marker);
    });
  };

  // Helper: auto focus camera based on search results
  const autoFocusMap = (map: maplibregl.Map, propsToFit: Property[]) => {
    // 1. Explicit highlight deep link
    if (highlightParam) {
      const targetProp = properties.find((p) => p.id === highlightParam);
      if (targetProp) {
        map.flyTo({
          center: targetProp.coordinates,
          zoom: 13,
          duration: 1000,
        });
        setSelectedPropId(targetProp.id);
        return;
      }
    }

    // 2. Single property result
    if (propsToFit.length === 1) {
      const single = propsToFit[0];
      map.flyTo({
        center: single.coordinates,
        zoom: 13,
        duration: 1000,
      });
      setSelectedPropId(single.id);
      return;
    }

    // 3. Multiple property results: fit bounding box with mobile-friendly padding
    if (propsToFit.length > 1) {
      // If user is just looking at all 200 without filters/search, use default district center
      const hasActiveSearchOrFilter =
        Boolean(qParam) ||
        Boolean(filterDistrict) ||
        Boolean(filterTaluka) ||
        Boolean(filterVillage) ||
        minArea !== '' ||
        maxPrice !== '' ||
        maxRoadDist !== '';

      if (hasActiveSearchOrFilter) {
        const bounds = new maplibregl.LngLatBounds();
        propsToFit.forEach((p) => bounds.extend(p.coordinates));
        map.fitBounds(bounds, {
          padding: { top: 70, bottom: 70, left: 50, right: 50 },
          maxZoom: 13,
          duration: 1000,
        });
      }
      return;
    }

    // 4. Zero results: clear selection
    if (propsToFit.length === 0) {
      setSelectedPropId(null);
    }
  };

  const initMap = () => {
    if (!mapContainer.current) return;

    // Clean up previous instance
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      isMapLoadedRef.current = false;
    }

    setIsLoading(true);
    setMapError(null);

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrls[mapStyle],
      center:
        filterDistrict === 'Raigad'
          ? [73.15, 18.65]
          : filterDistrict === 'Palghar'
          ? [72.95, 19.45]
          : [73.0, 19.0],
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
      isMapLoadedRef.current = true;

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

      // Render markers and focus camera
      updateMarkers(map, filteredProperties);
      autoFocusMap(map, filteredProperties);
    });

    map.on('error', (e: { error?: { message?: string } }) => {
      clearTimeout(timeout);
      setIsLoading(false);
      setMapError(`Map error: ${e.error?.message ?? 'Unknown error'}`);
    });

    mapRef.current = map;
  };

  // Initialize or re-style map
  useEffect(() => {
    initMap();
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        isMapLoadedRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStyle]);

  // Synchronize markers and auto-focus whenever filteredProperties changes
  useEffect(() => {
    if (mapRef.current && isMapLoadedRef.current) {
      updateMarkers(mapRef.current, filteredProperties);
      autoFocusMap(mapRef.current, filteredProperties);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredProperties, highlightParam]);

  // Update marker styles when selectedPropId changes
  useEffect(() => {
    if (mapRef.current && isMapLoadedRef.current) {
      updateMarkers(mapRef.current, filteredProperties);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPropId]);

  // Ensure map resizes whenever the container changes size or view mode changes
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

  // When switching back to map view, ensure canvas is resized
  useEffect(() => {
    if (viewMode === 'map' && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.resize();
      }, 50);
    }
  }, [viewMode]);

  // Search submission handler (updates URL search params)
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchInput.trim();
    const nextParams = new URLSearchParams(searchParams);
    if (trimmed) {
      nextParams.set('q', trimmed);
    } else {
      nextParams.delete('q');
    }
    setSearchParams(nextParams, { replace: true });
  };

  // Clear search handler
  const handleClearSearch = () => {
    setSearchInput('');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('q');
    setSearchParams(nextParams, { replace: true });
  };

  // Clear all structured filters
  const handleClearAllFilters = () => {
    setFilterDistrict('');
    setFilterTaluka('');
    setFilterVillage('');
    setMinArea('');
    setMaxPrice('');
    setMaxRoadDist('');
  };

  const selectedProperty = properties.find((p) => p.id === selectedPropId);

  return (
    <div className="relative w-full h-full flex flex-col min-w-0">
      {/* ──────────────────────────────────────────
          1. Top Search Bar
      ────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-3 py-2 flex flex-col gap-1.5 z-20 flex-shrink-0">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-gray-100 rounded-xl px-3 py-1.5 border border-gray-200 focus-within:bg-white focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all shadow-2xs">
            <Search size={16} className="text-amber-600 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t('explore.searchPlaceholder')}
              enterKeyHint="search"
              className="w-full bg-transparent text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 outline-none font-medium"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1 text-gray-400 hover:text-gray-600 mr-1"
                title={t('explore.clearSearch')}
                aria-label={t('explore.clearSearch')}
              >
                <X size={15} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 flex-shrink-0"
          >
            {t('common.search')}
          </button>
        </form>

        {/* Active Search Pill */}
        {qParam && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-500">{t('explore.activeSearch')}:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-200">
              "{qParam}"
              <button
                onClick={handleClearSearch}
                className="hover:text-amber-950 font-bold ml-0.5"
                title={t('explore.clearSearch')}
              >
                ×
              </button>
            </span>
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────
          2. Toolbar
      ────────────────────────────────────────── */}
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
          {t('explore.filters')}{' '}
          {filterDistrict ||
          filterTaluka ||
          filterVillage ||
          minArea !== '' ||
          maxPrice !== '' ||
          maxRoadDist !== ''
            ? '●'
            : ''}
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

        <span className="ml-auto text-xs text-gray-500 whitespace-nowrap pl-1">
          {t('home.listingsCount', { count: formatDigits(filteredProperties.length) })}
        </span>
      </div>

      {/* ──────────────────────────────────────────
          3. Filter Panel
      ────────────────────────────────────────── */}
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
            onClick={handleClearAllFilters}
          >
            {t('explore.clear')}
          </button>
        </div>
      )}

      {/* ──────────────────────────────────────────
          4. Map / List View Area
      ────────────────────────────────────────── */}
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

        {/* Empty Search Overlay on Map View */}
        {viewMode === 'map' && filteredProperties.length === 0 && !isLoading && !mapError && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 max-w-sm w-[90%] bg-white/95 backdrop-blur-sm border border-amber-200 rounded-xl p-3.5 shadow-lg text-center space-y-2">
            <div className="text-2xl">🔍</div>
            <p className="text-sm font-bold text-gray-800">
              {qParam ? t('explore.noPropertiesFoundFor', { query: qParam }) : t('explore.noMatch')}
            </p>
            <p className="text-xs text-gray-500">
              No properties match your current search and filters. Unrelated markers are hidden.
            </p>
            <div className="flex justify-center gap-2 pt-1">
              {qParam && (
                <button
                  onClick={handleClearSearch}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold shadow-xs"
                >
                  {t('explore.clearSearch')}
                </button>
              )}
              {(filterDistrict ||
                filterTaluka ||
                filterVillage ||
                minArea !== '' ||
                maxPrice !== '' ||
                maxRoadDist !== '') && (
                <button
                  onClick={handleClearAllFilters}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs font-semibold"
                >
                  {t('explore.clear')} Filters
                </button>
              )}
            </div>
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
              <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-gray-200 text-center space-y-3 mt-6">
                <div className="text-3xl">🌾</div>
                <h3 className="text-base font-bold text-gray-800">
                  {qParam ? t('explore.noPropertiesFoundFor', { query: qParam }) : t('explore.noMatch')}
                </h3>
                <p className="text-xs text-gray-500 max-w-sm">
                  We couldn't find any properties matching your current criteria. Try clearing the
                  search term or adjusting filters.
                </p>
                <div className="flex gap-2 pt-2">
                  {qParam && (
                    <button
                      onClick={handleClearSearch}
                      className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                    >
                      {t('explore.clearSearch')}
                    </button>
                  )}
                  {(filterDistrict ||
                    filterTaluka ||
                    filterVillage ||
                    minArea !== '' ||
                    maxPrice !== '' ||
                    maxRoadDist !== '') && (
                    <button
                      onClick={handleClearAllFilters}
                      className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-all"
                    >
                      {t('explore.clear')} Filters
                    </button>
                  )}
                </div>
              </div>
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
                    <span
                      className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${
                        p.district === 'Raigad'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {localizeDistrict(p.district)}
                    </span>
                  </div>
                  <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    {t('common.demoUnverified')}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {localizeLocation(p.village, p.taluka, p.district)}
                </p>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mt-2 text-sm">
                  <span className="text-gray-700">
                    📐 {formatNumber(p.areaAcres)} {t('common.acres')} (
                    {formatNumber(p.areaAcres * 40)} {t('common.gunthas')})
                  </span>
                  <span className="text-emerald-700 font-semibold">
                    {formatINRLocalized(p.totalPrice)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({formatSmartPrice(p.totalPrice)} · {formatINRLocalized(p.pricePerGuntha)} /{' '}
                    {t('common.guntha')})
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded text-xs font-medium hover:opacity-95 shadow-sm transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/property/${p.id}`);
                    }}
                  >
                    {t('common.viewDetails')}
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(p.id);
                    }}
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
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedProperty.district === 'Raigad'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {localizeDistrict(selectedProperty.district)}
                </span>
              </div>
              <button
                onClick={() => setSelectedPropId(null)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
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
                  Demo Village: {selectedProperty.village} · Taluka: {selectedProperty.taluka} ·
                  District: {selectedProperty.district}
                </p>
                <p className="text-[11px] text-gray-500 font-mono">
                  Illustrative Map Coordinates: {selectedProperty.coordinates[1].toFixed(4)}°N,{' '}
                  {selectedProperty.coordinates[0].toFixed(4)}°E
                </p>
              </div>

              <p className="font-medium text-gray-700">
                📐 {formatNumber(selectedProperty.areaAcres)} {t('common.acres')} (
                {formatNumber(selectedProperty.areaAcres * 40)} {t('common.gunthas')})
              </p>
              <p className="text-emerald-700 font-bold">
                {formatINRLocalized(selectedProperty.totalPrice)}{' '}
                <span className="text-xs text-gray-500 font-normal">{t('explore.asking')}</span>
                <span className="block text-xs text-gray-500 font-normal">
                  {formatSmartPrice(selectedProperty.totalPrice)} ·{' '}
                  {formatINRLocalized(selectedProperty.pricePerGuntha)} / {t('common.guntha')}
                </span>
              </p>
              {selectedProperty.roadDistanceMeters && (
                <p className="text-xs text-gray-500">
                  🛣️ ~{formatDigits(selectedProperty.roadDistanceMeters)}m{' '}
                  {localizeRoadType(selectedProperty.roadType)} ({t('common.estimated')})
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
