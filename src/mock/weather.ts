/**
 * SIMULATED weather baseline.
 *
 * Used ONLY when no live weather provider is reachable (Open-Meteo
 * offline, optional providers unconfigured). Every value is synthetic
 * and must be presented in the UI as "SIMULATED BASELINE" — never as a
 * live observation.
 */
import { CurrentWeather } from "@/services/types";

export const SIMULATED_CURRENT_WEATHER: CurrentWeather = {
  temperatureC: 21.4,
  feelsLikeC: 22.8,
  humidityPct: 84,
  precipitationMm: 4.2,
  rainMm: 4.2,
  windSpeedKmh: 11.3,
  windDirectionDeg: 205,
  surfacePressureHpa: 1012.6,
  weatherCode: 61, // light rain — matches monsoon cloudburst season profile
  cloudCoverPct: 92,
  isDay: true,
  source: "simulated",
  fetchedAt: new Date().toISOString(),
};
