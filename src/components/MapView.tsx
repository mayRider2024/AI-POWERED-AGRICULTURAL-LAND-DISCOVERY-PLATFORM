import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from '../context/ThemeContext';

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mapContainer.current) return;
    const styleUrl = theme === 'dark'
      ? 'https://demotiles.maplibre.org/style-dark.json'
      : 'https://demotiles.maplibre.org/style.json';

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: [73.8567, 19.0760], // Center on Maharashtra (approx Mumbai)
      zoom: 6,
    });

    map.addControl(new maplibregl.NavigationControl());
    map.addControl(new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }));
    map.addControl(new maplibregl.FullscreenControl());

    map.on('load', () => {
      setIsLoading(false);
    });

    mapInstance.current = map;
    return () => {
      map.remove();
    };
  }, [theme]);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-800/70 z-10">
          <span className="text-gray-700 dark:text-gray-200">Loading map...</span>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
