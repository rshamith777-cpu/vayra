import React, { useEffect, useState } from "react";
import { fetchHourlyForecast, HourlyWeatherPoint, describeWeatherCode } from "../services/weather";
import { MONITORED_LOCATION } from "../mock/map";
import { MOCK_FORECAST_HOURS, MOCK_RISK_TREND } from "../mock/alerts";
import { RiskLevel } from "../types";
import { SeverityColors } from "../constants/colors";
import { CloudRain, TrendingUp, Sun, Clock } from "lucide-react";

export function ForecastTimelineView() {
  const [hourly, setHourly] = useState<HourlyWeatherPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHourlyForecast(MONITORED_LOCATION.latitude, MONITORED_LOCATION.longitude, 6)
      .then((data) => {
        setHourly(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Risk Outlook Horizon */}
      <div
        style={{
          background: "var(--white)",
          borderRadius: "var(--radius-xl)",
          padding: "24px",
          border: "1px solid var(--line)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--navy-900)", margin: 0 }}>
              6-HOUR MULTI-HAZARD RISK TRAJECTORY
            </h3>
            <div style={{ fontSize: "12px", color: "var(--ink-50)" }}>
              Continuous nowcasting sequence across monitored districts
            </div>
          </div>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--blue)", background: "var(--blue-tint)", padding: "4px 8px", borderRadius: "4px" }}>
            PREDICTIVE HORIZON
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: `repeat(${MOCK_FORECAST_HOURS.length}, 1fr)`, gap: "10px" }}>
          {MOCK_FORECAST_HOURS.map((pt, i) => {
            const sev = SeverityColors[pt.risk];
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "14px 8px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: sev.bg,
                  border: `1px solid ${sev.dot}44`,
                  gap: "6px",
                }}
              >
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--charcoal)" }}>{pt.label}</span>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: sev.dot }} />
                <span style={{ fontSize: "11px", fontWeight: 700, color: sev.fg }}>
                  {pt.risk.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hourly Live Meteorological Outlook */}
      <div
        style={{
          background: "var(--white)",
          borderRadius: "var(--radius-xl)",
          padding: "24px",
          border: "1px solid var(--line)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--navy-900)", margin: 0 }}>
            LIVE METEOROLOGICAL FORECAST (OPEN-METEO)
          </h3>
          <span style={{ fontSize: "12px", color: "var(--ink-50)" }}>Uttarakhand Central Grid</span>
        </div>

        {loading ? (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--ink-50)", fontSize: "13px" }}>
            Querying high-resolution Open-Meteo atmospheric model…
          </div>
        ) : hourly.length === 0 ? (
          <div style={{ padding: "16px", color: "var(--ink-50)", fontSize: "13px" }}>
            Hourly data feed offline. Using cached state.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px" }}>
            {hourly.map((h, i) => {
              const desc = describeWeatherCode(h.weatherCode);
              return (
                <div
                  key={i}
                  style={{
                    padding: "14px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--paper)",
                    border: "1px solid var(--line-light)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--navy-900)" }}>{h.hourLabel}</div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--charcoal)" }}>
                    {h.temperatureC.toFixed(1)}°C
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--ink-70)", fontWeight: 500 }}>{desc.label}</div>
                  <div style={{ fontSize: "11px", color: "var(--blue)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                    <CloudRain size={12} />
                    <span>
                      {h.precipitationProbabilityPct !== null
                        ? `${h.precipitationProbabilityPct}% prob`
                        : `${h.precipitationMm.toFixed(1)} mm`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
