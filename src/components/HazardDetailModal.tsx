import React from "react";
import { HazardDetail, RiskLevel } from "../types";
import { MOCK_HAZARD_DETAILS } from "../mock/hazards";
import { RiskBadge, LocationChip } from "./RiskBadge";
import { SeverityColors } from "../constants/colors";
import { AlertCircle, TrendingUp, TrendingDown, Minus, ArrowLeft } from "lucide-react";

interface HazardDetailModalProps {
  hazardId: string | null;
  onClose: () => void;
  onOpenMap: () => void;
  onWhyPress: () => void;
}

const ALL_LEVELS: RiskLevel[] = ["low", "moderate", "high", "critical"];

export function HazardDetailModal({
  hazardId,
  onClose,
  onOpenMap,
  onWhyPress,
}: HazardDetailModalProps) {
  if (!hazardId) return null;

  const hazard: HazardDetail =
    MOCK_HAZARD_DETAILS[hazardId] || MOCK_HAZARD_DETAILS.flash_flood;

  const riskColor = SeverityColors[hazard.risk] || SeverityColors.moderate;
  const currentLevelIdx = ALL_LEVELS.indexOf(hazard.risk);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(11, 22, 38, 0.7)",
        backdropFilter: "blur(6px)",
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "580px",
          backgroundColor: "var(--white)",
          borderRadius: "var(--radius-xl)",
          padding: "28px",
          boxShadow: "var(--shadow-lg)",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--ink-50)",
            fontSize: "13px",
            fontWeight: 600,
            marginBottom: "16px",
          }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--navy-900)", marginBottom: "6px" }}>
              {hazard.name}
            </h2>
            <LocationChip label={hazard.location} />
          </div>
          <RiskBadge risk={hazard.risk} size="md" />
        </div>

        {/* Risk Progression Bar */}
        <div style={{ margin: "20px 0" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ink-50)", letterSpacing: "0.06em", marginBottom: "8px" }}>
            CASCADE RISK PROGRESSION
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
            {ALL_LEVELS.map((level, i) => {
              const active = i <= currentLevelIdx;
              const isPeak = i === currentLevelIdx;
              const col = SeverityColors[level];
              return (
                <div key={level}>
                  <div
                    style={{
                      height: "8px",
                      borderRadius: "var(--radius-pill)",
                      backgroundColor: active ? (isPeak ? col.dot : "var(--orange)") : "var(--line)",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: isPeak ? 800 : 500,
                      color: isPeak ? col.fg : "var(--ink-30)",
                      textAlign: "center",
                      marginTop: "4px",
                    }}
                  >
                    {level.toUpperCase()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* What's Happening */}
        <div
          style={{
            backgroundColor: "var(--paper)",
            borderRadius: "var(--radius-lg)",
            padding: "16px 18px",
            border: "1px solid var(--line-light)",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ink-50)", letterSpacing: "0.06em", marginBottom: "6px" }}>
            WHAT IS HAPPENING
          </div>
          <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--charcoal)", margin: 0 }}>
            {hazard.whatIsHappening}
          </p>
        </div>

        {/* Key contributing factors */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ink-50)", letterSpacing: "0.06em", marginBottom: "10px" }}>
            CONTRIBUTING HYDRO-METEOROLOGICAL SIGNALS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {hazard.keyFactors.map((k, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--white)",
                  border: "1px solid var(--line)",
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)" }}>{k.label}</span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: k.trend === "up" ? "var(--red)" : "var(--green-deep)",
                  }}
                >
                  {k.trendLabel}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <button
            onClick={() => {
              onClose();
              onOpenMap();
            }}
            style={{
              padding: "12px",
              borderRadius: "var(--radius-pill)",
              backgroundColor: "var(--navy-900)",
              color: "var(--white)",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            Locate On Risk Map
          </button>
          <button
            onClick={() => {
              onClose();
              onWhyPress();
            }}
            style={{
              padding: "12px",
              borderRadius: "var(--radius-pill)",
              backgroundColor: "var(--blue-tint)",
              color: "var(--blue)",
              fontSize: "13px",
              fontWeight: 700,
              border: "1px solid var(--blue)",
            }}
          >
            Why This Alert? (XAI)
          </button>
        </div>
      </div>
    </div>
  );
}
