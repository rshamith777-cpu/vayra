import React from "react";
import { CurrentWeather, describeWeatherCode } from "../services/weather";
import { Wind, Droplets, Gauge, CloudRain, Sun, Cloud, Eye } from "lucide-react";

export function CurrentConditionsCard({ weather }: { weather: CurrentWeather | null }) {
  if (!weather) {
    return (
      <div
        style={{
          background: "var(--white)",
          padding: "18px",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--line)",
          color: "var(--ink-50)",
          fontSize: "13px",
        }}
      >
        Loading live meteorological telemetry…
      </div>
    );
  }

  const desc = describeWeatherCode(weather.weatherCode);

  return (
    <div
      style={{
        background: "var(--white)",
        borderRadius: "var(--radius-lg)",
        padding: "20px",
        border: "1px solid var(--line)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: "1px solid var(--line-light)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: weather.source === "open-meteo" ? "var(--green)" : "var(--orange)",
            }}
          />
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", color: "var(--ink-70)" }}>
            LIVE TELEMETRY · {weather.source.toUpperCase()}
          </span>
        </div>
        <span style={{ fontSize: "11px", color: "var(--ink-30)" }}>
          {new Date(weather.fetchedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "18px" }}>
        <span style={{ fontSize: "36px", fontWeight: 800, color: "var(--charcoal)", lineHeight: 1 }}>
          {weather.temperatureC.toFixed(1)}°C
        </span>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--charcoal)" }}>{desc.label}</div>
          <div style={{ fontSize: "12px", color: "var(--ink-50)" }}>
            Feels like {weather.feelsLikeC.toFixed(1)}°C
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "12px",
        }}
      >
        <div
          style={{
            background: "var(--paper)",
            padding: "10px 12px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--line-light)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Droplets size={18} color="var(--blue)" />
          <div>
            <div style={{ fontSize: "10px", color: "var(--ink-50)", fontWeight: 600 }}>HUMIDITY</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--charcoal)" }}>
              {weather.humidityPct}%
            </div>
          </div>
        </div>

        <div
          style={{
            background: "var(--paper)",
            padding: "10px 12px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--line-light)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <CloudRain size={18} color="var(--blue)" />
          <div>
            <div style={{ fontSize: "10px", color: "var(--ink-50)", fontWeight: 600 }}>PRECIPITATION</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--charcoal)" }}>
              {weather.precipitationMm.toFixed(1)} mm
            </div>
          </div>
        </div>

        <div
          style={{
            background: "var(--paper)",
            padding: "10px 12px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--line-light)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Wind size={18} color="var(--ink-70)" />
          <div>
            <div style={{ fontSize: "10px", color: "var(--ink-50)", fontWeight: 600 }}>WIND SPEED</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--charcoal)" }}>
              {weather.windSpeedKmh.toFixed(1)} km/h
            </div>
          </div>
        </div>

        <div
          style={{
            background: "var(--paper)",
            padding: "10px 12px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--line-light)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Gauge size={18} color="var(--moderate-deep)" />
          <div>
            <div style={{ fontSize: "10px", color: "var(--ink-50)", fontWeight: 600 }}>PRESSURE</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--charcoal)" }}>
              {Math.round(weather.surfacePressureHpa)} hPa
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
