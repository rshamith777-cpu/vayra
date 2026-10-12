import { CurrentWeather, HourlyWeatherPoint } from "./types";
import { SIMULATED_CURRENT_WEATHER } from "../mock/weather";

const BASE = "https://api.open-meteo.com/v1/forecast";
const TIMEOUT_MS = 5000;
const CACHE_TTL_MS = 10 * 60 * 1000;

let currentCache: { at: number; data: CurrentWeather } | null = null;

async function fetchJson(url: string): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function buildUrl(lat: number, lon: number, hourlyHours: number): string {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,is_day",
    hourly: [
      "temperature_2m",
      "precipitation",
      "precipitation_probability",
      "wind_speed_10m",
      "weather_code",
    ].join(","),
    forecast_hours: String(hourlyHours),
    timezone: "auto",
  });
  return `${BASE}?${params.toString()}`;
}

export async function fetchCurrentWeather(
  lat = 30.4088,
  lon = 79.3202
): Promise<CurrentWeather> {
  const cached = currentCache;
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return { ...cached.data, fetchedAt: cached.data.fetchedAt };
  }
  try {
    const json = await fetchJson(buildUrl(lat, lon, 1));
    const c = json.current;
    const data: CurrentWeather = {
      temperatureC: c.temperature_2m,
      feelsLikeC: c.apparent_temperature,
      humidityPct: c.relative_humidity_2m,
      precipitationMm: c.precipitation,
      rainMm: c.rain,
      windSpeedKmh: c.wind_speed_10m,
      windDirectionDeg: c.wind_direction_10m,
      surfacePressureHpa: c.surface_pressure,
      weatherCode: c.weather_code,
      cloudCoverPct: c.cloud_cover,
      isDay: c.is_day === 1,
      source: "open-meteo",
      fetchedAt: new Date().toISOString(),
    };
    currentCache = { at: Date.now(), data };
    return data;
  } catch (error) {
    console.warn("[weather] Open-Meteo unreachable, using simulated baseline:", error);
    return { ...SIMULATED_CURRENT_WEATHER, fetchedAt: new Date().toISOString() };
  }
}

export async function fetchHourlyForecast(
  lat = 30.4088,
  lon = 79.3202,
  hours = 6
): Promise<HourlyWeatherPoint[]> {
  try {
    const json = await fetchJson(buildUrl(lat, lon, hours));
    const h = json.hourly;
    const now = new Date();
    const points: HourlyWeatherPoint[] = [];
    for (let i = 0; i < Math.min(h.time.length, hours); i++) {
      const time = new Date(h.time[i]);
      const hourLabel =
        i === 0 ? "NOW" : `+${Math.max(1, Math.round((time.getTime() - now.getTime()) / 3600000))}h`;
      points.push({
        time: h.time[i],
        hourLabel,
        temperatureC: h.temperature_2m[i],
        precipitationMm: h.precipitation[i],
        precipitationProbabilityPct:
          h.precipitation_probability && h.precipitation_probability[i] !== undefined
            ? h.precipitation_probability[i]
            : null,
        windSpeedKmh: h.wind_speed_10m[i],
        weatherCode: h.weather_code[i],
      });
    }
    return points;
  } catch (error) {
    console.warn("[weather] Open-Meteo hourly unreachable:", error);
    return [];
  }
}

export * from "./types";
export { fetchCurrentWeather as getCurrentWeather };
