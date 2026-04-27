"use client";

import React from "react";

/* ─────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────── */

const edges = [
  {
    num: "01",
    tag: "QUALITY ASSURANCE",
    title: "Computer Vision QC",
    desc: "Automated camera systems detect microscopic defects instantly, ensuring 99.9% yield rates before your products ever leave the factory floor.",
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

/* ─────────────────────────────────────────────
   BENTO CELL
   ───────────────────────────────────────────── */

interface BentoCellProps {
  num: string;
  tag: string;
  title: string;
  desc: string;
  className?: string;
  large?: boolean;
}

function BentoCell({ num, tag, title, desc, className = "", large = false }: BentoCellProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-lg border border-dark-3 bg-white transition-all duration-500 hover:border-red/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 ${className}`}
    >
      {/* Glow line at top */}
      <div className="absolute top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-red to-transparent transition-all duration-700 group-hover:w-full" />

      {/* Content */}
      <div className={`relative z-10 flex h-full flex-col justify-between ${large ? "p-8 lg:p-10" : "p-6 lg:p-8"}`}>
        {/* Top row: number + tag */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-display text-[36px] lg:text-[48px] font-bold leading-none text-dark-3 transition-colors duration-500 group-hover:text-red/20">
            {num}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-red/80">
            {tag}
          </span>
        </div>

        {/* Title */}
        <h3 className={`font-display font-bold text-white-text leading-[1.1] mb-4 transition-transform duration-500 group-hover:-translate-y-1 ${large ? "text-[28px] lg:text-[36px]" : "text-[22px] lg:text-[26px]"}`}>
          {title}
        </h3>

        {/* Description — fades in on hover */}
        <p className={`font-body text-grey leading-relaxed transition-all duration-500 group-hover:text-white-text ${large ? "text-[16px] lg:text-[18px]" : "text-[14px] lg:text-[16px]"}`}>
          {desc}
        </p>

        {/* Bottom accent line */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-[1px] w-8 bg-dark-3 transition-all duration-500 group-hover:w-16 group-hover:bg-red/60" />
          <span className="text-[11px] text-grey uppercase tracking-widest transition-colors duration-500 group-hover:text-white-text">
            Learn more
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN SECTION
   ───────────────────────────────────────────── */

export default function WhyUs() {
  return (
    <section
      id="why-us"
      className="relative w-full overflow-hidden min-h-screen flex items-center py-20 md:py-28"
    >

      {/* ── Content ── */}
      <div className="relative z-10 max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 w-full">
        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 lg:mb-20 gap-6">
          <div>
            <span className="inline-block text-[14px] font-bold uppercase tracking-[0.2em] text-red mb-4">
              OUR EDGE
            </span>
            <h2 className="font-display text-4xl sm:text-6xl lg:text-[80px] font-bold leading-[0.9] text-white-text">
              WHY
              <br />
              <span className="text-dim">ONE</span>SHOT
            </h2>
          </div>

          {/* Decorative stat */}
          <div className="hidden lg:flex items-end gap-8 pb-2">
            <div className="text-right">
              <div className="text-[48px] font-display font-bold text-red leading-none">6</div>
              <div className="text-[12px] uppercase tracking-[0.15em] text-grey mt-1">Competitive<br/>Advantages</div>
            </div>
            <div className="h-16 w-[1px] bg-dark-3" />
            <div className="text-right">
              <div className="text-[48px] font-display font-bold text-dim leading-none">99.9<span className="text-red">%</span></div>
              <div className="text-[12px] uppercase tracking-[0.15em] text-grey mt-1">Quality<br/>Yield Rate</div>
            </div>
          </div>
        </div>

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5">
          {/* Row 1 */}
          <BentoCell
            {...edges[0]}
            large
            className="lg:col-span-5 lg:row-span-2 min-h-[280px] lg:min-h-[380px]"
          />
          <BentoCell
            {...edges[1]}
            className="lg:col-span-4 min-h-[180px]"
          />
          <BentoCell
            {...edges[2]}
            className="lg:col-span-3 min-h-[180px]"
          />

          {/* Row 2 */}
          <BentoCell
            {...edges[3]}
            className="lg:col-span-3 min-h-[180px]"
          />
          <BentoCell
            {...edges[4]}
            large
            className="lg:col-span-4 min-h-[180px]"
          />

          {/* Row 3 — full-width bottom bar */}
          <BentoCell
            {...edges[5]}
            className="lg:col-span-12 min-h-[140px] lg:min-h-[160px]"
          />
        </div>
      </div>
    </section>
  );
}
