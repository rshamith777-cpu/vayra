/**
 * Shared domain types.
 *
 * These mirror the backend response contract described in the product
 * brief so that swapping `mock/*` for a real `services/api.ts` call
 * later requires no changes to components or screens:
 *
 * {
 *   "location": {},
 *   "timestamp": "",
 *   "lead_time_minutes": 138,
 *   "hazards": {},
 *   "xai": [],
 *   "map_layers": []
 * }
 */

export type RiskLevel = "low" | "moderate" | "high" | "critical";

export type HazardType = "thunderstorm" | "cloudburst" | "flash_flood";

export interface MonitoredLocation {
  region: string; // e.g. "Uttarakhand"
  district: string; // e.g. "Chamoli"
  label: string; // display string e.g. "Uttarakhand · Monitored region"
  latitude: number;
  longitude: number;
}

export interface HazardStatus {
  id: HazardType;
  name: string; // "Thunderstorm" | "Cloudburst" | "Flash flood"
  subtitle: string; // e.g. "Rising over last 30 min"
  risk: RiskLevel;
}

export interface KeyFactor {
  label: string; // "Rainfall intensity"
  trend: "up" | "down" | "flat";
  trendLabel: string; // "Increasing"
}

export interface HazardDetail {
  id: HazardType;
  name: string;
  risk: RiskLevel;
  location: string;
  whatIsHappening: string;
  progression: RiskLevel[]; // ordered low -> critical, filled up to current
  keyFactors: KeyFactor[];
}

export type XaiCategory =
  | "moisture"
  | "instability"
  | "kinematics"
  | "cloud_development"
  | "precipitation"
  | "terrain";

export interface XaiFactorData {
  id: XaiCategory;
  title: string; // "Moisture"
  icon: string; // emoji placeholder, swappable for an icon set later
  segments: {
    text: string; // "Column water vapor"
    trend: "up" | "down" | "flat";
    trendLabel: string; // "rising"
  }[];
}

export interface EmergencyContact {
  id: string;
  name: string; // "District response"
  subtitle: string; // "Disaster management cell"
  icon: string;
  phoneNumber: string; // demo value, tel: formatted
}

export interface AlertHistoryEntry {
  id: string;
  day: "today" | "yesterday" | "this_week" | string;
  time: string; // "09:42"
  hazard: string; // "Flash flood"
  district: string; // "Rudraprayag"
  risk: RiskLevel;
  icon: string;
}

export interface ForecastHourPoint {
  label: string; // "NOW", "+1h"
  risk: RiskLevel;
}

export type AlertStage = "normal" | "high" | "critical" | "critical_alert" | "acknowledged";

export interface RiskZone {
  id: string;
  district: string;
  risk: RiskLevel;
  /** Polygon ring for the risk-zone overlay, [lat, lng][] */
  coordinates: { latitude: number; longitude: number }[];
}

export interface MapLayer {
  id: HazardType | "rainfall" | "terrain";
  label: string;
}

export interface DataSourceInfo {
  id: "ground_telemetry" | "terrain" | "satellite" | "citizen_reports" | string;
  name: string;
  source: string;
  status: "available" | "limited" | "unavailable";
  is_simulated: boolean;
  quality: number;
  weight: number;
  timestamp?: string;
  description?: string;
}

export interface DataSourcesResponse {
  sources: DataSourceInfo[];
  fusion_weights: Record<string, number>;
  overall_data_confidence: number;
  scenario: "normal" | "ground_sensor_failure" | string;
  resilience_status: string;
}

export interface BackendRiskResponse {
  location: MonitoredLocation;
  timestamp: string;
  lead_time_minutes: number;
  hazards: HazardStatus[];
  xai: XaiFactorData[];
  map_layers: MapLayer[];
  data_sources_used?: string[];
  fusion_weights?: Record<string, number>;
  overall_data_confidence?: number;
  resilience_status?: string;
  sources?: DataSourceInfo[];
}

export interface AlertResponse {
  alert_triggered: boolean;
  risk_level: RiskLevel;
  hazard_id?: HazardType;
  hazard_name?: string;
  location_label?: string;
  lead_time_minutes: number;
  message: string;
}

export interface ExplanationResponse {
  location_id: string;
  lead_time_hours: number;
  lead_time_minutes: number;
  interpretation: string;
  factors: XaiFactorData[];
  raw_factors: Record<string, any>;
  fusion_weights?: Record<string, number>;
  overall_data_confidence?: number;
  resilience_status?: string;
  sources?: DataSourceInfo[];
}

