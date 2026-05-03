"use client";

import React from "react";

const pcbPoints = [
  {
    title: "Short Turnaround",
    desc: "Fast cycles for rapid hardware iteration",
  },
  {
    title: "Lead-Free Solder",
    desc: "RoHS-compliant, safe for your team",
  },
  {
    title: "Digitally Controlled Reflow",
    desc: "Oven settings managed by software, not guesswork",
  },
  {
    title: "Computer Vision Inspection",
    desc: "Every board verified under microscope + CV",
  },
  {
    title: "ESD-Safe Environment",
    desc: "Grounded, gloved, ISO-handled throughout",
  },
  {
    title: "ESD Packaging",
    desc: "Anti-static packaging, boards arrive intact",
  },
];

export default function PCBQuality() {
  return (
    <section id="pcb" style={{ background: "#111111", padding: "80px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <span
            style={{
              display: "inline-block",
              background: "#DC2626",
              color: "#FFFFFF",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.10em",
              padding: "4px 10px",
              marginBottom: "12px",
            }}
          >
            PCB PROCESS
          </span>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.15,
            }}
          >
            PCB ASSEMBLY QUALITY
          </h2>
        </div>

        {/* 3×2 Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {pcbPoints.map((point, index) => (
            <div
              key={index}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderTop: "2px solid #DC2626",
                borderRadius: "4px",
                padding: "24px",
                transition: "background 0.25s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(220,38,38,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.06)";
              }}
            >
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  marginBottom: "8px",
                }}
              >
                {point.title}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.60)",
                  lineHeight: 1.5,
                }}
              >
                {point.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
