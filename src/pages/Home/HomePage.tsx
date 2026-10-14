import React from 'react';
import { SearchBar } from '../../components/common/SearchBar';
import { POPULAR_TRAINS } from '../../constants';
import { useAppStore } from '../../stores/useAppStore';
import { Train, Navigation, Heart, Clock, Sparkles, ArrowRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const setSelectedTrainNumber = useAppStore((s) => s.setSelectedTrainNumber);
  const favourites = useAppStore((s) => s.favourites);
  const recentSearches = useAppStore((s) => s.recentSearches);

  const favTrains = POPULAR_TRAINS.filter((t) => favourites.includes(t.trainNumber));

  return (
    <div className="min-h-[calc(100vh-80px)] py-10 px-4 md:px-8 max-w-6xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-xs font-bold border border-blue-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Indian Railways Journey Intelligence</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Track any train in India with{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
            live GPS precision
          </span>
        </h1>

        <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed">
          Interactive railway maps, current & next station ETAs, weather intelligence, and geographic features — all in one visual companion.
        </p>
      </div>

      {/* Main Search Bar */}
      <div className="py-2">
        <SearchBar autoFocus />
      </div>

      {/* Favourites Section */}
      {favTrains.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              Saved Favourite Trains
            </h2>
            <span className="text-xs text-slate-400 font-semibold">{favTrains.length} Saved</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favTrains.map((train) => (
              <button
                key={train.trainNumber}
                onClick={() => setSelectedTrainNumber(train.trainNumber)}
                className="text-left bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 subtle-shadow hover:border-blue-400 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-xs font-black bg-blue-100 text-blue-800">
                    {train.trainNumber}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{train.type}</span>
                </div>

                <div className="font-extrabold text-slate-900 text-base mt-2 group-hover:text-blue-600 transition-colors">
                  {train.name}
                </div>

                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                  <span>{train.sourceCode}</span>
                  <ArrowRight className="w-3 h-3 text-slate-300" />
                  <span>{train.destinationCode}</span>
                  <span className="text-slate-400 font-normal">({train.totalDistanceKm} km)</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Indian Railway Corridors */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Navigation className="w-5 h-5 text-blue-600" />
          Popular Railway Corridors
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_TRAINS.map((train) => (
            <button
              key={`popular-${train.trainNumber}`}
              onClick={() => setSelectedTrainNumber(train.trainNumber)}
              className="text-left bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 subtle-shadow hover:border-blue-400 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded text-xs font-black bg-slate-100 text-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {train.trainNumber}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-slate-400">{train.type}</span>
                </div>

                <div className="font-extrabold text-slate-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                  {train.name}
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  {train.source} → {train.destination}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>Track Live</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
