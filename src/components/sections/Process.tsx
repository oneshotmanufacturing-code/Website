import React from "react";

const steps = [
  {
    number: "01",
    title: "Inquiry",
    desc: "Share requirements via the quote form or email",
  },
  {
    number: "02",
    title: "Design Review",
    desc: "Engineers confirm specs and suggest optimizations",
  },
  {
    number: "03",
    title: "Production",
    desc: "Precision manufacturing with in-process QC",
  },
  {
    number: "04",
    title: "Delivery",
    desc: "Packaged, labeled, shipped on time",
  },
];

export default function Process() {
  return (
    <section id="process" style={{ background: "#F5F5F5", padding: "80px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
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
            PROCESS
          </span>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#111111",
              lineHeight: 1.15,
            }}
          >
            HOW IT WORKS
          </h2>
        </div>

        {/* Timeline */}
        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "32px",
          }}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              {/* Dashed connector from this circle to the next */}
              {index < steps.length - 1 && (
                <div
                  className="hidden md:block"
                  style={{
                    position: "absolute",
                    top: "24px",
                    left: "48px",
                    right: "-32px",
                    height: "0px",
                    borderTop: "2px dashed #D0D0D0",
                    zIndex: 0,
                  }}
                />
              )}

              {/* Number Circle */}
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "#DC2626",
                  color: "#FFFFFF",
                  fontSize: "18px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {step.number}
              </div>

              {/* Title & Desc */}
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#111111",
                  marginBottom: "8px",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#555555",
                  lineHeight: 1.6,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
