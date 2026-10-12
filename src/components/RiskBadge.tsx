import React from "react";
import { RiskLevel } from "../types";

export function RiskBadge({ risk, size = "md" }: { risk: RiskLevel; size?: "sm" | "md" | "lg" }) {
  const configs: Record<RiskLevel, { bg: string; fg: string; dot: string; label: string }> = {
    low: { bg: "var(--green-tint)", fg: "var(--green-deep)", dot: "var(--green)", label: "LOW RISK" },
    moderate: { bg: "var(--moderate-tint)", fg: "var(--moderate-deep)", dot: "var(--moderate)", label: "MODERATE" },
    high: { bg: "var(--orange-tint)", fg: "var(--orange-deep)", dot: "var(--orange)", label: "HIGH RISK" },
    critical: { bg: "var(--red-tint)", fg: "var(--red-deep)", dot: "var(--red)", label: "CRITICAL" },
  };

  const c = configs[risk] || configs.moderate;
  const padding = size === "sm" ? "4px 8px" : size === "lg" ? "8px 16px" : "6px 12px";
  const fontSize = size === "sm" ? "11px" : size === "lg" ? "13px" : "12px";
  const dotSize = size === "sm" ? "6px" : "8px";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        backgroundColor: c.bg,
        color: c.fg,
        padding,
        borderRadius: "var(--radius-pill)",
        fontWeight: 700,
        fontSize,
        letterSpacing: "0.04em",
        border: `1px solid ${c.dot}33`,
      }}
    >
      <span
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          backgroundColor: c.dot,
          boxShadow: risk === "critical" ? "0 0 6px var(--red)" : "none",
        }}
      />
      {c.label}
    </span>
  );
}

export function LocationChip({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        backgroundColor: "var(--white)",
        color: "var(--ink-70)",
        padding: "5px 12px",
        borderRadius: "var(--radius-pill)",
        fontSize: "12px",
        fontWeight: 500,
        border: "1px solid var(--line)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {icon ? (
        icon
      ) : (
        <span style={{ color: "var(--blue)", display: "flex", alignItems: "center" }}>📍</span>
      )}
      <span>{label}</span>
    </div>
  );
}
