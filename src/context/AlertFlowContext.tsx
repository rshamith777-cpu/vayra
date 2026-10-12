import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AlertResponse, AlertStage } from "../types";
import { fetchAlerts } from "../services/api";

interface AlertFlowContextValue {
  stage: AlertStage;
  isDemoRunning: boolean;
  activeAlert: AlertResponse | null;
  startDemo: () => void;
  acknowledge: () => void;
  reset: () => void;
  checkAlerts: () => Promise<void>;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const AlertFlowContext = createContext<AlertFlowContextValue | undefined>(undefined);

const STAGE_SEQUENCE: { stage: AlertStage; delayMs: number }[] = [
  { stage: "normal", delayMs: 0 },
  { stage: "high", delayMs: 1400 },
  { stage: "critical", delayMs: 1400 },
  { stage: "critical_alert", delayMs: 1400 },
];

export function AlertFlowProvider({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<AlertStage>("normal");
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAlert, setActiveAlert] = useState<AlertResponse | null>(null);
  const timers = useRef<number[]>([]);
  const hasAutoTriggered = useRef(false);

  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };

  const checkAlerts = useCallback(async () => {
    try {
      const alertData = await fetchAlerts();
      setActiveAlert(alertData);

      if (
        alertData.alert_triggered &&
        alertData.risk_level === "critical" &&
        !hasAutoTriggered.current &&
        stage !== "acknowledged"
      ) {
        hasAutoTriggered.current = true;
        setStage("critical_alert");
        setIsModalOpen(true);
      }
    } catch (err) {
      console.warn("[AlertFlow] Failed checking backend alerts:", err);
    }
  }, [stage]);

  useEffect(() => {
    checkAlerts();
    const interval = setInterval(checkAlerts, 30000);
    return () => clearInterval(interval);
  }, [checkAlerts]);

  const startDemo = useCallback(() => {
    clearTimers();
    setIsDemoRunning(true);
    setStage("normal");

    let cumulative = 0;
    STAGE_SEQUENCE.forEach(({ stage: s, delayMs }) => {
      cumulative += delayMs;
      const timer = window.setTimeout(() => {
        setStage(s);
        if (s === "critical_alert") {
          setIsDemoRunning(false);
          setIsModalOpen(true);
        }
      }, cumulative);
      timers.current.push(timer);
    });
  }, []);

  const acknowledge = useCallback(() => {
    setStage("acknowledged");
    setIsModalOpen(false);
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    hasAutoTriggered.current = false;
    setStage("normal");
    setIsDemoRunning(false);
    setIsModalOpen(false);
  }, []);

  return (
    <AlertFlowContext.Provider
      value={{
        stage,
        isDemoRunning,
        activeAlert,
        startDemo,
        acknowledge,
        reset,
        checkAlerts,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </AlertFlowContext.Provider>
  );
}

export function useAlertFlow() {
  const ctx = useContext(AlertFlowContext);
  if (!ctx) {
    throw new Error("useAlertFlow must be used within an AlertFlowProvider");
  }
  return ctx;
}
