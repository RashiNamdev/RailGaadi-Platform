import React from 'react';
import { Gauge, Clock, Map, Award } from 'lucide-react';
import type { LiveTrainStatus } from '../../types';

interface AnalyticsCardProps {
  status: LiveTrainStatus;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ status }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Completion */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 subtle-shadow">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Progress</span>
          <Award className="w-4 h-4 text-blue-600" />
        </div>
        <div className="text-2xl font-black text-slate-900">{status.completionPercentage}%</div>
        <div className="text-xs text-slate-500 mt-1">Journey completed</div>
      </div>

      {/* Distance */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 subtle-shadow">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Travelled</span>
          <Map className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="text-2xl font-black text-slate-900">{status.distanceCoveredKm} <span className="text-sm font-normal text-slate-400">km</span></div>
        <div className="text-xs text-slate-500 mt-1">{status.distanceRemainingKm} km remaining</div>
      </div>

      {/* Delay */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 subtle-shadow">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Delay</span>
          <Clock className="w-4 h-4 text-amber-600" />
        </div>
        <div className={`text-2xl font-black ${status.delayMinutes > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
          {status.delayMinutes > 0 ? `+${status.delayMinutes}m` : 'On Time'}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {status.delayMinutes > 0 ? 'Running behind schedule' : 'Perfect schedule'}
        </div>
      </div>

      {/* Speed */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 subtle-shadow">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Avg Speed</span>
          <Gauge className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-2xl font-black text-slate-900">{status.currentSpeedKmH} <span className="text-sm font-normal text-slate-400">km/h</span></div>
        <div className="text-xs text-slate-500 mt-1">High-speed corridor</div>
      </div>
    </div>
  );
};
