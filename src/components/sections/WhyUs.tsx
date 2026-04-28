"use client";

import React from "react";

const edges = [
  {
    num: "01",
    tag: "QUALITY ASSURANCE",
    title: "Computer Vision QC",
    desc: "Automated camera systems detect microscopic defects instantly, ensuring higher yield rates before your products ever leave the factory floor.",
  },
  {
    num: "02",
    tag: "TRACEABILITY",
    title: "Cable Tracking & Tagging",
    desc: "Unique digital twins for every harness, giving full visibility into manufacturing history, materials used, and testing results.",
  },
  {
    num: "03",
    tag: "LOGISTICS",
    title: "Free Pickup & Delivery",
    desc: "Door-to-door, friction-free supply chain transport anywhere in India so you can focus on hardware design.",
  },
  {
    num: "04",
    tag: "SAFETY STANDARDS",
    title: "ESD-Safe Handling",
    desc: "ISO-compliant pristine assembly environments heavily regulated against electrostatic discharge, protecting sensitive components.",
  },
  {
    num: "05",
    tag: "SPEED",
    title: "Fast Turnaround",
    desc: "Rapid prototyping lines optimized to get functional boards back into your hands in record time. In hardware, speed is life.",
  },
  {
    num: "06",
    tag: "FLEXIBILITY",
    title: "Startup-Friendly MOQ",
    desc: "No minimum too small. Scale from 5 prototypes for investor demos to 5,000 units for your first commercial run.",
  },
];

function EdgeCard({
  num,
  tag,
  title,
  desc,
}: {
  num: string;
  tag: string;
  title: string;
  desc: string;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E0E0E0",
        borderRadius: "4px",
        padding: "28px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.25s ease, transform 0.25s ease, border-left 0.25s ease",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)";
        el.style.transform = "translateY(-2px)";
        el.style.borderLeft = "3px solid #F7941D";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)";
        el.style.transform = "translateY(0)";
        el.style.borderLeft = "1px solid #E0E0E0";
      }}
    >
      {/* Number badge */}
      <div>
        <span
          style={{
            display: "inline-block",
            background: "#F7941D",
            color: "#FFFFFF",
            fontSize: "13px",
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: "2px",
          }}
        >
          {num}
        </span>
      </div>

      <h3
        style={{
          fontSize: "16px",
          fontWeight: 600,
          color: "#0F1D3F",
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: "14px",
          fontWeight: 400,
          color: "#555555",
          lineHeight: 1.6,
          flex: 1,
        }}
      >
        {desc}
      </p>

      {/* <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "12px",
          fontWeight: 700,
          textTransform: "uppercase" as const,
          letterSpacing: "0.08em",
          color: "#F7941D",
          cursor: "default",
        }}
      >
        Learn more →
      </div> */}
    </div>
  );
}

export default function WhyUs() {
  return (
    <section
      id="why-us"
      style={{ background: "#F5F5F5", padding: "80px 0" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header row with stats */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "48px",
            gap: "24px",
          }}
        >
          <div>
            <span
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#F7941D",
                marginBottom: "12px",
              }}
            >
              OUR EDGE
            </span>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 700,
                color: "#0F1D3F",
                lineHeight: 1.1,
                textTransform: "uppercase",
              }}
            >
              WHY CHOOSE US?

            </h2>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: 900,
                  color: "#0F1D3F",
                  lineHeight: 1,
                }}
              >
                6
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.10em",
                  color: "#F7941D",
                  marginTop: "4px",
                }}
              >
                Advantages
              </div>
            </div>

            <div
              style={{
                width: "2px",
                height: "70px",
                background: "#E0E0E0",
              }}
            />

            {/* <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: 900,
                  color: "#0F1D3F",
                  lineHeight: 1,
                }}
              >
                99.9%
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.10em",
                  color: "#F7941D",
                  marginTop: "4px",
                }}
              >
                Yield Rate
              </div>
            </div> */}
          </div>
        </div>

        {/* 3×2 card grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {edges.map((edge, index) => (
            <EdgeCard key={index} {...edge} />
          ))}
        </div>
      </div>
    </section>
  );
}
