import React, { useState } from "react";
import { XaiFactorData } from "../types";
import {
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Minus,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Info,
  Droplets,
  Zap,
  Wind,
  Cloud,
  CloudRain,
  Mountain,
  ChevronDown,
  ChevronUp,
  Compass,
  Thermometer,
  Activity,
  Cpu,
} from "lucide-react";

interface RichXaiFactor {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  weightPct: number;
  physicsDescription: string;
  thresholdStatus: string;
  sensorSource: string;
  metrics: {
    label: string;
    value: string;
    normalBaseline: string;
    trend: "up" | "down" | "flat";
    trendLabel: string;
    impact: "High Risk" | "Moderate Risk" | "Stabilizing" | "Neutral";
  }[];
  mitigationNote: string;
}

const COMPREHENSIVE_XAI_FACTORS: RichXaiFactor[] = [
  {
    id: "moisture",
    title: "Tropospheric Moisture & Column Vapor",
    subtitle: "High-density atmospheric precipitable water (TPW) & specific humidity",
    icon: "💧",
    weightPct: 24,
    physicsDescription:
      "Deep moisture convergence advecting from the Arabian Sea / Bay of Bengal channeled into narrow Himalayan valleys (Alaknanda, Mandakini, Bhagirathi), fueling intense local cloud nucleation.",
    thresholdStatus: "Exceeding 92nd percentile monsoon boundary layer saturation",
    sensorSource: "INSAT-3D Sounder + Local Microwave Radiometers & AWS Hygrometers",
    metrics: [
      {
        label: "Total Column Precipitable Water",
        value: "54.8 mm",
        normalBaseline: "32–38 mm",
        trend: "up",
        trendLabel: "+4.2 mm/h surge",
        impact: "High Risk",
      },
      {
        label: "Surface Relative Humidity (2m)",
        value: "96.4%",
        normalBaseline: "70–82%",
        trend: "up",
        trendLabel: "Near condensation ceiling",
        impact: "High Risk",
      },
      {
        label: "Dew Point Depression",
        value: "0.8°C",
        normalBaseline: "3.5–5.0°C",
        trend: "down",
        trendLabel: "Saturated boundary level",
        impact: "High Risk",
      },
      {
        label: "Moisture Flux Divergence",
        value: "-14.2 × 10⁻⁴ g/(kg·s)",
        normalBaseline: "Neutral / Positive",
        trend: "up",
        trendLabel: "Rapid valley pooling",
        impact: "High Risk",
      },
    ],
    mitigationNote:
      "High atmospheric water loading provides the raw fuel for rapid precipitation bursts once thermal triggering occurs.",
  },
  {
    id: "instability",
    title: "Convective Instability & Thermodynamic Energy",
    subtitle: "CAPE, Lifted Index, and rapid vertical ascent buoyancy",
    icon: "⚡",
    weightPct: 28,
    physicsDescription:
      "Steep vertical lapse rates causing rapid thermal buoyancy. Parcels rising through the Free Convection Level (LFC) trigger violent convective updrafts capable of sustaining cloudburst cores.",
    thresholdStatus: "Severe convective instability — CAPE exceeds 2,800 J/kg",
    sensorSource: "Numerical Weather Prediction (NCMRWF) + Radiosonde Profile Assimilation",
    metrics: [
      {
        label: "Most Unstable CAPE (MUCAPE)",
        value: "2,840 J/kg",
        normalBaseline: "600–1,200 J/kg",
        trend: "up",
        trendLabel: "Severe energy reservoir",
        impact: "High Risk",
      },
      {
        label: "Convective Inhibition (CIN)",
        value: "-12 J/kg",
        normalBaseline: "-70 to -150 J/kg",
        trend: "down",
        trendLabel: "Cap completely broken",
        impact: "High Risk",
      },
      {
        label: "Lifted Index (LI)",
        value: "-6.2°C",
        normalBaseline: "-1.0 to 1.5°C",
        trend: "down",
        trendLabel: "Extremely buoyant parcel",
        impact: "High Risk",
      },
      {
        label: "K-Index (Thunderstorm Potential)",
        value: "39.4°C",
        normalBaseline: "22–28°C",
        trend: "up",
        trendLabel: "High thunderstorm certainty (>85%)",
        impact: "High Risk",
      },
    ],
    mitigationNote:
      "When convective inhibition collapses below -20 J/kg, localized explosive storms can form within 30 to 45 minutes.",
  },
  {
    id: "kinematics",
    title: "Low-Level Kinematics & Orographic Convergence",
    subtitle: "Valley channeling, wind shear, and forced mechanical convergence",
    icon: "🌀",
    weightPct: 16,
    physicsDescription:
      "Strong south-southwesterly monsoonal low-level jet streams slamming perpendicular into the Lesser and Greater Himalayan ridges, producing violent forced mechanical ascent.",
    thresholdStatus: "Active valley funneling and low-level boundary convergence detected",
    sensorSource: "Doppler Weather Radar (IMD Mukteshwar / Pauri) + Automated Stations",
    metrics: [
      {
        label: "Low-Level Mass Convergence (925–850 hPa)",
        value: "+8.4 × 10⁻⁵ s⁻¹",
        normalBaseline: "+1.2 × 10⁻⁵ s⁻¹",
        trend: "up",
        trendLabel: "Intense valley confluence",
        impact: "High Risk",
      },
      {
        label: "0–6 km Bulk Wind Shear",
        value: "28 knots",
        normalBaseline: "10–16 knots",
        trend: "up",
        trendLabel: "Organized multicell support",
        impact: "Moderate Risk",
      },
      {
        label: "Updraft Helicity (UH)",
        value: "68 m²/s²",
        normalBaseline: "<20 m²/s²",
        trend: "up",
        trendLabel: "Rotating storm cores",
        impact: "High Risk",
      },
      {
        label: "Valley Wind Speed Funneling",
        value: "34 km/h gusting 58 km/h",
        normalBaseline: "12–18 km/h",
        trend: "up",
        trendLabel: "Accelerating through gorge",
        impact: "Moderate Risk",
      },
    ],
    mitigationNote:
      "Steep canyon walls compress and accelerate inflow air, multiplying convective uplift velocity by up to 2.4x.",
  },
  {
    id: "cloud_development",
    title: "Cloud Microphysics & Cloud-Top Cooling",
    subtitle: "Satellite Infrared brightness temperature & rapid vertical cloud growth",
    icon: "☁️",
    weightPct: 18,
    physicsDescription:
      "Satellite thermal infrared monitoring records cloud-top temperatures plunging below -60°C within 20 minutes, indicating convective tower tops piercing the tropopause.",
    thresholdStatus: "Overshooting tops detected with rapid cloud-top brightness drop",
    sensorSource: "INSAT-3D/3DR TIR1 & Water Vapor Bands (Every 15 min cadence)",
    metrics: [
      {
        label: "Cloud-Top Temperature (TIR1)",
        value: "-68.4°C",
        normalBaseline: "-25 to -40°C",
        trend: "down",
        trendLabel: "Plunging -18°C/hr",
        impact: "High Risk",
      },
      {
        label: "Vertical Cloud Growth Rate",
        value: "14.2 mm/h altitude equivalent",
        normalBaseline: "2–4 mm/h",
        trend: "up",
        trendLabel: "Explosive vertical building",
        impact: "High Risk",
      },
      {
        label: "Radar Maximum Reflectivity (Z_max)",
        value: "54.8 dBZ",
        normalBaseline: "30–40 dBZ",
        trend: "up",
        trendLabel: "Severe convective core / hail mix",
        impact: "High Risk",
      },
      {
        label: "Hydrometeor Classification",
        value: "Heavy Rain + Supercooled Graupel",
        normalBaseline: "Stratiform liquid rain",
        trend: "flat",
        trendLabel: "Cloudburst microphysics signature",
        impact: "High Risk",
      },
    ],
    mitigationNote:
      "Rapidly cooling cloud tops are the single most reliable satellite signature of impending cloudburst events.",
  },
  {
    id: "precipitation",
    title: "Real-Time Telemetry & Rain Accumulation",
    subtitle: "High-resolution ground AWS precipitation rate and tipping-bucket telemetry",
    icon: "🌧️",
    weightPct: 22,
    physicsDescription:
      "Automated weather station gauge telemetry measuring instantaneous rain rate, 30-minute cumulative totals, and intensity variance across the catchment boundary.",
    thresholdStatus: "Extreme short-duration precipitation burst registered",
    sensorSource: "IMD / State Disaster Management Cell Automated Weather Stations",
    metrics: [
      {
        label: "Instantaneous Precipitation Intensity",
        value: "68.5 mm/h (Peak)",
        normalBaseline: "4–12 mm/h",
        trend: "up",
        trendLabel: "+38 mm/h rise over 20 min",
        impact: "High Risk",
      },
      {
        label: "30-Minute Accumulated Rainfall",
        value: "38.2 mm",
        normalBaseline: "<10 mm",
        trend: "up",
        trendLabel: "Exceeds Flash Flood Guidance",
        impact: "High Risk",
      },
      {
        label: "Precipitation Acceleration Rate",
        value: "+2.8 mm/min²",
        normalBaseline: "0.1–0.4 mm/min²",
        trend: "up",
        trendLabel: "Extreme steep onset curve",
        impact: "High Risk",
      },
      {
        label: "Spatial Coherence Index",
        value: "0.89 (High Spatial Concentration)",
        normalBaseline: "0.35–0.50 (Dispersed)",
        trend: "up",
        trendLabel: "Pinpoint micro-catchment lock",
        impact: "High Risk",
      },
    ],
    mitigationNote:
      "Rainfall rates exceeding 50 mm/h in steep Himalayan basins overwhelm soil infiltration within 15 minutes.",
  },
  {
    id: "terrain",
    title: "Orography, Slope Gradient & Catchment Drainage",
    subtitle: "30m Digital Elevation Model (DEM), runoff velocity, and soil saturation",
    icon: "⛰️",
    weightPct: 20,
    physicsDescription:
      "CartoDEM 30m topographic modeling of catchment steepness, river bed convergence angles, and hydrological time-of-concentration for runoff surges into main river channels.",
    thresholdStatus: "Catchment slopes >32° with saturated Antecedent Soil Moisture",
    sensorSource: "ISRO CartoDEM + Central Water Commission (CWC) River Gauges",
    metrics: [
      {
        label: "Mean Catchment Slope Gradient",
        value: "34.2° (V-shaped Gorge)",
        normalBaseline: "14–22°",
        trend: "flat",
        trendLabel: "Steep gravity runoff acceleration",
        impact: "High Risk",
      },
      {
        label: "Hydrological Time-of-Concentration (Tc)",
        value: "22 Minutes",
        normalBaseline: "75–120 Minutes",
        trend: "down",
        trendLabel: "Immediate flash flood surge",
        impact: "High Risk",
      },
      {
        label: "Antecedent Soil Moisture Index (ASI)",
        value: "94.2% (Near Saturation)",
        normalBaseline: "45–65%",
        trend: "up",
        trendLabel: "Zero buffer infiltration capacity",
        impact: "High Risk",
      },
      {
        label: "Catchment Drainage Bottleneck Ratio",
        value: "4.8:1 (Severe Choke Point)",
        normalBaseline: "1.5:1",
        trend: "flat",
        trendLabel: "High debris-jam & backwater hazard",
        impact: "High Risk",
      },
    ],
    mitigationNote:
      "High soil saturation means nearly 90% of fallen rain converts immediately into surface debris flow and streamflow surge.",
  },
];

interface XaiScreenViewProps {
  factors?: XaiFactorData[];
  interpretation?: string;
  confidencePct?: number;
  resilienceStatus?: string;
}

export function XaiScreenView({
  interpretation = "Multimodal Spatiotemporal Bi-LSTM with Attention identified an acute convective surge aligning with steep V-shaped Himalayan catchment orography.",
  confidencePct = 88,
  resilienceStatus = "OPTIMAL_MULTIMODAL",
}: XaiScreenViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>("moisture");

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "26px" }}>
      {/* Executive XAI Model Overview */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--navy-900) 0%, #0d1e38 100%)",
          borderRadius: "var(--radius-xl)",
          padding: "30px 34px",
          color: "var(--white)",
          boxShadow: "var(--shadow-md)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "rgba(58, 111, 224, 0.2)",
                border: "1px solid rgba(58, 111, 224, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BrainCircuit size={24} color="#60a5fa" />
            </div>
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: 800, margin: 0, color: "var(--white)", letterSpacing: "-0.01em" }}>
                Explainable AI (XAI) Atmospheric Attribution
              </h2>
              <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.7)", marginTop: "2px" }}>
                Mathematical Decomposition of Nowcasting Probability Signals
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span
              style={{
                padding: "6px 12px",
                borderRadius: "var(--radius-pill)",
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                color: "#60a5fa",
                fontSize: "12px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Cpu size={13} />
              Bi-LSTM + Gradient Boost
            </span>
            <span
              style={{
                padding: "6px 12px",
                borderRadius: "var(--radius-pill)",
                backgroundColor: "rgba(46, 139, 87, 0.25)",
                color: "#86efac",
                fontSize: "12px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "5px",
                border: "1px solid rgba(74, 222, 128, 0.3)",
              }}
            >
              <ShieldCheck size={13} />
              {confidencePct}% Confidence
            </span>
          </div>
        </div>

        <p style={{ fontSize: "14.5px", color: "rgba(255, 255, 255, 0.88)", lineHeight: 1.65, margin: "0 0 18px" }}>
          {interpretation}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            paddingTop: "16px",
          }}
        >
          <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.75)" }}>
            Primary Trigger: <strong style={{ color: "#ffb4ab" }}>Rapid Orographic Convective Ascent</strong>
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.75)" }}>
            Nowcast Horizon: <strong style={{ color: "#fff" }}>T+0 to T+3 Hours</strong>
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.75)" }}>
            Fault Tolerance: <strong style={{ color: "#86efac" }}>{resilienceStatus}</strong>
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.75)" }}>
            Spatial Resolution: <strong style={{ color: "#fff" }}>1.0 km Catchment Grids</strong>
          </div>
        </div>
      </div>

      {/* Six In-Depth Contributing Atmospheric Factor Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--navy-900)", margin: 0, letterSpacing: "0.02em" }}>
              DIAGNOSTIC FACTOR DECOMPOSITION (6/6 ACTIVE)
            </h3>
            <div style={{ fontSize: "12px", color: "var(--ink-50)" }}>
              Detailed physical atmospheric observations and threshold exceedances
            </div>
          </div>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--blue)", backgroundColor: "var(--blue-tint)", padding: "4px 10px", borderRadius: "var(--radius-pill)" }}>
            Click Any Factor To Expand Telemetry
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {COMPREHENSIVE_XAI_FACTORS.map((f) => {
            const isExpanded = expandedId === f.id;

            return (
              <div
                key={f.id}
                style={{
                  backgroundColor: "var(--white)",
                  borderRadius: "var(--radius-xl)",
                  border: isExpanded ? "1px solid var(--blue)" : "1px solid var(--line)",
                  boxShadow: isExpanded ? "var(--shadow-md)" : "var(--shadow-sm)",
                  overflow: "hidden",
                  transition: "all var(--transition-fast)",
                }}
              >
                {/* Header row */}
                <div
                  onClick={() => toggleExpand(f.id)}
                  style={{
                    padding: "20px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    backgroundColor: isExpanded ? "rgba(58, 111, 224, 0.03)" : "var(--white)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div
                      style={{
                        width: "46px",
                        height: "46px",
                        borderRadius: "12px",
                        backgroundColor: "var(--paper)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "22px",
                        border: "1px solid var(--line-light)",
                      }}
                    >
                      {f.icon}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <h4 style={{ fontSize: "16px", fontWeight: 800, color: "var(--navy-900)", margin: 0 }}>
                          {f.title}
                        </h4>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "var(--radius-pill)",
                            backgroundColor: "var(--blue-tint)",
                            color: "var(--blue)",
                          }}
                        >
                          {f.weightPct}% model weight
                        </span>
                      </div>
                      <div style={{ fontSize: "12.5px", color: "var(--ink-50)", marginTop: "2px" }}>
                        {f.subtitle}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "var(--red)",
                        backgroundColor: "var(--red-tint)",
                        padding: "4px 10px",
                        borderRadius: "var(--radius-pill)",
                        display: "none",
                      }}
                      className="hide-mobile"
                    >
                      Elevated
                    </span>
                    <button
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundColor: "var(--paper)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid var(--line)",
                        color: "var(--ink-70)",
                      }}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div
                    style={{
                      padding: "0 24px 24px",
                      borderTop: "1px solid var(--line-light)",
                      backgroundColor: "var(--white)",
                    }}
                  >
                    {/* Physics Context */}
                    <div
                      style={{
                        padding: "14px 16px",
                        backgroundColor: "var(--paper)",
                        borderRadius: "var(--radius-md)",
                        marginTop: "16px",
                        marginBottom: "16px",
                        border: "1px solid var(--line-light)",
                      }}
                    >
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ink-50)", letterSpacing: "0.06em", marginBottom: "4px" }}>
                        ATMOSPHERIC MECHANICS & REASONING
                      </div>
                      <p style={{ fontSize: "13.5px", lineHeight: 1.6, color: "var(--charcoal)", margin: 0 }}>
                        {f.physicsDescription}
                      </p>
                      <div style={{ fontSize: "12px", color: "var(--ink-70)", marginTop: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontWeight: 700, color: "var(--navy-900)" }}>Sensor Feed:</span> {f.sensorSource}
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ink-50)", letterSpacing: "0.06em", marginBottom: "10px" }}>
                      SUB-METRICS & VERIFIED OBSERVATIONS
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: "12px",
                        marginBottom: "16px",
                      }}
                    >
                      {f.metrics.map((m, i) => (
                        <div
                          key={i}
                          style={{
                            padding: "12px 14px",
                            borderRadius: "var(--radius-md)",
                            backgroundColor: "var(--white)",
                            border: "1px solid var(--line)",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--ink-70)" }}>
                              {m.label}
                            </span>
                            <span
                              style={{
                                fontSize: "10px",
                                fontWeight: 700,
                                color: m.impact === "High Risk" ? "var(--red)" : "var(--orange)",
                                backgroundColor: m.impact === "High Risk" ? "var(--red-tint)" : "var(--orange-tint)",
                                padding: "2px 6px",
                                borderRadius: "4px",
                              }}
                            >
                              {m.impact.toUpperCase()}
                            </span>
                          </div>

                          <div style={{ fontSize: "17px", fontWeight: 800, color: "var(--navy-900)", marginBottom: "4px" }}>
                            {m.value}
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "var(--ink-50)" }}>
                            <span>Normal: {m.normalBaseline}</span>
                            <span
                              style={{
                                fontWeight: 700,
                                color: m.trend === "up" ? "var(--red)" : "var(--green-deep)",
                                display: "flex",
                                alignItems: "center",
                                gap: "2px",
                              }}
                            >
                              {m.trend === "up" ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                              {m.trendLabel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Operational Impact Note */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 14px",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: "var(--orange-tint)",
                        color: "var(--orange-deep)",
                        fontSize: "12px",
                        fontWeight: 600,
                        border: "1px solid rgba(227, 138, 28, 0.25)",
                      }}
                    >
                      <AlertTriangle size={15} />
                      <span>{f.mitigationNote}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
