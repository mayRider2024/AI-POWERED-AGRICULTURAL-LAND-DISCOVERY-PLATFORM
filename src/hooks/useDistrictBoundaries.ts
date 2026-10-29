import { useEffect, useState, useRef } from 'react';

export type DistrictFeature = {
  name: string;
  feature: GeoJSON.Feature;
};

/**
 * Hook to fetch ADM2 district boundaries for India from GeoBoundaries and filter
 * for the requested district names (case‑insensitive).
 * Returns the matching features, loading state and any error.
 */
export function useDistrictBoundaries(districtNames: string[]) {
  const [features, setFeatures] = useState<DistrictFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple in‑memory cache for the full GeoJSON collection
  const cacheRef = useRef<Map<string, GeoJSON.FeatureCollection>>(new Map());

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchBoundaries() {
      setLoading(true);
      setError(null);
      try {
        // 1️⃣ Fetch metadata to obtain the GeoJSON download URL
        const metaResp = await fetch('https://www.geoboundaries.org/api/current/gbOpen/IND/ADM2/', { signal });
        if (!metaResp.ok) {
          throw new Error(`GeoBoundaries metadata request failed with status ${metaResp.status}`);
        }
        const metaData = await metaResp.json();
        const geojsonUrl: string = metaData.gjDownloadURL;
        if (!geojsonUrl) {
          throw new Error('GeoJSON download URL missing in metadata');
        }
        // 2️⃣ Retrieve or download the GeoJSON FeatureCollection
        let featureCollection: GeoJSON.FeatureCollection;
        const cache = cacheRef.current;
        if (cache.has(geojsonUrl)) {
          featureCollection = cache.get(geojsonUrl)!;
        } else {
          const fcResp = await fetch(geojsonUrl, { signal });
          if (!fcResp.ok) {
            throw new Error(`GeoJSON download failed with status ${fcResp.status}`);
          }
          featureCollection = await fcResp.json();
          cache.set(geojsonUrl, featureCollection);
        }
        // 3️⃣ Filter for requested districts (case‑insensitive, handle alternate spellings)
        const normalized = districtNames.map((n) => n.toLowerCase().trim());
        const matched: DistrictFeature[] = [];
        for (const f of featureCollection.features) {
          const props: any = f.properties ?? {};
          const name = (props.shapeName ?? props.name ?? '').toString().toLowerCase();
          if (normalized.some((dn) => name.includes(dn))) {
            matched.push({ name: props.shapeName ?? props.name ?? 'Unnamed', feature: f });
          }
        }
        setFeatures(matched);
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          setError(e.message);
        }
      } finally {
        setLoading(false);
      }
    }
    if (districtNames.length > 0) {
      fetchBoundaries();
    } else {
      setFeatures([]);
    }
    return () => {
      controller.abort();
    };
  }, [districtNames.join(',')]);

  return { features, loading, error };
}

