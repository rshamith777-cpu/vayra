import React from "react";
import { HazardStatus } from "../types";
import { RiskBadge } from "./RiskBadge";
import { CloudLightning, CloudRain, Waves, ChevronRight } from "lucide-react";

interface HazardCardProps {
  hazard: HazardStatus;
  onClick: () => void;
}

export function HazardCard({ hazard, onClick }: HazardCardProps) {
  const getHazardIcon = () => {
    switch (hazard.id) {
      case "thunderstorm":
        return <CloudLightning size={22} style={{ color: "#E38A1C" }} />;
      case "cloudburst":
        return <CloudRain size={22} style={{ color: "#3A6FE0" }} />;
      case "flash_flood":
        return <Waves size={22} style={{ color: "#D9372E" }} />;
      default:
        return <CloudRain size={22} />;
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 18px",
        backgroundColor: "var(--white)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--line)",
        boxShadow: "var(--shadow-sm)",
        cursor: "pointer",
        transition: "all var(--transition-fast)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
        e.currentTarget.style.borderColor = "var(--blue-tint)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        e.currentTarget.style.borderColor = "var(--line)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--paper)",
            border: "1px solid var(--line-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {getHazardIcon()}
        </div>
        <div>
          <h4
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--charcoal)",
              marginBottom: "3px",
            }}
          >
            {hazard.name}
          </h4>
          <p style={{ fontSize: "12px", color: "var(--ink-50)", margin: 0 }}>
            {hazard.subtitle}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <RiskBadge risk={hazard.risk} size="sm" />
        <ChevronRight size={18} color="var(--ink-30)" />
      </div>
    </div>
  );
}
