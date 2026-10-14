/**
 * RailGaadi Configuration & API Keys Manager
 */

export interface AppConfig {
  useLiveApi: boolean;
  apiKeys: {
    railRadar: string;
    mapTiler: string;
    openWeather: string;
    openTopography: string;
  };
  apiBaseUrl: string;
  refreshIntervalMs: number;
}

export const config: AppConfig = {
  useLiveApi: import.meta.env.VITE_USE_LIVE_API === 'true',
  
  apiKeys: {
    railRadar: import.meta.env.VITE_RAILRADAR_API_KEY ?? '',
    mapTiler: import.meta.env.VITE_MAPTILER_API_KEY ?? '',
    openWeather: import.meta.env.VITE_OPENWEATHER_API_KEY ?? '',
    openTopography: import.meta.env.VITE_OPENTOPOGRAPHY_API_KEY ?? '',
  },

  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  refreshIntervalMs: 30000, // 30 seconds
};

/**
 * Returns true if RailRadar API key is provided and live tracking is enabled.
 */
export function isLiveTrackingConfigured(): boolean {
  return config.useLiveApi && Boolean(config.apiKeys.railRadar);
}

/**
 * Dynamically update live API key at runtime if needed.
 */
export function setLiveApiKey(keyName: keyof AppConfig['apiKeys'], value: string) {
  config.apiKeys[keyName] = value;
  if (keyName === 'railRadar' && value) {
    config.useLiveApi = true;
  }
}
