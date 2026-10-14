import React from 'react';
import type { Station } from '../../types';
import { CheckCircle2, Radio, Circle } from 'lucide-react';

interface StationTimelineProps {
  stations: Station[];
  currentStationCode?: string;
  nextStationCode?: string;
}

export const StationTimeline: React.FC<StationTimelineProps> = ({
  stations,
  currentStationCode,
  nextStationCode,
}) => {
  const currentIndex = stations.findIndex((s) => s.code === currentStationCode);

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-6 shadow-xl space-y-5">
      {/* Header */}
      <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
        Station Route Timeline
      </h3>

      {/* Station List */}
      <div className="space-y-4">
        {stations.map((st, idx) => {
          const isPassed = currentIndex !== -1 && idx < currentIndex;
          const isCurrent = st.code === currentStationCode;
          const isNext = st.code === nextStationCode;

          return (
            <div
              key={st.code}
              className={`flex items-start justify-between p-2 rounded-2xl transition-all ${
                isCurrent ? 'bg-cyan-50/70 border border-cyan-200/80 shadow-sm' : ''
              }`}
            >
              {/* Left Side: Icon + Station Name + Platform & Distance */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  {isPassed ? (
                    <div className="w-5 h-5 rounded-full text-emerald-500 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full text-cyan-600 flex items-center justify-center animate-pulse">
                      <Radio className="w-5 h-5 text-cyan-600" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full text-slate-300 flex items-center justify-center">
                      <Circle className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`font-bold text-sm tracking-tight ${
                        isCurrent ? 'text-cyan-900 font-extrabold' : 'text-slate-800'
                      }`}
                    >
                      {st.name} ({st.code})
                    </span>

                    {st.platform && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200/60">
                        PF {st.platform}
                      </span>
                    )}

                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-cyan-100 text-cyan-800 border border-cyan-200">
                        LIVE LOCATION
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-400 font-medium mt-0.5">
                    {st.distanceFromSourceKm} km
                  </div>
                </div>
              </div>

              {/* Right Side: Arrival Time & Delay Badge */}
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-extrabold text-slate-900 tracking-tight">
                  {st.actualArrival || st.scheduledArrival}
                </div>

                {st.delayMinutes === 0 ? (
                  <div className="text-xs font-bold text-emerald-600 mt-0.5">On Time</div>
                ) : st.delayMinutes && st.delayMinutes > 0 ? (
                  <div className="text-xs font-bold text-amber-700 mt-0.5">
                    +{st.delayMinutes}m delay
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 mt-0.5">On Schedule</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
