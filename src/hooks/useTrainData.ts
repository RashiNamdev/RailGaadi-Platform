import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { railService } from '../services/railService';
import { useAppStore } from '../stores/useAppStore';

export function useTrainData() {
  const selectedTrainNumber = useAppStore((s) => s.selectedTrainNumber);

  // Train Details Query
  const trainQuery = useQuery({
    queryKey: ['train', selectedTrainNumber],
    queryFn: () => railService.getTrainByNumber(selectedTrainNumber),
    staleTime: 1000 * 60 * 60, // 1 hr
  });

  // Live Status Query (Auto-refreshes every 30 seconds)
  const statusQuery = useQuery({
    queryKey: ['liveStatus', selectedTrainNumber],
    queryFn: () => railService.getLiveStatus(selectedTrainNumber),
    refetchInterval: 30000,
    staleTime: 10000,
  });

  // Weather Query
  const weatherQuery = useQuery({
    queryKey: ['weather', statusQuery.data?.currentStation?.name],
    queryFn: () =>
      railService.getWeather(statusQuery.data?.currentStation?.name || 'Kota Junction'),
    enabled: !!statusQuery.data?.currentStation,
    staleTime: 1000 * 60 * 10, // 10 min
  });

  // Geo Features Query
  const geoQuery = useQuery({
    queryKey: ['geoFeatures', selectedTrainNumber],
    queryFn: () => railService.getGeoFeatures(),
    staleTime: 1000 * 60 * 60,
  });

  // Analytics Query
  const analyticsQuery = useQuery({
    queryKey: ['analytics', selectedTrainNumber],
    queryFn: () => railService.getAnalytics(selectedTrainNumber),
    enabled: !!statusQuery.data,
    staleTime: 30000,
  });

  return {
    train: trainQuery.data,
    liveStatus: statusQuery.data,
    weather: weatherQuery.data,
    geoFeatures: geoQuery.data || [],
    analytics: analyticsQuery.data,
    isLoading: trainQuery.isLoading || statusQuery.isLoading,
    isError: trainQuery.isError || statusQuery.isError,
    refetchStatus: statusQuery.refetch,
  };
}

/**
 * Hook for live seconds-since-update counter.
 */
export function useUpdateTicker(lastUpdatedTimestamp?: string) {
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    if (!lastUpdatedTimestamp) return;

    const updateCounter = () => {
      const updated = new Date(lastUpdatedTimestamp).getTime();
      const now = Date.now();
      const elapsed = Math.max(0, Math.floor((now - updated) / 1000));
      setSecondsAgo(elapsed);
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, [lastUpdatedTimestamp]);

  return secondsAgo;
}
