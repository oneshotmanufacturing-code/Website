import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Cable, Cpu, Search, Rocket, ChevronRight } from "lucide-react";

const SectionTag = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block text-[18px] font-bold uppercase tracking-[0.15em] text-red mb-4">
    {children}
  </span>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-tight text-white-text">
    {children}
  </h2>
);

const services = [
  {
    icon: <Cable size={40} className="text-red" />,
    title: "Wire & Cable Preparation",
    desc: "Custom harnesses, crimping, harness assembly, end-to-end processing. We offer a complete solution in cable assembly and wire harness processes.",
    img: "/images/wire.jpg",
    href: "/services#wire-cable",
  },
  {
    icon: <Cpu size={40} className="text-red" />,
    title: "PCB Assembly & Soldering",
    desc: "SMT, THT, mixed-tech — prototype to mid-volume production. Our engineers can assist customers with Design for Manufacturability (DfM).",
    img: "/images/pcb.jpg",
    href: "/services#pcb-assembly",
  },
  {
    icon: <Search size={40} className="text-red" />,
    title: "Raw Material Sourcing",
    desc: "Buyer-supplied, we-procure, or hybrid procurement models. Sourcing capability is the core strength of our group ensuring quality components.",
    img: "/images/sourcing.jpg",
    href: "/services#material",
  },
  {
    icon: <Rocket size={40} className="text-red" />,
    title: "Startup-Friendly Services",
    desc: "No MOQ, no quantity is too small. End-to-end — from free pickup to doorstep delivery. Fast iterations with a team that understands hardware startups.",
    img: "/images/for-startup-3.jpg",
    href: "/services#startup",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative w-full min-h-screen flex"
    >
      <div className="relative z-10 max-w-[1450px] mx-auto w-full px-2 sm:px-4 md:px-6 pt-20 md:pt-32 pb-16 flex flex-col">
        <header className="flex flex-col items-center text-center mb-20">
          <SectionTag>OUR SERVICES</SectionTag>
          <SectionHeading>WHAT WE BUILD</SectionHeading>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-dark-3 bg-white flex flex-col transition-all duration-300 hover:-translate-y-2 hover:border-red/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] min-h-[380px] md:min-h-[420px]"
            >
              {/* Glow line at top */}
              <div className="absolute top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-red to-transparent transition-all duration-700 group-hover:w-full z-10" />

              {/* Top content */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="mb-6">
                  {service.icon}
                </div>
                <h3 className="font-display text-2xl md:text-[26px] font-medium text-white-text mb-4">
                  {service.title}
                </h3>
                <p className="font-body text-grey text-[18px] md:text-[18px] leading-relaxed mb-8 flex-1">
                  {service.desc}
                </p>
                <Link
                  href={service.href}
                  className="bg-red hover:bg-red-hover transition-colors w-12 h-10 rounded-lg flex items-center justify-center text-white shrink-0 shadow-md mt-auto"
                  aria-label={`Learn more about ${service.title}`}
                >
                  <ChevronRight size={24} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
