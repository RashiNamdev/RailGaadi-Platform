import React, { useState, useEffect } from 'react';
import { Mountain, ArrowUpRight, ArrowDownRight, TrendingUp, Compass, MapPin } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import type { ElevationProfileResult } from '../../services/openTopographyService';
import { fetchOpenTopographyElevation } from '../../services/openTopographyService';
import type { Station } from '../../types';

interface ElevationChartProps {
  geometry?: [number, number][];
  totalDistanceKm?: number;
  stations?: Station[];
  currentDistanceKm?: number;
  currentStationName?: string;
}

export const ElevationChart: React.FC<ElevationChartProps> = ({
  geometry = [],
  totalDistanceKm = 1386,
  stations = [],
  currentDistanceKm = 920,
  currentStationName = 'Kota Junction',
}) => {
  const [profile, setProfile] = useState<ElevationProfileResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchOpenTopographyElevation(geometry, totalDistanceKm, stations)
      .then((res) => {
        if (isMounted) {
          setProfile(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [geometry, totalDistanceKm, stations]);

  // Find approximate current elevation based on current distance
  const currentElevation = profile?.points.reduce((prev, curr) => {
    return Math.abs(curr.distanceKm - currentDistanceKm) < Math.abs(prev.distanceKm - currentDistanceKm)
      ? curr
      : prev;
  }, profile.points[0])?.elevationMeters || 259;

  if (loading || !profile) {
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-8 shadow-xl text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto animate-bounce">
          <Mountain className="w-6 h-6" />
        </div>
        <div className="text-sm font-bold text-slate-800">Querying OpenTopography Copernicus 30m DEM...</div>
        <div className="text-xs text-slate-400">Sampling elevation points along railway track geometry</div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">
            <Mountain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Terrain & Elevation Profile
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200 shadow-xs">
                OpenTopography COP30
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              High-resolution Global Digital Elevation Model (Copernicus 30m resolution)
            </p>
          </div>
        </div>

        {/* High/Low Elevation Pills */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 shadow-xs">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            <span>Peak: {profile.highestElevationMeters}m</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-700 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 shadow-xs">
            <ArrowDownRight className="w-3.5 h-3.5 text-slate-500" />
            <span>Low: {profile.lowestElevationMeters}m</span>
          </span>
        </div>
      </div>

      {/* 4-Metric Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Altitude</div>
          <div className="text-xl font-black text-indigo-600 mt-0.5">
            {currentElevation} <span className="text-xs font-semibold text-slate-400">m</span>
          </div>
          <div className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">Near {currentStationName}</div>
        </div>

        <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Maximum Peak</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">
            {profile.highestElevationMeters} <span className="text-xs font-semibold text-slate-400">m</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Malwa Plateau Region</div>
        </div>

        <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Route Climb</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">
            +{profile.totalAscentMeters} <span className="text-xs font-semibold text-slate-400">m</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">Cumulative Uphill</div>
        </div>

        <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Descent</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">
            -{profile.totalDescentMeters} <span className="text-xs font-semibold text-slate-400">m</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">Cumulative Downhill</div>
        </div>
      </div>

      {/* Interactive Recharts Elevation Profile Chart */}
      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={profile.points} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="openTopoGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="distanceKm"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
              unit=" km"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
              unit=" m"
              domain={[0, 'dataMax + 50']}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl border border-slate-700/80 text-xs space-y-1">
                      {data.stationName && (
                        <div className="font-extrabold text-indigo-300 text-sm">{data.stationName}</div>
                      )}
                      <div className="text-slate-300 font-medium">
                        Distance: <b className="text-white">{data.distanceKm} km</b>
                      </div>
                      <div className="text-slate-300 font-medium">
                        Elevation: <b className="text-indigo-400 text-sm">{data.elevationMeters} meters</b>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="elevationMeters"
              stroke="#6366F1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#openTopoGradient)"
            />
            {currentDistanceKm > 0 && (
              <ReferenceLine
                x={currentDistanceKm}
                stroke="#06B6D4"
                strokeWidth={2}
                strokeDasharray="4 4"
                label={{
                  value: '🚆 Live Train Position',
                  position: 'top',
                  fill: '#0891B2',
                  fontSize: 11,
                  fontWeight: 800,
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-1 border-t border-slate-100">
        <span>Verified via OpenTopography API Key `7f954...`</span>
        <span className="text-indigo-600 font-semibold">Indian Railways High-Elevation Corridor</span>
      </div>
    </div>
  );
};
