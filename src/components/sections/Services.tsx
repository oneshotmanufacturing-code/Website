"use client";

import React from "react";
import Link from "next/link";
import { Cable, Cpu, Search, Rocket, ChevronRight } from "lucide-react";

const services = [
  {
    icon: <Cable size={32} color="#F7941D" />,
    title: "Wire & Cable Preparation",
    desc: "Custom harnesses, crimping, harness assembly, end-to-end processing. We offer a complete solution in cable assembly and wire harness processes.",
    href: "/services#wire-cable",
  },
  {
    icon: <Cpu size={32} color="#F7941D" />,
    title: "PCB Assembly & Soldering",
    desc: "SMT, THT, mixed-tech — prototype to mid-volume production. Our engineers can assist customers with Design for Manufacturability (DfM).",
    href: "/services#pcb-assembly",
  },
  {
    icon: <Search size={32} color="#F7941D" />,
    title: "Raw Material Sourcing",
    desc: "Buyer-supplied, we-procure, or hybrid procurement models. Sourcing capability is the core strength of our group ensuring quality components.",
    href: "/services#material",
  },
  {
    icon: <Rocket size={32} color="#F7941D" />,
    title: "Startup-Friendly Services",
    desc: "No MOQ, no quantity is too small. End-to-end — from free pickup to doorstep delivery. Fast iterations with a team that understands hardware startups.",
    href: "/services#startup",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      style={{ background: "#FFFFFF", padding: "80px 0" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#F7941D",
              marginBottom: "12px",
            }}
          >
            OUR SERVICES
          </span>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#0F1D3F",
              lineHeight: 1.15,
            }}
          >
            WHAT WE BUILD
          </h2>
        </div>

        {/* 2×2 grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
          }}
        >
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  icon,
  title,
  desc,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <div
      className="group"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E0E0E0",
        borderLeft: "4px solid #F7941D",
        borderRadius: "4px",
        padding: "32px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
        display: "flex",
        flexDirection: "column",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)";
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)";
        el.style.transform = "translateY(0)";
      }}
    >
      <div style={{ marginBottom: "20px" }}>{icon}</div>
      <h3
        style={{
          fontSize: "17px",
          fontWeight: 600,
          color: "#0F1D3F",
          marginBottom: "12px",
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
          marginBottom: "24px",
        }}
      >
        {desc}
      </p>
      {/* <Link
        href={href}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "12px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#F7941D",
          textDecoration: "none",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color = "#E08319";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color = "#F7941D";
        }}
      >
        Learn More <ChevronRight size={14} />
      </Link> */}
    </div>
  );
}
