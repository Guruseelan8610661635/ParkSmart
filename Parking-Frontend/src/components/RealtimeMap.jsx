import { useEffect, useRef, useState } from "react";

// Lightweight Leaflet loader without adding dependencies to package.json
const loadLeaflet = () => {
  return new Promise((resolve, reject) => {
    if (window.L) {
      resolve(window.L);
      return;
    }

    const existingScript = document.querySelector('script[data-leaflet-loader="true"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.L));
      existingScript.addEventListener('error', reject);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.setAttribute('data-leaflet-loader', 'true');
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.defer = true;
    script.setAttribute('data-leaflet-loader', 'true');
    script.onload = () => resolve(window.L);
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

export default function RealtimeMap({ locations = [], userLocation, onMarkerClick }) {
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  // Color helpers based on occupancy
  const getMarkerColor = (occupancy = 0) => {
    if (occupancy < 30) return '#16a34a'; // green
    if (occupancy < 70) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  // Lightweight style injector for popup cosmetics
  useEffect(() => {
    const styleId = 'realtime-map-popup-style';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .realtime-map-popup .leaflet-popup-content-wrapper { border-radius: 12px; box-shadow: 0 12px 30px rgba(0,0,0,0.18); padding: 6px; }
      .realtime-map-popup .leaflet-popup-content { margin: 6px 8px; font-size: 12px; }
      .realtime-map-popup strong { display: block; margin-bottom: 4px; }
      .realtime-map-popup small { display: block; margin-top: 4px; color: #4b5563; }
      .location-tooltip .leaflet-tooltip { background-color: rgba(255, 255, 255, 0.95); border: 2px solid #333; border-radius: 8px; padding: 8px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); color: #333; font-weight: 600; }
      .location-tooltip .leaflet-tooltip-top::before { border-top-color: #333; }
    `;
    document.head.appendChild(style);
  }, []);

  // Load Leaflet once
  useEffect(() => {
    let mounted = true;
    loadLeaflet()
      .then(() => mounted && setReady(true))
      .catch(() => {
        if (mounted) setError('Map failed to load. Please check your connection.');
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!ready || !containerRef.current || mapRef.current) return;
    const L = window.L;
    const fallbackCenter = [12.9716, 77.5946]; // Bangalore as safe default
    const firstLocation = locations[0];
    const center = userLocation
      ? [userLocation.lat, userLocation.lon]
      : firstLocation
      ? [firstLocation.latitude || firstLocation.lat, firstLocation.longitude || firstLocation.lon]
      : fallbackCenter;

    mapRef.current = L.map(containerRef.current, {
      zoomControl: false,
    }).setView(center, 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(mapRef.current);
  }, [ready, locations, userLocation]);

  // Update markers when data changes
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const L = window.L;

    // Clear previous markers
    if (layerRef.current) {
      layerRef.current.clearLayers();
      layerRef.current.remove();
    }

    layerRef.current = L.layerGroup().addTo(mapRef.current);

    // User location marker
    if (userLocation?.lat && userLocation?.lon) {
      L.circleMarker([userLocation.lat, userLocation.lon], {
        radius: 8,
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.9,
        weight: 2
      }).addTo(layerRef.current).bindPopup('You are here');
    }

    locations.forEach((loc) => {
      const lat = loc.latitude ?? loc.lat;
      const lon = loc.longitude ?? loc.lon;
      if (lat == null || lon == null) return;

      const occupancy = loc.occupancyPercentage || 0;
      const color = getMarkerColor(occupancy);
      const availableSlots = loc.availableSlots ?? (loc.totalSlots ? Math.max(loc.totalSlots - (loc.occupiedSlots || 0), 0) : undefined);

      // Create custom HTML for marker with location pin icon
      const markerHtml = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background-color: ${color};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          font-size: 20px;
          color: white;
          font-weight: bold;
        ">
          <div style="transform: rotate(45deg);">📍</div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
        className: 'custom-marker-icon'
      });

      const marker = L.marker([lat, lon], { icon: customIcon }).addTo(layerRef.current);

      // Add hover tooltip with location name and slots
      const tooltipHtml = `
        <div style="
          font-weight: bold;
          font-size: 12px;
          text-align: center;
          white-space: nowrap;
        ">
          <div style="margin-bottom: 4px;">${loc.name || 'Parking'}</div>
          <div style="
            background-color: ${color};
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: 700;
          ">
            ${availableSlots !== undefined ? `${availableSlots}/${loc.totalSlots ?? '?'} slots` : 'N/A'}
          </div>
        </div>
      `;

      marker.bindTooltip(tooltipHtml, {
        permanent: false,
        direction: 'top',
        offset: [0, -10],
        className: 'location-tooltip'
      });

      marker.on('click', () => {
        try {
          mapRef.current?.closePopup();
        } catch (_) {}
        // Directly navigate to slots page without modal
        console.log('📍 ===== MARKER CLICKED =====');
        console.log('📍 Location:', loc.name, '| ID:', loc.id);
        console.log('📍 onMarkerClick callback type:', typeof onMarkerClick);
        if (onMarkerClick) {
          console.log('✅ Executing onMarkerClick callback NOW');
          try {
            onMarkerClick(loc);
            console.log('✅ onMarkerClick callback executed successfully');
          } catch (err) {
            console.error('❌ Error in onMarkerClick:', err);
          }
        } else {
          console.warn('⚠️ onMarkerClick is NOT defined!');
        }
        console.log('📍 ===== MARKER CLICK COMPLETE =====');
      });
    });
  }, [ready, locations, userLocation, onMarkerClick]);

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="w-full h-96 rounded-2xl border-2 border-blue-300 shadow-lg overflow-hidden"
      >
        {!ready && !error && (
          <div className="w-full h-full flex items-center justify-center text-sm text-gray-600">
            Loading map...
          </div>
        )}
        {error && (
          <div className="w-full h-full flex items-center justify-center text-sm text-red-600 font-semibold">
            {error}
          </div>
        )}
      </div>
      <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-blue-200 text-xs text-center font-semibold text-gray-700">
        🗺️ Real-time parking markers • <span className="text-green-600">Green: Available</span> • <span className="text-yellow-600">Yellow: Limited</span> • <span className="text-red-600">Red: Full</span>
      </div>
    </div>
  );
}
