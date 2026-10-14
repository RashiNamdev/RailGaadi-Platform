import React, { useState } from 'react';
import { Train, Heart, Share2, Compass, Layers, Check } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { railService } from '../../services/railService';

export const Header: React.FC = () => {
  const selectedTrainNumber = useAppStore((s) => s.selectedTrainNumber);
  const favourites = useAppStore((s) => s.favourites);
  const toggleFavourite = useAppStore((s) => s.toggleFavourite);
  const isLiveTrackingEnabled = useAppStore((s) => s.isLiveTrackingEnabled);
  const toggleLiveTracking = useAppStore((s) => s.toggleLiveTracking);
  const [copied, setCopied] = useState(false);

  const isFav = favourites.includes(selectedTrainNumber);

  const handleShare = () => {
    const url = railService.getShareUrl(selectedTrainNumber);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between transition-all">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
          <Train className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 bg-clip-text text-transparent">
              RailGaadi
            </span>
            <button
              onClick={toggleLiveTracking}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border ${
                isLiveTrackingEnabled
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm'
                  : 'bg-slate-100 text-slate-600 border-slate-300'
              }`}
              title="Click to toggle Live GPS / Simulation mode"
            >
              <span className={`w-2 h-2 rounded-full ${isLiveTrackingEnabled ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
              <span>{isLiveTrackingEnabled ? 'LIVE GPS: ON' : 'LIVE GPS: OFF'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">
            Immersive Railway Journey Companion
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Favourite Toggle */}
        <button
          onClick={() => toggleFavourite(selectedTrainNumber)}
          className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center gap-2 text-sm font-medium ${
            isFav
              ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm'
              : 'bg-white/80 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
          }`}
          title={isFav ? 'Saved in Favourites' : 'Add to Favourites'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span className="hidden md:inline">{isFav ? 'Saved' : 'Save Train'}</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share Journey</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
