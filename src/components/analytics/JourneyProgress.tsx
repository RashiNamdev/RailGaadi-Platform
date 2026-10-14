import React from 'react';
import { Flag, Navigation, ShieldCheck } from 'lucide-react';

interface JourneyProgressProps {
  sourceName: string;
  destinationName: string;
  completionPercentage: number;
  distanceCoveredKm: number;
  totalDistanceKm: number;
  distanceRemainingKm: number;
}

export const JourneyProgress: React.FC<JourneyProgressProps> = ({
  sourceName,
  destinationName,
  completionPercentage,
  distanceCoveredKm,
  totalDistanceKm,
  distanceRemainingKm,
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 subtle-shadow space-y-3">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
        <span className="flex items-center gap-1">
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          Journey Completion
        </span>
        <span className="text-blue-600 font-extrabold text-sm">{completionPercentage}%</span>
      </div>

      {/* Track Bar */}
      <div className="relative w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-full transition-all duration-700 ease-out shadow-inner"
          style={{ width: `${Math.min(100, Math.max(0, completionPercentage))}%` }}
        />
      </div>

      {/* Station Indicators & Km Stats */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 pt-1">
        <div>
          <span className="text-slate-400 block font-normal text-[10px]">ORIGIN</span>
          <span className="truncate max-w-[120px] inline-block">{sourceName}</span>
        </div>

        <div className="text-center bg-slate-100/80 px-3 py-1 rounded-xl border border-slate-200/60">
          <span className="font-extrabold text-blue-700">{distanceCoveredKm.toLocaleString()} km</span>
          <span className="text-slate-400 font-normal"> / {totalDistanceKm.toLocaleString()} km</span>
          <span className="text-slate-500 text-[11px] block">{distanceRemainingKm.toLocaleString()} km left</span>
        </div>

        <div className="text-right">
          <span className="text-slate-400 block font-normal text-[10px]">DESTINATION</span>
          <span className="truncate max-w-[120px] inline-block">{destinationName}</span>
        </div>
      </div>
    </div>
  );
};
