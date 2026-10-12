import React from "react";
import { DataSourceInfo } from "../types";
import { ShieldCheck, AlertCircle, RefreshCw, Layers } from "lucide-react";

interface DataReliabilityCardProps {
  confidence?: number;
  resilienceStatus?: string;
  sources: DataSourceInfo[];
  sensorFailureActive: boolean;
  onToggleSensorFailure: () => void;
  isLoading: boolean;
}

export function DataReliabilityCard({
  confidence = 0.88,
  resilienceStatus = "OPTIMAL_MULTIMODAL",
  sources,
  sensorFailureActive,
  onToggleSensorFailure,
  isLoading,
}: DataReliabilityCardProps) {
  const isFailure = sensorFailureActive || resilienceStatus.includes("FAILURE");
  const pct = Math.round(confidence * 100);

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Layers size={18} color="var(--blue)" />
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--charcoal)", letterSpacing: "0.04em" }}>
            MULTIMODAL DATA FUSION
          </h3>
        </div>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            padding: "4px 8px",
            borderRadius: "var(--radius-pill)",
            backgroundColor: isFailure ? "var(--orange-tint)" : "var(--green-tint)",
            color: isFailure ? "var(--orange-deep)" : "var(--green-deep)",
          }}
        >
          {isFailure ? "REWEIGHTED FALLBACK" : "FULL RESILIENCE"}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <div style={{ fontSize: "12px", color: "var(--ink-50)" }}>Overall Data Confidence</div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--navy-900)" }}>
            {pct}%
          </div>
        </div>

        <button
          onClick={onToggleSensorFailure}
          disabled={isLoading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 14px",
            borderRadius: "var(--radius-pill)",
            fontSize: "12px",
            fontWeight: 700,
            cursor: isLoading ? "not-allowed" : "pointer",
            background: isFailure ? "var(--paper)" : "var(--orange-tint)",
            color: isFailure ? "var(--ink-70)" : "var(--orange-deep)",
            border: `1px solid ${isFailure ? "var(--line)" : "var(--orange)"}`,
            transition: "all var(--transition-fast)",
          }}
        >
          {isLoading ? (
            <RefreshCw size={14} className="spin-animation" />
          ) : isFailure ? (
            <ShieldCheck size={14} color="var(--green)" />
          ) : (
            <AlertCircle size={14} color="var(--orange)" />
          )}
          <span>{isFailure ? "Restore Ground Sensors" : "Simulate Sensor Failure"}</span>
        </button>
      </div>

      {/* Sources Breakdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {sources.map((s) => {
          const isUnavailable = s.status === "unavailable";
          return (
            <div
              key={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                backgroundColor: isUnavailable ? "#fff5f5" : "var(--paper)",
                border: `1px solid ${isUnavailable ? "rgba(217,55,46,0.2)" : "var(--line-light)"}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor:
                      s.status === "available"
                        ? "var(--green)"
                        : s.status === "limited"
                        ? "var(--moderate)"
                        : "var(--red)",
                  }}
                />
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--charcoal)" }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--ink-50)" }}>
                    {s.source} · {Math.round(s.weight * 100)}% weight
                  </div>
                </div>
              </div>

              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: isUnavailable ? "var(--red)" : "var(--ink-70)",
                  letterSpacing: "0.05em",
                }}
              >
                {s.status.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
