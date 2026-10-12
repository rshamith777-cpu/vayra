/**
 * PROTOTYPE / DEMO DATA — these are prototype UI values for
 * demonstration, not live scientific measurements. Structured to
 * match `XaiFactorData` so the "xai" array from the backend response
 * contract can replace this directly.
 */
import { XaiFactorData } from "@/types";

export const MOCK_XAI_FACTORS: XaiFactorData[] = [
  {
    id: "moisture",
    title: "Moisture",
    icon: "💧",
    segments: [{ text: "Column water vapor", trend: "up", trendLabel: "rising" }],
  },
  {
    id: "instability",
    title: "Instability",
    icon: "⚡",
    segments: [
      { text: "Convective energy", trend: "up", trendLabel: "elevated" },
      { text: "inhibition", trend: "down", trendLabel: "weakening" },
    ],
  },
  {
    id: "kinematics",
    title: "Kinematics",
    icon: "🌀",
    segments: [{ text: "Wind convergence", trend: "up", trendLabel: "increasing" }],
  },
  {
    id: "cloud_development",
    title: "Cloud development",
    icon: "☁︎",
    segments: [{ text: "Cloud-top temperature", trend: "down", trendLabel: "cooling" }],
  },
  {
    id: "precipitation",
    title: "Precipitation",
    icon: "🌧️",
    segments: [{ text: "Rainfall intensity", trend: "up", trendLabel: "increasing" }],
  },
  {
    id: "terrain",
    title: "Terrain",
    icon: "⛰️",
    segments: [{ text: "Slope & drainage susceptibility", trend: "up", trendLabel: "high" }],
  },
];

export const XAI_MODEL_INTERPRETATION =
  "These signals combine to push flash-flood risk into the high band for this region.";
