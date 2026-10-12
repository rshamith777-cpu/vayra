/**
 * Historical event library for the replay screen.
 *
 * Events are real Uttarakhand disasters. The risk-evolution and rainfall
 * curves are ILLUSTRATIVE RECONSTRUCTIONS from public reports — not
 * archived telemetry — and are labelled as such in the UI.
 */
import { RiskLevel } from "@/types";

export interface HistoricalEventPoint {
  label: string; // "D-2", "D-1", "EVENT", ...
  risk: RiskLevel;
  rainfallMm: number; // 24h accumulation, reconstructed
}

export interface HistoricalEvent {
  id: string;
  name: string;
  dateLabel: string;
  district: string;
  hazard: string;
  summary: string;
  rainfallPeakMm: number;
  isReconstruction: boolean;
  timeline: HistoricalEventPoint[];
}

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    id: "kedarnath-2013",
    name: "Kedarnath cloudburst & flash flood",
    dateLabel: "16–17 June 2013",
    district: "Rudraprayag",
    hazard: "Cloudburst · Flash flood",
    summary:
      "A massive cloudburst over the Kedarnath catchment triggered the Chorabari lake outburst and devastating flash floods along the Mandakini river. Widespread loss of life and infrastructure across Rudraprayag district.",
    rainfallPeakMm: 325,
    isReconstruction: true,
    timeline: [
      { label: "D-3", risk: "low", rainfallMm: 18 },
      { label: "D-2", risk: "moderate", rainfallMm: 42 },
      { label: "D-1", risk: "high", rainfallMm: 96 },
      { label: "EVENT", risk: "critical", rainfallMm: 325 },
      { label: "D+1", risk: "high", rainfallMm: 71 },
      { label: "D+2", risk: "moderate", rainfallMm: 24 },
    ],
  },
  {
    id: "chamoli-2021",
    name: "Chamoli rock-ice avalanche flood",
    dateLabel: "7 February 2021",
    district: "Chamoli",
    hazard: "Avalanche · Debris flood",
    summary:
      "A rock-ice avalanche on Ronti peak detached into the Rishiganga valley, producing a debris flood that destroyed the Rishiganga and Tapovan hydro projects downstream.",
    rainfallPeakMm: 0,
    isReconstruction: true,
    timeline: [
      { label: "D-3", risk: "low", rainfallMm: 0 },
      { label: "D-2", risk: "low", rainfallMm: 0 },
      { label: "D-1", risk: "moderate", rainfallMm: 6 },
      { label: "EVENT", risk: "critical", rainfallMm: 0 },
      { label: "D+1", risk: "high", rainfallMm: 11 },
      { label: "D+2", risk: "moderate", rainfallMm: 4 },
    ],
  },
  {
    id: "gohna-1894",
    name: "Gohna Lake landslide & dam-burst flood",
    dateLabel: "6 September 1894",
    district: "Chamoli",
    hazard: "Landslide · Outburst flood",
    summary:
      "A major landslide dammed the Birahi Ganga near Gohna village, forming a large lake. When the dam burst in 1894 it released a catastrophic flood down the Alaknanda valley.",
    rainfallPeakMm: 150,
    isReconstruction: true,
    timeline: [
      { label: "D-3", risk: "low", rainfallMm: 12 },
      { label: "D-2", risk: "moderate", rainfallMm: 38 },
      { label: "D-1", risk: "high", rainfallMm: 82 },
      { label: "EVENT", risk: "critical", rainfallMm: 150 },
      { label: "D+1", risk: "high", rainfallMm: 55 },
      { label: "D+2", risk: "moderate", rainfallMm: 19 },
    ],
  },
];
