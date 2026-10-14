import React, { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import type * as GeoJSON from 'geojson';
import { Plus, Minus, Navigation, Box, Maximize2 } from 'lucide-react';
import type { Train, LiveTrainStatus, GeoFeature } from '../../types';
import { useAppStore } from '../../stores/useAppStore';
import { config } from '../../config';

interface JourneyMapProps {
  train?: Train | null;
  status?: LiveTrainStatus | null;
  geoFeatures?: GeoFeature[];
  className?: string;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({
  train,
  status,
  geoFeatures = [],
  className = 'w-full h-full min-h-[440px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const trainMarkerRef = useRef<maplibregl.Marker | null>(null);
  const stationMarkersRef = useRef<maplibregl.Marker[]>([]);

  const mapMode = useAppStore((s) => s.mapMode);
  const setMapMode = useAppStore((s) => s.setMapMode);
  const is3DPitch = useAppStore((s) => s.is3DPitch);
  const toggle3DPitch = useAppStore((s) => s.toggle3DPitch);

  const getStyleUrl = (): string => {
    const key = config.apiKeys.mapTiler;
    if (key) {
      return `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${key}`;
    }
    return 'https://tiles.openfreemap.org/styles/positron';
  };

  // Helper: Render Vibrant Electric Cyan Route Line & Glowing Train Marker
  const renderRouteLayers = (
    map: maplibregl.Map,
    currentTrain?: Train | null,
    currentStatus?: LiveTrainStatus | null
  ) => {
    if (!map) return;

    // 1. Clean up station markers
    stationMarkersRef.current.forEach((m) => m.remove());
    stationMarkersRef.current = [];

    // 2. Render route lines if train geometry exists
    if (currentTrain && currentTrain.geometry && currentTrain.geometry.length > 0) {
      const routeGeoJSON: GeoJSON.Feature<GeoJSON.LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: currentTrain.geometry,
        },
      };

      if (map.getSource('route-source')) {
        (map.getSource('route-source') as maplibregl.GeoJSONSource).setData(routeGeoJSON);
      } else {
        map.addSource('route-source', {
          type: 'geojson',
          data: routeGeoJSON,
        });

        // Outer Cyan Glow
        map.addLayer({
          id: 'route-glow',
          type: 'line',
          source: 'route-source',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#06B6D4',
            'line-width': 10,
            'line-opacity': 0.35,
          },
        });

        // Electric Cyan Route Line
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route-source',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#00F0FF',
            'line-width': 4,
          },
        });
      }

      // Render Station Dots along Route
      currentTrain.stations.forEach((st) => {
        const el = document.createElement('div');
        const isCurrent = currentStatus?.currentStation?.code === st.code;

        el.className = `w-3.5 h-3.5 rounded-full border-2 cursor-pointer transition-all ${
          isCurrent
            ? 'bg-cyan-400 border-white ring-4 ring-cyan-500/50 scale-125'
            : 'bg-slate-900 border-cyan-400 shadow-sm'
        }`;

        const popup = new maplibregl.Popup({ offset: 12 }).setHTML(`
          <div style="padding: 4px; font-family: sans-serif;">
            <div style="font-weight: 800; color: #0F172A; font-size: 13px;">${st.name} (${st.code})</div>
            <div style="font-size: 11px; color: #64748B; margin-top: 2px;">Arrival: <b>${st.actualArrival || st.scheduledArrival}</b></div>
            ${st.platform ? `<div style="font-size: 10px; color: #0284C7; font-weight: 700; margin-top: 2px;">Platform ${st.platform}</div>` : ''}
          </div>
        `);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([st.longitude, st.latitude])
          .setPopup(popup)
          .addTo(map);

        stationMarkersRef.current.push(marker);
      });
    }

    // 3. Render High-Visibility Live Train Marker
    if (currentStatus && typeof currentStatus.longitude === 'number' && typeof currentStatus.latitude === 'number') {
      if (trainMarkerRef.current) {
        trainMarkerRef.current.remove();
        trainMarkerRef.current = null;
      }

      const trainEl = document.createElement('div');
      trainEl.className = 'relative flex items-center justify-center cursor-pointer';
      trainEl.style.zIndex = '50';
      trainEl.innerHTML = `
        <div class="relative flex items-center justify-center">
          <!-- Outer Pulsing Halo Ring -->
          <div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(6, 182, 212, 0.4); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background: rgba(0, 240, 255, 0.25); filter: blur(4px);"></div>
          
          <!-- Inner Glowing Core -->
          <div style="position: relative; width: 36px; height: 36px; border-radius: 9999px; background: linear-gradient(135deg, #06b6d4, #00f0ff); color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(6, 182, 212, 0.9); border: 2.5px solid white;">
            <span style="font-size: 16px; transform: rotate(${currentStatus.bearing || 0}deg); display: inline-block;">🚆</span>
          </div>

          <!-- Live Train Label Pill -->
          <div style="position: absolute; top: -26px; white-space: nowrap; background: rgba(15, 23, 42, 0.92); color: #67e8f9; font-weight: 800; font-size: 10px; padding: 2px 8px; border-radius: 9999px; border: 1px solid rgba(6, 182, 212, 0.6); box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
            LIVE • ${currentStatus.trainNumber}
          </div>
        </div>
      `;

      const trainPopup = new maplibregl.Popup({ offset: 20 }).setHTML(`
        <div style="padding: 4px; font-family: sans-serif;">
          <div style="font-weight: 900; color: #0891B2; font-size: 13px;">🚆 ${currentStatus.trainName} (${currentStatus.trainNumber})</div>
          <div style="font-size: 11px; color: #334155; margin-top: 3px;">
            Live Location: <b>${currentStatus.currentStation?.name || 'On Track'}</b>
          </div>
          <div style="font-size: 11px; color: #334155; margin-top: 2px;">
            Speed: <b>${currentStatus.currentSpeedKmH} km/h</b> | Delay: <b style="color: ${currentStatus.delayMinutes > 0 ? '#D97706' : '#059669'};">${currentStatus.delayMinutes > 0 ? `+${currentStatus.delayMinutes}m` : 'On Time'}</b>
          </div>
        </div>
      `);

      trainMarkerRef.current = new maplibregl.Marker({ element: trainEl })
        .setLngLat([currentStatus.longitude, currentStatus.latitude])
        .setPopup(trainPopup)
        .addTo(map);
    }
  };

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialCenter: [number, number] = status
      ? [status.longitude, status.latitude]
      : [75.8648, 25.2138];

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getStyleUrl(),
      center: initialCenter,
      zoom: status ? 8.5 : 6.8,
      pitch: is3DPitch ? 45 : 0,
      attributionControl: false,
    });

    map.on('load', () => {
      mapRef.current = map;
      map.resize();

      if (status && mapMode === 'follow') {
        map.setCenter([status.longitude, status.latitude]);
      }

      renderRouteLayers(map, train, status);
    });

    map.on('style.load', () => {
      renderRouteLayers(map, train, status);
    });

    const handleResize = () => map.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (trainMarkerRef.current) {
        trainMarkerRef.current.remove();
        trainMarkerRef.current = null;
      }
      stationMarkersRef.current.forEach((m) => m.remove());
      stationMarkersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Route and Markers when train or status updates
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (map.isStyleLoaded()) {
      renderRouteLayers(map, train, status);
    } else {
      map.once('style.load', () => renderRouteLayers(map, train, status));
    }

    if (mapMode === 'follow' && status) {
      map.easeTo({
        center: [status.longitude, status.latitude],
        zoom: 9.5,
        duration: 800,
      });
    }
  }, [train, status]);

  // Handle Camera Modes & Pitch
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.setPitch(is3DPitch ? 45 : 0);

    if (mapMode === 'follow' && status) {
      map.easeTo({
        center: [status.longitude, status.latitude],
        zoom: 9.5,
        duration: 800,
      });
    } else if (mapMode === 'overview' && train && train.geometry.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      train.geometry.forEach((coord) => bounds.extend(coord));
      map.fitBounds(bounds, { padding: 60, duration: 1000 });
    }
  }, [mapMode, is3DPitch]);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();

  const handleRecenterTrain = () => {
    setMapMode('follow');
    if (mapRef.current && status) {
      mapRef.current.flyTo({
        center: [status.longitude, status.latitude],
        zoom: 9.5,
        speed: 1.4,
      });
    }
  };

  const handleOverviewRoute = () => {
    setMapMode('overview');
    if (mapRef.current && train && train.geometry.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      train.geometry.forEach((coord) => bounds.extend(coord));
      mapRef.current.fitBounds(bounds, { padding: 60, duration: 1000 });
    }
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 ${className}`}>
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[440px]" />

      {/* Top Right Floating Controls (Zoom +, Zoom -, Recenter / Fit, 3D Pitch) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 rounded-full bg-slate-900/90 text-white hover:bg-slate-800 border border-slate-700/80 backdrop-blur-md flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          onClick={handleZoomOut}
          className="w-10 h-10 rounded-full bg-slate-900/90 text-white hover:bg-slate-800 border border-slate-700/80 backdrop-blur-md flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>

        <button
          onClick={handleOverviewRoute}
          className="w-10 h-10 rounded-full bg-slate-900/90 text-white hover:bg-slate-800 border border-slate-700/80 backdrop-blur-md flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
          title="Fit Route to Screen"
        >
          <Maximize2 className="w-4 h-4 text-cyan-400" />
        </button>

        <button
          onClick={toggle3DPitch}
          className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg border transition-transform active:scale-95 cursor-pointer ${
            is3DPitch
              ? 'bg-cyan-500 text-white border-cyan-400 shadow-cyan-500/40'
              : 'bg-slate-900/90 text-white hover:bg-slate-800 border-slate-700/80'
          }`}
          title="Toggle 2D / 3D Pitch"
        >
          <Box className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Left Mode Pill (Following Train Button) */}
      <div className="absolute bottom-4 left-4 z-10">
        <button
          onClick={handleRecenterTrain}
          className={`px-4 py-2 rounded-full backdrop-blur-md text-xs font-semibold shadow-xl flex items-center gap-2 border transition-all cursor-pointer ${
            mapMode === 'follow'
              ? 'bg-slate-900/90 text-cyan-400 border-cyan-500/50 shadow-cyan-500/20'
              : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:text-white'
          }`}
          title="Click to center map on live train"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{mapMode === 'follow' ? '🛡️ Following Train' : '📍 Center on Live Train'}</span>
        </button>
      </div>

      {/* Bottom Right MapTiler Attribution Pill */}
      <div className="absolute bottom-3 right-4 z-10 text-[10px] text-slate-400 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 flex items-center gap-1.5 shadow-sm">
        <span>© MapTiler © OpenStreetMap contributors</span>
        <span className="w-3.5 h-3.5 rounded-full bg-slate-800 flex items-center justify-center text-[9px] text-white">i</span>
      </div>
    </div>
  );
};
