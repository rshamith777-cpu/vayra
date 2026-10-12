import React from "react";
import { RiskLevel } from "../types";
import { AlertTriangle, Clock, ChevronRight } from "lucide-react";

interface RiskCardProps {
  eyebrow: string;
  hazardName: string;
  leadTimeMinutes: number;
  risk: RiskLevel;
  onWhyPress?: () => void;
  onMapPress?: () => void;
}

export function RiskCard({
  eyebrow,
  hazardName,
  leadTimeMinutes,
  risk,
  onWhyPress,
  onMapPress,
}: RiskCardProps) {
  const isCritical = risk === "critical";
  const isHigh = risk === "high";

  // Gradient styles per risk
  let gradientBg = "linear-gradient(135deg, var(--navy-900) 0%, var(--navy-800) 100%)";
  let borderGlow = "1px solid rgba(255, 255, 255, 0.08)";
  let badgeColor = "var(--moderate)";

  if (isCritical) {
    gradientBg = "linear-gradient(135deg, #7e1913 0%, #3e0c09 100%)";
    borderGlow = "1px solid rgba(217, 55, 46, 0.4)";
    badgeColor = "var(--red)";
  } else if (isHigh) {
    gradientBg = "linear-gradient(135deg, #2b1f13 0%, #151820 100%)";
    borderGlow = "1px solid rgba(227, 138, 28, 0.3)";
    badgeColor = "var(--orange)";
  }

  const hours = Math.floor(leadTimeMinutes / 60);
  const minutes = leadTimeMinutes % 60;
  const leadTimeDisplay =
    hours > 0 ? `${hours}h ${minutes > 0 ? `${minutes}m` : ""}` : `${minutes}m`;

  return (
    <div
      style={{
        background: gradientBg,
        borderRadius: "var(--radius-xl)",
        padding: "32px 36px",
        color: "var(--white)",
        boxShadow: isCritical
          ? "var(--shadow-lg), 0 0 32px rgba(217, 55, 46, 0.25)"
          : "var(--shadow-lg)",
        border: borderGlow,
        position: "relative",
        overflow: "hidden",
        transition: "all var(--transition-normal)",
      }}
    >
      {/* Background ambient pattern */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: isCritical
            ? "radial-gradient(circle, rgba(217, 55, 46, 0.3) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(58, 111, 224, 0.2) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {isCritical && (
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "var(--red)",
                animation: "pulseGlow 1.5s infinite",
              }}
            />
          )}
          <span
            style={{
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              color: isCritical ? "#ff9a94" : isHigh ? "#ffc680" : "var(--ink-30)",
            }}
          >
            {eyebrow}
          </span>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(8px)",
            padding: "4px 10px",
            borderRadius: "var(--radius-pill)",
            fontSize: "11px",
            fontWeight: 700,
            color: badgeColor,
          }}
        >
          <AlertTriangle size={12} />
          {risk.toUpperCase()}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2
          style={{
            fontSize: "28px",
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: "6px",
            color: "var(--white)",
          }}
        >
          {hazardName}
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255, 255, 255, 0.75)", fontSize: "14px" }}>
          <Clock size={16} style={{ color: "var(--orange)" }} />
          <span>
            Actionable lead-time:{" "}
            <strong style={{ color: "var(--white)", fontWeight: 700 }}>
              ~{leadTimeDisplay}
            </strong>
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {onWhyPress && (
          <button
            onClick={onWhyPress}
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              color: "var(--white)",
              padding: "10px 16px",
              borderRadius: "var(--radius-pill)",
              fontSize: "13px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "background var(--transition-fast)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)")}
          >
            <span>Why this alert?</span>
            <ChevronRight size={14} />
          </button>
        )}

        {onMapPress && (
          <button
            onClick={onMapPress}
            style={{
              background: "var(--white)",
              color: "var(--navy-900)",
              padding: "10px 18px",
              borderRadius: "var(--radius-pill)",
              fontSize: "13px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "transform var(--transition-fast)",
              boxShadow: "var(--shadow-sm)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <span>View Risk Map</span>
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
