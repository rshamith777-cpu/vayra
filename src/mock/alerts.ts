/** PROTOTYPE / DEMO DATA — not live model output. */
import { AlertHistoryEntry, ForecastHourPoint } from "@/types";

export const MOCK_LEAD_TIME_MINUTES = 138; // "02h 18m"

export function formatLeadTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`;
}

export const MOCK_ALERT_HISTORY: AlertHistoryEntry[] = [
  { id: "h1", day: "today", time: "09:42", hazard: "Flash flood", district: "Rudraprayag", risk: "high", icon: "〰︎" },
  { id: "h2", day: "today", time: "06:10", hazard: "Cloudburst", district: "Chamoli", risk: "critical", icon: "☁︎" },
  { id: "h3", day: "yesterday", time: "18:20", hazard: "Thunderstorm", district: "Uttarkashi", risk: "moderate", icon: "⚡" },
  { id: "h4", day: "yesterday", time: "14:02", hazard: "Flash flood", district: "Tehri Garhwal", risk: "low", icon: "〰︎" },
];

export const MOCK_FORECAST_HOURS: ForecastHourPoint[] = [
  { label: "NOW", risk: "high" },
  { label: "+1h", risk: "high" },
  { label: "+2h", risk: "moderate" },
  { label: "+3h", risk: "moderate" },
  { label: "+4h", risk: "low" },
  { label: "+5h", risk: "low" },
];

/** Prototype risk-trend line, normalized 0..1 (y), index = hour offset. Used for the sparkline only. */
export const MOCK_RISK_TREND: number[] = [0.78, 0.83, 0.67, 0.5, 0.32, 0.22, 0.14];
