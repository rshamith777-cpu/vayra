import React from "react";
import { MOCK_CONTACTS } from "../mock/contacts";
import { Phone, MapPin, Building, ShieldAlert } from "lucide-react";

export function ContactsScreenView() {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div
        style={{
          background: "linear-gradient(135deg, var(--navy-900) 0%, var(--navy-800) 100%)",
          borderRadius: "var(--radius-xl)",
          padding: "24px",
          color: "var(--white)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <ShieldAlert size={22} color="#f87171" />
          <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0, color: "var(--white)" }}>
            Disaster Response & Emergency Contacts
          </h2>
        </div>
        <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.75)", margin: 0 }}>
          Direct communication links to State & District Emergency Operation Centres (DEOC) for Uttarakhand.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {MOCK_CONTACTS.map((c) => (
          <div
            key={c.id}
            style={{
              background: "var(--white)",
              borderRadius: "var(--radius-lg)",
              padding: "18px 20px",
              border: "1px solid var(--line)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "var(--blue-tint)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Building size={20} color="var(--blue)" />
              </div>
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--charcoal)", marginBottom: "3px" }}>
                  {c.name}
                </h4>
                <div style={{ fontSize: "12px", color: "var(--ink-50)" }}>
                  {c.subtitle}
                </div>
              </div>
            </div>

            <a
              href={`tel:${c.phoneNumber}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "var(--radius-pill)",
                backgroundColor: "var(--navy-900)",
                color: "var(--white)",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 600,
                transition: "opacity var(--transition-fast)",
              }}
            >
              <Phone size={14} />
              <span>{c.phoneNumber}</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
