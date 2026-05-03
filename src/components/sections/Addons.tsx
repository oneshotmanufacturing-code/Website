"use client";

import React from "react";

const addons = [
  "QC Report & Data",
  "Per-Unit Photos",
  "Cable Tagging",
  "Firmware Flashing",
  "Continuity Testing",
  "Partial Assembly",
  "Conformer Coating",
  "Potting",
];

export default function Addons() {
  return (
    <section id="addons" style={{ background: "#FFFFFF", padding: "80px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px", textAlign: "left" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#DC2626",
              marginBottom: "12px",
            }}
          >
            EXTRAS
          </span>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#111111",
              lineHeight: 1.15,
            }}
          >
            OPTIONAL ADD-ONS
          </h2>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "#555555",
              marginTop: "8px",
            }}
          >
            Available at additional cost. Mention when requesting a quote.
          </p>
        </div>

        {/* Pill Badges */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            gap: "12px",
          }}
        >
          {addons.map((item, index) => (
            <span
              key={index}
              style={{
                background: "#F5F5F5",
                border: "1px solid #E0E0E0",
                color: "#1A1A1A",
                fontSize: "13px",
                fontWeight: 500,
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "default",
                transition: "background 0.2s ease, border-color 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLSpanElement;
                el.style.background = "#DC2626";
                el.style.borderColor = "#DC2626";
                el.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLSpanElement;
                el.style.background = "#F5F5F5";
                el.style.borderColor = "#E0E0E0";
                el.style.color = "#1A1A1A";
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
