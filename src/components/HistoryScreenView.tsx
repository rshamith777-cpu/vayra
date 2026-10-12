import React, { useState } from "react";
import { MOCK_ALERT_HISTORY } from "../mock/alerts";
import { RiskBadge } from "./RiskBadge";
import { Clock, Filter, AlertCircle } from "lucide-react";

export function HistoryScreenView() {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all" ? MOCK_ALERT_HISTORY : MOCK_ALERT_HISTORY.filter((e) => e.day === filter);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--navy-900)", margin: 0 }}>
            Alert & Nowcast Audit Log
          </h2>
          <div style={{ fontSize: "12px", color: "var(--ink-50)" }}>
            Archived incident bulletins with verified lead-times
          </div>
        </div>

        <div style={{ display: "flex", gap: "6px", background: "var(--white)", padding: "4px", borderRadius: "var(--radius-pill)", border: "1px solid var(--line)" }}>
          {["all", "today", "yesterday", "this_week"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-pill)",
                fontSize: "12px",
                fontWeight: 600,
                color: filter === tab ? "var(--white)" : "var(--ink-70)",
                backgroundColor: filter === tab ? "var(--navy-900)" : "transparent",
              }}
            >
              {tab === "all" ? "All" : tab === "today" ? "Today" : tab === "yesterday" ? "Yesterday" : "This Week"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            style={{
              background: "var(--white)",
              borderRadius: "var(--radius-lg)",
              padding: "16px 20px",
              border: "1px solid var(--line)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ fontSize: "20px" }}>{item.icon}</span>
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "3px" }}>
                  {item.hazard}
                </h4>
                <div style={{ fontSize: "12px", color: "var(--ink-50)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>{item.district} District</span>
                  <span>•</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                    <Clock size={12} />
                    {item.time} ({item.day})
                  </span>
                </div>
              </div>
            </div>

            <RiskBadge risk={item.risk} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
