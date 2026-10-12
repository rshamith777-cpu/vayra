import React, { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  Play,
  RotateCcw,
  MapPin,
  ShieldCheck,
  Activity,
  Layers,
  History,
  TrendingUp,
  Phone,
  Settings,
  HelpCircle,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { useAlertFlow } from "./context/AlertFlowContext";
import { fetchRiskSnapshot, fetchRiskMap, setFusionScenario } from "./services/api";
import { getCurrentWeather, CurrentWeather } from "./services/weather";
import { BackendRiskResponse, RiskZone, HazardStatus, RiskLevel } from "./types";
import { MONITORED_LOCATION, MOCK_RISK_ZONES } from "./mock/map";
import { MOCK_DATA_SOURCES_NORMAL, MOCK_DATA_SOURCES_FAILURE } from "./mock/dataSources";
import { getDemoStageContent } from "./mock/demoStages";
import { MOCK_LEAD_TIME_MINUTES } from "./mock/alerts";

// Components
import { RiskCard } from "./components/RiskCard";
import { HazardCard } from "./components/HazardCard";
import { LocationChip } from "./components/RiskBadge";
import { CurrentConditionsCard } from "./components/CurrentConditionsCard";
import { DataReliabilityCard } from "./components/DataReliabilityCard";
import { CriticalAlertModal } from "./components/CriticalAlertModal";
import { MapViewScreen } from "./components/MapViewScreen";
import { XaiScreenView } from "./components/XaiScreenView";
import { HistoricalReplayView } from "./components/HistoricalReplayView";
import { ContactsScreenView } from "./components/ContactsScreenView";
import { HistoryScreenView } from "./components/HistoryScreenView";
import { ForecastTimelineView } from "./components/ForecastTimelineView";
import { HazardDetailModal } from "./components/HazardDetailModal";

type ActiveTab =
  | "home"
  | "map"
  | "xai"
  | "forecast"
  | "data-sources"
  | "replay"
  | "history"
  | "contacts";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [selectedHazardId, setSelectedHazardId] = useState<string | null>(null);
  const [selectedMapLayer, setSelectedMapLayer] = useState<string>("flash_flood");

  const {
    stage,
    isDemoRunning,
    startDemo,
    reset,
    isModalOpen,
    setIsModalOpen,
    acknowledge,
  } = useAlertFlow();

  const demoContent = getDemoStageContent(stage);

  const [backendData, setBackendData] = useState<BackendRiskResponse | null>(null);
  const [riskZones, setRiskZones] = useState<RiskZone[]>(MOCK_RISK_ZONES);
  const [sensorFailureActive, setSensorFailureActive] = useState(false);
  const [fusionLoading, setFusionLoading] = useState(false);
  const [weather, setWeather] = useState<CurrentWeather | null>(null);

  // Load initial risk snapshot & map
  useEffect(() => {
    fetchRiskSnapshot(2, "normal").then((data) => {
      setBackendData(data);
    });
    fetchRiskMap(2).then((zones) => {
      setRiskZones(zones);
    });
    getCurrentWeather().then((w) => {
      setWeather(w);
    });
  }, []);

  // Sensor Failure toggle
  const handleToggleSensorFailure = useCallback(async () => {
    setFusionLoading(true);
    const nextScenario = sensorFailureActive ? "normal" : "ground_sensor_failure";
    try {
      await setFusionScenario(nextScenario);
      const data = await fetchRiskSnapshot(2, nextScenario);
      setBackendData(data);
      setSensorFailureActive(!sensorFailureActive);
    } catch {
      const fallback =
        nextScenario === "ground_sensor_failure"
          ? { ...backendData, ...MOCK_DATA_SOURCES_FAILURE }
          : { ...backendData, ...MOCK_DATA_SOURCES_NORMAL };
      setBackendData(fallback as BackendRiskResponse);
      setSensorFailureActive(!sensorFailureActive);
    } finally {
      setFusionLoading(false);
    }
  }, [sensorFailureActive, backendData]);

  const useLiveBackend = !isDemoRunning && backendData !== null;
  const locationLabel = useLiveBackend ? backendData.location.label : MONITORED_LOCATION.label;
  const flashFloodHazard = backendData?.hazards.find((h) => h.id === "flash_flood");
  const overallRisk: RiskLevel = useLiveBackend
    ? flashFloodHazard?.risk ?? "high"
    : demoContent.risk;

  const eyebrow = useLiveBackend
    ? overallRisk === "critical"
      ? "CRITICAL HAZARD DETECTED"
      : overallRisk === "high"
      ? "HIGH RISK DETECTED"
      : "CONTINUOUS MONITORING ACTIVE"
    : demoContent.eyebrow;

  const leadTimeMinutes = useLiveBackend
    ? backendData.lead_time_minutes
    : MOCK_LEAD_TIME_MINUTES;

  const hazardList: HazardStatus[] = useLiveBackend
    ? backendData.hazards
    : demoContent.hazards;

  const fusionSources =
    backendData?.sources ??
    (sensorFailureActive ? MOCK_DATA_SOURCES_FAILURE.sources : MOCK_DATA_SOURCES_NORMAL.sources);

  const fusionConfidence =
    backendData?.overall_data_confidence ??
    (sensorFailureActive
      ? MOCK_DATA_SOURCES_FAILURE.overall_data_confidence
      : MOCK_DATA_SOURCES_NORMAL.overall_data_confidence);

  const resilienceStatus =
    backendData?.resilience_status ??
    (sensorFailureActive ? "SENSOR_FAILURE_RESILIENT_FUSION" : "OPTIMAL_MULTIMODAL");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--off-white)", display: "flex", flexDirection: "column" }}>
      {/* Top Navigation Bar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 900,
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--line)",
          padding: "0 24px",
          height: "68px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            onClick={() => setActiveTab("home")}
            style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
          >
            <img
              src="/vayra-logo.jpeg"
              alt="VAYRA Logo"
              style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover" }}
            />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "19px", fontWeight: 800, color: "var(--navy-900)", letterSpacing: "-0.01em" }}>
                  VAYRA
                </span>
                <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", backgroundColor: "var(--navy-900)", color: "var(--white)" }}>
                  AI NOWCAST
                </span>
              </div>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--ink-50)", letterSpacing: "0.06em" }}>
                NATURE × INTELLIGENCE
              </div>
            </div>
          </div>
        </div>

        {/* Primary Tab Navigation */}
        <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {[
            { id: "home", label: "Dashboard" },
            { id: "map", label: "Risk Map" },
            { id: "xai", label: "Why This Alert? (XAI)" },
            { id: "forecast", label: "Forecast Timeline" },
            { id: "data-sources", label: "Multimodal Fusion" },
            { id: "replay", label: "Historical Replay" },
            { id: "history", label: "Audit Log" },
            { id: "contacts", label: "Emergency Contacts" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              style={{
                padding: "8px 14px",
                borderRadius: "var(--radius-pill)",
                fontSize: "13px",
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? "var(--white)" : "var(--ink-70)",
                backgroundColor: activeTab === tab.id ? "var(--navy-900)" : "transparent",
                transition: "all var(--transition-fast)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* SIH Hackathon Demo Trigger Control */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {stage !== "normal" && (
            <button
              onClick={reset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 14px",
                borderRadius: "var(--radius-pill)",
                fontSize: "12px",
                fontWeight: 600,
                backgroundColor: "var(--paper)",
                color: "var(--ink-70)",
                border: "1px solid var(--line)",
              }}
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={startDemo}
            disabled={isDemoRunning}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "var(--radius-pill)",
              fontSize: "12px",
              fontWeight: 700,
              backgroundColor: isDemoRunning ? "var(--red)" : "var(--blue)",
              color: "var(--white)",
              boxShadow: "var(--shadow-sm)",
              transition: "all var(--transition-fast)",
            }}
          >
            <Play size={13} fill="currentColor" />
            <span>{isDemoRunning ? `Stage: ${stage.toUpperCase()}` : "Run Demo Alert Flow"}</span>
          </button>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main style={{ flex: 1, padding: "24px 32px 60px", maxWidth: "1680px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {activeTab === "home" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Location & Region Overview */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <LocationChip label={locationLabel} />
                <span style={{ fontSize: "12px", color: "var(--ink-50)" }}>
                  High-Altitude Mountain Radar & Sensor Array
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--ink-50)", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--green)" }} />
                <span>Real-time Inference Active</span>
              </div>
            </div>

            {/* Hero Risk Card */}
            <RiskCard
              eyebrow={eyebrow}
              hazardName={hazardList[0]?.name ?? "Flash-flood risk"}
              leadTimeMinutes={leadTimeMinutes}
              risk={overallRisk}
              onWhyPress={() => setActiveTab("xai")}
              onMapPress={() => setActiveTab("map")}
            />

            {/* Split Grid: Hazards List & Live Telemetry */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px" }}>
              {/* Hazards Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--charcoal)", letterSpacing: "0.04em" }}>
                    MONITORED ATMOSPHERIC HAZARDS
                  </h3>
                  <span style={{ fontSize: "11px", color: "var(--ink-50)" }}>3 of 3 active</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {hazardList.map((h) => (
                    <HazardCard
                      key={h.id}
                      hazard={h}
                      onClick={() => setSelectedHazardId(h.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Weather & Multimodal Telemetry Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <CurrentConditionsCard weather={weather} />
                <DataReliabilityCard
                  confidence={fusionConfidence}
                  resilienceStatus={resilienceStatus}
                  sources={fusionSources}
                  sensorFailureActive={sensorFailureActive}
                  onToggleSensorFailure={handleToggleSensorFailure}
                  isLoading={fusionLoading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Geospatial Risk Map */}
        {activeTab === "map" && (
          <MapViewScreen
            selectedLayer={selectedMapLayer}
            onSelectLayer={setSelectedMapLayer}
            onSelectHazard={(hId) => setSelectedHazardId(hId)}
          />
        )}

        {/* Tab 3: Explainable AI (XAI) */}
        {activeTab === "xai" && (
          <XaiScreenView
            factors={backendData?.xai ?? []}
            interpretation={backendData ? "Bi-LSTM and Spatiotemporal attention identified a sharp convective surge over the catchment area with saturated soil indices." : "Awaiting data"}
            confidencePct={Math.round((backendData?.overall_data_confidence ?? 0.88) * 100)}
            resilienceStatus={resilienceStatus}
          />
        )}

        {/* Tab 4: Forecast Timeline */}
        {activeTab === "forecast" && <ForecastTimelineView />}

        {/* Tab 5: Multimodal Fusion */}
        {activeTab === "data-sources" && (
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <DataReliabilityCard
              confidence={fusionConfidence}
              resilienceStatus={resilienceStatus}
              sources={fusionSources}
              sensorFailureActive={sensorFailureActive}
              onToggleSensorFailure={handleToggleSensorFailure}
              isLoading={fusionLoading}
            />
          </div>
        )}

        {/* Tab 6: Historical Replay */}
        {activeTab === "replay" && <HistoricalReplayView />}

        {/* Tab 7: Alert Audit Log */}
        {activeTab === "history" && <HistoryScreenView />}

        {/* Tab 8: Emergency Contacts */}
        {activeTab === "contacts" && <ContactsScreenView />}
      </main>

      {/* Full Screen Critical Alert Modal (Triggered by Demo Flow or Live Detection) */}
      <CriticalAlertModal
        hazardName={hazardList[0]?.name ?? "Flash-flood risk"}
        risk={overallRisk}
        locationLabel={locationLabel}
        leadTimeMinutes={leadTimeMinutes}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAcknowledge={acknowledge}
        onViewMap={() => {
          setIsModalOpen(false);
          setActiveTab("map");
        }}
        onContactTeam={() => {
          setIsModalOpen(false);
          setActiveTab("contacts");
        }}
      />

      {/* Hazard Detailed Inspection Modal */}
      <HazardDetailModal
        hazardId={selectedHazardId}
        onClose={() => setSelectedHazardId(null)}
        onOpenMap={() => setActiveTab("map")}
        onWhyPress={() => setActiveTab("xai")}
      />
    </div>
  );
}
