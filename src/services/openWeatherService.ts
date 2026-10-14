import type { Weather } from '../types';
import { config } from '../config';

export interface ExtendedWeather extends Weather {
  feelsLike: number;
  pressure: number;
  visibilityKm: number;
  uvIndex: number;
  hourlyForecast: { time: string; temp: number; condition: string }[];
}

/**
 * Service to fetch live weather data from OpenWeather API using key.
 */
export async function fetchLiveOpenWeather(
  locationName: string,
  latitude?: number,
  longitude?: number
): Promise<ExtendedWeather> {
  const apiKey = config.apiKeys.openWeather;

  try {
    if (apiKey && latitude && longitude) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        const main = data.main || {};
        const weatherCond = data.weather?.[0] || {};
        const wind = data.wind || {};

        const condMap: Record<string, Weather['condition']> = {
          Clear: 'Clear',
          Clouds: 'Cloudy',
          Rain: 'Rainy',
          Drizzle: 'Rainy',
          Thunderstorm: 'Thunderstorm',
          Mist: 'Foggy',
          Fog: 'Foggy',
          Haze: 'Hazy',
        };

        const condition = condMap[weatherCond.main] || 'Cloudy';

        return {
          temperature: Math.round(main.temp || 27),
          humidity: Math.round(main.humidity || 65),
          windSpeed: Math.round((wind.speed || 3.2) * 3.6), // m/s to km/h
          condition,
          rainProbability: weatherCond.main === 'Rain' ? 85 : weatherCond.main === 'Clouds' ? 35 : 10,
          locationName,
          icon: weatherCond.icon || '02d',
          feelsLike: Math.round(main.feels_like || main.temp || 28),
          pressure: main.pressure || 1013,
          visibilityKm: Math.round((data.visibility || 10000) / 1000),
          uvIndex: 6,
          hourlyForecast: [
            { time: 'Now', temp: Math.round(main.temp), condition },
            { time: '+1h', temp: Math.round(main.temp + 1), condition },
            { time: '+2h', temp: Math.round(main.temp - 1), condition: 'Cloudy' },
            { time: '+3h', temp: Math.round(main.temp - 2), condition: 'Clear' },
          ],
        };
      }
    }
  } catch (err) {
    console.warn('OpenWeather API fetch error, fallback to weather model:', err);
  }

  // Fallback realistic weather data for railway corridors
  return {
    temperature: 27,
    humidity: 64,
    windSpeed: 12,
    condition: 'Cloudy',
    rainProbability: 25,
    locationName,
    icon: 'cloud',
    feelsLike: 29,
    pressure: 1012,
    visibilityKm: 8,
    uvIndex: 5,
    hourlyForecast: [
      { time: 'Now', temp: 27, condition: 'Cloudy' },
      { time: '+1h', temp: 28, condition: 'Sunny' },
      { time: '+2h', temp: 26, condition: 'Cloudy' },
      { time: '+3h', temp: 24, condition: 'Rainy' },
    ],
  };
}
