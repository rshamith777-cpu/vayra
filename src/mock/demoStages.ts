/** PROTOTYPE / DEMO DATA — maps the isolated demo alert flow to display content. */
import { AlertStage, HazardStatus, RiskLevel } from "@/types";

interface DemoStageContent {
  eyebrow: string;
  risk: RiskLevel;
  hazards: HazardStatus[];
}

const BASE_HAZARDS: Record<RiskLevel, HazardStatus[]> = {
  low: [
    { id: "thunderstorm", name: "Thunderstorm", subtitle: "No significant activity", risk: "low" },
    { id: "cloudburst", name: "Cloudburst", subtitle: "Conditions stable", risk: "low" },
    { id: "flash_flood", name: "Flash flood", subtitle: "Normal terrain risk", risk: "low" },
  ],
  moderate: [
    { id: "thunderstorm", name: "Thunderstorm", subtitle: "Building over last hour", risk: "moderate" },
    { id: "cloudburst", name: "Cloudburst", subtitle: "Moisture increasing", risk: "moderate" },
    { id: "flash_flood", name: "Flash flood", subtitle: "Terrain risk moderate", risk: "low" },
  ],
  high: [
    { id: "thunderstorm", name: "Thunderstorm", subtitle: "Rising over last 30 min", risk: "high" },
    { id: "cloudburst", name: "Cloudburst", subtitle: "Extreme rainfall building", risk: "critical" },
    { id: "flash_flood", name: "Flash flood", subtitle: "Elevated terrain risk", risk: "high" },
  ],
  critical: [
    { id: "thunderstorm", name: "Thunderstorm", subtitle: "Active over monitored area", risk: "high" },
    { id: "cloudburst", name: "Cloudburst", subtitle: "Extreme rainfall in progress", risk: "critical" },
    { id: "flash_flood", name: "Flash flood", subtitle: "Critical terrain risk", risk: "critical" },
  ],
};

const CONTENT_BY_STAGE: Record<AlertStage, DemoStageContent> = {
  normal: { eyebrow: "MONITORING · NORMAL", risk: "low", hazards: BASE_HAZARDS.low },
  high: { eyebrow: "ELEVATED WEATHER RISK", risk: "high", hazards: BASE_HAZARDS.high },
  critical: { eyebrow: "CRITICAL WEATHER RISK", risk: "critical", hazards: BASE_HAZARDS.critical },
  critical_alert: { eyebrow: "CRITICAL WEATHER RISK", risk: "critical", hazards: BASE_HAZARDS.critical },
  acknowledged: { eyebrow: "ALERT ACKNOWLEDGED", risk: "high", hazards: BASE_HAZARDS.high },
};

export function getDemoStageContent(stage: AlertStage): DemoStageContent {
  return CONTENT_BY_STAGE[stage];
}
