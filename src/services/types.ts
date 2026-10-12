export type WeatherSource =
  | "open-meteo"
  | "openweather"
  | "weatherbit"
  | "simulated";

export interface CurrentWeather {
  temperatureC: number;
  feelsLikeC: number;
  humidityPct: number;
  precipitationMm: number;
  rainMm: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  surfacePressureHpa: number;
  weatherCode: number;
  cloudCoverPct: number;
  isDay: boolean;
  source: WeatherSource;
  fetchedAt: string;
}

export interface HourlyWeatherPoint {
  time: string;
  hourLabel: string;
  temperatureC: number;
  precipitationMm: number;
  precipitationProbabilityPct: number | null;
  windSpeedKmh: number;
  weatherCode: number;
}

export function describeWeatherCode(code: number): {
  label: string;
  icon: "sunny" | "partly-sunny" | "cloudy" | "rainy" | "thunderstorm" | "snow" | "fog";
} {
  if (code === 0) return { label: "Clear Sky", icon: "sunny" };
  if (code <= 2) return { label: "Partly Cloudy", icon: "partly-sunny" };
  if (code === 3) return { label: "Overcast", icon: "cloudy" };
  if (code === 45 || code === 48) return { label: "Dense Fog", icon: "fog" };
  if (code >= 51 && code <= 57) return { label: "Light Drizzle", icon: "rainy" };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82))
    return { label: "Rain / Downpour", icon: "rainy" };
  if (code >= 71 && code <= 77) return { label: "Snowfall", icon: "snow" };
  if (code >= 85 && code <= 86) return { label: "Snow Showers", icon: "snow" };
  if (code >= 95) return { label: "Severe Thunderstorm", icon: "thunderstorm" };
  return { label: "Cloudy", icon: "cloudy" };
}
