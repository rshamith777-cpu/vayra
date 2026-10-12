import React, { useState } from "react";
import { HISTORICAL_EVENTS } from "../mock/historicalEvents";
import { SeverityColors } from "../constants/colors";
import { Calendar, MapPin, Droplets, Info } from "lucide-react";

export function HistoricalReplayView() {
  const [selectedId, setSelectedId] = useState(HISTORICAL_EVENTS[0].id);
  const event = HISTORICAL_EVENTS.find((e) => e.id === selectedId) ?? HISTORICAL_EVENTS[0];
  const maxRain = Math.max(...event.timeline.map((p) => p.rainfallMm), 1);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Event tabs */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
        {HISTORICAL_EVENTS.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelectedId(e.id)}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--radius-pill)",
              fontSize: "13px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              border: `1px solid ${selectedId === e.id ? "var(--navy-900)" : "var(--line)"}`,
              backgroundColor: selectedId === e.id ? "var(--navy-900)" : "var(--white)",
              color: selectedId === e.id ? "var(--white)" : "var(--ink-70)",
              transition: "all var(--transition-fast)",
            }}
          >
            {e.district} ({e.dateLabel})
          </button>
        ))}
      </div>

      {/* Main Event Details */}
      <div
        style={{
          background: "var(--white)",
          borderRadius: "var(--radius-xl)",
          padding: "24px",
          border: "1px solid var(--line)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--navy-900)", marginBottom: "4px" }}>
              {event.name}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--ink-50)", fontSize: "13px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Calendar size={14} />
                {event.dateLabel}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <MapPin size={14} />
                {event.district}, Uttarakhand
              </span>
            </div>
          </div>

          <span
            style={{
              backgroundColor: "var(--red-tint)",
              color: "var(--red-deep)",
              fontWeight: 700,
              fontSize: "11px",
              padding: "4px 10px",
              borderRadius: "var(--radius-pill)",
              border: "1px solid rgba(217,55,46,0.2)",
            }}
          >
            {event.hazard}
          </span>
        </div>

        <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--ink-70)", marginTop: "12px" }}>
          {event.summary}
        </p>
      </div>

      {/* Risk Evolution and Rainfall Chart */}
      <div
        style={{
          background: "var(--white)",
          borderRadius: "var(--radius-xl)",
          padding: "24px",
          border: "1px solid var(--line)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--charcoal)", letterSpacing: "0.04em" }}>
            RECONSTRUCTED TIMELINE & RUNOFF EVOLUTION
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--ink-50)" }}>
            <Droplets size={14} color="var(--blue)" />
            <span>24h Rainfall (mm)</span>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${event.timeline.length}, 1fr)`,
            gap: "12px",
            alignItems: "flex-end",
            minHeight: "220px",
            paddingBottom: "12px",
            borderBottom: "1px solid var(--line-light)",
          }}
        >
          {event.timeline.map((point) => {
            const sev = SeverityColors[point.risk];
            const rainHeight = (point.rainfallMm / maxRain) * 110;

            return (
              <div
                key={point.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {/* Risk badge pill */}
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: sev.fg,
                    backgroundColor: sev.bg,
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  {point.risk.toUpperCase()}
                </span>

                {/* Rainfall bar */}
                <div
                  style={{
                    width: "100%",
                    maxWidth: "48px",
                    height: "120px",
                    backgroundColor: "var(--paper)",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "flex-end",
                    overflow: "hidden",
                    border: "1px solid var(--line-light)",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: `${Math.max(8, rainHeight)}px`,
                      backgroundColor: "var(--blue)",
                      borderRadius: "4px 4px 0 0",
                      transition: "height 300ms ease",
                    }}
                  />
                </div>

                <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--charcoal)" }}>
                  {point.rainfallMm}mm
                </div>
                <div style={{ fontSize: "11px", color: "var(--ink-50)" }}>
                  {point.label}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "14px", color: "var(--ink-50)", fontSize: "11px" }}>
          <Info size={14} />
          <span>
            Reconstructions compiled from state disaster management reports & high-resolution re-analysis.
          </span>
        </div>
      </div>
    </div>
  );
}
