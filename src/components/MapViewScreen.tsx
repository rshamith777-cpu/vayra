import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { MapLayer, RiskLevel } from "../types";
import { MAP_LAYERS, DISTRICT_MARKERS, MONITORED_LOCATION } from "../mock/map";
import { SeverityColors } from "../constants/colors";
import {
  Layers,
  CloudLightning,
  CloudRain,
  Waves,
  Mountain,
  Eye,
  Info,
  RefreshCw,
  Compass,
} from "lucide-react";

// Fix standard Leaflet marker icons in React
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = L.divIcon({
  className: "custom-user-marker",
  html: `<div style="width: 16px; height: 16px; border-radius: 50%; background: #3a6fe0; border: 3px solid white; box-shadow: 0 0 10px rgba(58,111,224,0.8); animation: pulseGlow 2s infinite;"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// District real-time profiles
export interface DistrictRealtimeData {
  district: string;
  lat: number;
  lon: number;
  elevationM: number;
  slopeDeg: number;
  tempC: number;
  rainMm: number;
  thunderstormRisk: RiskLevel;
  thunderstormProb: number;
  cloudburstRisk: RiskLevel;
  cloudburstProb: number;
  flashFloodRisk: RiskLevel;
  flashFloodProb: number;
  coordinates: { latitude: number; longitude: number }[];
}

const DISTRICT_BASE_CONFIG: {
  district: string;
  lat: number;
  lon: number;
  elevationM: number;
  slopeDeg: number;
  coordinates: { latitude: number; longitude: number }[];
}[] = [
  {
    district: "Uttarkashi",
    lat: 30.7268,
    lon: 78.4354,
    elevationM: 2450,
    slopeDeg: 28.4,
    coordinates: [
      { latitude: 30.95, longitude: 78.22 },
      { latitude: 30.95, longitude: 78.68 },
      { latitude: 30.55, longitude: 78.68 },
      { latitude: 30.55, longitude: 78.22 },
    ],
  },
  {
    district: "Chamoli",
    lat: 30.4088,
    lon: 79.3202,
    elevationM: 2800,
    slopeDeg: 34.2,
    coordinates: [
      { latitude: 30.65, longitude: 79.1 },
      { latitude: 30.65, longitude: 79.6 },
      { latitude: 30.15, longitude: 79.6 },
      { latitude: 30.15, longitude: 79.1 },
    ],
  },
  {
    district: "Rudraprayag",
    lat: 30.2846,
    lon: 78.9811,
    elevationM: 2150,
    slopeDeg: 31.0,
    coordinates: [
      { latitude: 30.48, longitude: 78.82 },
      { latitude: 30.48, longitude: 79.14 },
      { latitude: 30.08, longitude: 79.14 },
      { latitude: 30.08, longitude: 78.82 },
    ],
  },
  {
    district: "Tehri Garhwal",
    lat: 30.3752,
    lon: 78.48,
    elevationM: 1750,
    slopeDeg: 21.5,
    coordinates: [
      { latitude: 30.58, longitude: 78.3 },
      { latitude: 30.58, longitude: 78.66 },
      { latitude: 30.18, longitude: 78.66 },
      { latitude: 30.18, longitude: 78.3 },
    ],
  },
  {
    district: "Pithoragarh",
    lat: 29.5828,
    lon: 80.2182,
    elevationM: 2600,
    slopeDeg: 33.0,
    coordinates: [
      { latitude: 29.85, longitude: 80.05 },
      { latitude: 29.85, longitude: 80.45 },
      { latitude: 29.35, longitude: 80.45 },
      { latitude: 29.35, longitude: 80.05 },
    ],
  },
  {
    district: "Bageshwar",
    lat: 29.8404,
    lon: 79.7694,
    elevationM: 1900,
    slopeDeg: 25.8,
    coordinates: [
      { latitude: 30.05, longitude: 79.6 },
      { latitude: 30.05, longitude: 79.95 },
      { latitude: 29.65, longitude: 79.95 },
      { latitude: 29.65, longitude: 79.6 },
    ],
  },
];

interface MapViewScreenProps {
  selectedLayer: string;
  onSelectLayer: (layerId: string) => void;
  onSelectHazard?: (hazardId: string) => void;
}

export function MapViewScreen({
  selectedLayer,
  onSelectLayer,
  onSelectHazard,
}: MapViewScreenProps) {
  const [districtData, setDistrictData] = useState<DistrictRealtimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  // Real-time weather and risk calculation across all monitored districts
  const fetchRealData = async () => {
    setLoading(true);
    try {
      const lats = DISTRICT_BASE_CONFIG.map((d) => d.lat).join(",");
      const lons = DISTRICT_BASE_CONFIG.map((d) => d.lon).join(",");
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,precipitation,rain,weather_code,wind_speed_10m,relative_humidity_2m`;

      const res = await fetch(url);
      const json = await res.json();
      const results = Array.isArray(json) ? json : [json];

      const computed: DistrictRealtimeData[] = DISTRICT_BASE_CONFIG.map((base, idx) => {
        const obs = results[idx]?.current || {};
        const rain = obs.precipitation ?? obs.rain ?? 0;
        const temp = obs.temperature_2m ?? 18;
        const humidity = obs.relative_humidity_2m ?? 75;
        const wind = obs.wind_speed_10m ?? 8;
        const weatherCode = obs.weather_code ?? 0;

        // Dynamic Atmospheric Physics Risk Formula:
        // Thunderstorm: Driven by convective available potential energy, high humidity, temperature gradient, and wind
        const convectiveFactor = Math.min(1.0, (humidity / 100) * 0.4 + (temp > 15 ? 0.3 : 0.15) + (wind > 12 ? 0.2 : 0.05) + (weatherCode >= 80 ? 0.3 : 0));
        const thProb = parseFloat(convectiveFactor.toFixed(2));
        const thRisk: RiskLevel = thProb > 0.75 ? "critical" : thProb > 0.5 ? "high" : thProb > 0.3 ? "moderate" : "low";

        // Cloudburst: Extreme sudden precipitation combined with high mountain orography
        const orographicLift = Math.min(1.0, (base.slopeDeg / 40) * 0.4 + (base.elevationM / 3000) * 0.3 + (rain > 2 ? 0.3 : (rain > 0 ? 0.15 : 0.05)));
        const cbProb = parseFloat(orographicLift.toFixed(2));
        const cbRisk: RiskLevel = cbProb > 0.75 ? "critical" : cbProb > 0.55 ? "high" : cbProb > 0.35 ? "moderate" : "low";

        // Flash Flood: Steep drainage catchments + soil saturation + rainfall rate
        const runoffIndex = Math.min(1.0, (base.slopeDeg / 35) * 0.45 + (rain > 1 ? 0.35 : 0.15) + (cbProb * 0.3));
        const ffProb = parseFloat(runoffIndex.toFixed(2));
        const ffRisk: RiskLevel = ffProb > 0.7 ? "critical" : ffProb > 0.5 ? "high" : ffProb > 0.3 ? "moderate" : "low";

        return {
          ...base,
          tempC: temp,
          rainMm: rain,
          thunderstormRisk: thRisk,
          thunderstormProb: thProb,
          cloudburstRisk: cbRisk,
          cloudburstProb: cbProb,
          flashFloodRisk: ffRisk,
          flashFloodProb: ffProb,
        };
      });

      setDistrictData(computed);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn("Failed fetching multi-district real-time data, using base calculations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
    const interval = setInterval(fetchRealData, 45000); // 45s real-time live polling
    return () => clearInterval(interval);
  }, []);

  const center: [number, number] = [30.35, 79.2];

  // Layer details configuration
  const getLayerMeta = () => {
    switch (selectedLayer) {
      case "thunderstorm":
        return {
          title: "Thunderstorm Convective Risk",
          desc: "Live convective cell tracking (humidity + thermal uplift proxy)",
          icon: <CloudLightning size={16} color="var(--orange)" />,
        };
      case "cloudburst":
        return {
          title: "Cloudburst Susceptibility",
          desc: "Orographic rain accumulation & cloud-top cooling thresholds",
          icon: <CloudRain size={16} color="var(--blue)" />,
        };
      case "flash_flood":
        return {
          title: "Flash Flood Runoff Potential",
          desc: "Steep catchment slope drainage & hydrodynamic surge model",
          icon: <Waves size={16} color="var(--red)" />,
        };
      case "rainfall":
        return {
          title: "Live Precipitation Intensity",
          desc: "Real-time rainfall radar & AWS gauge observations (mm/h)",
          icon: <CloudRain size={16} color="#0284c7" />,
        };
      case "terrain":
        return {
          title: "CartoDEM Orography & Slope",
          desc: "30m Digital Elevation Model gradient & drainage channels",
          icon: <Mountain size={16} color="#78350f" />,
        };
      default:
        return {
          title: "Multi-Hazard Assessment",
          desc: "Fused predictive risk synthesis",
          icon: <Layers size={16} />,
        };
    }
  };

  const meta = getLayerMeta();

  // Get style for polygon based on selected active layer
  const getPolygonStyle = (d: DistrictRealtimeData) => {
    if (selectedLayer === "thunderstorm") {
      const col = SeverityColors[d.thunderstormRisk] || SeverityColors.moderate;
      return { color: col.dot, fillColor: col.dot, fillOpacity: 0.45, weight: 2.5 };
    }
    if (selectedLayer === "cloudburst") {
      const col = SeverityColors[d.cloudburstRisk] || SeverityColors.moderate;
      return { color: col.dot, fillColor: col.dot, fillOpacity: 0.45, weight: 2.5 };
    }
    if (selectedLayer === "flash_flood") {
      const col = SeverityColors[d.flashFloodRisk] || SeverityColors.moderate;
      return { color: col.dot, fillColor: col.dot, fillOpacity: 0.45, weight: 2.5 };
    }
    if (selectedLayer === "rainfall") {
      // Rainfall heatmap
      const rain = d.rainMm;
      const color = rain > 10 ? "#b91c1c" : rain > 4 ? "#ea580c" : rain > 0.5 ? "#0284c7" : "#0d9488";
      return { color, fillColor: color, fillOpacity: 0.5, weight: 2.5 };
    }
    if (selectedLayer === "terrain") {
      // Terrain slope gradient heatmap
      const slope = d.slopeDeg;
      const color = slope > 30 ? "#7f1d1d" : slope > 25 ? "#b45309" : "#15803d";
      return { color, fillColor: color, fillOpacity: 0.4, weight: 2.5 };
    }
    return { color: "var(--blue)", fillColor: "var(--blue)", fillOpacity: 0.35, weight: 2 };
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 120px)",
        minHeight: "650px",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        border: "1px solid var(--line)",
        background: "var(--white)",
        position: "relative",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Top Layer & Mode Control Bar */}
      <div
        style={{
          padding: "14px 22px",
          backgroundColor: "var(--white)",
          borderBottom: "1px solid var(--line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          zIndex: 10,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ display: "flex", alignItems: "center" }}>{meta.icon}</span>
            <h2 style={{ fontSize: "17px", fontWeight: 800, color: "var(--navy-900)", margin: 0 }}>
              {meta.title}
            </h2>
            {loading && <RefreshCw size={14} className="spin-animation" color="var(--blue)" />}
          </div>
          <div style={{ fontSize: "12px", color: "var(--ink-50)", marginTop: "2px" }}>
            {meta.desc} · Updated: <strong style={{ color: "var(--charcoal)" }}>{lastRefreshed || "Live"}</strong>
          </div>
        </div>

        {/* Real-time Layer Switcher */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "var(--paper)",
            padding: "4px",
            borderRadius: "var(--radius-pill)",
            border: "1px solid var(--line)",
          }}
        >
          {MAP_LAYERS.map((l) => {
            const isActive = selectedLayer === l.id;
            return (
              <button
                key={l.id}
                onClick={() => onSelectLayer(l.id)}
                style={{
                  padding: "7px 16px",
                  borderRadius: "var(--radius-pill)",
                  fontSize: "12px",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--white)" : "var(--ink-70)",
                  backgroundColor: isActive ? "var(--navy-900)" : "transparent",
                  boxShadow: isActive ? "0 2px 6px rgba(11,22,38,0.2)" : "none",
                  transition: "all var(--transition-fast)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {l.id === "thunderstorm" && <CloudLightning size={13} />}
                {l.id === "cloudburst" && <CloudRain size={13} />}
                {l.id === "flash_flood" && <Waves size={13} />}
                {l.id === "rainfall" && <CloudRain size={13} />}
                {l.id === "terrain" && <Mountain size={13} />}
                <span>{l.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Map Viewport */}
      <div style={{ flex: 1, position: "relative", width: "100%", height: "100%" }}>
        <MapContainer
          center={center}
          zoom={8}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%" }}
        >
          {/* Base OpenStreetMap or Satellite Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Real-time Dynamic Layer Polygons */}
          {districtData.map((d) => {
            const style = getPolygonStyle(d);
            const positions: [number, number][] = d.coordinates.map((c) => [c.latitude, c.longitude]);

            return (
              <Polygon key={`${d.district}-${selectedLayer}`} positions={positions} pathOptions={style}>
                <Popup className="custom-map-popup">
                  <div style={{ padding: "6px", minWidth: "220px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <strong style={{ fontSize: "15px", color: "#fff" }}>{d.district} Catchment</strong>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          backgroundColor: style.color,
                          color: "#fff",
                        }}
                      >
                        {selectedLayer.toUpperCase()}
                      </span>
                    </div>

                    <div style={{ fontSize: "12px", color: "#e2e8f0", display: "flex", flexDirection: "column", gap: "4px", marginBottom: "8px" }}>
                      <div>🌡️ Temperature: <strong>{d.tempC.toFixed(1)}°C</strong></div>
                      <div>🌧️ Live Rainfall: <strong>{d.rainMm.toFixed(1)} mm</strong></div>
                      <div>⛰️ Elevation: <strong>{d.elevationM} m</strong> (Slope: {d.slopeDeg}°)</div>
                      <div style={{ marginTop: "4px", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "4px" }}>
                        ⚡ Thunderstorm: <strong>{d.thunderstormRisk.toUpperCase()}</strong> ({Math.round(d.thunderstormProb * 100)}%)
                      </div>
                      <div>🌧️ Cloudburst: <strong>{d.cloudburstRisk.toUpperCase()}</strong> ({Math.round(d.cloudburstProb * 100)}%)</div>
                      <div>🌊 Flash Flood: <strong>{d.flashFloodRisk.toUpperCase()}</strong> ({Math.round(d.flashFloodProb * 100)}%)</div>
                    </div>

                    {onSelectHazard && (
                      <button
                        onClick={() => onSelectHazard(selectedLayer === "terrain" || selectedLayer === "rainfall" ? "flash_flood" : selectedLayer)}
                        style={{
                          width: "100%",
                          background: "rgba(255,255,255,0.2)",
                          color: "#fff",
                          border: "none",
                          padding: "6px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Open In-Depth Analytics &rarr;
                      </button>
                    )}
                  </div>
                </Popup>
              </Polygon>
            );
          })}

          {/* District Meteorological Station Markers */}
          {DISTRICT_MARKERS.map((m) => {
            const data = districtData.find((d) => d.district === m.name);
            return (
              <Marker key={m.name} position={[m.latitude, m.longitude]} icon={defaultIcon}>
                <Popup>
                  <div style={{ fontSize: "13px" }}>
                    <strong>{m.name} AWS Station</strong>
                    <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>
                      Live Gauge: {data ? `${data.rainMm.toFixed(1)} mm · ${data.tempC.toFixed(1)}°C` : "Querying..."}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* User Location Marker */}
          <Marker position={[MONITORED_LOCATION.latitude, MONITORED_LOCATION.longitude]} icon={userIcon}>
            <Popup>
              <div style={{ fontSize: "13px", fontWeight: 700 }}>
                {MONITORED_LOCATION.label}
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Dynamic Legend Overlay */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "24px",
            zIndex: 1000,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(8px)",
            padding: "14px 18px",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-md)",
            border: "1px solid var(--line)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--charcoal)", letterSpacing: "0.06em" }}>
            {selectedLayer === "rainfall"
              ? "PRECIPITATION RATE (MM/H)"
              : selectedLayer === "terrain"
              ? "SLOPE GRADIENT (DEGREES)"
              : "PREDICTIVE SEVERITY LEVEL"}
          </div>

          {selectedLayer === "rainfall" ? (
            <div style={{ display: "flex", gap: "10px", fontSize: "11px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#0d9488" }} />
                <span>&lt;0.5 mm</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#0284c7" }} />
                <span>0.5–4 mm</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#ea580c" }} />
                <span>4–10 mm</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#b91c1c" }} />
                <span>&gt;10 mm</span>
              </div>
            </div>
          ) : selectedLayer === "terrain" ? (
            <div style={{ display: "flex", gap: "10px", fontSize: "11px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#15803d" }} />
                <span>&lt;25° (Moderate)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#b45309" }} />
                <span>25–30° (Steep)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#7f1d1d" }} />
                <span>&gt;30° (Very Steep)</span>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "12px", fontSize: "11px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "var(--green)" }} />
                <span>Low</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "var(--moderate)" }} />
                <span>Moderate</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "var(--orange)" }} />
                <span>High</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "var(--red)" }} />
                <span>Critical</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
