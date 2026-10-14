import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Wind, Droplets, Thermometer, Sparkles, Eye, Gauge, Compass } from 'lucide-react';
import type { ExtendedWeather } from '../../services/openWeatherService';
import { fetchLiveOpenWeather } from '../../services/openWeatherService';

interface WeatherCardProps {
  locationName?: string;
  latitude?: number;
  longitude?: number;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  locationName = 'Kota Junction',
  latitude = 25.2138,
  longitude = 75.8648,
}) => {
  const [weatherData, setWeatherData] = useState<ExtendedWeather | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchLiveOpenWeather(locationName, latitude, longitude)
      .then((data) => {
        if (isMounted) {
          setWeatherData(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [locationName, latitude, longitude]);

  const getWeatherIcon = (cond: string) => {
    switch (cond) {
      case 'Sunny':
      case 'Clear':
        return <Sun className="w-8 h-8 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />;
      case 'Rainy':
      case 'Thunderstorm':
        return <CloudRain className="w-8 h-8 text-blue-400" />;
      default:
        return <Cloud className="w-8 h-8 text-slate-300" />;
    }
  };

  if (loading || !weatherData) {
    return (
      <div className="bg-gradient-to-br from-blue-600 to-indigo-900 text-white rounded-2xl p-5 subtle-shadow-lg animate-pulse h-64 flex items-center justify-center">
        <span className="text-sm font-semibold">Fetching OpenWeather Companion...</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 text-white rounded-2xl p-5 subtle-shadow-lg relative overflow-hidden space-y-4">
      <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-200 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          OpenWeather Companion
        </div>
        <span className="text-xs bg-white/15 px-3 py-0.5 rounded-full backdrop-blur-md border border-white/10 font-bold">
          📍 {weatherData.locationName}
        </span>
      </div>

      {/* Main Temperature Breakdown */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="text-4xl font-black tracking-tight">{weatherData.temperature}°C</div>
          <div className="text-xs font-semibold text-blue-200 mt-1 flex items-center gap-2">
            <span>{weatherData.condition}</span>
            <span>•</span>
            <span>Feels like {weatherData.feelsLike}°C</span>
          </div>
        </div>
        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
          {getWeatherIcon(weatherData.condition)}
        </div>
      </div>

      {/* 4-Metric Weather Grid */}
      <div className="grid grid-cols-4 gap-2 pt-2 text-xs">
        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md text-center">
          <Droplets className="w-3.5 h-3.5 mx-auto text-blue-300 mb-1" />
          <div className="text-[10px] text-blue-200">Humidity</div>
          <div className="font-extrabold">{weatherData.humidity}%</div>
        </div>

        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md text-center">
          <Wind className="w-3.5 h-3.5 mx-auto text-blue-300 mb-1" />
          <div className="text-[10px] text-blue-200">Wind</div>
          <div className="font-extrabold">{weatherData.windSpeed} km/h</div>
        </div>

        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md text-center">
          <Eye className="w-3.5 h-3.5 mx-auto text-blue-300 mb-1" />
          <div className="text-[10px] text-blue-200">Visibility</div>
          <div className="font-extrabold">{weatherData.visibilityKm} km</div>
        </div>

        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md text-center">
          <Gauge className="w-3.5 h-3.5 mx-auto text-blue-300 mb-1" />
          <div className="text-[10px] text-blue-200">Pressure</div>
          <div className="font-extrabold">{weatherData.pressure} hPa</div>
        </div>
      </div>

      {/* Hourly Weather Strip */}
      <div className="pt-2 border-t border-white/10">
        <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200 mb-2">
          Route Corridor Hourly Forecast
        </div>
        <div className="flex items-center justify-between text-xs">
          {weatherData.hourlyForecast.map((hour, idx) => (
            <div key={idx} className="flex flex-col items-center bg-white/5 px-3 py-1.5 rounded-lg">
              <span className="text-[10px] text-blue-300 font-medium">{hour.time}</span>
              <span className="font-extrabold my-0.5">{hour.temp}°C</span>
              <span className="text-[9px] text-blue-200">{hour.condition}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const WeatherStrip: React.FC = () => {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 subtle-shadow flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-700">
      <div className="flex items-center gap-2">
        <span>Mumbai</span>
        <Sun className="w-4 h-4 text-amber-500" />
        <span className="font-bold">29°C</span>
      </div>
      <span className="text-slate-300">→</span>
      <div className="flex items-center gap-2">
        <span>Kota (Current)</span>
        <Cloud className="w-4 h-4 text-slate-400" />
        <span className="font-bold text-blue-600">27°C</span>
      </div>
      <span className="text-slate-300">→</span>
      <div className="flex items-center gap-2">
        <span>New Delhi</span>
        <CloudRain className="w-4 h-4 text-blue-500" />
        <span className="font-bold">24°C</span>
      </div>
    </div>
  );
};
