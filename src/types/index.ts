export type TrainStatus = 
  | 'ON_TIME' 
  | 'DELAYED' 
  | 'EARLY' 
  | 'AT_STATION' 
  | 'DEPARTED' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'NOT_STARTED' 
  | 'DATA_UNAVAILABLE';

export interface Station {
  code: string;
  name: string;
  state?: string;
  latitude: number;
  longitude: number;
  sequence: number;
  scheduledArrival: string;   // e.g. "14:20" or "Source"
  scheduledDeparture: string; // e.g. "14:30" or "Destination"
  actualArrival?: string;     // e.g. "14:42"
  actualDeparture?: string;
  delayMinutes?: number;
  distanceFromSourceKm: number;
  platform?: string;
  haltMinutes?: number;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface LiveTrainStatus {
  trainNumber: string;
  trainName: string;
  latitude: number;
  longitude: number;
  bearing: number; // in degrees for smooth train marker rotation
  currentStation?: Station;
  nextStation?: Station;
  previousStation?: Station;
  status: TrainStatus;
  delayMinutes: number;
  distanceCoveredKm: number;
  distanceRemainingKm: number;
  totalDistanceKm: number;
  completionPercentage: number;
  currentSpeedKmH: number;
  lastUpdated: string;
  isStale?: boolean;
}

export interface Train {
  trainNumber: string;
  name: string;
  type: 'RAJDHANI' | 'VANDE_BHARAT' | 'SHATABDI' | 'EXPRESS' | 'SUPERFAST' | 'DURONTO';
  source: string;
  sourceCode: string;
  destination: string;
  destinationCode: string;
  totalDistanceKm: number;
  durationMinutes: number;
  runsOn: string[]; // ['Mon', 'Tue', 'Wed', ...]
  stations: Station[];
  geometry: [number, number][]; // LineString [lon, lat] points
}

export interface Weather {
  temperature: number; // Celsius
  humidity: number;    // %
  windSpeed: number;   // km/h
  condition: 'Sunny' | 'Clear' | 'Cloudy' | 'Rainy' | 'Thunderstorm' | 'Foggy' | 'Hazy';
  rainProbability: number; // %
  locationName: string;
  icon: string;
}

export type POIType = 'bridge' | 'river' | 'lake' | 'mountain' | 'tunnel' | 'monument' | 'city';

export interface GeoFeature {
  id: string;
  name: string;
  type: POIType;
  description: string;
  latitude: number;
  longitude: number;
  distanceFromRouteKm: number;
  imageUrl?: string;
}

export interface StationETA {
  station: Station;
  scheduledTime: string;
  expectedETA: string;
  delayMinutes: number;
  status: 'PASSED' | 'CURRENT' | 'NEXT' | 'UPCOMING';
}

export interface JourneyAnalytics {
  completionPercentage: number;
  distanceTravelledKm: number;
  distanceRemainingKm: number;
  currentDelayMinutes: number;
  delayTrend: 'improving' | 'worsening' | 'stable';
  averageSpeedKmH: number;
  maxSpeedKmH: number;
  elevationData: { distanceKm: number; elevationMeters: number }[];
  highestElevationMeters: number;
  lowestElevationMeters: number;
}
