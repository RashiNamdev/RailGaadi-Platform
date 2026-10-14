import React from 'react';
import { RefreshCw, Calendar, MapPin, ArrowRight, Signal } from 'lucide-react';
import type { Train, LiveTrainStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { useUpdateTicker } from '../../hooks/useTrainData';
import { useAppStore } from '../../stores/useAppStore';

interface TrainHeaderProps {
  train: Train;
  status?: LiveTrainStatus;
  onRefresh?: () => void;
}

export const TrainHeader: React.FC<TrainHeaderProps> = ({ train, status, onRefresh }) => {
  const secondsAgo = useUpdateTicker(status?.lastUpdated);
  const isLiveTrackingEnabled = useAppStore((s) => s.isLiveTrackingEnabled);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 subtle-shadow space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Train Info */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-blue-600 text-white tracking-wider shadow-sm">
              {train.trainNumber}
            </span>
            <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 uppercase tracking-wide">
              {train.type}
            </span>
            {status && (
              <StatusBadge status={status.status} delayMinutes={status.delayMinutes} size="sm" />
            )}
            <span
              className={`px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${
                isLiveTrackingEnabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <Signal className={`w-3 h-3 ${isLiveTrackingEnabled ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
              <span>{isLiveTrackingEnabled ? 'Live GPS Stream' : 'Simulated GPS'}</span>
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {train.name}
          </h1>

          {/* Route path */}
          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium mt-1">
            <span>{train.source} ({train.sourceCode})</span>
            <ArrowRight className="w-4 h-4 text-blue-500" />
            <span>{train.destination} ({train.destinationCode})</span>
            <span className="text-slate-400 font-normal">({train.totalDistanceKm} km)</span>
          </div>
        </div>

        {/* Live Refresh & Runs On */}
        <div className="flex flex-col items-start md:items-end gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold transition-all border border-slate-200 hover:border-blue-200"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: '10s' }} />
            <span>Updated {secondsAgo}s ago</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Runs: {train.runsOn.join(', ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
