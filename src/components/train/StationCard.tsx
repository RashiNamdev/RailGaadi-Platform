import React from 'react';
import { MapPin, ArrowDown, Clock, Navigation2, Building2 } from 'lucide-react';
import type { Station } from '../../types';

interface StationCardProps {
  currentStation?: Station;
  nextStation?: Station;
  delayMinutes: number;
}

export const StationCard: React.FC<StationCardProps> = ({
  currentStation,
  nextStation,
  delayMinutes,
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 subtle-shadow space-y-4">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
        <span>Journey Corridor</span>
        <span className="text-blue-600 font-semibold flex items-center gap-1">
          <Navigation2 className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          Live GPS Position
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-indigo-500 before:to-emerald-500">
        {/* Current Station */}
        {currentStation && (
          <div className="relative group">
            <div className="absolute -left-[30px] top-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center ring-4 ring-blue-100 shadow-sm">
              <MapPin className="w-3 h-3" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                  CURRENT LOCATION
                </span>
                {currentStation.platform && (
                  <span className="text-xs text-slate-500 font-medium">
                    Platform {currentStation.platform}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                {currentStation.name}
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                  {currentStation.code}
                </span>
              </h3>

              <div className="flex items-center gap-4 text-xs text-slate-600 mt-1.5">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Arrived: </span>
                  <span className="font-semibold text-slate-900">
                    {currentStation.actualArrival || currentStation.scheduledArrival}
                  </span>
                </div>
                {currentStation.state && (
                  <div className="flex items-center gap-1 text-slate-400">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{currentStation.state}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Transition Divider Arrow */}
        <div className="relative flex items-center gap-2 text-slate-300">
          <ArrowDown className="w-4 h-4 text-indigo-500 animate-bounce" />
          <span className="text-[11px] font-medium text-slate-400">En route to next station</span>
        </div>

        {/* Next Station */}
        {nextStation && (
          <div className="relative group">
            <div className="absolute -left-[30px] top-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-emerald-100 shadow-sm">
              <Navigation2 className="w-3 h-3 rotate-45" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  NEXT STOP
                </span>
                {nextStation.platform && (
                  <span className="text-xs text-slate-500 font-medium">
                    Platform {nextStation.platform}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                {nextStation.name}
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                  {nextStation.code}
                </span>
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-1.5">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Expected ETA: </span>
                  <span className="font-extrabold text-emerald-700 text-sm">
                    {nextStation.actualArrival || nextStation.scheduledArrival}
                  </span>
                </div>

                <div className="text-slate-400">
                  Sch: <span className="line-through">{nextStation.scheduledArrival}</span>
                </div>

                {delayMinutes > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    +{delayMinutes}m delay
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
