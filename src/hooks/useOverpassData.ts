import { useEffect, useState, useRef } from 'react';
import debounce from 'lodash.debounce';
import osmtogeojson from 'osmtogeojson';

type OverpassFeature = GeoJSON.Feature;

type OverpassResult = {
  type: 'FeatureCollection';
  features: OverpassFeature[];
};

/** Simple in‑memory cache for Overpass requests */
const overpassCache = new Map<string, OverpassResult>();

/** Build Overpass QL query */
function buildQuery(type: 'farmland' | 'roads', bbox: [number, number, number, number]): string {
  const [west, south, east, north] = bbox;
  const bboxStr = `${south},${west},${north},${east}`; // south,west,north,east
  if (type === 'farmland') {
    return `[out:json][timeout:25];(way["landuse"="farmland"](${bboxStr});relation["landuse"="farmland"](${bboxStr}););out geom;`;
  }
  // roads
  return `[out:json][timeout:25];(way["highway"](${bboxStr});relation["highway"](${bboxStr}););out geom;`;
}

/** Convert Overpass JSON to GeoJSON using osmtogeojson */
function overpassToGeoJSON(data: any): OverpassResult {
  // osmtogeojson returns a FeatureCollection
  const geo = (osmtogeojson as any)(data);
  // Filter out any features without geometry or unsupported types
  const filtered = (geo.features as any[]).filter((f) => f.geometry && f.geometry.type);
  return { type: 'FeatureCollection', features: filtered as OverpassFeature[] };
}

/** Hook to fetch Overpass data with debouncing, caching, abort handling */
export function useOverpassData(type: 'farmland' | 'roads', bbox: [number, number, number, number] | null) {
  const [data, setData] = useState<OverpassResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = debounce(async (box: [number, number, number, number]) => {
    const cacheKey = `${type}-${box.join(',')}`;
    if (overpassCache.has(cacheKey)) {
      setData(overpassCache.get(cacheKey)!);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const query = buildQuery(type, box);
      const resp = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
        signal: controller.signal,
        headers: { 'Content-Type': 'text/plain' },
      });
      if (!resp.ok) throw new Error(`Overpass request failed: ${resp.status}`);
      const json = await resp.json();
      const geo = overpassToGeoJSON(json);
      overpassCache.set(cacheKey, geo);
      setData(geo);
    } catch (e: any) {
      if (e.name !== 'AbortError') setError(e.message);
    } finally {
      setLoading(false);
    }
  }, 500) as any;

  useEffect(() => {
    if (!bbox) return;
    fetchData(bbox);
    return () => {
      abortRef.current?.abort();
      fetchData.cancel();
    };
  }, [type, bbox?.join(',')]);

  return { data, loading, error };
}
