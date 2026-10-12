import React from "react";
import { RiskLevel } from "../types";
import { AlertOctagon, X, MapPin, Clock, PhoneCall, Map } from "lucide-react";

interface CriticalAlertModalProps {
  hazardName: string;
  risk: RiskLevel;
  locationLabel: string;
  leadTimeMinutes: number;
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge: () => void;
  onViewMap: () => void;
  onContactTeam: () => void;
}

export function CriticalAlertModal({
  hazardName,
  risk,
  locationLabel,
  leadTimeMinutes,
  isOpen,
  onClose,
  onAcknowledge,
  onViewMap,
  onContactTeam,
}: CriticalAlertModalProps) {
  if (!isOpen) return null;

  const hours = Math.floor(leadTimeMinutes / 60);
  const minutes = leadTimeMinutes % 60;
  const leadTimeDisplay =
    hours > 0 ? `${hours}h ${minutes > 0 ? `${minutes}m` : ""}` : `${minutes}m`;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(11, 22, 38, 0.85)",
        backdropFilter: "blur(12px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 200ms ease-out",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "linear-gradient(180deg, #8c1c14 0%, #4d0d08 100%)",
          borderRadius: "var(--radius-xl)",
          padding: "32px 28px",
          color: "var(--white)",
          boxShadow: "0 20px 60px rgba(217, 55, 46, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2)",
          position: "relative",
          textAlign: "center",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            color: "rgba(255, 255, 255, 0.7)",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={18} />
        </button>

        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            margin: "0 auto 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 24px rgba(255, 255, 255, 0.3)",
          }}
        >
          <AlertOctagon size={36} color="#ffffff" />
        </div>

        <div
          style={{
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.12em",
            color: "#ffc2bd",
            marginBottom: "6px",
          }}
        >
          EARLY WARNING ALERT · {risk.toUpperCase()}
        </div>

        <h2
          style={{
            fontSize: "30px",
            fontWeight: 800,
            marginBottom: "12px",
            lineHeight: 1.15,
          }}
        >
          {hazardName}
        </h2>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "rgba(0, 0, 0, 0.25)",
            padding: "6px 14px",
            borderRadius: "var(--radius-pill)",
            fontSize: "13px",
            marginBottom: "18px",
          }}
        >
          <MapPin size={14} color="#ffc2bd" />
          <span>{locationLabel}</span>
        </div>

        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            borderRadius: "var(--radius-md)",
            padding: "16px",
            marginBottom: "24px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.8)", marginBottom: "4px" }}>
            Estimated Actionable Lead-Time
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#ffe082", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Clock size={24} />
            <span>~{leadTimeDisplay}</span>
          </div>
          <p style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.65)", marginTop: "6px", margin: 0 }}>
            Nowcasting model indicates high-probability severe event trajectory. Take precautionary safety measures.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={onAcknowledge}
            style={{
              backgroundColor: "var(--white)",
              color: "var(--red-critical)",
              fontWeight: 800,
              fontSize: "15px",
              padding: "14px",
              borderRadius: "var(--radius-pill)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              transition: "transform var(--transition-fast)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Acknowledge Warning
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <button
              onClick={onViewMap}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                color: "var(--white)",
                fontWeight: 600,
                fontSize: "13px",
                padding: "12px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <Map size={16} />
              <span>View Map</span>
            </button>

            <button
              onClick={onContactTeam}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                color: "var(--white)",
                fontWeight: 600,
                fontSize: "13px",
                padding: "12px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <PhoneCall size={16} />
              <span>Contact Team</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
