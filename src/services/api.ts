import {
  AlertResponse,
  BackendRiskResponse,
  DataSourcesResponse,
  ExplanationResponse,
  RiskZone,
} from "../types";
import { MOCK_HAZARD_STATUS } from "../mock/hazards";
import { MOCK_LEAD_TIME_MINUTES } from "../mock/alerts";
import { MOCK_XAI_FACTORS, XAI_MODEL_INTERPRETATION } from "../mock/xai";
import { MAP_LAYERS, MOCK_RISK_ZONES, MONITORED_LOCATION } from "../mock/map";
import {
  MOCK_DATA_SOURCES_NORMAL,
  MOCK_DATA_SOURCES_FAILURE,
} from "../mock/dataSources";

export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || "http://127.0.0.1:8000";

const REQUEST_TIMEOUT_MS = 3000;

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = REQUEST_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * GET /risk
 */
export async function fetchRiskSnapshot(
  leadTimeHours = 2,
  scenario?: string
): Promise<BackendRiskResponse> {
  try {
    const scenarioQuery = scenario ? `&scenario=${encodeURIComponent(scenario)}` : "";
    const res = await fetchWithTimeout(
      `${API_BASE_URL}/risk?lead_time_hours=${leadTimeHours}${scenarioQuery}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      location: data.location ?? MONITORED_LOCATION,
      timestamp: data.timestamp ?? new Date().toISOString(),
      lead_time_minutes: data.lead_time_minutes ?? leadTimeHours * 60,
      hazards: data.hazards ?? MOCK_HAZARD_STATUS,
      xai: data.xai ?? MOCK_XAI_FACTORS,
      map_layers: data.map_layers ?? MAP_LAYERS,
      data_sources_used: data.data_sources_used,
      fusion_weights: data.fusion_weights,
      overall_data_confidence: data.overall_data_confidence,
      resilience_status: data.resilience_status,
      sources: data.sources,
    };
  } catch {
    const fallbackSource =
      scenario === "ground_sensor_failure"
        ? MOCK_DATA_SOURCES_FAILURE
        : MOCK_DATA_SOURCES_NORMAL;

    return {
      location: MONITORED_LOCATION,
      timestamp: new Date().toISOString(),
      lead_time_minutes: MOCK_LEAD_TIME_MINUTES,
      hazards: MOCK_HAZARD_STATUS,
      xai: MOCK_XAI_FACTORS,
      map_layers: MAP_LAYERS,
      sources: fallbackSource.sources,
      fusion_weights: fallbackSource.fusion_weights,
      overall_data_confidence: fallbackSource.overall_data_confidence,
      resilience_status: fallbackSource.resilience_status,
    };
  }
}

/**
 * GET /risk-map
 */
export async function fetchRiskMap(leadTimeHours = 2): Promise<RiskZone[]> {
  try {
    const res = await fetchWithTimeout(
      `${API_BASE_URL}/risk-map?lead_time_hours=${leadTimeHours}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
    return MOCK_RISK_ZONES;
  } catch {
    return MOCK_RISK_ZONES;
  }
}

/**
 * GET /alerts
 */
export async function fetchAlerts(): Promise<AlertResponse> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/alerts`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return {
      alert_triggered: false,
      risk_level: "high",
      hazard_id: "flash_flood",
      hazard_name: "Flash flood",
      location_label: MONITORED_LOCATION.label,
      lead_time_minutes: MOCK_LEAD_TIME_MINUTES,
      message: "High risk of flash flood detected in Chamoli and Rudraprayag.",
    };
  }
}

/**
 * GET /explanation
 */
export async function fetchExplanation(
  locationId = "30.4088_79.3202",
  leadTimeHours = 2
): Promise<ExplanationResponse> {
  try {
    const res = await fetchWithTimeout(
      `${API_BASE_URL}/explanation?location_id=${locationId}&lead_time_hours=${leadTimeHours}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      location_id: data.location_id ?? locationId,
      lead_time_hours: data.lead_time_hours ?? leadTimeHours,
      lead_time_minutes: data.lead_time_minutes ?? leadTimeHours * 60,
      interpretation: data.interpretation ?? XAI_MODEL_INTERPRETATION,
      factors: data.factors?.length ? data.factors : MOCK_XAI_FACTORS,
      raw_factors: data.raw_factors ?? {},
      fusion_weights: data.fusion_weights,
      overall_data_confidence: data.overall_data_confidence,
      resilience_status: data.resilience_status,
      sources: data.sources,
    };
  } catch {
    return {
      location_id: locationId,
      lead_time_hours: leadTimeHours,
      lead_time_minutes: leadTimeHours * 60,
      interpretation: XAI_MODEL_INTERPRETATION,
      factors: MOCK_XAI_FACTORS,
      raw_factors: {},
      fusion_weights: MOCK_DATA_SOURCES_NORMAL.fusion_weights,
      overall_data_confidence: MOCK_DATA_SOURCES_NORMAL.overall_data_confidence,
      resilience_status: MOCK_DATA_SOURCES_NORMAL.resilience_status,
      sources: MOCK_DATA_SOURCES_NORMAL.sources,
    };
  }
}

/**
 * GET /data-sources
 */
export async function fetchDataSources(scenario?: string): Promise<DataSourcesResponse> {
  try {
    const query = scenario ? `?scenario=${encodeURIComponent(scenario)}` : "";
    const res = await fetchWithTimeout(`${API_BASE_URL}/data-sources${query}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return scenario === "ground_sensor_failure"
      ? MOCK_DATA_SOURCES_FAILURE
      : MOCK_DATA_SOURCES_NORMAL;
  }
}

/**
 * POST /data-sources/scenario
 */
export async function setFusionScenario(
  scenario: "normal" | "ground_sensor_failure" | string
): Promise<DataSourcesResponse> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/data-sources/scenario`, {
      method: "POST",
      body: JSON.stringify({ scenario }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return scenario === "ground_sensor_failure"
      ? MOCK_DATA_SOURCES_FAILURE
      : MOCK_DATA_SOURCES_NORMAL;
  }
}
