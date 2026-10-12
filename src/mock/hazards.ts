/**
 * PROTOTYPE / DEMO DATA — not live model output.
 * Structured to match `HazardStatus` / `HazardDetail` so it can be
 * swapped for `services/api.ts` results later without touching UI.
 */
import { HazardDetail, HazardStatus } from "@/types";

export const MOCK_HAZARD_STATUS: HazardStatus[] = [
  {
    id: "thunderstorm",
    name: "Thunderstorm",
    subtitle: "Rising over last 30 min",
    risk: "high",
  },
  {
    id: "cloudburst",
    name: "Cloudburst",
    subtitle: "Extreme rainfall building",
    risk: "critical",
  },
  {
    id: "flash_flood",
    name: "Flash flood",
    subtitle: "Elevated terrain risk",
    risk: "high",
  },
];

export const MOCK_HAZARD_DETAILS: Record<string, HazardDetail> = {
  flash_flood: {
    id: "flash_flood",
    name: "Flash-flood risk",
    risk: "high",
    location: "Selected monitored region",
    whatIsHappening:
      "Extreme rainfall risk is increasing over an area with elevated terrain susceptibility, raising the chance of fast-rising water in low-lying channels.",
    progression: ["low", "moderate", "high"],
    keyFactors: [
      { label: "Rainfall intensity", trend: "up", trendLabel: "Increasing" },
      { label: "Terrain susceptibility", trend: "up", trendLabel: "Increasing" },
      { label: "Extreme-rainfall probability", trend: "up", trendLabel: "Increasing" },
    ],
  },
  cloudburst: {
    id: "cloudburst",
    name: "Cloudburst risk",
    risk: "critical",
    location: "Selected monitored region",
    whatIsHappening:
      "Very high atmospheric moisture combined with strong upward motion is building conditions for an intense, short-duration rainfall event.",
    progression: ["low", "moderate", "high", "critical"],
    keyFactors: [
      { label: "Column water vapor", trend: "up", trendLabel: "Increasing" },
      { label: "Updraft strength", trend: "up", trendLabel: "Increasing" },
      { label: "Cloud-top cooling rate", trend: "down", trendLabel: "Decreasing" },
    ],
  },
  thunderstorm: {
    id: "thunderstorm",
    name: "Thunderstorm risk",
    risk: "high",
    location: "Selected monitored region",
    whatIsHappening:
      "Increasing instability in the lower atmosphere is raising the chance of thunderstorm development with gusty winds and lightning.",
    progression: ["low", "moderate", "high"],
    keyFactors: [
      { label: "Convective available energy (CAPE)", trend: "up", trendLabel: "Elevated" },
      { label: "Convective inhibition (CIN)", trend: "down", trendLabel: "Weakening" },
      { label: "Wind convergence", trend: "up", trendLabel: "Increasing" },
    ],
  },
};
