/**
 * PROTOTYPE / DEMO DATA — approximate coordinates for the four
 * MVP-monitored districts in Uttarakhand (Chamoli, Rudraprayag,
 * Tehri Garhwal, Uttarkashi). Risk-zone polygons are simplified
 * illustrative shapes, NOT survey-accurate district boundaries.
 *
 * This is intentionally shaped close to GeoJSON so it can later be
 * replaced by real AI-generated GeoJSON (see services/api.ts).
 */
import { MapLayer, MonitoredLocation, RiskZone } from "@/types";

export const UTTARAKHAND_REGION = {
  latitude: 30.35,
  longitude: 79.2,
  latitudeDelta: 2.6,
  longitudeDelta: 2.6,
};

export const MONITORED_LOCATION: MonitoredLocation = {
  region: "Uttarakhand",
  district: "Selected region",
  label: "Uttarakhand · Monitored region",
  latitude: 30.35,
  longitude: 79.2,
};

export const USER_MARKER = {
  latitude: 30.39,
  longitude: 79.12,
  title: "Your monitored location",
};

export const DISTRICT_MARKERS: { name: string; latitude: number; longitude: number }[] = [
  { name: "Uttarkashi", latitude: 30.7268, longitude: 78.4354 },
  { name: "Chamoli", latitude: 30.4088, longitude: 79.3202 },
  { name: "Rudraprayag", latitude: 30.2846, longitude: 78.9811 },
  { name: "Tehri Garhwal", latitude: 30.3752, longitude: 78.48 },
];

/** Simplified illustrative polygons (NOT survey-accurate) centered near each district marker. */
export const MOCK_RISK_ZONES: RiskZone[] = [
  {
    id: "zone-uttarkashi",
    district: "Uttarkashi",
    risk: "moderate",
    coordinates: [
      { latitude: 30.82, longitude: 78.32 },
      { latitude: 30.82, longitude: 78.56 },
      { latitude: 30.62, longitude: 78.56 },
      { latitude: 30.62, longitude: 78.32 },
    ],
  },
  {
    id: "zone-chamoli",
    district: "Chamoli",
    risk: "critical",
    coordinates: [
      { latitude: 30.52, longitude: 79.18 },
      { latitude: 30.52, longitude: 79.46 },
      { latitude: 30.3, longitude: 79.46 },
      { latitude: 30.3, longitude: 79.18 },
    ],
  },
  {
    id: "zone-rudraprayag",
    district: "Rudraprayag",
    risk: "high",
    coordinates: [
      { latitude: 30.38, longitude: 78.86 },
      { latitude: 30.38, longitude: 79.08 },
      { latitude: 30.18, longitude: 79.08 },
      { latitude: 30.18, longitude: 78.86 },
    ],
  },
  {
    id: "zone-tehri",
    district: "Tehri Garhwal",
    risk: "low",
    coordinates: [
      { latitude: 30.48, longitude: 78.36 },
      { latitude: 30.48, longitude: 78.6 },
      { latitude: 30.28, longitude: 78.6 },
      { latitude: 30.28, longitude: 78.36 },
    ],
  },
];

export const MAP_LAYERS: MapLayer[] = [
  { id: "thunderstorm", label: "Thunderstorm" },
  { id: "cloudburst", label: "Cloudburst" },
  { id: "flash_flood", label: "Flash flood" },
  { id: "rainfall", label: "Rainfall" },
  { id: "terrain", label: "Terrain" },
];
