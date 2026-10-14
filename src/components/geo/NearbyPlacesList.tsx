import React from 'react';
import { Compass, MapPin, LandPlot, Mountain, Landmark } from 'lucide-react';
import type { GeoFeature } from '../../types';

interface NearbyPlacesListProps {
  features: GeoFeature[];
}

export const NearbyPlacesList: React.FC<NearbyPlacesListProps> = ({ features }) => {
  const getPoiIcon = (type: string) => {
    switch (type) {
      case 'bridge':
        return '🌉';
      case 'river':
        return '🌊';
      case 'mountain':
        return '🏔️';
      case 'monument':
        return '🏯';
      default:
        return '📍';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 subtle-shadow space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Geographic Intelligence</h3>
            <p className="text-xs text-slate-500">Points of interest along the 10km railway corridor</p>
          </div>
        </div>
      </div>

      {/* Corridor Alert Card */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-xl shadow-md flex items-center gap-3">
        <span className="text-2xl">🌉</span>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-100">Approaching POI</div>
          <div className="text-sm font-extrabold">Chambal River Bridge</div>
          <div className="text-xs text-emerald-100 mt-0.5">Approx. 1.2 km ahead on current track</div>
        </div>
      </div>

      {/* Features List */}
      <div className="space-y-3">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start gap-3"
          >
            <div className="text-2xl p-2 bg-white rounded-xl shadow-sm border border-slate-200/60">
              {getPoiIcon(feature.type)}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{feature.name}</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {feature.distanceFromRouteKm} km off route
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
