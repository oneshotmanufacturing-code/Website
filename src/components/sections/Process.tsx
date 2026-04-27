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
              color: "#C0392B",
              marginBottom: "12px",
            }}
          >
            PROCESS
          </span>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#171717",
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
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "32px",
          }}
        >
          {/* Desktop timeline connector (hidden on small screens via CSS/media query in global, but using inline for now we'll do a simple trick or just rely on layout) */}
          <div
            className="hidden md:block"
            style={{
              position: "absolute",
              top: "24px", /* half of 48px circle */
              left: "12%",
              right: "12%",
              height: "2px",
              borderTop: "2px dashed #E0E0E0",
              zIndex: 0,
            }}
          />

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
              {/* Number Circle */}
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "#C0392B",
                  color: "#FFFFFF",
                  fontSize: "18px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                {step.number}
              </div>

              {/* Title & Desc */}
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#171717",
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
