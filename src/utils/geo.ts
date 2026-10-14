import type { GeoPoint, Station, LiveTrainStatus, TrainStatus } from '../types';

/**
 * Calculates Great-Circle distance between two coordinates in kilometers (Haversine formula).
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Calculates compass bearing from point A to point B in degrees (0-360).
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const λ1 = (lon1 * Math.PI) / 180;
  const λ2 = (lon2 * Math.PI) / 180;

  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  const θ = Math.atan2(y, x);
  const bearing = ((θ * 180) / Math.PI + 360) % 360;
  return Math.round(bearing);
}

/**
 * Interpolates coordinate between station A and station B given a fraction [0..1].
 */
export function interpolateCoordinate(
  start: GeoPoint,
  end: GeoPoint,
  fraction: number
): GeoPoint {
  const clamped = Math.max(0, Math.min(1, fraction));
  return {
    latitude: start.latitude + (end.latitude - start.latitude) * clamped,
    longitude: start.longitude + (end.longitude - start.longitude) * clamped,
  };
}

/**
 * Generates realistic elevation profile given total route distance.
 */
export function generateElevationProfile(totalDistanceKm: number) {
  const pointsCount = 20;
  const step = totalDistanceKm / pointsCount;
  const points = [];
  let highest = 0;
  let lowest = 9999;

  for (let i = 0; i <= pointsCount; i++) {
    const dist = Math.round(i * step);
    // Base elevation with gentle hill sine wave + slight noise
    const baseElev = Math.round(
      220 + Math.sin(i * 0.4) * 180 + Math.cos(i * 0.9) * 90
    );
    const elevationMeters = Math.max(40, baseElev);
    
    if (elevationMeters > highest) highest = elevationMeters;
    if (elevationMeters < lowest) lowest = elevationMeters;

    points.push({
      distanceKm: dist,
      elevationMeters,
    });
  }

  return {
    points,
    highestElevationMeters: highest,
    lowestElevationMeters: lowest,
  };
}
