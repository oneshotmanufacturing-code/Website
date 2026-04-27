"use client";

import React from "react";

export default function Footer() {
  return (
    <footer style={{ background: "#0A0A0A", color: "#FFFFFF" }}>
      {/* Upper section */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "64px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "40px",
          }}
        >
          {/* Col 1 */}
          <div style={{ gridColumn: "span 2" }}>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 800,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              ONESHOT MANUFACTURING
            </div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", marginBottom: "16px" }}>
              Precision Wiring & Assembly Solutions
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
              GSTIN: 2727272727272727
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h3
              style={{
                color: "#C0392B",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.10em",
                marginBottom: "20px",
              }}
            >
              Quick Links
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <FooterLink href="#services">Services</FooterLink>
              <FooterLink href="#why-us">Why Us</FooterLink>
              <FooterLink href="#process">Process</FooterLink>
              <FooterLink href="#contact">Contact</FooterLink>
            </div>
          </div>

          {/* Col 3 */}
          <div>
            <h3
              style={{
                color: "#C0392B",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.10em",
                marginBottom: "20px",
              }}
            >
              Company
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <FooterLink href="#">Quality Standards</FooterLink>
              <FooterLink href="#">ESD Policy</FooterLink>
              <FooterLink href="#">About</FooterLink>
            </div>
          </div>

          {/* Col 4 */}
          <div>
            <h3
              style={{
                color: "#C0392B",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.10em",
                marginBottom: "20px",
              }}
            >
              Contact
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>+91 90000 00000</span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", wordBreak: "break-all" }}>
                info@oneshotmanufacturing.com
              </span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>
                Mon–Sat, 9AM–6PM IST
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.08)" }} />

      {/* Bottom bar */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
          © 2026 OneShot Manufacturing. All rights reserved.
        </div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
          L140, MIDC, Ahilyanagar, Maharashtra — 414111
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      style={{
        fontSize: "13px",
        color: "rgba(255,255,255,0.7)",
        textDecoration: "none",
        transition: "color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color = "#C0392B";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)";
      }}
    >
      {children}
    </a>
  );
}
