import React, { useState } from 'react';
import { useTrainData } from '../../hooks/useTrainData';
import { useAppStore } from '../../stores/useAppStore';
import { TrainHeader } from '../../components/train/TrainHeader';
import { StationTimeline } from '../../components/train/StationTimeline';
import { JourneyProgress } from '../../components/analytics/JourneyProgress';
import { AnalyticsCard } from '../../components/analytics/AnalyticsCard';
import { ElevationChart } from '../../components/analytics/ElevationChart';
import { WeatherCard, WeatherStrip } from '../../components/weather/WeatherCard';
import { NearbyPlacesList } from '../../components/geo/NearbyPlacesList';
import { JourneyMap } from '../../components/map/JourneyMap';
import { JourneyDashboardSkeleton } from '../../components/common/Skeleton';
import { SearchBar } from '../../components/common/SearchBar';
import { useUpdateTicker } from '../../hooks/useTrainData';
import { MapPin, Sun, Mountain, ArrowLeft, RefreshCw, AlertTriangle, Sparkles } from 'lucide-react';

export const JourneyDashboard: React.FC = () => {
  const { train, liveStatus, weather, geoFeatures, analytics, isLoading, isError, refetchStatus } =
    useTrainData();

  const [activeFeatureTab, setActiveFeatureTab] = useState<'map' | 'weather' | 'elevation'>('map');

  const setSelectedTrainNumber = useAppStore((s) => s.setSelectedTrainNumber);
  const secondsAgo = useUpdateTicker(liveStatus?.lastUpdated);

  if (isLoading) return <JourneyDashboardSkeleton />;

  if (isError || !train || !liveStatus) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Live Train Data Unavailable</h2>
        <p className="text-slate-500 max-w-md text-sm">
          Unable to connect to live railway tracking servers right now. Please verify your internet or try again.
        </p>
        <button
          onClick={() => refetchStatus()}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-12 pt-4 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Search & Navigation Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
        <button
          onClick={() => setSelectedTrainNumber('12951')}
          className="self-start text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Search another train</span>
        </button>
        <div className="w-full md:w-auto flex-1 max-w-xl">
          <SearchBar />
        </div>
      </div>

      {/* Train Metadata Header */}
      <TrainHeader train={train} status={liveStatus} onRefresh={refetchStatus} />

      {/* Auto-refresh Status Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Auto-refreshes every 30 seconds</span>
        </div>
        <div>Updated {secondsAgo}s ago</div>
      </div>

      {/* 3 Feature Selector Pills */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          onClick={() => setActiveFeatureTab('map')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeFeatureTab === 'map'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 ring-2 ring-cyan-400'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Interactive Vector Map</span>
        </button>

        <button
          onClick={() => setActiveFeatureTab('weather')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeFeatureTab === 'weather'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Sun className="w-4 h-4" />
          <span>Weather Companion</span>
        </button>

        <button
          onClick={() => setActiveFeatureTab('elevation')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeFeatureTab === 'elevation'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Mountain className="w-4 h-4" />
          <span>Terrain & Elevation</span>
        </button>
      </div>

      {/* Main 2-Column Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Selected Feature (Map / Weather / Elevation) - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          {activeFeatureTab === 'map' && (
            <div className="h-[520px] w-full">
              <JourneyMap train={train} status={liveStatus} geoFeatures={geoFeatures} />
            </div>
          )}

          {activeFeatureTab === 'weather' && (
            <div className="space-y-4">
              <WeatherCard
                locationName={liveStatus.currentStation?.name || 'Kota Junction'}
                latitude={liveStatus.latitude}
                longitude={liveStatus.longitude}
              />
              <WeatherStrip />
            </div>
          )}

          {activeFeatureTab === 'elevation' && (
            <ElevationChart
              geometry={train.geometry}
              totalDistanceKm={train.totalDistanceKm}
              stations={train.stations}
              currentDistanceKm={liveStatus.distanceCoveredKm}
              currentStationName={liveStatus.currentStation?.name}
            />
          )}

          {/* Real-time Journey Progress Bar */}
          <JourneyProgress
            sourceName={train.source}
            destinationName={train.destination}
            completionPercentage={liveStatus.completionPercentage}
            distanceCoveredKm={liveStatus.distanceCoveredKm}
            totalDistanceKm={train.totalDistanceKm}
            distanceRemainingKm={liveStatus.distanceRemainingKm}
          />

          {/* 4-Metric Real Time Cards */}
          <AnalyticsCard status={liveStatus} />

          {/* Geographic Corridor Intelligence */}
          <NearbyPlacesList features={geoFeatures} />
        </div>

        {/* Right Panel: Station Route Timeline - 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          <StationTimeline
            stations={train.stations}
            currentStationCode={liveStatus.currentStation?.code}
            nextStationCode={liveStatus.nextStation?.code}
          />
        </div>
      </div>
    </div>
  );
};
